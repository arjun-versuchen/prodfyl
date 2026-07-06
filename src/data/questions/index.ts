import { basicsQuestions } from './basics'
import { joinsQuestions } from './joins'
import { aggregationsQuestions } from './aggregations'
import { windowQuestions } from './window'
import { theoryQuestions } from './theory'
import { practicalQuestions } from './practical'
import { masterQuestions } from './master'
import { cteQuestions } from './cte'
import { pysparkQuestions } from './modules/pyspark'
import { sparkQuestions } from './modules/spark'
import { azureDataEngineeringQuestions } from './modules/azure-data-engineering'
import { azureDataFactoryQuestions } from './modules/azure-data-factory'
import { azureDatabricksQuestions } from './modules/azure-databricks'
import { deltaLakeQuestions } from './modules/delta-lake'
import { pythonQuestions } from './modules/python'
import { dataModelingQuestions } from './modules/data-modeling'
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
  ...pysparkQuestions,
  ...sparkQuestions,
  ...azureDataEngineeringQuestions,
  ...azureDataFactoryQuestions,
  ...azureDatabricksQuestions,
  ...deltaLakeQuestions,
  ...pythonQuestions,
  ...dataModelingQuestions,
]

export const questionById = Object.fromEntries(allQuestions.map((q) => [q.id, q]))

export function getQuestionsBySheet(slug: string): SqlQuestion[] {
  return allQuestions.filter((q) => q.sheet === slug)
}

export function getQuestionsByModule(moduleSlug: string): SqlQuestion[] {
  return allQuestions.filter((q) => q.module === moduleSlug)
}

export function getRandomQuestion(sheetSlug?: string): SqlQuestion {
  const pool = sheetSlug ? getQuestionsBySheet(sheetSlug) : allQuestions
  return pool[Math.floor(Math.random() * pool.length)]
}

export const totalQuestionCount = allQuestions.length

export function getModuleQuestionCount(moduleSlug: string): number {
  return getQuestionsByModule(moduleSlug).length
}
