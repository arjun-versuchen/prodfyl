import type { Sheet } from '../types'

const sqlSheets: Sheet[] = [
  {
    slug: 'sql-master-sheet',
    module: 'sql',
    title: 'SQL Master Sheet',
    description: 'Handpicked MOST frequently asked SQL interview questions in top MNCs and product companies.',
    icon: '⭐',
    color: 'from-primary to-accent',
    accessTier: 'premium',
  },
  {
    slug: 'sql-basics',
    module: 'sql',
    title: 'SQL Basics',
    description: 'SELECT, WHERE, ORDER BY, DISTINCT, and fundamental query writing.',
    icon: '📘',
    color: 'from-info to-primary',
    accessTier: 'free',
  },
  {
    slug: 'joins-subqueries',
    module: 'sql',
    title: 'JOINs & Subqueries',
    description: 'INNER, LEFT, RIGHT, FULL joins and nested query patterns.',
    icon: '🔗',
    color: 'from-success to-info',
    accessTier: 'mixed',
  },
  {
    slug: 'aggregations',
    module: 'sql',
    title: 'Aggregations & GROUP BY',
    description: 'COUNT, SUM, AVG, GROUP BY, HAVING, and rollup patterns.',
    icon: '📊',
    color: 'from-warning to-accent',
    accessTier: 'mixed',
  },
  {
    slug: 'window-functions',
    module: 'sql',
    title: 'Window Functions',
    description: 'ROW_NUMBER, RANK, LAG, LEAD, and analytical SQL patterns.',
    icon: '🪟',
    color: 'from-accent to-primary',
    accessTier: 'premium',
  },
  {
    slug: 'database-theory',
    module: 'sql',
    title: 'Database Design & Theory',
    description: 'Normalization, keys, ACID, indexes, and schema design.',
    icon: '🏗️',
    color: 'from-primary to-info',
    accessTier: 'premium',
  },
  {
    slug: 'practical-challenges',
    module: 'sql',
    title: 'Practical Query Challenges',
    description: 'Real-world scenarios asked in data analyst and backend interviews.',
    icon: '🎯',
    color: 'from-warning to-success',
    accessTier: 'premium',
  },
]

const pysparkSheets: Sheet[] = [
  { slug: 'pyspark-basics', module: 'pyspark', title: 'Basics', description: 'SparkSession, RDD fundamentals, and PySpark setup.', icon: '⚡', color: 'from-warning to-accent', accessTier: 'free' },
  { slug: 'pyspark-dataframes', module: 'pyspark', title: 'DataFrames', description: 'Creating, reading, and inspecting DataFrames.', icon: '📋', color: 'from-info to-primary', accessTier: 'mixed' },
  { slug: 'pyspark-transformations', module: 'pyspark', title: 'Transformations', description: 'map, filter, select, withColumn, and lazy transforms.', icon: '🔄', color: 'from-success to-info', accessTier: 'mixed' },
  { slug: 'pyspark-actions', module: 'pyspark', title: 'Actions', description: 'count, collect, show, write, and triggering jobs.', icon: '▶️', color: 'from-accent to-primary', accessTier: 'premium' },
  { slug: 'pyspark-rdd-vs-df', module: 'pyspark', title: 'RDD vs DataFrame', description: 'When to use RDDs vs DataFrames vs Datasets.', icon: '⚖️', color: 'from-primary to-accent', accessTier: 'premium' },
  { slug: 'pyspark-spark-sql', module: 'pyspark', title: 'Spark SQL', description: 'spark.sql, temp views, and Catalyst optimizer.', icon: '🗄️', color: 'from-info to-accent', accessTier: 'premium' },
  { slug: 'pyspark-joins', module: 'pyspark', title: 'Joins', description: 'Join types, broadcast hints, and join strategies in Spark.', icon: '🔗', color: 'from-success to-primary', accessTier: 'premium' },
  { slug: 'pyspark-window', module: 'pyspark', title: 'Window Functions', description: 'Window specs, ranking, and analytical functions.', icon: '🪟', color: 'from-warning to-accent', accessTier: 'premium' },
  { slug: 'pyspark-performance', module: 'pyspark', title: 'Performance Optimization', description: 'Catalyst, Tungsten, and query plan optimization.', icon: '🚀', color: 'from-accent to-warning', accessTier: 'premium' },
  { slug: 'pyspark-partitioning', module: 'pyspark', title: 'Partitioning', description: 'repartition, coalesce, and partition pruning.', icon: '📦', color: 'from-primary to-info', accessTier: 'premium' },
  { slug: 'pyspark-broadcast', module: 'pyspark', title: 'Broadcast Join', description: 'Broadcast variables and broadcast hash joins.', icon: '📡', color: 'from-success to-accent', accessTier: 'premium' },
  { slug: 'pyspark-shuffle', module: 'pyspark', title: 'Shuffle', description: 'Shuffle stages, spill, and reducing shuffle cost.', icon: '🔀', color: 'from-warning to-primary', accessTier: 'premium' },
  { slug: 'pyspark-skew', module: 'pyspark', title: 'Skew Handling', description: 'Salting, AQE skew join, and hot key mitigation.', icon: '🌡️', color: 'from-accent to-info', accessTier: 'premium' },
  { slug: 'pyspark-delta', module: 'pyspark', title: 'Delta Integration', description: 'Reading/writing Delta tables from PySpark.', icon: '🌊', color: 'from-info to-success', accessTier: 'premium' },
  { slug: 'pyspark-scenarios', module: 'pyspark', title: 'Scenario-based Questions', description: 'Real PySpark interview scenarios and trade-offs.', icon: '🎯', color: 'from-warning to-success', accessTier: 'premium' },
]

const sparkSheets: Sheet[] = [
  { slug: 'spark-architecture', module: 'spark', title: 'Architecture', description: 'Spark components, driver, executors, and cluster model.', icon: '🏛️', color: 'from-warning to-primary', accessTier: 'free' },
  { slug: 'spark-driver-executors', module: 'spark', title: 'Driver & Executors', description: 'Roles, memory, and task scheduling.', icon: '🖥️', color: 'from-info to-accent', accessTier: 'mixed' },
  { slug: 'spark-dag', module: 'spark', title: 'DAG', description: 'Stages, tasks, DAGScheduler, and TaskScheduler.', icon: '📊', color: 'from-success to-primary', accessTier: 'mixed' },
  { slug: 'spark-lazy', module: 'spark', title: 'Lazy Evaluation', description: 'Lineage, lazy transforms, and action triggers.', icon: '💤', color: 'from-accent to-warning', accessTier: 'premium' },
  { slug: 'spark-caching', module: 'spark', title: 'Caching', description: 'cache, persist, storage levels, and reuse.', icon: '💾', color: 'from-primary to-info', accessTier: 'premium' },
  { slug: 'spark-persistence', module: 'spark', title: 'Persistence', description: 'Storage levels, MEMORY_AND_DISK, and eviction.', icon: '🗃️', color: 'from-info to-primary', accessTier: 'premium' },
  { slug: 'spark-shuffle', module: 'spark', title: 'Shuffle', description: 'Shuffle write/read, sort-merge, and hash shuffle.', icon: '🔀', color: 'from-warning to-accent', accessTier: 'premium' },
  { slug: 'spark-partitioning', module: 'spark', title: 'Partitioning', description: 'Default parallelism, partitions, and coalesce.', icon: '📦', color: 'from-success to-info', accessTier: 'premium' },
  { slug: 'spark-cluster', module: 'spark', title: 'Cluster Managers', description: 'YARN, Mesos, Kubernetes, and standalone.', icon: '☸️', color: 'from-accent to-primary', accessTier: 'premium' },
  { slug: 'spark-performance', module: 'spark', title: 'Performance', description: 'AQE, skew, serialization, and tuning knobs.', icon: '🚀', color: 'from-primary to-accent', accessTier: 'premium' },
  { slug: 'spark-scenarios', module: 'spark', title: 'Scenario Questions', description: 'Production Spark troubleshooting scenarios.', icon: '🎯', color: 'from-warning to-success', accessTier: 'premium' },
]

const azdeSheets: Sheet[] = [
  { slug: 'azde-pipelines', module: 'azure-data-engineering', title: 'End-to-End Pipelines', description: 'Designing batch and streaming pipelines on Azure.', icon: '🔧', color: 'from-info to-primary', accessTier: 'free' },
  { slug: 'azde-storage', module: 'azure-data-engineering', title: 'Storage', description: 'ADLS Gen2, Blob, tiers, and lifecycle policies.', icon: '🗄️', color: 'from-primary to-info', accessTier: 'mixed' },
  { slug: 'azde-compute', module: 'azure-data-engineering', title: 'Compute', description: 'Databricks, Synapse, HDInsight, and serverless SQL.', icon: '🖥️', color: 'from-success to-info', accessTier: 'mixed' },
  { slug: 'azde-orchestration', module: 'azure-data-engineering', title: 'Orchestration', description: 'ADF, Logic Apps, and workflow coordination.', icon: '🎛️', color: 'from-accent to-primary', accessTier: 'premium' },
  { slug: 'azde-security', module: 'azure-data-engineering', title: 'Security', description: 'RBAC, managed identities, Key Vault, and encryption.', icon: '🔒', color: 'from-warning to-accent', accessTier: 'premium' },
  { slug: 'azde-monitoring', module: 'azure-data-engineering', title: 'Monitoring', description: 'Azure Monitor, Log Analytics, and alerting.', icon: '📈', color: 'from-info to-accent', accessTier: 'premium' },
  { slug: 'azde-cost', module: 'azure-data-engineering', title: 'Cost Optimization', description: 'Reserved capacity, autoscaling, and tiering.', icon: '💰', color: 'from-success to-primary', accessTier: 'premium' },
  { slug: 'azde-scenarios', module: 'azure-data-engineering', title: 'Production Scenarios', description: 'Real Azure DE production interview scenarios.', icon: '🎯', color: 'from-warning to-success', accessTier: 'premium' },
]

const adfSheets: Sheet[] = [
  { slug: 'adf-pipelines', module: 'azure-data-factory', title: 'Pipelines', description: 'Pipeline structure, dependencies, and orchestration.', icon: '🏭', color: 'from-info to-accent', accessTier: 'free' },
  { slug: 'adf-activities', module: 'azure-data-factory', title: 'Activities', description: 'Copy, Data Flow, Lookup, ForEach, and custom activities.', icon: '⚙️', color: 'from-primary to-info', accessTier: 'mixed' },
  { slug: 'adf-linked-services', module: 'azure-data-factory', title: 'Linked Services', description: 'Connection definitions and credential management.', icon: '🔗', color: 'from-success to-primary', accessTier: 'mixed' },
  { slug: 'adf-datasets', module: 'azure-data-factory', title: 'Datasets', description: 'Dataset schemas, parameters, and binary formats.', icon: '📁', color: 'from-accent to-warning', accessTier: 'premium' },
  { slug: 'adf-ir', module: 'azure-data-factory', title: 'Integration Runtime', description: 'Azure, self-hosted, and Azure-SSIS IR.', icon: '🌐', color: 'from-warning to-accent', accessTier: 'premium' },
  { slug: 'adf-triggers', module: 'azure-data-factory', title: 'Triggers', description: 'Schedule, tumbling window, and event triggers.', icon: '⏰', color: 'from-info to-primary', accessTier: 'premium' },
  { slug: 'adf-parameters', module: 'azure-data-factory', title: 'Parameters', description: 'Pipeline and dataset parameterization.', icon: '📝', color: 'from-primary to-accent', accessTier: 'premium' },
  { slug: 'adf-variables', module: 'azure-data-factory', title: 'Variables', description: 'SetVariable, AppendVariable, and dynamic expressions.', icon: '🔢', color: 'from-success to-info', accessTier: 'premium' },
  { slug: 'adf-error-handling', module: 'azure-data-factory', title: 'Error Handling', description: 'Retry policies, try/catch patterns, and dead-letter.', icon: '🛡️', color: 'from-accent to-primary', accessTier: 'premium' },
  { slug: 'adf-incremental', module: 'azure-data-factory', title: 'Incremental Loads', description: 'Watermark columns, CDC, and delta patterns.', icon: '📶', color: 'from-warning to-success', accessTier: 'premium' },
  { slug: 'adf-monitoring', module: 'azure-data-factory', title: 'Monitoring', description: 'Monitor hub, alerts, and pipeline run analytics.', icon: '📊', color: 'from-info to-accent', accessTier: 'premium' },
  { slug: 'adf-scenarios', module: 'azure-data-factory', title: 'Scenario Questions', description: 'ADF design and troubleshooting scenarios.', icon: '🎯', color: 'from-warning to-primary', accessTier: 'premium' },
]

const dbrSheets: Sheet[] = [
  { slug: 'dbr-workspace', module: 'azure-databricks', title: 'Workspace', description: 'Workspace layout, repos, and collaboration.', icon: '🧱', color: 'from-accent to-primary', accessTier: 'free' },
  { slug: 'dbr-clusters', module: 'azure-databricks', title: 'Clusters', description: 'Job vs all-purpose clusters, autoscaling, and pools.', icon: '🖥️', color: 'from-info to-accent', accessTier: 'mixed' },
  { slug: 'dbr-notebooks', module: 'azure-databricks', title: 'Notebooks', description: 'Notebooks, widgets, %run, and magic commands.', icon: '📓', color: 'from-primary to-info', accessTier: 'mixed' },
  { slug: 'dbr-jobs', module: 'azure-databricks', title: 'Jobs', description: 'Job scheduling, task dependencies, and workflows.', icon: '⏱️', color: 'from-success to-primary', accessTier: 'premium' },
  { slug: 'dbr-delta', module: 'azure-databricks', title: 'Delta Lake', description: 'Delta tables, MERGE, and time travel in Databricks.', icon: '🌊', color: 'from-info to-success', accessTier: 'premium' },
  { slug: 'dbr-unity-catalog', module: 'azure-databricks', title: 'Unity Catalog', description: 'Catalogs, schemas, governance, and lineage.', icon: '📚', color: 'from-accent to-warning', accessTier: 'premium' },
  { slug: 'dbr-optimization', module: 'azure-databricks', title: 'Optimization', description: 'OPTIMIZE, ZORDER, and file compaction.', icon: '⚡', color: 'from-warning to-accent', accessTier: 'premium' },
  { slug: 'dbr-performance', module: 'azure-databricks', title: 'Performance', description: 'Photon, caching, and shuffle tuning.', icon: '🚀', color: 'from-primary to-accent', accessTier: 'premium' },
  { slug: 'dbr-streaming', module: 'azure-databricks', title: 'Streaming', description: 'Structured Streaming and Delta streaming sinks.', icon: '📡', color: 'from-success to-info', accessTier: 'premium' },
  { slug: 'dbr-scenarios', module: 'azure-databricks', title: 'Scenario Questions', description: 'Databricks production interview scenarios.', icon: '🎯', color: 'from-warning to-success', accessTier: 'premium' },
]

const deltaSheets: Sheet[] = [
  { slug: 'delta-acid', module: 'delta-lake', title: 'ACID', description: 'Transactions, concurrency, and isolation in Delta Lake.', icon: '🔐', color: 'from-info to-success', accessTier: 'free' },
  { slug: 'delta-time-travel', module: 'delta-lake', title: 'Time Travel', description: 'Version history, restore, and audit queries.', icon: '⏳', color: 'from-primary to-info', accessTier: 'mixed' },
  { slug: 'delta-merge', module: 'delta-lake', title: 'MERGE', description: 'Upserts, SCD patterns, and conditional MERGE.', icon: '🔀', color: 'from-accent to-primary', accessTier: 'mixed' },
  { slug: 'delta-optimize', module: 'delta-lake', title: 'OPTIMIZE', description: 'Compaction, file sizing, and layout optimization.', icon: '⚡', color: 'from-warning to-accent', accessTier: 'premium' },
  { slug: 'delta-vacuum', module: 'delta-lake', title: 'VACUUM', description: 'Retention, cleanup, and storage cost control.', icon: '🧹', color: 'from-success to-info', accessTier: 'premium' },
  { slug: 'delta-zorder', module: 'delta-lake', title: 'ZORDER', description: 'Multi-dimensional clustering and data skipping.', icon: '📐', color: 'from-info to-accent', accessTier: 'premium' },
  { slug: 'delta-cdf', module: 'delta-lake', title: 'Change Data Feed', description: 'CDC streams from Delta table changes.', icon: '📶', color: 'from-primary to-accent', accessTier: 'premium' },
  { slug: 'delta-medallion', module: 'delta-lake', title: 'Medallion Architecture', description: 'Bronze, silver, gold layers with Delta.', icon: '🥇', color: 'from-accent to-warning', accessTier: 'premium' },
  { slug: 'delta-scenarios', module: 'delta-lake', title: 'Scenario Questions', description: 'Delta Lake production and design scenarios.', icon: '🎯', color: 'from-warning to-success', accessTier: 'premium' },
]

const pythonSheets: Sheet[] = [
  { slug: 'python-basics', module: 'python', title: 'Basics', description: 'Types, variables, control flow, and comprehensions.', icon: '🐍', color: 'from-success to-primary', accessTier: 'free' },
  { slug: 'python-oop', module: 'python', title: 'OOP', description: 'Classes, inheritance, polymorphism, and dunder methods.', icon: '🏗️', color: 'from-info to-accent', accessTier: 'mixed' },
  { slug: 'python-functions', module: 'python', title: 'Functions', description: 'Args, kwargs, lambdas, and scope.', icon: 'ƒ', color: 'from-primary to-info', accessTier: 'mixed' },
  { slug: 'python-collections', module: 'python', title: 'Collections', description: 'list, dict, set, tuple, Counter, defaultdict.', icon: '📚', color: 'from-accent to-primary', accessTier: 'premium' },
  { slug: 'python-files', module: 'python', title: 'File Handling', description: 'Reading/writing files, context managers, and pathlib.', icon: '📄', color: 'from-warning to-success', accessTier: 'premium' },
  { slug: 'python-exceptions', module: 'python', title: 'Exception Handling', description: 'try/except, custom exceptions, and best practices.', icon: '⚠️', color: 'from-success to-info', accessTier: 'premium' },
  { slug: 'python-generators', module: 'python', title: 'Iterators & Generators', description: 'yield, iter protocols, and lazy evaluation.', icon: '🔄', color: 'from-info to-primary', accessTier: 'premium' },
  { slug: 'python-decorators', module: 'python', title: 'Decorators', description: 'Function decorators, functools.wraps, and patterns.', icon: '🎀', color: 'from-primary to-accent', accessTier: 'premium' },
  { slug: 'python-threading', module: 'python', title: 'Multithreading', description: 'GIL, threads, locks, and I/O-bound concurrency.', icon: '🧵', color: 'from-accent to-warning', accessTier: 'premium' },
  { slug: 'python-multiprocessing', module: 'python', title: 'Multiprocessing', description: 'Processes, pools, and CPU-bound parallelism.', icon: '⚙️', color: 'from-warning to-accent', accessTier: 'premium' },
  { slug: 'python-logging', module: 'python', title: 'Logging', description: 'logging module, handlers, and structured logs.', icon: '📝', color: 'from-success to-primary', accessTier: 'premium' },
  { slug: 'python-apis', module: 'python', title: 'APIs', description: 'requests, REST clients, retries, and pagination.', icon: '🌐', color: 'from-info to-accent', accessTier: 'premium' },
  { slug: 'python-coding', module: 'python', title: 'Coding Questions', description: 'Common Python coding problems in DE interviews.', icon: '💻', color: 'from-primary to-info', accessTier: 'premium' },
  { slug: 'python-scenarios', module: 'python', title: 'Scenario Questions', description: 'Python scenarios for data engineering roles.', icon: '🎯', color: 'from-warning to-success', accessTier: 'premium' },
]

const dmSheets: Sheet[] = [
  { slug: 'dm-oltp-olap', module: 'data-modeling', title: 'OLTP vs OLAP', description: 'Transactional vs analytical systems and workloads.', icon: '⚖️', color: 'from-info to-primary', accessTier: 'free' },
  { slug: 'dm-star', module: 'data-modeling', title: 'Star Schema', description: 'Fact tables, dimensions, and star schema design.', icon: '⭐', color: 'from-warning to-accent', accessTier: 'mixed' },
  { slug: 'dm-snowflake', module: 'data-modeling', title: 'Snowflake Schema', description: 'Normalized dimensions and snowflake trade-offs.', icon: '❄️', color: 'from-primary to-info', accessTier: 'mixed' },
  { slug: 'dm-facts-dims', module: 'data-modeling', title: 'Facts & Dimensions', description: 'Grain, degenerate dimensions, and fact types.', icon: '📊', color: 'from-success to-primary', accessTier: 'premium' },
  { slug: 'dm-scd', module: 'data-modeling', title: 'SCD Types', description: 'Type 0–6 slowly changing dimension patterns.', icon: '🔄', color: 'from-accent to-warning', accessTier: 'premium' },
  { slug: 'dm-normalization', module: 'data-modeling', title: 'Normalization', description: '1NF–3NF, BCNF, and when to normalize.', icon: '📐', color: 'from-info to-accent', accessTier: 'premium' },
  { slug: 'dm-denormalization', module: 'data-modeling', title: 'Denormalization', description: 'When and how to denormalize for analytics.', icon: '📦', color: 'from-warning to-primary', accessTier: 'premium' },
  { slug: 'dm-surrogate-keys', module: 'data-modeling', title: 'Surrogate Keys', description: 'Natural vs surrogate keys and conformed dimensions.', icon: '🔑', color: 'from-primary to-accent', accessTier: 'premium' },
  { slug: 'dm-dwh-design', module: 'data-modeling', title: 'Data Warehouse Design', description: 'Kimball vs Inmon, staging, and marts.', icon: '🏛️', color: 'from-success to-info', accessTier: 'premium' },
  { slug: 'dm-scenarios', module: 'data-modeling', title: 'Scenario Questions', description: 'Modeling scenarios from real interview loops.', icon: '🎯', color: 'from-warning to-success', accessTier: 'premium' },
]

export const sheets: Sheet[] = [
  ...sqlSheets,
  ...pysparkSheets,
  ...sparkSheets,
  ...azdeSheets,
  ...adfSheets,
  ...dbrSheets,
  ...deltaSheets,
  ...pythonSheets,
  ...dmSheets,
]

export const sheetBySlug = Object.fromEntries(sheets.map((s) => [s.slug, s]))

export function getSheetsByModule(moduleSlug: string): Sheet[] {
  return sheets.filter((s) => s.module === moduleSlug)
}

export function getQuestionCountByModule(moduleSlug: string): number {
  return getSheetsByModule(moduleSlug).length
}
