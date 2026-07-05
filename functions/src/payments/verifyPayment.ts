import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { z } from 'zod'
import { grantPremiumAccess } from '../lib/firestore'
import { log } from '../lib/logger'
import { checkRateLimit } from '../lib/rateLimit'
import { verifyPaymentSignature } from '../lib/razorpay'

const verifySchema = z.object({
  razorpayOrderId: z.string().min(1),
  razorpayPaymentId: z.string().min(1),
  razorpaySignature: z.string().min(1),
  plan: z.enum(['monthly', 'yearly']),
})

export const verifyRazorpayPayment = onCall({ cors: true }, async (request) => {
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

  const valid = verifyPaymentSignature({
    orderId: parsed.data.razorpayOrderId,
    paymentId: parsed.data.razorpayPaymentId,
    signature: parsed.data.razorpaySignature,
  })

  if (!valid) {
    log('warn', 'Razorpay signature verification failed', {
      uid: request.auth.uid,
      orderId: parsed.data.razorpayOrderId,
    })
    throw new HttpsError('permission-denied', 'Payment verification failed')
  }

  await grantPremiumAccess({
    uid: request.auth.uid,
    plan: parsed.data.plan,
    orderId: parsed.data.razorpayOrderId,
    paymentId: parsed.data.razorpayPaymentId,
  })

  return {
    success: true,
    plan: 'premium' as const,
    subscriptionStatus: 'active' as const,
  }
})
