import { httpsCallable } from 'firebase/functions'
import { functions, isFirebaseConfigured } from './config'
import type { BillingPlan } from '../../types'

export interface CreateOrderResponse {
  orderId: string
  amount: number
  currency: string
  keyId: string
  plan: BillingPlan
  description: string
}

export interface VerifyPaymentInput {
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
  plan: BillingPlan
}

export interface VerifyPaymentResponse {
  success: boolean
  plan: 'premium'
  subscriptionStatus: 'active'
}

export async function createRazorpayOrder(plan: BillingPlan): Promise<CreateOrderResponse> {
  if (!isFirebaseConfigured || !functions) {
    throw new Error('Firebase is not configured. Add environment variables to enable payments.')
  }
  const callable = httpsCallable<{ plan: BillingPlan }, CreateOrderResponse>(functions, 'createRazorpayOrder')
  const result = await callable({ plan })
  return result.data
}

export async function verifyRazorpayPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResponse> {
  if (!isFirebaseConfigured || !functions) {
    throw new Error('Firebase is not configured. Add environment variables to enable payments.')
  }
  const callable = httpsCallable<VerifyPaymentInput, VerifyPaymentResponse>(functions, 'verifyRazorpayPayment')
  const result = await callable(input)
  return result.data
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void }
  }
}

export function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Razorpay checkout script'))
    document.body.appendChild(script)
  })
}

export async function openRazorpayCheckout(options: {
  order: CreateOrderResponse
  userEmail: string
  userName: string | null
  onSuccess: (payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void
  onDismiss: () => void
}): Promise<void> {
  await loadRazorpayScript()
  if (!window.Razorpay) throw new Error('Razorpay SDK unavailable')

  const rzp = new window.Razorpay({
    key: options.order.keyId,
    amount: options.order.amount,
    currency: options.order.currency,
    name: 'InterviewMaster AI',
    description: options.order.description,
    order_id: options.order.orderId,
    prefill: {
      email: options.userEmail,
      name: options.userName ?? undefined,
    },
    theme: { color: '#818cf8' },
    handler: (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
      options.onSuccess(response)
    },
    modal: {
      ondismiss: options.onDismiss,
    },
  })
  rzp.open()
}
