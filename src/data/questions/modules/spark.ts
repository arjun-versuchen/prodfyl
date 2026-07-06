import { distributeQuestions } from '../../questionFactory'
import type { QuestionInput } from '../../questionFactory'

export const sparkQuestions = distributeQuestions('spark', [
  {
    sheet: 'spark-architecture',
    category: 'Architecture',
    items: [
      {
        title: 'Spark core components',
        difficulty: 'Easy',
        question: 'Name the main components of a Spark application and their roles.',
        answer:
          'The driver runs your main() program, builds the DAG, and schedules tasks. Executors run tasks and hold cached data in JVM processes on worker nodes. The cluster manager (YARN, K8s, Mesos, standalone) allocates resources. SparkContext/SparkSession connects driver to the cluster. Interviewers expect clear separation: driver orchestrates, executors compute.',
        tags: ['architecture', 'fundamentals'],
        frequency: 'Very High',
      },
      {
        title: 'Driver vs executor responsibilities',
        difficulty: 'Easy',
        question: 'What runs on the driver versus executors during a Spark job?',
        answer:
          'Driver hosts SparkContext, tracks RDD/DataFrame lineage, converts logical plans to physical stages, and ships tasks to executors. Executors evaluate transformations on partitions, store shuffle blocks, and return results or metadata to the driver. collect() and take() pull data to the driver—keep heavy data on executors.',
        tags: ['driver', 'executor', 'architecture'],
        frequency: 'Very High',
      },
      {
        title: 'Spark deployment modes',
        difficulty: 'Medium',
        question: 'Compare client mode and cluster mode for Spark deployments.',
        answer:
          'In client mode the driver runs on the submitter machine (notebook, edge node)—good for interactive dev but driver network must reach executors. In cluster mode the driver runs inside the cluster on a worker—production jobs on YARN/K8s for resilience. Databricks abstracts this; know implications for driver OOM and firewall rules.',
        tags: ['deployment', 'client-mode', 'cluster-mode'],
        frequency: 'Very High',
      },
      {
        title: 'Spark ecosystem modules',
        difficulty: 'Easy',
        question: 'How do Spark SQL, Structured Streaming, MLlib, and GraphX relate to Spark Core?',
        answer:
          'All build on Spark Core\'s distributed task scheduler and memory management. Spark SQL is the primary DE surface (DataFrames, Catalyst). Structured Streaming treats streams as micro-batch or continuous queries on the same engine. MLlib and GraphX add algorithms but share executors and shuffle infrastructure.',
        tags: ['ecosystem', 'spark-sql', 'streaming'],
        frequency: 'High',
      },
      {
        title: 'Fault tolerance model',
        difficulty: 'Medium',
        question: 'How does Spark recover from executor or task failures?',
        answer:
          'Spark tracks lineage (RDD) or logical plans (DataFrames) to recompute lost partitions on healthy executors. Shuffle files are re-read or regenerated depending on stage. Task failures retry up to spark.task.maxFailures. Driver failure typically kills the app unless cluster-mode driver restart is configured—design idempotent writes for safe retries.',
        tags: ['fault-tolerance', 'lineage', 'reliability'],
        frequency: 'Very High',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'spark-driver-executors',
    category: 'Driver & Executors',
    items: [
      {
        title: 'Executor memory layout',
        difficulty: 'Hard',
        question: 'Describe executor memory regions relevant to tuning Spark jobs.',
        answer:
          'Executor heap splits into storage (cache, broadcast), execution (shuffle, joins, sorts), and user memory via spark.memory.fraction and spark.memory.storageFraction. Off-heap can be enabled for allocators. OOM in execution often means shuffle or join too large; storage OOM means too much cache/persist. Unified memory allows borrowing between storage and execution.',
        tags: ['memory', 'executor', 'tuning'],
        frequency: 'Very High',
      },
      {
        title: 'Driver memory pitfalls',
        difficulty: 'Medium',
        question: 'What operations commonly cause driver OOM in Spark?',
        answer:
          'collect(), toPandas(), take() on huge results, broadcasting oversized tables, and accumulating lists in driver-side foreach. Large query plans or too many partitions returning task metrics can also stress the driver. Fix by writing to storage, using aggregate actions, increasing spark.driver.maxResultSize only as a band-aid, and right-sizing broadcasts.',
        tags: ['driver', 'oom', 'anti-patterns'],
        frequency: 'Very High',
      },
      {
        title: 'Cores per executor',
        difficulty: 'Medium',
        question: 'How do you choose the number of cores per executor?',
        answer:
          'Typical guidance: 4–5 cores per executor balances HDFS throughput and JVM GC overhead. Too many cores per executor increases concurrent tasks competing for memory; too few underutilizes nodes. Total concurrency ≈ executors × cores per executor; align with shuffle partitions and input split size for even task duration.',
        tags: ['cores', 'sizing', 'executors'],
        frequency: 'High',
      },
      {
        title: 'Dynamic allocation',
        difficulty: 'Medium',
        question: 'What is dynamic allocation and when is it useful?',
        answer:
          'Executors scale up when pending tasks backlog and scale down when idle (spark.dynamicAllocation.enabled). Useful for shared clusters with variable workloads. Requires external shuffle service on YARN to safely remove executors with shuffle data. Not always ideal for streaming or strict SLAs needing fixed capacity.',
        tags: ['dynamic-allocation', 'scaling'],
        frequency: 'High',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'spark-dag',
    category: 'DAG',
    items: [
      {
        title: 'DAG and stages',
        difficulty: 'Medium',
        question: 'How does Spark break a job into stages and tasks?',
        answer:
          'DAGScheduler builds a directed acyclic graph from RDD/DataFrame lineage. Shuffle boundaries split stages—wide dependencies start new stages. Each stage contains tasks—one per partition. TaskScheduler submits tasks to executors. Fewer stages generally mean less shuffle; explain plans to see where Exchange nodes cut stages.',
        tags: ['dag', 'stages', 'tasks'],
        frequency: 'Very High',
      },
      {
        title: 'DAGScheduler vs TaskScheduler',
        difficulty: 'Hard',
        question: 'Differentiate DAGScheduler and TaskScheduler in Spark.',
        answer:
          'DAGScheduler converts logical stages into Stage objects, registers shuffle dependencies, and requests shuffle metadata. TaskScheduler (via SchedulerBackend) launches individual tasks on executors, handles retries, locality preferences (PROCESS_LOCAL, NODE_LOCAL), and speculative execution. Interview depth: DAG is macro planning; TaskScheduler is micro execution.',
        tags: ['dagscheduler', 'taskscheduler', 'internals'],
        frequency: 'Medium',
      },
      {
        title: 'Narrow vs wide dependencies',
        difficulty: 'Medium',
        question: 'Explain narrow and wide dependencies with examples.',
        answer:
          'Narrow: each parent partition feeds at most one child partition (map, filter)—pipelined in one stage. Wide: multiple child partitions depend on multiple parents (groupByKey, join shuffle)—requires shuffle and new stage. Spark fuses narrow ops via Whole-Stage Codegen; wide deps dominate cluster cost.',
        tags: ['dependencies', 'narrow', 'wide'],
        frequency: 'Very High',
      },
      {
        title: 'Speculative execution',
        difficulty: 'Medium',
        question: 'What is speculative execution and when does Spark use it?',
        answer:
          'If tasks straggle, Spark launches duplicate copies on other executors and takes the first finish (spark.speculation). Helps with slow nodes or skewed tasks not yet optimized away. Disable when side-effect tasks could double-write; enable for CPU-bound uniform workloads with variable node performance.',
        tags: ['speculation', 'stragglers', 'tasks'],
        frequency: 'High',
      },
      {
        title: 'Job, stage, and task hierarchy',
        difficulty: 'Easy',
        question: 'Define Spark job, stage, and task in the UI context.',
        answer:
          'A job is triggered by one action (e.g., write or count). Jobs contain stages separated by shuffles. Stages contain tasks equal to partition count at that point. Monitoring: one slow task in a stage often signals skew; many stages signal repeated shuffles worth optimizing.',
        tags: ['jobs', 'stages', 'spark-ui'],
        frequency: 'Very High',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'spark-lazy',
    category: 'Lazy Evaluation',
    items: [
      {
        title: 'Lazy evaluation benefits',
        difficulty: 'Easy',
        question: 'Why is lazy evaluation fundamental to Spark performance?',
        answer:
          'Spark delays execution until an action, allowing Catalyst to rewrite the full query—push filters, prune columns, pick join strategies, and fuse operators. Without laziness each line would run immediately, blocking optimization across steps. Lineage also enables recomputation after failures without persisting intermediates.',
        tags: ['lazy-evaluation', 'optimization'],
        frequency: 'Very High',
      },
      {
        title: 'Lineage and recomputation',
        difficulty: 'Medium',
        question: 'How does lineage enable fault tolerance in Spark RDDs and DataFrames?',
        answer:
          'Each partition records its parent RDDs/transforms. On loss, Spark recomputes only missing partitions from lineage—not the full dataset. Long lineage chains can be expensive to recompute; persist/cache cuts recompute cost at memory price. DataFrames track logical plans similarly through the optimizer.',
        tags: ['lineage', 'fault-tolerance'],
        frequency: 'High',
      },
      {
        title: 'Actions that trigger jobs',
        difficulty: 'Easy',
        question: 'Which operations trigger Spark job execution?',
        answer:
          'Actions: count, collect, take, save, write, foreach, reduce, show (limited), and aggregate terminal functions. Transformations (select, filter, join without action) only extend the plan. Multiple actions on the same lineage without cache re-run the DAG unless persisted.',
        tags: ['actions', 'lazy-evaluation'],
        frequency: 'Very High',
      },
      {
        title: 'Breaking lineage with checkpoint',
        difficulty: 'Hard',
        question: 'When do you use checkpoint() versus cache() to truncate lineage?',
        answer:
          'checkpoint() writes to reliable storage (HDFS/S3) and severs lineage—useful for very long chains or streaming state where recomputation is prohibitive. cache() keeps in memory/disk on executors but retains lineage. Checkpoint is eager and requires checkpoint directory setup; use sparingly due to write cost.',
        tags: ['checkpoint', 'lineage', 'streaming'],
        frequency: 'Medium',
      },
      {
        title: 'Eager execution in pandas API',
        difficulty: 'Medium',
        question: 'Does Spark ever execute eagerly outside of actions?',
        answer:
          'Mostly lazy for DataFrames. Exceptions: schema inference on CSV/JSON may sample files; some Databricks display paths trigger preview jobs; pandas-on-Spark can feel eager in notebooks. Structured Streaming starts incremental execution on writeStream.start(). Know the default mental model remains lazy until action.',
        tags: ['eager', 'edge-cases'],
        frequency: 'Low',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'spark-caching',
    category: 'Caching',
    items: [
      {
        title: 'cache vs persist',
        difficulty: 'Easy',
        question: 'What is the difference between cache() and persist() in Spark?',
        answer:
          'cache() is persist(MEMORY_ONLY) shorthand. persist(level) lets you choose storage: MEMORY_ONLY, MEMORY_AND_DISK, DISK_ONLY, etc. Both materialize the Dataset on first action after the call. Use when reuse justifies memory; always unpersist() when done in long sessions.',
        example: 'df.persist(StorageLevel.MEMORY_AND_DISK)\ndf.unpersist()',
        tags: ['cache', 'persist'],
        frequency: 'Very High',
      },
      {
        title: 'When not to cache',
        difficulty: 'Medium',
        question: 'What are common mistakes when caching Spark datasets?',
        answer:
          'Caching one-pass ETL intermediates wastes memory with no reuse benefit. Caching before a filter that drastically shrinks data—filter first, then cache the smaller set. Caching huge datasets evicts execution memory causing spill. Multiple cached layers without unpersist cascade memory pressure.',
        tags: ['cache', 'anti-patterns'],
        frequency: 'High',
      },
      {
        title: 'Storage level trade-offs',
        difficulty: 'Medium',
        question: 'Compare MEMORY_ONLY versus MEMORY_AND_DISK storage levels.',
        answer:
          'MEMORY_ONLY is fastest but evicts partitions that do not fit, recomputing on next use. MEMORY_AND_DISK spills overflow to disk—slower but avoids full recompute. MEMORY_ONLY_SER stores serialized bytes—less memory, more CPU. Choose based on reuse frequency and memory headroom.',
        tags: ['storage-level', 'memory'],
        frequency: 'High',
      },
      {
        title: 'Cache and shuffle interactions',
        difficulty: 'Hard',
        question: 'Does caching before a shuffle help performance?',
        answer:
          'Caching before shuffle can help if the pre-shuffle DataFrame is reused in multiple downstream branches—computing shuffle inputs once. It does not remove shuffle itself. Caching post-shuffle is often more valuable when the shuffled result feeds many aggregations. Measure—unnecessary cache adds materialization cost.',
        tags: ['cache', 'shuffle'],
        frequency: 'Medium',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'spark-persistence',
    category: 'Persistence',
    items: [
      {
        title: 'Persistence levels overview',
        difficulty: 'Medium',
        question: 'List Spark storage levels and their use cases.',
        answer:
          'MEMORY_ONLY, MEMORY_AND_DISK, MEMORY_ONLY_SER, MEMORY_AND_DISK_SER, DISK_ONLY, OFF_HEAP (with off-heap enabled). Serialized levels reduce footprint for large string-heavy data at CPU cost. DISK_ONLY for rarely reused huge datasets. Spark UI Storage tab shows what is pinned where.',
        tags: ['persistence', 'storage-level'],
        frequency: 'High',
      },
      {
        title: 'Serialization formats',
        difficulty: 'Hard',
        question: 'How do Kryo and Java serialization affect Spark persistence and shuffles?',
        answer:
          'Java serialization is default but verbose and slow. Kryo (spark.serializer, spark.kryo.registrator) is faster and more compact—register custom classes for best gains. Smaller serialized objects reduce shuffle spill and broadcast overhead. Trade-off: Kryo requires maintenance when classes change.',
        tags: ['kryo', 'serialization'],
        frequency: 'High',
      },
      {
        title: 'Eviction and LRU',
        difficulty: 'Medium',
        question: 'How does Spark evict cached blocks when memory is full?',
        answer:
          'Spark uses LRU within storage memory; blocks with high recomputation cost are prioritized to stay. When execution needs memory, storage can be evicted per unified memory rules. Chronic eviction means insufficient executor memory or over-caching—fix sizing not infinite persist.',
        tags: ['eviction', 'memory', 'cache'],
        frequency: 'Medium',
      },
      {
        title: 'Global temporary views lifetime',
        difficulty: 'Easy',
        question: 'How long do cached DataFrames and temp views persist in a Spark session?',
        answer:
          'Cache persists until unpersist or SparkSession stop. Temp views last for the session lifetime. Cluster restart clears all. Production jobs should explicitly unpersist and not rely on notebook session longevity. Job clusters terminate with the job—design pipelines to be stateless across runs.',
        tags: ['session', 'lifecycle', 'temp-view'],
        frequency: 'High',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'spark-shuffle',
    category: 'Shuffle',
    items: [
      {
        title: 'Shuffle write and read',
        difficulty: 'Medium',
        question: 'What happens during shuffle write and shuffle read in Spark?',
        answer:
          'Map tasks partition output by key into local shuffle files (or push-based shuffle in Spark 3). Reduce tasks pull remote blocks over the network into sort or hash buffers. Shuffle is disk + network intensive—dominates many ETL jobs. Metrics appear as shuffle write/read bytes in Spark UI.',
        tags: ['shuffle', 'internals'],
        frequency: 'Very High',
      },
      {
        title: 'Sort-merge vs hash shuffle',
        difficulty: 'Hard',
        question: 'Explain sort-merge shuffle and when Spark avoids hash shuffle.',
        answer:
          'Modern Spark defaults to sort-based shuffle for reliability with large partition counts—map tasks write sorted records per partition; reduce side merges. Hash shuffle (legacy) kept all map outputs in memory—problematic at scale. Joins use sort-merge join after shuffling both sides to the same partitioner.',
        tags: ['sort-merge', 'shuffle', 'join'],
        frequency: 'High',
      },
      {
        title: 'Reducing shuffle volume',
        difficulty: 'Medium',
        question: 'What techniques reduce shuffle bytes in Spark pipelines?',
        answer:
          'Filter and project early to shrink row width. Broadcast small dimensions. Use combiners for partial aggregates. Repartition by join key once instead of multiple shuffles. Bucket tables on join keys for co-located reads. Avoid distinct on wide rows before necessary.',
        tags: ['shuffle', 'optimization'],
        frequency: 'Very High',
      },
      {
        title: 'External shuffle service',
        difficulty: 'Hard',
        question: 'What is the external shuffle service and why does it matter on YARN?',
        answer:
          'A long-lived NodeManager service holds shuffle files so executors can be removed without losing shuffle data—enabling dynamic allocation and safer executor loss. Without it, losing an executor may require entire stage recomputation. Enable on YARN for elastic clusters; understand K8s has different shuffle persistence models.',
        tags: ['shuffle-service', 'yarn', 'dynamic-allocation'],
        frequency: 'Medium',
      },
      {
        title: 'Push-based shuffle',
        difficulty: 'Hard',
        question: 'What problem does push-based shuffle solve in Spark 3?',
        answer:
          'Classic shuffle makes many reduce tasks fetch from many map outputs—driver tracks enormous metadata. Push-based shuffle lets map sides push merged shuffle blocks to remote shuffle services, reducing fetch fan-out and driver memory for huge partition counts. Relevant at terabyte scale with thousands of reducers.',
        tags: ['push-shuffle', 'spark3'],
        frequency: 'Medium',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'spark-partitioning',
    category: 'Partitioning',
    items: [
      {
        title: 'Default parallelism',
        difficulty: 'Medium',
        question: 'What controls default partition count for RDDs and DataFrames in Spark?',
        answer:
          'For RDDs: max(spark.default.parallelism, minPartitions) often tied to total cores. For DataFrames: spark.sql.shuffle.partitions (default 200) for shuffle outputs; file-based reads use split size (spark.sql.files.maxPartitionBytes). Misaligned defaults cause tiny tasks or giant partitions—tune per workload.',
        tags: ['parallelism', 'partitions'],
        frequency: 'Very High',
      },
      {
        title: 'Hive-style partitioning',
        difficulty: 'Easy',
        question: 'How does hive-style partitioning help Spark read performance?',
        answer:
          'Directory layout like year=2024/month=01/ lets Spark list only matching paths when filters use partition columns. Combine with Parquet/Delta file statistics inside partitions. Write pipelines should partition on low-cardinality date or region columns aligned to query patterns—not high-cardinality user_id.',
        tags: ['hive-partitioning', 'layout'],
        frequency: 'Very High',
      },
      {
        title: 'Bucketing tables',
        difficulty: 'Hard',
        question: 'What is bucketing in Spark and how does it optimize joins?',
        answer:
          'Bucketing pre-shuffles data into fixed buckets per bucket column at write time (bucketBy). Joins on bucket columns can skip full shuffle if bucket counts match. Useful for repeated joins on high-cardinality keys. Maintenance overhead: must plan bucket count up front; not as flexible as runtime AQE.',
        tags: ['bucketing', 'join', 'optimization'],
        frequency: 'Medium',
      },
      {
        title: 'Coalesce and file count',
        difficulty: 'Medium',
        question: 'Your Spark write produces thousands of small files—how do you fix it?',
        answer:
          'Coalesce or repartition to target file count before write; aim for 100–200MB files. For Delta/Parquet lakes run OPTIMIZE COMPACT. Tune maxRecordsPerFile or use distributed write options. Root cause is often high partition count after shuffle without post-write compaction.',
        tags: ['small-files', 'coalesce', 'write'],
        frequency: 'Very High',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'spark-cluster',
    category: 'Cluster Managers',
    items: [
      {
        title: 'YARN vs Kubernetes',
        difficulty: 'Medium',
        question: 'Compare running Spark on YARN versus Kubernetes.',
        answer:
          'YARN integrates with Hadoop ecosystems, mature shuffle services, and queue-based multi-tenancy. Kubernetes offers container-native scheduling, elasticity, and cloud-native ops (Helm, operators). Spark on K8s creates driver/executor pods; YARN uses containers on NM. Choice depends on existing platform—both are common in DE interviews.',
        tags: ['yarn', 'kubernetes', 'cluster-manager'],
        frequency: 'Very High',
      },
      {
        title: 'Standalone mode',
        difficulty: 'Easy',
        question: 'When is Spark standalone cluster manager appropriate?',
        answer:
          'Standalone is built-in for simple dedicated Spark clusters without YARN/K8s. Fine for learning, isolated batch clusters, or bare-metal Spark farms. Lacks rich resource queues and enterprise security integrations—most enterprises prefer YARN or K8s for shared infrastructure.',
        tags: ['standalone', 'cluster-manager'],
        frequency: 'Medium',
      },
      {
        title: 'Resource queues and fair scheduling',
        difficulty: 'Medium',
        question: 'How do resource queues affect Spark job submission on shared clusters?',
        answer:
          'YARN capacity/fair schedulers assign queues with memory/vCPU caps per team. spark.yarn.queue sets target queue. Misconfigured queues starve jobs or overcommit nodes. On Databricks, policies and cluster policies play a similar governance role. Always request resources matching shuffle/partition needs.',
        tags: ['yarn', 'queues', 'governance'],
        frequency: 'High',
      },
      {
        title: 'Spark on Databricks abstraction',
        difficulty: 'Medium',
        question: 'How does Databricks simplify Spark cluster management for data engineers?',
        answer:
          'Databricks manages Spark runtime versions, autoscaling clusters, Photon engine, Unity Catalog, and job scheduling. Developers focus on notebooks/jobs while the control plane handles cluster lifecycle. In interviews, note trade-offs: less low-level YARN tuning visibility but faster operational maturity and integrated Delta/UC.',
        tags: ['databricks', 'managed-spark'],
        frequency: 'High',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'spark-performance',
    category: 'Performance',
    items: [
      {
        title: 'Key Spark performance knobs',
        difficulty: 'Medium',
        question: 'List the top Spark configuration knobs you tune for batch ETL performance.',
        answer:
          'spark.sql.shuffle.partitions, executor memory/cores/instances, spark.sql.autoBroadcastJoinThreshold, AQE settings, spark.sql.files.maxPartitionBytes, serializer (Kryo), and adaptive coalesce. Profile with Spark UI before guessing. Data layout (partitioning, ZORDER, file size) often beats raw cluster upsizing.',
        tags: ['tuning', 'configuration'],
        frequency: 'Very High',
      },
      {
        title: 'Tungsten and Whole-Stage Codegen',
        difficulty: 'Hard',
        question: 'What is Tungsten and Whole-Stage Codegen in Spark SQL?',
        answer:
          'Tungsten optimizes memory and CPU via binary processing, unsafe operators, and cache-friendly layouts. Whole-Stage Codegen fuses multiple operators into a single generated JVM function—eliminating virtual call overhead. This is why DataFrame SQL beats naive RDD map chains. Python UDFs break codegen fusion.',
        tags: ['tungsten', 'codegen', 'internals'],
        frequency: 'High',
      },
      {
        title: 'Data skew at scale',
        difficulty: 'Hard',
        question: 'Describe a production approach to fixing skew without manual salting every job.',
        answer:
          'Enable AQE with skew join optimization, ensure table statistics (ANALYZE TABLE), partition on time for prune-friendly scans, and compact files with OPTIMIZE. For chronic hot keys, isolate outliers to broadcast side branches or dedicated micro-batches. Monitor Spark UI stage skew ratio as an SLO signal.',
        tags: ['skew', 'aqe', 'production'],
        frequency: 'Very High',
      },
      {
        title: 'IO optimization',
        difficulty: 'Medium',
        question: 'How do file format and compression choices affect Spark performance?',
        answer:
          'Parquet/ORC columnar formats with Snappy/Zstd balance compression and splitability. Avoid gzip on huge CSV reads—not splittable. Prefer partition pruning friendly layouts. For object storage, watch list operations on deep directory trees—use Delta log and partition filters to minimize LIST calls.',
        tags: ['io', 'parquet', 'compression'],
        frequency: 'High',
      },
      {
        title: 'Cost vs performance trade-off',
        difficulty: 'Medium',
        question: 'How do you right-size Spark clusters for cost without missing SLAs?',
        answer:
          'Baseline job with autoscaling and historical Spark UI metrics. Use job clusters not interactive all-purpose for production. Right-size shuffle partitions to reduce over-parallelism. Schedule compaction separately from peak ETL. Spot/preemptible workers with retry-friendly idempotent writes save cost if failures are handled.',
        tags: ['cost', 'sla', 'operations'],
        frequency: 'High',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'spark-scenarios',
    category: 'Scenario Questions',
    items: [
      {
        title: 'Stage with single straggler task',
        difficulty: 'Hard',
        question: 'One task in a shuffle stage takes 10x longer than peers—what do you do?',
        answer:
          'Classic skew: identify the hot key via sampling or key distribution analysis. Apply salting, AQE skew join, or isolate key to separate branch. If not skew, check slow node (speculation helps) or oversized partition from coalesce misuse. Never only increase cluster size without fixing partition balance.',
        tags: ['scenarios', 'stragglers', 'skew'],
        frequency: 'Very High',
      },
      {
        title: 'Executor lost during shuffle',
        difficulty: 'Hard',
        question: 'Executors are lost mid-shuffle on a YARN cluster—what happens and how do you harden the job?',
        answer:
          'Spark recomputes lost shuffle map outputs if external shuffle service is unavailable—expensive stage retry. Enable external shuffle service, increase executor memory overhead, avoid giant broadcasts, and use idempotent writes so job-level retries are safe. For recurring losses, investigate node health, preemption, and shuffle-heavy plan redesign.',
        tags: ['scenarios', 'fault-tolerance', 'shuffle'],
        frequency: 'High',
      },
      {
        title: 'Streaming plus batch unified architecture',
        difficulty: 'Hard',
        question: 'How would you explain Lambda vs Kappa architecture using Spark components?',
        answer:
          'Lambda: batch (Spark batch on historical) + speed (Structured Streaming) with serving merge—complex but flexible. Kappa: treat all data as stream, reprocess history by replaying Kafka with Structured Streaming to Delta. Modern DE favors Kappa-lite on Delta with merge and time travel for corrections—Spark provides both APIs on one engine.',
        tags: ['scenarios', 'streaming', 'architecture'],
        frequency: 'High',
      },
      {
        title: 'Governance on shared Spark cluster',
        difficulty: 'Medium',
        question: 'Multiple teams share a Spark cluster—what controls prevent noisy neighbor jobs?',
        answer:
          'YARN queues or K8s namespaces with resource quotas, Spark fair scheduler pools, Databricks cluster policies, max concurrent jobs per workspace, and table ACLs via Unity Catalog. Monitor shuffle and spill metrics centrally. Chargeback tagging encourages right-sizing. Separate interactive from production job clusters.',
        tags: ['scenarios', 'governance', 'multi-tenant'],
        frequency: 'High',
      },
      {
        title: 'Choosing Spark vs warehouse compute',
        difficulty: 'Medium',
        question: 'Leadership asks whether to migrate all ETL from Spark to a cloud warehouse—how do you respond?',
        answer:
          'Warehouses excel at SQL-centric EL(T), concurrency, and BI proximity. Spark excels at complex semi-structured processing, unified streaming/batch, ML, and open lake formats (Delta/Iceberg). Recommend hybrid lakehouse: Spark for bronze/silver heavy transforms, warehouse for gold aggregates and self-serve SQL—migrate only workloads that fit warehouse sweet spots.',
        tags: ['scenarios', 'architecture', 'strategy'],
        frequency: 'Very High',
      },
    ] satisfies QuestionInput[],
  },
], 1100)
