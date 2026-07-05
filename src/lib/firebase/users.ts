import { doc, getDoc, serverTimestamp, setDoc, type Timestamp } from 'firebase/firestore'
import { db, isFirebaseConfigured } from './config'
import type { UserPlan, UserProfile, UserSubscription } from '../../types'

function timestampToDate(value: Timestamp | Date | undefined): Date | undefined {
  if (!value) return undefined
  if (value instanceof Date) return value
  return value.toDate()
}

function parseSubscription(data: Record<string, unknown> | undefined): UserSubscription {
  if (!data) {
    return { status: 'none' }
  }
  return {
    status: (data.status as UserSubscription['status']) ?? 'none',
    razorpaySubscriptionId: data.razorpaySubscriptionId as string | undefined,
    razorpayPlanId: data.razorpayPlanId as string | undefined,
    razorpayOrderId: data.razorpayOrderId as string | undefined,
    currentPeriodEnd: timestampToDate(data.currentPeriodEnd as Timestamp | undefined),
    updatedAt: timestampToDate(data.updatedAt as Timestamp | undefined),
  }
}

export function parseUserProfile(uid: string, data: Record<string, unknown>): UserProfile {
  return {
    uid,
    email: (data.email as string) ?? '',
    displayName: (data.displayName as string | null) ?? null,
    photoURL: (data.photoURL as string | null) ?? null,
    plan: (data.plan as UserPlan) ?? 'free',
    subscription: parseSubscription(data.subscription as Record<string, unknown> | undefined),
    createdAt: timestampToDate(data.createdAt as Timestamp | undefined),
    lastLoginAt: timestampToDate(data.lastLoginAt as Timestamp | undefined),
  }
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  if (!isFirebaseConfigured || !db) return null
  const snap = await getDoc(doc(db, 'users', uid))
  if (!snap.exists()) return null
  return parseUserProfile(uid, snap.data() as Record<string, unknown>)
}

export async function upsertUserProfile(input: {
  uid: string
  email: string
  displayName: string | null
  photoURL: string | null
}): Promise<UserProfile | null> {
  if (!isFirebaseConfigured || !db) return null

  const ref = doc(db, 'users', input.uid)
  const existing = await getDoc(ref)
  const now = serverTimestamp()

  if (!existing.exists()) {
    await setDoc(ref, {
      email: input.email,
      displayName: input.displayName,
      photoURL: input.photoURL,
      createdAt: now,
      lastLoginAt: now,
      plan: 'free',
      subscription: { status: 'none', updatedAt: now },
    })
  } else {
    await setDoc(
      ref,
      {
        email: input.email,
        displayName: input.displayName,
        photoURL: input.photoURL,
        lastLoginAt: now,
      },
      { merge: true },
    )
  }

  return fetchUserProfile(input.uid)
}
