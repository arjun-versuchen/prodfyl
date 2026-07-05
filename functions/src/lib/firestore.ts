import * as admin from 'firebase-admin'
import { FieldValue, Timestamp } from 'firebase-admin/firestore'
import { log } from './logger'
import { getPlan, type BillingPlan } from './plans'

if (!admin.apps.length) {
  admin.initializeApp()
}

const db = admin.firestore()

export type GrantSource = 'verify' | 'webhook' | 'recovery'

export interface ProcessPremiumGrantInput {
  paymentId: string
  orderId: string
  uid: string
  email: string
  displayName: string | null
  plan: BillingPlan
  amount: number
  currency: string
  country?: string
  device?: string
  source: GrantSource
}

export interface ProcessPremiumGrantResult {
  success: true
  alreadyProcessed: boolean
  plan: 'premium'
  subscriptionStatus: 'active'
  currentPeriodEnd: string
}

export async function savePendingOrder(input: {
  uid: string
  orderId: string
  plan: BillingPlan
  amount: number
  currency: string
}): Promise<void> {
  await db.doc(`users/${input.uid}/orders/${input.orderId}`).set({
    orderId: input.orderId,
    plan: input.plan,
    amount: input.amount,
    currency: input.currency,
    status: 'created',
    createdAt: FieldValue.serverTimestamp(),
  })
}

export async function getUserProfileSummary(uid: string): Promise<{
  email: string
  displayName: string | null
}> {
  const snap = await db.doc(`users/${uid}`).get()
  const data = snap.data() ?? {}
  return {
    email: (data.email as string) ?? '',
    displayName: (data.displayName as string | null) ?? null,
  }
}

export async function processPremiumGrant(
  input: ProcessPremiumGrantInput,
): Promise<ProcessPremiumGrantResult> {
  const selected = getPlan(input.plan)
  const periodEnd = Timestamp.fromDate(
    new Date(Date.now() + selected.periodDays * 24 * 60 * 60 * 1000),
  )
  const paymentRef = db.doc(`payments/${input.paymentId}`)
  const userRef = db.doc(`users/${input.uid}`)
  const orderRef = db.doc(`users/${input.uid}/orders/${input.orderId}`)

  const result = await db.runTransaction(async (transaction) => {
    const existingPayment = await transaction.get(paymentRef)

    if (existingPayment.exists) {
      const data = existingPayment.data() ?? {}
      if (data.status === 'completed') {
        const periodEndTs = data.periodEnd as Timestamp | undefined
        return {
          alreadyProcessed: true,
          currentPeriodEnd:
            periodEndTs?.toDate().toISOString() ?? periodEnd.toDate().toISOString(),
        }
      }
    }

    const now = FieldValue.serverTimestamp()

    transaction.set(paymentRef, {
      paymentId: input.paymentId,
      orderId: input.orderId,
      uid: input.uid,
      email: input.email,
      displayName: input.displayName,
      plan: input.plan,
      amount: input.amount,
      currency: input.currency,
      country: input.country ?? null,
      device: input.device ?? 'web',
      status: 'completed',
      source: input.source,
      razorpayOrderId: input.orderId,
      razorpayPaymentId: input.paymentId,
      periodEnd,
      createdAt: existingPayment.exists ? existingPayment.data()?.createdAt ?? now : now,
      verifiedAt: now,
    })

    transaction.set(
      userRef,
      {
        plan: 'premium',
        subscription: {
          status: 'active',
          currentPeriodEnd: periodEnd,
          lastPaymentId: input.paymentId,
          updatedAt: now,
        },
      },
      { merge: true },
    )

    transaction.set(
      orderRef,
      {
        status: 'completed',
        completedAt: now,
      },
      { merge: true },
    )

    return {
      alreadyProcessed: false,
      currentPeriodEnd: periodEnd.toDate().toISOString(),
    }
  })

  log('info', 'Premium grant processed', {
    uid: input.uid,
    paymentId: input.paymentId,
    orderId: input.orderId,
    source: input.source,
    alreadyProcessed: result.alreadyProcessed,
  })

  return {
    success: true,
    alreadyProcessed: result.alreadyProcessed,
    plan: 'premium',
    subscriptionStatus: 'active',
    currentPeriodEnd: result.currentPeriodEnd,
  }
}

export async function listPendingOrders(uid: string, limit = 10) {
  const snap = await db
    .collection(`users/${uid}/orders`)
    .where('status', '==', 'created')
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get()

  return snap.docs.map((doc) => ({
    orderId: doc.id,
    ...(doc.data() as { plan: BillingPlan; amount: number; currency: string }),
  }))
}

export { db }
