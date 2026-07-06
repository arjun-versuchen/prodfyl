export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type InterviewFrequency = 'Very High' | 'High' | 'Medium' | 'Low'
export type SheetAccessTier = 'free' | 'mixed' | 'premium'
export type ProjectAccessTier = 'free' | 'mixed' | 'premium'
export type ProjectDifficulty = 'Beginner' | 'Intermediate' | 'Advanced'
export type UserPlan = 'free' | 'premium'
export type SubscriptionStatus = 'active' | 'expired' | 'none'

export interface SqlQuestion {
  id: number
  title: string
  category: string
  sheet: string
  module: string
  difficulty: Difficulty
  question: string
  answer: string
  example?: string
  tags?: string[]
  frequency?: InterviewFrequency
  notes?: string
}

export interface Sheet {
  slug: string
  module: string
  title: string
  description: string
  icon: string
  color: string
  accessTier: SheetAccessTier
}

export interface ProjectSection {
  id: string
  title: string
  content: string
  bullets?: string[]
  code?: string
}

export interface PipelineStep {
  title: string
  description: string
  checklist: string[]
}

export interface FailureScenario {
  title: string
  problem: string
  detection: string
  fix: string
  interviewAnswer: string
}

export interface ProjectEnhancedContent {
  businessProblem: string
  architectureFlow: string[]
  pipelineSteps: PipelineStep[]
  failureScenarios: FailureScenario[]
  interviewScript: string
}

export interface ProjectWalkthrough {
  slug: string
  title: string
  description: string
  icon: string
  color: string
  difficulty: ProjectDifficulty
  accessTier: ProjectAccessTier
  duration: string
  techStack: string[]
  outcome: string
  sections: ProjectSection[]
  interviewQuestions: string[]
  resumeBullets: string[]
  enhanced?: ProjectEnhancedContent
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
