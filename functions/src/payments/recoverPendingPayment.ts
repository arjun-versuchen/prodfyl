import { onCall, HttpsError } from 'firebase-functions/v2/https'
import { log } from '../lib/logger'
import { checkRateLimit } from '../lib/rateLimit'
import {
  getUserProfileSummary,
  listPendingOrders,
  processPremiumGrant,
} from '../lib/firestore'
import {
  createRazorpayClient,
  fetchOrderPayments,
  fetchRazorpayOrder,
  validateOrderOwnership,
} from '../lib/razorpay'
import type { BillingPlan } from '../lib/plans'
import { paymentSecrets, razorpayKeyId, razorpayKeySecret } from '../lib/secrets'

export const recoverPendingPayment = onCall(
  { secrets: [...paymentSecrets], cors: true },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'Authentication required')
    }

    const rateKey = `recover:${request.auth.uid}`
    if (!checkRateLimit(rateKey, 5, 60_000)) {
      throw new HttpsError('resource-exhausted', 'Too many recovery attempts. Please try again later.')
    }

    const uid = request.auth.uid
    const pendingOrders = await listPendingOrders(uid)

    if (pendingOrders.length === 0) {
      return {
        recovered: false,
        message: 'No pending orders found.',
      }
    }

    const client = createRazorpayClient(razorpayKeyId.value(), razorpayKeySecret.value())
    const profile = await getUserProfileSummary(uid)

    for (const pending of pendingOrders) {
      try {
        const order = await fetchRazorpayOrder(client, pending.orderId)

        if (order.status !== 'paid') {
          continue
        }

        validateOrderOwnership({
          order: order as { amount?: number; status?: string; notes?: Record<string, string> },
          uid,
          plan: pending.plan as BillingPlan,
        })

        const paymentsResponse = await fetchOrderPayments(client, pending.orderId)
        const items = paymentsResponse.items ?? []
        const captured = items.find((item) => item.status === 'captured')

        if (!captured || typeof captured.id !== 'string') {
          continue
        }

        const grant = await processPremiumGrant({
          paymentId: captured.id,
          orderId: pending.orderId,
          uid,
          email: profile.email,
          displayName: profile.displayName,
          plan: pending.plan as BillingPlan,
          amount: Number(captured.amount),
          currency: String(captured.currency ?? 'INR'),
          device: 'recovery',
          source: 'recovery',
        })

        log('info', 'Pending payment recovered', {
          uid,
          orderId: pending.orderId,
          paymentId: captured.id,
          alreadyProcessed: grant.alreadyProcessed,
        })

        return {
          recovered: true,
          message: grant.alreadyProcessed
            ? 'Premium access is already active for your account.'
            : 'Your payment was recovered and Premium access is now active.',
          success: grant.success,
          plan: grant.plan,
          subscriptionStatus: grant.subscriptionStatus,
          currentPeriodEnd: grant.currentPeriodEnd,
          alreadyProcessed: grant.alreadyProcessed,
        }
      } catch (error) {
        log('warn', 'Pending order recovery skipped', {
          uid,
          orderId: pending.orderId,
          error: error instanceof Error ? error.message : 'unknown',
        })
      }
    }

    return {
      recovered: false,
      message: 'No completed payments were found for your pending orders.',
    }
  },
)
