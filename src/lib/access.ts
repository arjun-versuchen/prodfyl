import { getQuestionsBySheet } from '../data/questions'
import type { SheetAccessTier, SqlQuestion } from '../types'

/** Free question count per mixed-tier sheet (first N questions by sheet order). */
export const MIXED_FREE_LIMIT = 8

export const SHEET_ACCESS: Record<string, SheetAccessTier> = {
  'sql-basics': 'free',
  'joins-subqueries': 'mixed',
  aggregations: 'mixed',
  'sql-master-sheet': 'premium',
  'window-functions': 'premium',
  'database-theory': 'premium',
  'practical-challenges': 'premium',
}

export function getSheetAccessTier(sheetSlug: string): SheetAccessTier {
  return SHEET_ACCESS[sheetSlug] ?? 'premium'
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
