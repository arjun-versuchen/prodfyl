import { onRequest } from 'firebase-functions/v2/https'
import { log } from '../lib/logger'
import { checkRateLimit } from '../lib/rateLimit'
import { getUserProfileSummary, processPremiumGrant } from '../lib/firestore'
import {
  createRazorpayClient,
  fetchOrderPayments,
  fetchRazorpayOrder,
  validateOrderOwnership,
  verifyWebhookSignature,
} from '../lib/razorpay'
import type { BillingPlan } from '../lib/plans'
import { paymentSecrets, razorpayKeySecret, razorpayWebhookSecret, webhookSecrets } from '../lib/secrets'
import { razorpayKeyId } from '../lib/secrets'

async function grantFromPaidOrder(input: {
  orderId: string
  uid: string
  plan: BillingPlan
  source: 'webhook'
}) {
  const client = createRazorpayClient(razorpayKeyId.value(), razorpayKeySecret.value())
  const order = await fetchRazorpayOrder(client, input.orderId)

  validateOrderOwnership({
    order: order as { amount?: number; status?: string; notes?: Record<string, string> },
    uid: input.uid,
    plan: input.plan,
  })

  const paymentsResponse = await fetchOrderPayments(client, input.orderId)
  const items = paymentsResponse.items ?? []
  const captured = items.find((item) => item.status === 'captured')

  if (!captured || typeof captured.id !== 'string') {
    throw new Error('CAPTURED_PAYMENT_NOT_FOUND')
  }

  const profile = await getUserProfileSummary(input.uid)

  return processPremiumGrant({
    paymentId: captured.id,
    orderId: input.orderId,
    uid: input.uid,
    email: profile.email,
    displayName: profile.displayName,
    plan: input.plan,
    amount: Number(captured.amount),
    currency: String(captured.currency ?? 'INR'),
    device: 'webhook',
    source: input.source,
  })
}

export const razorpayWebhook = onRequest(
  { secrets: [...paymentSecrets, ...webhookSecrets], cors: false },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed')
      return
    }

    if (!checkRateLimit(`webhook:${req.ip ?? 'unknown'}`, 30, 60_000)) {
      res.status(429).send('Too Many Requests')
      return
    }

    const signature = req.get('x-razorpay-signature')
    const rawBody =
      typeof req.rawBody === 'undefined' ? JSON.stringify(req.body) : req.rawBody.toString('utf8')

    if (!verifyWebhookSignature(razorpayWebhookSecret.value(), rawBody, signature)) {
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
        const payment = payload.payment?.entity as Record<string, unknown> | undefined
        const orderId = payment?.order_id as string | undefined
        const paymentId = payment?.id as string | undefined

        if (paymentId && orderId) {
          const client = createRazorpayClient(razorpayKeyId.value(), razorpayKeySecret.value())
          const order = await fetchRazorpayOrder(client, orderId)
          const notes = (order.notes as Record<string, string> | undefined) ?? {}
          const uid = notes.uid
          const plan = notes.plan as BillingPlan | undefined

          if (uid && plan) {
            validateOrderOwnership({
              order: order as { amount?: number; status?: string; notes?: Record<string, string> },
              uid,
              plan,
            })
            const profile = await getUserProfileSummary(uid)
            await processPremiumGrant({
              paymentId,
              orderId,
              uid,
              email: profile.email,
              displayName: profile.displayName,
              plan,
              amount: Number(payment?.amount ?? order.amount),
              currency: String(payment?.currency ?? order.currency ?? 'INR'),
              device: 'webhook',
              source: 'webhook',
            })
          }
        }
      }

      if (eventName === 'order.paid') {
        const order = payload.order?.entity as Record<string, unknown> | undefined
        const orderId = order?.id as string | undefined
        const notes = (order?.notes as Record<string, string> | undefined) ?? {}
        const uid = notes.uid
        const plan = notes.plan as BillingPlan | undefined

        if (orderId && uid && plan) {
          await grantFromPaidOrder({ orderId, uid, plan, source: 'webhook' })
        }
      }

      res.status(200).json({ received: true })
    } catch (error) {
      log('error', 'Webhook processing failed', {
        error: error instanceof Error ? error.message : 'unknown',
      })
      res.status(500).send('Webhook handler error')
    }
  },
)
