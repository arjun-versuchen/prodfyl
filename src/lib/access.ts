import { getQuestionsBySheet } from '../data/questions'
import { sheetBySlug } from '../data/sheets'
import type { ProjectAccessTier, SheetAccessTier, SqlQuestion } from '../types'

/** Free question count per mixed-tier sheet (first N questions by sheet order). */
export const MIXED_FREE_LIMIT = 8

export function getSheetAccessTier(sheetSlug: string): SheetAccessTier {
  return sheetBySlug[sheetSlug]?.accessTier ?? 'premium'
}

export function isPremiumSheet(sheetSlug: string): boolean {
  return getSheetAccessTier(sheetSlug) === 'premium'
}

export function canAccessQuestion(question: SqlQuestion, isPremium: boolean): boolean {
  if (isPremium) return true

  const tier = getSheetAccessTier(question.sheet)
  if (tier === 'free') return true
  if (tier === 'premium') return false

  const sheetQuestions = getQuestionsBySheet(question.sheet)
  const index = sheetQuestions.findIndex((q) => q.id === question.id)
  return index >= 0 && index < MIXED_FREE_LIMIT
}

export function filterAccessibleQuestions(questions: SqlQuestion[], isPremium: boolean): SqlQuestion[] {
  if (isPremium) return questions
  return questions.filter((q) => canAccessQuestion(q, isPremium))
}

export function isSubscriptionActive(
  plan: 'free' | 'premium' | undefined,
  status: string | undefined,
  currentPeriodEnd?: Date,
): boolean {
  if (plan !== 'premium' || status !== 'active') return false
  if (currentPeriodEnd && currentPeriodEnd.getTime() < Date.now()) return false
  return true
}

export const PROJECT_ACCESS: Record<string, ProjectAccessTier> = {
  'ecommerce-sales-analytics': 'free',
  'log-ingestion-monitoring': 'mixed',
  'customer-360-lakehouse': 'premium',
  'azure-adf-batch-orchestration': 'premium',
  'fraud-detection-streaming': 'premium',
}

/** Free section count for mixed-tier projects. */
export const PROJECT_MIXED_FREE_SECTIONS = 2

export function getProjectAccessTier(projectSlug: string): ProjectAccessTier {
  return PROJECT_ACCESS[projectSlug] ?? 'premium'
}

export function isPremiumProject(projectSlug: string): boolean {
  return getProjectAccessTier(projectSlug) === 'premium'
}

export function canAccessProjectSection(
  projectSlug: string,
  sectionIndex: number,
  isPremium: boolean,
): boolean {
  if (isPremium) return true

  const tier = getProjectAccessTier(projectSlug)
  if (tier === 'free') return true
  if (tier === 'premium') return false
  return sectionIndex < PROJECT_MIXED_FREE_SECTIONS
}

export function canAccessProject(projectSlug: string, isPremium: boolean): boolean {
  if (isPremium) return true
  const tier = getProjectAccessTier(projectSlug)
  return tier !== 'premium'
}

export function isSubscriptionExpired(
  plan: 'free' | 'premium' | undefined,
  status: string | undefined,
  currentPeriodEnd?: Date,
): boolean {
  if (plan === 'premium' && status === 'expired') return true
  if (plan === 'premium' && status === 'active' && currentPeriodEnd && currentPeriodEnd.getTime() < Date.now()) {
    return true
  }
  return false
}
