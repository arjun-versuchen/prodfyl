import Razorpay from 'razorpay'

export function getRazorpayClient(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials are not configured')
  }

  return new Razorpay({ key_id: keyId, key_secret: keySecret })
}

export function getPublicKeyId(): string {
  const keyId = process.env.RAZORPAY_KEY_ID
  if (!keyId) throw new Error('Razorpay key ID is not configured')
  return keyId
}

export function verifyPaymentSignature(input: {
  orderId: string
  paymentId: string
  signature: string
}): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) return false

  const crypto = require('crypto') as typeof import('crypto')
  const payload = `${input.orderId}|${input.paymentId}`
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  return expected === input.signature
}

export function verifyWebhookSignature(body: string, signature: string | undefined): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret || !signature) return false

  const crypto = require('crypto') as typeof import('crypto')
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex')
  return expected === signature
}
