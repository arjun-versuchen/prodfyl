import { distributeQuestions } from '../../questionFactory'
import type { QuestionInput } from '../../questionFactory'

export const pysparkQuestions = distributeQuestions('pyspark', [
  {
    sheet: 'pyspark-basics',
    category: 'Basics',
    items: [
      {
        title: 'SparkSession entry point',
        difficulty: 'Easy',
        question: 'What is SparkSession and how do you create one in PySpark?',
        answer:
          'SparkSession is the unified entry point for Spark SQL, DataFrames, and catalog operations in Spark 2.x+. It wraps SparkContext and SQLContext. In Databricks a session exists by default; locally use SparkSession.builder.appName("job").getOrCreate(). Interviewers expect you to mention only one active session per JVM and that builder.getOrCreate() reuses an existing session.',
        example: 'from pyspark.sql import SparkSession\n\nspark = SparkSession.builder \\\n    .appName("etl-job") \\\n    .config("spark.sql.shuffle.partitions", "200") \\\n    .getOrCreate()',
        tags: ['sparksession', 'fundamentals'],
        frequency: 'Very High',
      },
      {
        title: 'PySpark application structure',
        difficulty: 'Easy',
        question: 'Describe the typical structure of a production PySpark ETL script.',
        answer:
          'A production script initializes SparkSession with explicit configs, reads sources via spark.read, applies transformations in logical stages (cleanse, enrich, aggregate), writes with explicit mode and partition columns, and calls spark.stop() in a finally block when not on a managed cluster. Keep business logic in testable Python functions; avoid collect() on large datasets. Use logging and job parameters instead of hard-coded paths.',
        tags: ['etl', 'structure', 'fundamentals'],
        frequency: 'High',
      },
      {
        title: 'Spark UI for debugging',
        difficulty: 'Medium',
        question: 'Which Spark UI tabs do you check when a PySpark job is slow or failing?',
        answer:
          'Start with the Jobs tab to see failed stages and duration. Drill into Stages for shuffle read/write, spill, and straggler tasks. The SQL tab shows the logical/physical plan for DataFrame jobs. Storage tab reveals cached datasets. Executors tab shows memory pressure and GC. In interviews, tie UI findings to actions: increase shuffle partitions, fix skew, broadcast small tables, or repartition before heavy joins.',
        tags: ['spark-ui', 'debugging', 'operations'],
        frequency: 'Very High',
      },
      {
        title: 'Cluster mode vs local mode',
        difficulty: 'Easy',
        question: 'When do you run PySpark in local mode versus on a cluster?',
        answer:
          'Local mode (master local[*]) suits unit tests and small prototyping on a laptop. Cluster mode distributes work across executors on YARN, Kubernetes, or Databricks for production scale. Local mode does not replicate shuffle, skew, or memory limits of real clusters—validate performance on representative data sizes before promoting jobs.',
        tags: ['deployment', 'local-mode', 'fundamentals'],
        frequency: 'High',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'pyspark-dataframes',
    category: 'DataFrames',
    items: [
      {
        title: 'Creating DataFrames',
        difficulty: 'Easy',
        question: 'What are common ways to create a PySpark DataFrame?',
        answer:
          'Read from files (parquet, csv, json, delta), JDBC sources, Hive tables, or create from an RDD with a schema. spark.createDataFrame(pandas_df) works for small data in tests. In production prefer reading Parquet/Delta with explicit schema or mergeSchema policies to avoid inference surprises on large files.',
        example: 'df = spark.read.parquet("abfss://lake/silver/orders")\ndf = spark.createDataFrame([(1, "a")], ["id", "name"])',
        tags: ['dataframe', 'read', 'fundamentals'],
        frequency: 'Very High',
      },
      {
        title: 'Schema and dtypes',
        difficulty: 'Medium',
        question: 'How do you inspect and enforce schema on a PySpark DataFrame?',
        answer:
          'Use df.printSchema(), df.dtypes, and df.schema to inspect. Enforce on read with spark.read.schema(StructType(...)) or .option("mergeSchema", "true") for controlled evolution. Cast columns with df.withColumn("amt", col("amt").cast("decimal(18,2)")). Interviewers want you to avoid schema inference on huge CSV JSON loads in production—it forces an extra pass and can mis-type columns.',
        tags: ['schema', 'dtypes', 'validation'],
        frequency: 'Very High',
      },
      {
        title: 'Column access patterns',
        difficulty: 'Easy',
        question: 'Compare df.select("col"), df["col"], and F.col("col") in PySpark.',
        answer:
          'All reference columns; F.col (from pyspark.sql.functions) is required in expressions, especially with dots in names or SQL-like transforms. df["col"] returns a Column object for DataFrame API chaining. df.select accepts strings or Column objects. For nested fields use col("address.city") or col("metrics")["revenue"].',
        example: 'from pyspark.sql import functions as F\n\ndf.select(F.col("order_id"), F.col("amount") * 1.1)',
        tags: ['columns', 'dataframe-api'],
        frequency: 'High',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'pyspark-transformations',
    category: 'Transformations',
    items: [
      {
        title: 'Lazy transformations',
        difficulty: 'Easy',
        question: 'Why do transformations like filter and select not run immediately in PySpark?',
        answer:
          'Transformations build a logical DAG of dependencies; Spark optimizes the full plan when an action triggers execution. This enables predicate pushdown, column pruning, and stage fusion. Calling df.filter() alone does no cluster work—only actions like count(), write(), or collect() materialize tasks.',
        tags: ['lazy-evaluation', 'transformations'],
        frequency: 'Very High',
      },
      {
        title: 'withColumn and when',
        difficulty: 'Medium',
        question: 'How do you add or update columns conditionally in PySpark?',
        answer:
          'Use withColumn with F.when().otherwise() for conditional logic, or F.expr for readable SQL snippets. Chain multiple withColumn calls or use select with aliases for bulk projection. Avoid UDFs when built-in functions suffice—Catalyst can optimize native expressions but not opaque Python UDFs.',
        example: 'from pyspark.sql import functions as F\n\ndf = df.withColumn(\n    "tier",\n    F.when(F.col("revenue") > 1000, "gold")\n     .when(F.col("revenue") > 100, "silver")\n     .otherwise("bronze")\n)',
        tags: ['withcolumn', 'when', 'transformations'],
        frequency: 'Very High',
      },
      {
        title: 'Handling nulls',
        difficulty: 'Medium',
        question: 'How do you filter, fill, and coalesce null values in PySpark DataFrames?',
        answer:
          'Filter nulls with df.filter(col("x").isNotNull()). Fill with df.fillna({"x": 0}) or df.na.fill(0, subset=["x"]). Coalesce columns with F.coalesce(col("a"), col("b"), lit(0)). For aggregates, count(*) includes null rows; count(col) skips nulls—same SQL semantics.',
        tags: ['nulls', 'data-quality', 'transformations'],
        frequency: 'High',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'pyspark-actions',
    category: 'Actions',
    items: [
      {
        title: 'Common actions',
        difficulty: 'Easy',
        question: 'List PySpark actions and when each is appropriate in production.',
        answer:
          'count() and agg actions compute metrics at scale. show() and take(n) sample small previews—safe only on limited rows. collect() pulls all partitions to the driver—dangerous on large data. write.* persists results and is the primary production action. foreach/foreachPartition stream rows to side effects; prefer writes for durability.',
        tags: ['actions', 'fundamentals'],
        frequency: 'Very High',
      },
      {
        title: 'collect() risks',
        difficulty: 'Medium',
        question: 'Why is collect() dangerous on large datasets and what do you use instead?',
        answer:
          'collect() serializes every partition to the driver JVM, causing OOM and network bottlenecks. Use take(n), head(), or limit().write for outputs. If you need a small lookup set, collect only after aggressive filter/distinct or broadcast a tiny dimension table. For pandas integration, toPandas() has the same driver memory risk.',
        tags: ['collect', 'driver-oom', 'anti-patterns'],
        frequency: 'Very High',
      },
      {
        title: 'Write modes and partitioning',
        difficulty: 'Medium',
        question: 'Explain save modes (append, overwrite, errorIfExists) and partitionBy when writing DataFrames.',
        answer:
          'append adds new files; overwrite replaces table/path (behavior differs for Delta vs plain Parquet). errorIfExists fails if data exists—good for idempotent pipeline guards. partitionBy("date") creates hive-style folders for prune-friendly layouts. Match partition column cardinality to avoid tiny files; coalesce or repartition before write when needed.',
        example: 'df.write.mode("append").partitionBy("event_date").parquet("abfss://lake/gold/events")',
        tags: ['write', 'partitionby', 'save-mode'],
        frequency: 'Very High',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'pyspark-rdd-vs-df',
    category: 'RDD vs DataFrame',
    items: [
      {
        title: 'RDD vs DataFrame trade-offs',
        difficulty: 'Medium',
        question: 'When would you choose RDDs over DataFrames in modern PySpark?',
        answer:
          'Prefer DataFrames for structured ETL—Catalyst optimizes queries and encodes rows efficiently via Tungsten. Use RDDs for unstructured data, custom partition-wide logic, or legacy APIs without SQL expressibility. RDDs expose map/partition primitives but lack automatic optimization. Most DE interviews expect DataFrame-first design with RDD escape hatches only when necessary.',
        tags: ['rdd', 'dataframe', 'trade-offs'],
        frequency: 'Very High',
      },
      {
        title: 'Converting RDD and DataFrame',
        difficulty: 'Medium',
        question: 'How do you convert between RDD and DataFrame?',
        answer:
          'df.rdd gives an RDD of Rows; rdd.toDF() or spark.createDataFrame(rdd, schema) builds a DataFrame. Preserve schema explicitly when converting unstructured tuples— inference on RDDs is fragile. After rdd.map, you lose column names unless you rebuild schema manually.',
        example: 'rdd = df.rdd\nrestored = spark.createDataFrame(rdd, df.schema)',
        tags: ['rdd', 'dataframe', 'conversion'],
        frequency: 'High',
      },
      {
        title: 'Datasets in PySpark',
        difficulty: 'Hard',
        question: 'What are Datasets in Spark and why are they less common in PySpark?',
        answer:
          'Datasets are typed extensions of DataFrames in Scala/Java with compile-time safety. PySpark does not have true Datasets because Python lacks static typing at runtime—PySpark DataFrames are already untyped Row collections under the hood. Mention this when interviewers compare Spark APIs across languages.',
        tags: ['dataset', 'typing', 'api'],
        frequency: 'Medium',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'pyspark-spark-sql',
    category: 'Spark SQL',
    items: [
      {
        title: 'spark.sql and temp views',
        difficulty: 'Easy',
        question: 'How do you run SQL against DataFrames in PySpark?',
        answer:
          'Register with df.createOrReplaceTempView("orders") or createGlobalTempView for session-wide names, then spark.sql("SELECT ..."). Temp views are session-scoped and in-memory metadata only—no data duplication. Spark SQL and DataFrame API share the same optimizer and physical plan.',
        example: 'orders.createOrReplaceTempView("orders")\nspark.sql("SELECT customer_id, SUM(amount) AS total FROM orders GROUP BY 1")',
        tags: ['spark-sql', 'temp-view'],
        frequency: 'Very High',
      },
      {
        title: 'Catalyst optimizer role',
        difficulty: 'Medium',
        question: 'What does the Catalyst optimizer do for PySpark SQL queries?',
        answer:
          'Catalyst parses SQL/DataFrame logical plans, applies rule-based and cost-based optimizations—predicate pushdown, projection pruning, constant folding, join reordering—and generates physical plans (broadcast hash join, sort-merge join, etc.). Explain plans with df.explain(True). Understanding Catalyst helps you phrase transformations so Spark can push filters and projections to sources.',
        tags: ['catalyst', 'optimizer', 'query-plan'],
        frequency: 'Very High',
      },
      {
        title: 'UDF vs built-in functions',
        difficulty: 'Medium',
        question: 'When should you avoid Python UDFs in Spark SQL pipelines?',
        answer:
          'Python UDFs serialize rows to Python, blocking Whole-Stage Codegen and vectorized execution—often 10–100x slower than F.expr or built-ins. Prefer Spark SQL functions, pandas UDFs (vectorized) only when necessary, or Scala UDFs on JVM. If you must use Python UDFs, keep them narrow and repartition thoughtfully.',
        tags: ['udf', 'performance', 'spark-sql'],
        frequency: 'Very High',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'pyspark-joins',
    category: 'Joins',
    items: [
      {
        title: 'Join types in PySpark',
        difficulty: 'Easy',
        question: 'Explain inner, left, right, full, and semi/anti joins in PySpark.',
        answer:
          'Inner keeps matching keys in both datasets. Left keeps all left rows with nulls for non-matches. Right is the mirror. Full outer keeps both with null padding. Left semi returns left rows with a match (no right columns); left anti returns left rows without a match—useful for existence checks without row explosion.',
        example: 'customers.join(orders, "customer_id", "left")\nactive = customers.join(orders, "customer_id", "left_semi")',
        tags: ['joins', 'fundamentals'],
        frequency: 'Very High',
      },
      {
        title: 'Join keys and duplicates',
        difficulty: 'Medium',
        question: 'How do duplicate keys on either side of a join affect results and performance?',
        answer:
          'Duplicates cause a Cartesian expansion per key—row count multiplies (m × n per key), inflating shuffle and memory. Deduplicate dimension tables or aggregate facts before join. Detect with groupBy(key).count().filter("count > 1"). Salting or broadcast does not fix duplicate-key explosion—only restructuring data does.',
        tags: ['joins', 'data-quality', 'skew'],
        frequency: 'Very High',
      },
      {
        title: 'Join hints',
        difficulty: 'Hard',
        question: 'How do you hint broadcast or sort-merge joins in PySpark?',
        answer:
          'Use broadcast(df_small) in the join or /*+ BROADCAST(small) */ in SQL when the small table fits driver/executor broadcast limits (spark.sql.autoBroadcastJoinThreshold, default ~10MB). Sort-merge is default for large-large joins. AQE can convert shuffle join to broadcast at runtime if stats prove small. Over-broadcasting huge tables causes OOM.',
        example: 'from pyspark.sql.functions import broadcast\n\nbig.join(broadcast(small), "id")',
        tags: ['broadcast', 'join-hints', 'optimizer'],
        frequency: 'High',
      },
      {
        title: 'Cross join caution',
        difficulty: 'Hard',
        question: 'When is a cross join acceptable in PySpark and how do you guard against explosions?',
        answer:
          'Cross joins multiply row counts (m × n) and are rarely intentional in production. Acceptable for small calibration sets or generating combinations under explicit size checks. Spark 2.3+ requires spark.sql.crossJoin.enabled=true. Prefer explicit keys or broadcast nested loop only when one side is tiny and verified with size stats.',
        tags: ['cross-join', 'joins', 'anti-patterns'],
        frequency: 'Medium',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'pyspark-window',
    category: 'Window Functions',
    items: [
      {
        title: 'Window spec basics',
        difficulty: 'Medium',
        question: 'How do you define and use a window specification in PySpark?',
        answer:
          'Import Window; build spec with partitionBy (group), orderBy (sequence), and rowsBetween/rangeBetween (frame). Apply functions like row_number(), rank(), sum().over(w). partitionBy is like GROUP BY but keeps detail rows. Always orderBy for ranking functions to get deterministic results.',
        example: 'from pyspark.sql import Window\nfrom pyspark.sql.functions import row_number\n\nw = Window.partitionBy("customer_id").orderBy(F.col("order_ts").desc())\ndf.withColumn("rn", row_number().over(w))',
        tags: ['window', 'analytics'],
        frequency: 'Very High',
      },
      {
        title: 'ROW_NUMBER vs RANK vs DENSE_RANK',
        difficulty: 'Medium',
        question: 'Differentiate ROW_NUMBER, RANK, and DENSE_RANK in PySpark window functions.',
        answer:
          'ROW_NUMBER assigns unique sequential integers even on ties. RANK skips ranks after ties (1,2,2,4). DENSE_RANK keeps consecutive ranks (1,2,2,3). Use ROW_NUMBER to pick one row per group (filter rn=1), RANK for competition-style scoring, DENSE_RANK for bucketed tiers without gaps.',
        tags: ['window', 'ranking'],
        frequency: 'High',
      },
      {
        title: 'LAG and LEAD',
        difficulty: 'Medium',
        question: 'How do LAG and LEAD help in event and session analytics?',
        answer:
          'LAG(col, 1) reads the previous row within the window partition; LEAD reads the next. Compute session gaps, period-over-period deltas, or funnel steps. Combine with datediff on lag(ts) to detect churn or idle timeouts. Frame must include orderBy for meaningful offsets.',
        example: 'w = Window.partitionBy("user_id").orderBy("event_ts")\ndf.withColumn("prev_ts", F.lag("event_ts", 1).over(w))',
        tags: ['window', 'lag-lead', 'sessions'],
        frequency: 'High',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'pyspark-performance',
    category: 'Performance Optimization',
    items: [
      {
        title: 'explain() and physical plans',
        difficulty: 'Medium',
        question: 'How do you diagnose a slow PySpark query using explain()?',
        answer:
          'df.explain(True) shows parsed, analyzed, optimized logical plans and the physical plan with operators (FileScan, Exchange, SortMergeJoin). Look for unexpected Exchange (shuffle), Cartesian products, or missing BroadcastHashJoin. Compare before/after optimizations; correlate Exchange nodes with spark.sql.shuffle.partitions.',
        tags: ['explain', 'query-plan', 'tuning'],
        frequency: 'Very High',
      },
      {
        title: 'AQE in Spark 3',
        difficulty: 'Hard',
        question: 'What is Adaptive Query Execution (AQE) and which problems does it solve?',
        answer:
          'AQE reoptimizes plans between stages using runtime statistics—coalescing skewed shuffle partitions, converting sort-merge to broadcast when a side shrank, and optimizing skew joins. Enabled by default in Spark 3.2+. Mention spark.sql.adaptive.enabled and skew join settings. AQE reduces manual shuffle partition tuning but does not replace good data layout.',
        tags: ['aqe', 'spark3', 'performance'],
        frequency: 'Very High',
      },
      {
        title: 'Predicate and column pruning',
        difficulty: 'Medium',
        question: 'How does predicate pushdown and column pruning improve Parquet reads?',
        answer:
          'When filters and projections are expressed early (filter/select before heavy joins), Catalyst pushes them to the Parquet scan—skipping row groups via statistics and reading only needed columns. Avoid selecting * before filters. For Delta, additional file-skipping uses the transaction log. This is why lazy lineage plus structured sources outperform naive RDD scans.',
        tags: ['pushdown', 'parquet', 'optimization'],
        frequency: 'High',
      },
      {
        title: 'Caching for iterative workloads',
        difficulty: 'Medium',
        question: 'When should you cache or persist a DataFrame in a multi-pass PySpark pipeline?',
        answer:
          'Cache when the same intermediate DataFrame is reused across multiple actions (ML iterations, repeated aggregations) and recomputing lineage is expensive. Use df.cache() or persist(StorageLevel.MEMORY_AND_DISK). Unpersist when done to free memory. Do not cache before a one-pass ETL—materialization adds overhead without benefit.',
        tags: ['cache', 'persist', 'performance'],
        frequency: 'High',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'pyspark-partitioning',
    category: 'Partitioning',
    items: [
      {
        title: 'repartition vs coalesce',
        difficulty: 'Medium',
        question: 'When do you use repartition() versus coalesce() in PySpark?',
        answer:
          'repartition(n) performs a full shuffle to spread data evenly—use before heavy joins or when increasing parallelism. coalesce(n) narrows partitions without a full shuffle (narrow dependency) but can skew if reducing heavily. Never coalesce up. Rule of thumb: coalesce down before write; repartition for balanced compute.',
        example: 'df.repartition(200, "customer_id")  # before join\ndf.coalesce(10)  # before single-file export',
        tags: ['repartition', 'coalesce', 'shuffle'],
        frequency: 'Very High',
      },
      {
        title: 'Partition count sizing',
        difficulty: 'Hard',
        question: 'How do you choose the number of shuffle partitions and output files?',
        answer:
          'Target 100–200MB per partition/file as a starting heuristic. Too few partitions underutilize cluster; too many create scheduler overhead and small files. Set spark.sql.shuffle.partitions (default 200) based on data volume and cores. AQE can coalesce at runtime. Align output partition count with downstream consumers and file compaction jobs.',
        tags: ['partitions', 'sizing', 'file-size'],
        frequency: 'Very High',
      },
      {
        title: 'Partition pruning',
        difficulty: 'Medium',
        question: 'What is partition pruning and how do you enable it?',
        answer:
          'When data is hive-partitioned (e.g., event_date=2024-01-01/), filters on partition columns let Spark skip directories. Use partitionBy on write and filter on those columns in read. Avoid functions on partition columns in WHERE (to_date(event_date)) that block pruning. Delta and Parquet metadata further skip files.',
        tags: ['partition-pruning', 'layout'],
        frequency: 'High',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'pyspark-broadcast',
    category: 'Broadcast Join',
    items: [
      {
        title: 'Broadcast hash join',
        difficulty: 'Medium',
        question: 'How does a broadcast hash join work and when is it chosen?',
        answer:
          'Spark copies a small table to every executor and probes it locally against the large table partition—avoiding a shuffle on the small side. Catalyst picks it when table stats are below autoBroadcastJoinThreshold or via hints. Essential for star-schema fact-dimension joins. Monitor driver memory when broadcasting near threshold.',
        tags: ['broadcast', 'join', 'performance'],
        frequency: 'Very High',
      },
      {
        title: 'Broadcast variables',
        difficulty: 'Medium',
        question: 'What is spark.sparkContext.broadcast() used for in PySpark?',
        answer:
          'Broadcast variables distribute read-only lookup data (maps, config dicts) efficiently to executors once per task lifecycle. Use for enrichment in map-side logic instead of shipping large closures repeatedly. Not a substitute for join when the lookup is tabular—prefer broadcast join for DataFrame merges.',
        example: 'lookup = spark.sparkContext.broadcast({"US": "USD", "UK": "GBP"})\n# access lookup.value inside UDF/map (prefer join when possible)',
        tags: ['broadcast-variable', 'lookup'],
        frequency: 'High',
      },
      {
        title: 'Broadcast join failures',
        difficulty: 'Hard',
        question: 'What causes broadcast join OOM and how do you fix it?',
        answer:
          'Tables exceeding spark.driver.maxResultSize or executor memory blow up when forced to broadcast. Fixes: increase threshold only if safe, disable broadcast hint, pre-filter/aggregate the small table, or bucket both sides for sort-merge. AQE may revert bad broadcast decisions when runtime stats show oversized builds.',
        tags: ['broadcast', 'oom', 'troubleshooting'],
        frequency: 'High',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'pyspark-shuffle',
    category: 'Shuffle',
    items: [
      {
        title: 'What triggers shuffle',
        difficulty: 'Medium',
        question: 'Which PySpark operations trigger a shuffle?',
        answer:
          'Wide dependencies shuffle: groupBy, agg, distinct, repartition, join (except broadcast), orderBy without local pre-sort, and window without partition bounds. Shuffle writes partition data to disk across the network—often the dominant cost. Minimize by filtering early, broadcasting small dims, and avoiding unnecessary repartition.',
        tags: ['shuffle', 'wide-dependency'],
        frequency: 'Very High',
      },
      {
        title: 'Shuffle spill',
        difficulty: 'Hard',
        question: 'What is shuffle spill and how do you reduce it?',
        answer:
          'When executor memory cannot hold shuffle map buffers or sort partitions, Spark spills to disk—slowing jobs dramatically. Reduce spill by increasing executor memory, lowering spark.memory.fraction pressure, tuning shuffle partitions, fixing skew, or caching less. Spark UI shows spill metrics on stages; persistent spill means memory or skew issues.',
        tags: ['shuffle', 'spill', 'memory'],
        frequency: 'High',
      },
      {
        title: 'Salting before shuffle-heavy ops',
        difficulty: 'Hard',
        question: 'How does salting keys reduce skew during groupBy or join shuffles?',
        answer:
          'Add a random salt column to spread hot keys across multiple partitions for the shuffle, then aggregate away the salt in a second stage. For joins, salt both sides with matching salt ranges. Trades extra compute for parallelism. AQE skew join handling automates similar splitting for known skew patterns in Spark 3.',
        tags: ['salting', 'skew', 'shuffle'],
        frequency: 'High',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'pyspark-skew',
    category: 'Skew Handling',
    items: [
      {
        title: 'Detecting data skew',
        difficulty: 'Medium',
        question: 'How do you detect skew in a PySpark job?',
        answer:
          'Spark UI shows one task in a stage taking much longer than others. Analyze key distribution with groupBy(key).count().orderBy(desc("count")). Hot keys dominate shuffle partitions. Business examples: popular products, default NULL keys, or country="US" dominating global data.',
        tags: ['skew', 'detection', 'spark-ui'],
        frequency: 'Very High',
      },
      {
        title: 'AQE skew join',
        difficulty: 'Hard',
        question: 'How does AQE handle skewed joins at runtime?',
        answer:
          'When AQE detects skewed partition sizes, it splits heavy keys into sub-partitions and replicates the non-skewed side accordingly, running multiple smaller joins. Controlled by spark.sql.adaptive.skewJoin.enabled and skew thresholds. Mention as first-line defense before manual salting in Spark 3 clusters.',
        tags: ['aqe', 'skew-join', 'spark3'],
        frequency: 'Very High',
      },
      {
        title: 'Skewed aggregation mitigation',
        difficulty: 'Hard',
        question: 'Your groupBy on user_id is skewed—what strategies help besides salting?',
        answer:
          'Two-phase aggregation: partial agg on salted key, then final agg on original key. Isolate top-N hot keys to a dedicated branch with broadcast lookup. Increase parallelism only helps if keys split—otherwise repartition worsens skew. Combine with custom partitioners or map-side combiners where Catalyst already optimizes partial aggregates.',
        tags: ['skew', 'aggregation', 'mitigation'],
        frequency: 'High',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'pyspark-delta',
    category: 'Delta Integration',
    items: [
      {
        title: 'Read and write Delta from PySpark',
        difficulty: 'Easy',
        question: 'How do you read and append to a Delta table in PySpark?',
        answer:
          'Use spark.read.format("delta").load(path) or spark.table("catalog.schema.table") with Unity Catalog. Write with df.write.format("delta").mode("append").save(path). Delta adds transaction log commits for ACID. Prefer merge for upserts instead of blind overwrite on shared tables.',
        example: 'df.write.format("delta").mode("append").partitionBy("date").save("/mnt/delta/events")',
        tags: ['delta', 'read-write', 'acid'],
        frequency: 'Very High',
      },
      {
        title: 'MERGE upsert pattern',
        difficulty: 'Hard',
        question: 'Write the PySpark pattern for an idempotent MERGE upsert into Delta.',
        answer:
          'Use DeltaTable.forPath(spark, path).alias("t").merge(source.alias("s"), "t.id = s.id").whenMatchedUpdateAll().whenNotMatchedInsertAll().execute(). MERGE is atomic—readers see consistent snapshots. In interviews mention CDC feeds and SCD Type 1/2 implementations via conditional update/insert clauses.',
        example: 'from delta.tables import DeltaTable\n\nDeltaTable.forName(spark, "silver.customers").alias("t") \\\n  .merge(updates.alias("s"), "t.customer_id = s.customer_id") \\\n  .whenMatchedUpdateAll() \\\n  .whenNotMatchedInsertAll() \\\n  .execute()',
        tags: ['delta', 'merge', 'upsert'],
        frequency: 'Very High',
      },
      {
        title: 'Delta vs plain Parquet writes',
        difficulty: 'Medium',
        question: 'Why prefer Delta over raw Parquet for PySpark lakehouse tables?',
        answer:
          'Delta provides ACID commits, schema enforcement, time travel, MERGE/DELETE, and file compaction (OPTIMIZE) in one format. Plain Parquet appends risk partial failures leaving corrupt partitions. Delta transaction log enables concurrent writers with optimistic concurrency—critical for production pipelines interviewed at scale.',
        tags: ['delta', 'parquet', 'lakehouse'],
        frequency: 'High',
      },
      {
        title: 'OPTIMIZE and ZORDER from PySpark',
        difficulty: 'Hard',
        question: 'How do you compact small files and improve data skipping on Delta tables in PySpark?',
        answer:
          'Run spark.sql("OPTIMIZE delta.`path` ZORDER BY (customer_id, event_date)") or the DeltaTable API optimize().compact() in maintenance jobs. OPTIMIZE bin-packs small files; ZORDER colocates related rows for stats-based skipping. Schedule after heavy append workloads; balance compaction cost against read latency in downstream dashboards.',
        tags: ['delta', 'optimize', 'zorder'],
        frequency: 'High',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'pyspark-scenarios',
    category: 'Scenario-based Questions',
    items: [
      {
        title: 'Daily batch SLA miss',
        difficulty: 'Hard',
        question: 'A nightly PySpark job missed SLA after a 3x data volume spike. Walk through your investigation.',
        answer:
          'Check Spark UI for new shuffle stages or spill. Compare input file counts and partition sizes. Verify AQE and shuffle partition settings scale with volume. Look for skew from new traffic sources. Short-term: increase cluster size, raise shuffle partitions, broadcast rechecked dims. Long-term: partition by date, OPTIMIZE Delta tables, ZORDER on filter columns, and autoscale policies.',
        tags: ['scenarios', 'sla', 'troubleshooting'],
        frequency: 'Very High',
      },
      {
        title: 'Incremental deduplication pipeline',
        difficulty: 'Hard',
        question: 'Design a PySpark pipeline that ingests hourly events and deduplicates by event_id.',
        answer:
          'Land raw events to bronze Delta append partitioned by ingest_hour. Silver job reads new bronze files using Delta CDF or max(timestamp) watermark, dedupes with window row_number partitioned by event_id ordered by event_ts, keeps rn=1, MERGEs into silver on event_id. Track metrics on duplicates dropped. Idempotent reruns rely on MERGE semantics and deterministic ordering.',
        tags: ['scenarios', 'dedup', 'incremental'],
        frequency: 'Very High',
      },
      {
        title: 'PySpark vs SQL warehouse',
        difficulty: 'Medium',
        question: 'When would you push transformation logic to a SQL warehouse instead of PySpark?',
        answer:
          'Use warehouse SQL for BI aggregations, lightweight ELT close to managed storage, and teams strong in SQL with tight concurrency SLAs. Keep PySpark for complex semi-structured parsing, ML feature engineering, fine-grained UDF logic, and unified batch/stream at lake scale. Hybrid: silver/gold in Spark, serving aggregates in warehouse via materialized views or sync.',
        tags: ['scenarios', 'architecture', 'trade-offs'],
        frequency: 'High',
      },
      {
        title: 'Testing PySpark transforms',
        difficulty: 'Medium',
        question: 'How do you unit test PySpark transformation logic without a full cluster?',
        answer:
          'Use a local SparkSession with master local[2] in pytest, build small in-memory DataFrames with createDataFrame, assert outputs with collect() on tiny sets or chispa dataframe_comparer. Extract pure functions accepting DataFrames. For integration tests, run against sample Parquet in CI with constrained resources. Mock external IO at boundaries.',
        tags: ['scenarios', 'testing', 'quality'],
        frequency: 'High',
      },
    ] satisfies QuestionInput[],
  },
], 1000)
