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
    description: 'Distributed data processing patterns for data engineering interviews.',
    status: 'coming_soon',
    icon: '⚡',
    order: 2,
    gradient: 'from-warning to-accent',
  },
  {
    slug: 'spark',
    title: 'Apache Spark',
    description: 'RDDs, DAGs, shuffle optimization, and Spark SQL deep dives.',
    status: 'coming_soon',
    icon: '🔥',
    order: 3,
    gradient: 'from-warning to-primary',
  },
  {
    slug: 'azure-data-engineering',
    title: 'Azure Data Engineering',
    description: 'End-to-end Azure data platform interview preparation.',
    status: 'coming_soon',
    icon: '☁️',
    order: 4,
    gradient: 'from-info to-primary',
  },
  {
    slug: 'azure-data-factory',
    title: 'Azure Data Factory',
    description: 'Pipelines, triggers, integration runtimes, and orchestration.',
    status: 'coming_soon',
    icon: '🏭',
    order: 5,
    gradient: 'from-info to-accent',
  },
  {
    slug: 'azure-databricks',
    title: 'Azure Databricks',
    description: 'Notebooks, clusters, Delta Lake, and lakehouse patterns.',
    status: 'coming_soon',
    icon: '🧱',
    order: 6,
    gradient: 'from-accent to-primary',
  },
  {
    slug: 'delta-lake',
    title: 'Delta Lake',
    description: 'ACID tables, time travel, MERGE, and optimization.',
    status: 'coming_soon',
    icon: '🌊',
    order: 7,
    gradient: 'from-info to-success',
  },
  {
    slug: 'python',
    title: 'Python',
    description: 'Python for data engineering and backend interview loops.',
    status: 'coming_soon',
    icon: '🐍',
    order: 8,
    gradient: 'from-success to-primary',
  },
  {
    slug: 'data-modeling',
    title: 'Data Modeling',
    description: 'Star schema, SCDs, normalization, and dimensional modeling.',
    status: 'coming_soon',
    icon: '📐',
    order: 9,
    gradient: 'from-secondary to-accent',
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
    status: 'coming_soon',
    icon: '🚀',
    order: 11,
    gradient: 'from-accent to-warning',
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
