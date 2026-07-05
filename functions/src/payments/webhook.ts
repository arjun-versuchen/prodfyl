import { onRequest } from 'firebase-functions/v2/https'
import { findUserIdByOrderId, grantPremiumAccess, markSubscriptionExpired } from '../lib/firestore'
import { log } from '../lib/logger'
import { checkRateLimit } from '../lib/rateLimit'
import { verifyWebhookSignature } from '../lib/razorpay'
import type { BillingPlan } from '../lib/plans'

export const razorpayWebhook = onRequest({ cors: false }, async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed')
    return
  }

  if (!checkRateLimit(`webhook:${req.ip ?? 'unknown'}`, 30, 60_000)) {
    res.status(429).send('Too Many Requests')
    return
  }

  const signature = req.get('x-razorpay-signature')
  const rawBody = typeof req.rawBody === 'undefined' ? JSON.stringify(req.body) : req.rawBody.toString('utf8')

  if (!verifyWebhookSignature(rawBody, signature)) {
    log('warn', 'Invalid Razorpay webhook signature')
    res.status(400).send('Invalid signature')
    return
  }

  try {
    const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const eventName = event.event as string
    const payload = event.payload ?? {}

    log('info', 'Razorpay webhook received', { eventName })

    if (eventName === 'payment.captured') {
      const payment = payload.payment?.entity
      const orderId = payment?.order_id as string | undefined
      const uid = payment?.notes?.uid as string | undefined
      const plan = payment?.notes?.plan as BillingPlan | undefined

      if (uid && plan && orderId) {
        await grantPremiumAccess({
          uid,
          plan,
          orderId,
          paymentId: payment.id,
        })
      }
    }

    if (eventName === 'subscription.cancelled' || eventName === 'subscription.completed') {
      const subscription = payload.subscription?.entity
      const orderId = subscription?.notes?.order_id as string | undefined
      const uid =
        (subscription?.notes?.uid as string | undefined) ??
        (orderId ? await findUserIdByOrderId(orderId) : null)

      if (uid) {
        await markSubscriptionExpired(uid)
      }
    }

    res.status(200).json({ received: true })
  } catch (error) {
    log('error', 'Webhook processing failed', {
      error: error instanceof Error ? error.message : 'unknown',
    })
    res.status(500).send('Webhook handler error')
  }
})
