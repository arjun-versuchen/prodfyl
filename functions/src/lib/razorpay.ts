import Razorpay from 'razorpay'
import { createHmac } from 'crypto'
import type { BillingPlan } from './plans'
import { getPlan } from './plans'

export function createRazorpayClient(keyId: string, keySecret: string): Razorpay {
  return new Razorpay({ key_id: keyId, key_secret: keySecret })
}

export function verifyPaymentSignature(
  keySecret: string,
  input: { orderId: string; paymentId: string; signature: string },
): boolean {
  const payload = `${input.orderId}|${input.paymentId}`
  const expected = createHmac('sha256', keySecret).update(payload).digest('hex')
  return expected === input.signature
}

export function verifyWebhookSignature(
  webhookSecret: string,
  body: string,
  signature: string | undefined,
): boolean {
  if (!signature) return false
  const expected = createHmac('sha256', webhookSecret).update(body).digest('hex')
  return expected === signature
}

export async function fetchRazorpayOrder(client: Razorpay, orderId: string) {
  return client.orders.fetch(orderId)
}

export async function fetchRazorpayPayment(client: Razorpay, paymentId: string) {
  return client.payments.fetch(paymentId)
}

export async function fetchOrderPayments(client: Razorpay, orderId: string) {
  return client.orders.fetchPayments(orderId)
}

export function validateOrderOwnership(input: {
  order: { amount?: number | string; status?: string; notes?: Record<string, string> }
  uid: string
  plan: BillingPlan
}): void {
  const notes = input.order.notes ?? {}
  const expected = getPlan(input.plan)

  if (notes.uid !== input.uid) {
    throw new Error('ORDER_UID_MISMATCH')
  }
  if (notes.plan !== input.plan) {
    throw new Error('ORDER_PLAN_MISMATCH')
  }
  if (Number(input.order.amount) !== expected.amount) {
    throw new Error('ORDER_AMOUNT_MISMATCH')
  }
  if (input.order.status !== 'paid') {
    throw new Error('ORDER_NOT_PAID')
  }
}
