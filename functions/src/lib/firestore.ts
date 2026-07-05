import * as admin from 'firebase-admin'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'
import { log } from '../lib/logger'
import { getPlan, type BillingPlan } from '../lib/plans'

if (!admin.apps.length) {
  admin.initializeApp()
}

const db = admin.firestore()

export async function grantPremiumAccess(input: {
  uid: string
  plan: BillingPlan
  orderId?: string
  paymentId?: string
  subscriptionId?: string
}): Promise<void> {
  const selected = getPlan(input.plan)
  const currentPeriodEnd = Timestamp.fromDate(
    new Date(Date.now() + selected.periodDays * 24 * 60 * 60 * 1000),
  )

  await db.doc(`users/${input.uid}`).set(
    {
      plan: 'premium',
      subscription: {
        status: 'active',
        razorpayPlanId: input.plan,
        razorpayOrderId: input.orderId,
        razorpayPaymentId: input.paymentId,
        razorpaySubscriptionId: input.subscriptionId,
        currentPeriodEnd,
        updatedAt: FieldValue.serverTimestamp(),
      },
    },
    { merge: true },
  )

  log('info', 'Premium access granted', {
    uid: input.uid,
    plan: input.plan,
    orderId: input.orderId,
    paymentId: input.paymentId,
  })
}

export async function markSubscriptionExpired(uid: string): Promise<void> {
  await db.doc(`users/${uid}`).set(
    {
      plan: 'free',
      subscription: {
        status: 'expired',
        updatedAt: FieldValue.serverTimestamp(),
      },
    },
    { merge: true },
  )

  log('warn', 'Subscription marked expired', { uid })
}

export async function findUserIdByOrderId(orderId: string): Promise<string | null> {
  const snap = await db.collection('users').where('subscription.razorpayOrderId', '==', orderId).limit(1).get()
  if (snap.empty) return null
  return snap.docs[0]?.id ?? null
}
