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
  device?: string
}

export interface VerifyPaymentResponse {
  success: boolean
  alreadyProcessed?: boolean
  plan: 'premium'
  subscriptionStatus: 'active'
  currentPeriodEnd: string
}

export interface RecoverPaymentResponse {
  recovered: boolean
  alreadyProcessed?: boolean
  message: string
  success?: boolean
  plan?: 'premium'
  subscriptionStatus?: 'active'
  currentPeriodEnd?: string
}

export class PaymentError extends Error {
  code: 'cancelled' | 'failed' | 'verification' | 'network' | 'config' | 'premium' | 'unknown'

  constructor(
    message: string,
    code: 'cancelled' | 'failed' | 'verification' | 'network' | 'config' | 'premium' | 'unknown',
  ) {
    super(message)
    this.name = 'PaymentError'
    this.code = code
  }
}

export async function createRazorpayOrder(plan: BillingPlan): Promise<CreateOrderResponse> {
  if (!isFirebaseConfigured || !functions) {
    throw new PaymentError('Firebase is not configured. Add environment variables to enable payments.', 'config')
  }
  try {
    const callable = httpsCallable<{ plan: BillingPlan }, CreateOrderResponse>(functions, 'createRazorpayOrder')
    const result = await callable({ plan })
    return result.data
  } catch (error) {
    throw new PaymentError(
      error instanceof Error ? error.message : 'Unable to create payment order.',
      'network',
    )
  }
}

export async function verifyRazorpayPayment(input: VerifyPaymentInput): Promise<VerifyPaymentResponse> {
  if (!isFirebaseConfigured || !functions) {
    throw new PaymentError('Firebase is not configured.', 'config')
  }
  try {
    const callable = httpsCallable<VerifyPaymentInput, VerifyPaymentResponse>(functions, 'verifyRazorpayPayment')
    const result = await callable({
      ...input,
      device: input.device ?? 'web',
    })
    return result.data
  } catch (error) {
    throw new PaymentError(
      error instanceof Error ? error.message : 'Payment verification failed.',
      'verification',
    )
  }
}

export async function recoverPendingPayment(): Promise<RecoverPaymentResponse> {
  if (!isFirebaseConfigured || !functions) {
    throw new PaymentError('Firebase is not configured.', 'config')
  }
  try {
    const callable = httpsCallable<Record<string, never>, RecoverPaymentResponse>(functions, 'recoverPendingPayment')
    const result = await callable({})
    return result.data
  } catch (error) {
    throw new PaymentError(
      error instanceof Error ? error.message : 'Unable to recover pending payment.',
      'network',
    )
  }
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void
      on: (event: string, handler: (response: { error?: { description?: string } }) => void) => void
    }
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
    script.onerror = () => reject(new PaymentError('Failed to load Razorpay checkout.', 'network'))
    document.body.appendChild(script)
  })
}

export async function openRazorpayCheckout(options: {
  order: CreateOrderResponse
  userEmail: string
  userName: string | null
  onSuccess: (payload: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => void
  onDismiss: () => void
  onFailure?: (message: string) => void
}): Promise<void> {
  await loadRazorpayScript()
  if (!window.Razorpay) throw new PaymentError('Razorpay checkout is unavailable.', 'config')

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

  rzp.on('payment.failed', (response) => {
    options.onFailure?.(response.error?.description ?? 'Payment failed. Please try again.')
  })

  rzp.open()
}
