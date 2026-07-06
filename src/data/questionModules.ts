/** Learning paths that use the sheet/question module experience (same layout as SQL). */
export const QUESTION_MODULE_SLUGS = [
  'sql',
  'pyspark',
  'spark',
  'azure-data-engineering',
  'azure-data-factory',
  'azure-databricks',
  'delta-lake',
  'python',
  'data-modeling',
] as const

export type QuestionModuleSlug = (typeof QUESTION_MODULE_SLUGS)[number]

export function isQuestionModule(slug: string): slug is QuestionModuleSlug {
  return (QUESTION_MODULE_SLUGS as readonly string[]).includes(slug)
}

export function getModuleTitle(slug: string): string {
  const titles: Record<string, string> = {
    sql: 'SQL Interview Questions',
    pyspark: 'PySpark Interview Questions',
    spark: 'Apache Spark Interview Questions',
    'azure-data-engineering': 'Azure Data Engineering Interview Questions',
    'azure-data-factory': 'Azure Data Factory Interview Questions',
    'azure-databricks': 'Azure Databricks Interview Questions',
    'delta-lake': 'Delta Lake Interview Questions',
    python: 'Python Interview Questions',
    'data-modeling': 'Data Modeling Interview Questions',
  }
  return titles[slug] ?? 'Interview Questions'
}

export function getModuleSeoDescription(slug: string): string {
  const descriptions: Record<string, string> = {
    sql: '130+ SQL interview questions with answers — basics, joins, aggregations, window functions, theory, and practical challenges.',
    pyspark: '50+ PySpark interview questions — DataFrames, transformations, performance, Delta integration, and scenario-based questions.',
    spark: '50+ Apache Spark interview questions — architecture, DAG, shuffle, caching, cluster managers, and performance tuning.',
    'azure-data-engineering': '50+ Azure data engineering interview questions — storage, compute, orchestration, security, and production scenarios.',
    'azure-data-factory': '50+ Azure Data Factory interview questions — pipelines, linked services, IR, triggers, incremental loads, and monitoring.',
    'azure-databricks': '50+ Azure Databricks interview questions — clusters, notebooks, jobs, Delta Lake, Unity Catalog, and streaming.',
    'delta-lake': '50+ Delta Lake interview questions — ACID, time travel, MERGE, OPTIMIZE, ZORDER, medallion architecture, and scenarios.',
    python: '50+ Python interview questions for data engineers — OOP, collections, decorators, concurrency, APIs, and coding scenarios.',
    'data-modeling': '50+ data modeling interview questions — star schema, SCD types, normalization, surrogate keys, and warehouse design.',
  }
  return descriptions[slug] ?? 'Curated interview questions for data engineering careers.'
}
