import { basicsQuestions } from './basics'
import { joinsQuestions } from './joins'
import { aggregationsQuestions } from './aggregations'
import { windowQuestions } from './window'
import { theoryQuestions } from './theory'
import { practicalQuestions } from './practical'
import { masterQuestions } from './master'
import { cteQuestions } from './cte'
import type { SqlQuestion } from '../../types'

export const allQuestions: SqlQuestion[] = [
  ...masterQuestions,
  ...basicsQuestions,
  ...joinsQuestions,
  ...aggregationsQuestions,
  ...windowQuestions,
  ...theoryQuestions,
  ...practicalQuestions,
  ...cteQuestions,
]

export const questionById = Object.fromEntries(allQuestions.map((q) => [q.id, q]))

export function getQuestionsBySheet(slug: string): SqlQuestion[] {
  return allQuestions.filter((q) => q.sheet === slug)
}

export function getRandomQuestion(sheetSlug?: string): SqlQuestion {
  const pool = sheetSlug ? getQuestionsBySheet(sheetSlug) : allQuestions
  return pool[Math.floor(Math.random() * pool.length)]
}

export const totalQuestionCount = allQuestions.length
