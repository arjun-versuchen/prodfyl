import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { z } from 'zod'
import { log } from '../lib/logger'
import { checkRateLimit } from '../lib/rateLimit'
import { getUserProfileSummary, processPremiumGrant } from '../lib/firestore'
import {
  createRazorpayClient,
  fetchRazorpayOrder,
  fetchRazorpayPayment,
  validateOrderOwnership,
  verifyPaymentSignature,
} from '../lib/razorpay'
import { paymentSecrets, razorpayKeyId, razorpayKeySecret } from '../lib/secrets'

const verifySchema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
  plan: z.enum(['monthly', 'yearly']),
  device: z.string().max(64).optional(),
})

export const verifyRazorpayPayment = onCall(
  { secrets: [...paymentSecrets], cors: true },
  async (request) => {
    if (!request.auth) {
      log('warn', 'Unauthenticated payment verification attempt')
      throw new HttpsError('unauthenticated', 'Authentication required')
    }

    const rateKey = `verify:${request.auth.uid}`
    if (!checkRateLimit(rateKey, 8, 60_000)) {
      throw new HttpsError('resource-exhausted', 'Too many verification attempts')
    }

    const parsed = verifySchema.safeParse(request.data)
    if (!parsed.success) {
      throw new HttpsError('invalid-argument', 'Invalid payment verification payload')
    }

    const keySecret = razorpayKeySecret.value()
    const valid = verifyPaymentSignature(keySecret, {
      orderId: parsed.data.razorpayOrderId,
      paymentId: parsed.data.razorpayPaymentId,
      signature: parsed.data.razorpaySignature,
    })

    if (!valid) {
      log('warn', 'Payment verification failed', {
        uid: request.auth.uid,
        orderId: parsed.data.razorpayOrderId,
      })
      throw new HttpsError('permission-denied', 'Payment verification failed')
    }

    try {
      const client = createRazorpayClient(razorpayKeyId.value(), keySecret)
      const order = await fetchRazorpayOrder(client, parsed.data.razorpayOrderId)

      validateOrderOwnership({
        order: order as { amount?: number; status?: string; notes?: Record<string, string> },
        uid: request.auth.uid,
        plan: parsed.data.plan,
      })

      const payment = await fetchRazorpayPayment(client, parsed.data.razorpayPaymentId)
      const profile = await getUserProfileSummary(request.auth.uid)

      const grant = await processPremiumGrant({
        paymentId: parsed.data.razorpayPaymentId,
        orderId: parsed.data.razorpayOrderId,
        uid: request.auth.uid,
        email: profile.email,
        displayName: profile.displayName,
        plan: parsed.data.plan,
        amount: Number(payment.amount),
        currency: String(payment.currency ?? 'INR'),
        device: parsed.data.device ?? 'web',
        source: 'verify',
      })

      log('info', 'Payment verified', {
        uid: request.auth.uid,
        orderId: parsed.data.razorpayOrderId,
        paymentId: parsed.data.razorpayPaymentId,
        alreadyProcessed: grant.alreadyProcessed,
      })

      return grant
    } catch (error) {
      const message = error instanceof Error ? error.message : 'unknown'
      if (
        message === 'ORDER_UID_MISMATCH' ||
        message === 'ORDER_PLAN_MISMATCH' ||
        message === 'ORDER_AMOUNT_MISMATCH' ||
        message === 'ORDER_NOT_PAID'
      ) {
        log('warn', 'Order validation failed', { uid: request.auth.uid, reason: message })
        throw new HttpsError('permission-denied', 'Payment verification failed')
      }

      log('error', 'Verification processing failed', {
        uid: request.auth.uid,
        error: message,
      })
      throw new HttpsError('internal', 'Unable to verify payment')
    }
  },
)
