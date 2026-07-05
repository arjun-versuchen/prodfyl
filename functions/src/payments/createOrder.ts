import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { z } from 'zod'
import { log } from '../lib/logger'
import { checkRateLimit } from '../lib/rateLimit'
import { getPlan } from '../lib/plans'
import { createRazorpayClient } from '../lib/razorpay'
import { savePendingOrder } from '../lib/firestore'
import { paymentSecrets, razorpayKeyId, razorpayKeySecret } from '../lib/secrets'

const planSchema = z.object({
  plan: z.enum(['monthly', 'yearly']),
})

export const createRazorpayOrder = onCall(
  { secrets: [...paymentSecrets], cors: true },
  async (request) => {
    if (!request.auth) {
      log('warn', 'Unauthenticated create order attempt')
      throw new HttpsError('unauthenticated', 'Authentication required')
    }

    const rateKey = `create:${request.auth.uid}`
    if (!checkRateLimit(rateKey, 5, 60_000)) {
      throw new HttpsError('resource-exhausted', 'Too many requests. Please try again later.')
    }

    const parsed = planSchema.safeParse(request.data)
    if (!parsed.success) {
      throw new HttpsError('invalid-argument', 'Invalid plan selection')
    }

    const keyId = razorpayKeyId.value()
    const keySecret = razorpayKeySecret.value()
    const selected = getPlan(parsed.data.plan)

    try {
      const razorpay = createRazorpayClient(keyId, keySecret)
      const order = await razorpay.orders.create({
        amount: selected.amount,
        currency: selected.currency,
        receipt: `imai_${request.auth.uid.slice(0, 8)}_${Date.now()}`,
        notes: {
          uid: request.auth.uid,
          plan: parsed.data.plan,
        },
      })

      await savePendingOrder({
        uid: request.auth.uid,
        orderId: order.id,
        plan: parsed.data.plan,
        amount: selected.amount,
        currency: selected.currency,
      })

      log('info', 'Razorpay order created', {
        uid: request.auth.uid,
        orderId: order.id,
        plan: parsed.data.plan,
      })

      return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId,
        plan: parsed.data.plan,
        description: selected.description,
      }
    } catch (error) {
      log('error', 'Failed to create Razorpay order', {
        uid: request.auth.uid,
        error: error instanceof Error ? error.message : 'unknown',
      })
      throw new HttpsError('internal', 'Unable to create payment order')
    }
  },
)
