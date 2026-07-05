export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type SheetAccessTier = 'free' | 'mixed' | 'premium'
export type UserPlan = 'free' | 'premium'
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'none'

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
  razorpaySubscriptionId?: string
  razorpayPlanId?: string
  razorpayOrderId?: string
  currentPeriodEnd?: Date
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
