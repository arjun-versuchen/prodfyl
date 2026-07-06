import type { Difficulty, InterviewFrequency, SqlQuestion } from '../types'

export type QuestionInput = {
  title: string
  difficulty: Difficulty
  question: string
  answer: string
  example?: string
  tags?: string[]
  frequency?: InterviewFrequency
  notes?: string
}

export function buildQuestions(
  module: string,
  sheet: string,
  category: string,
  idStart: number,
  items: QuestionInput[],
): SqlQuestion[] {
  return items.map((item, index) => ({
    ...item,
    id: idStart + index,
    module,
    sheet,
    category,
  }))
}

export function distributeQuestions(
  module: string,
  sections: { sheet: string; category: string; items: QuestionInput[] }[],
  idStart: number,
): SqlQuestion[] {
  let cursor = idStart
  const result: SqlQuestion[] = []
  for (const section of sections) {
    const built = buildQuestions(module, section.sheet, section.category, cursor, section.items)
    result.push(...built)
    cursor += section.items.length
  }
  return result
}
