export type LearningPathStatus = 'live' | 'coming_soon'

export interface LearningPath {
  slug: string
  title: string
  description: string
  status: LearningPathStatus
  icon: string
  order: number
  gradient: string
  highlights?: string[]
}

export const learningPaths: LearningPath[] = [
  {
    slug: 'sql',
    title: 'SQL',
    description: '130+ curated interview questions from basics to window functions, theory, and practical challenges.',
    status: 'live',
    icon: '🗄️',
    order: 1,
    gradient: 'from-primary to-accent',
    highlights: ['Master Sheet', 'JOINs', 'Window Functions', 'Company FAQs'],
  },
  {
    slug: 'pyspark',
    title: 'PySpark',
    description: '50+ PySpark interview questions — DataFrames, transformations, performance, Delta, and scenarios.',
    status: 'live',
    icon: '⚡',
    order: 2,
    gradient: 'from-warning to-accent',
    highlights: ['DataFrames', 'Joins', 'Performance', 'Delta'],
  },
  {
    slug: 'spark',
    title: 'Apache Spark',
    description: '50+ Spark interview questions — architecture, DAG, shuffle, caching, and cluster tuning.',
    status: 'live',
    icon: '🔥',
    order: 3,
    gradient: 'from-warning to-primary',
    highlights: ['Architecture', 'DAG', 'Shuffle', 'Performance'],
  },
  {
    slug: 'azure-data-engineering',
    title: 'Azure Data Engineering',
    description: '50+ Azure DE interview questions — storage, compute, orchestration, security, and production scenarios.',
    status: 'live',
    icon: '☁️',
    order: 4,
    gradient: 'from-info to-primary',
    highlights: ['ADLS', 'Databricks', 'Security', 'Pipelines'],
  },
  {
    slug: 'azure-data-factory',
    title: 'Azure Data Factory',
    description: '50+ ADF interview questions — pipelines, linked services, IR, triggers, and incremental loads.',
    status: 'live',
    icon: '🏭',
    order: 5,
    gradient: 'from-info to-accent',
    highlights: ['Pipelines', 'Triggers', 'IR', 'Monitoring'],
  },
  {
    slug: 'azure-databricks',
    title: 'Azure Databricks',
    description: '50+ Databricks interview questions — clusters, jobs, Delta, Unity Catalog, and streaming.',
    status: 'live',
    icon: '🧱',
    order: 6,
    gradient: 'from-accent to-primary',
    highlights: ['Clusters', 'Jobs', 'Unity Catalog', 'Delta'],
  },
  {
    slug: 'delta-lake',
    title: 'Delta Lake',
    description: '50+ Delta Lake interview questions — ACID, time travel, MERGE, OPTIMIZE, and medallion architecture.',
    status: 'live',
    icon: '🌊',
    order: 7,
    gradient: 'from-info to-success',
    highlights: ['ACID', 'MERGE', 'Time Travel', 'Medallion'],
  },
  {
    slug: 'python',
    title: 'Python',
    description: '50+ Python interview questions for data engineers — OOP, concurrency, APIs, and coding scenarios.',
    status: 'live',
    icon: '🐍',
    order: 8,
    gradient: 'from-success to-primary',
    highlights: ['OOP', 'Decorators', 'APIs', 'Coding'],
  },
  {
    slug: 'data-modeling',
    title: 'Data Modeling',
    description: '50+ data modeling interview questions — star schema, SCD types, normalization, and warehouse design.',
    status: 'live',
    icon: '📐',
    order: 9,
    gradient: 'from-secondary to-accent',
    highlights: ['Star Schema', 'SCD', 'Kimball', 'Dimensions'],
  },
  {
    slug: 'system-design',
    title: 'System Design',
    description: 'Scalable data platform and pipeline architecture interviews.',
    status: 'coming_soon',
    icon: '🏗️',
    order: 10,
    gradient: 'from-primary to-info',
  },
  {
    slug: 'projects',
    title: 'Projects',
    description: 'Portfolio-ready data engineering project walkthroughs.',
    status: 'live',
    icon: '🚀',
    order: 11,
    gradient: 'from-accent to-warning',
    highlights: ['Batch ETL', 'Streaming', 'Lakehouse', 'Interview Q&A'],
  },
  {
    slug: 'mock-interviews',
    title: 'Mock Interviews',
    description: 'Timed mock interviews with scoring and feedback.',
    status: 'coming_soon',
    icon: '🎯',
    order: 12,
    gradient: 'from-warning to-success',
  },
]

export const learningPathBySlug = Object.fromEntries(learningPaths.map((p) => [p.slug, p]))

export const livePaths = learningPaths.filter((p) => p.status === 'live')
export const comingSoonPaths = learningPaths.filter((p) => p.status === 'coming_soon')
