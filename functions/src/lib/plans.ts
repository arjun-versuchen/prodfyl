export const PLANS = {
  monthly: {
    amount: 49900,
    currency: 'INR',
    description: 'InterviewMaster AI Premium Monthly',
    periodDays: 30,
  },
  yearly: {
    amount: 499900,
    currency: 'INR',
    description: 'InterviewMaster AI Premium Yearly',
    periodDays: 365,
  },
} as const

export type BillingPlan = keyof typeof PLANS

export function getPlan(plan: BillingPlan) {
  const selected = PLANS[plan]
  if (!selected) throw new Error('Invalid billing plan')
  return selected
}
