export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type SheetAccessTier = 'free' | 'mixed' | 'premium'
export type UserPlan = 'free' | 'premium'
export type SubscriptionStatus = 'active' | 'expired' | 'none'

export interface SqlQuestion {
  id: number
  title: string
  category: string
  sheet: string
  difficulty: Difficulty
  question: string
  answer: string
  example?: string
  tags?: string[]
  notes?: string
}

export interface Sheet {
  slug: string
  title: string
  description: string
  icon: string
  color: string
  accessTier: SheetAccessTier
}

export interface UserSubscription {
  status: SubscriptionStatus
  currentPeriodEnd?: Date
  lastPaymentId?: string
  updatedAt?: Date
}

export interface UserProfile {
  uid: string
  email: string
  displayName: string | null
  photoURL: string | null
  plan: UserPlan
  subscription: UserSubscription
  createdAt?: Date
  lastLoginAt?: Date
}

export type BillingPlan = 'monthly' | 'yearly'

export interface PaymentRecord {
  paymentId: string
  orderId: string
  uid: string
  email: string
  displayName: string | null
  plan: BillingPlan
  amount: number
  currency: string
  country?: string | null
  device?: string
  status: 'completed' | 'failed'
  createdAt?: Date
  verifiedAt?: Date
  razorpayOrderId: string
  razorpayPaymentId: string
}
