import { distributeQuestions, type QuestionInput } from '../../questionFactory'

export const deltaLakeQuestions = distributeQuestions('delta-lake', [
  {
    sheet: 'delta-acid',
    category: 'ACID',
    items: [
      {
        title: 'What is Delta Lake?',
        difficulty: 'Easy',
        question: 'What is Delta Lake and why do data engineers use it on top of object storage?',
        answer:
          'Delta Lake is an open-source storage layer that adds ACID transactions, schema enforcement, and time travel to Parquet files on cloud object stores. It turns a data lake from append-only files into reliable tables that support concurrent reads and writes. Interviewers expect you to mention it works with Spark and integrates with Databricks, but remains portable across engines.',
        tags: ['delta-lake', 'fundamentals', 'data-lake'],
        frequency: 'Very High',
      },
      {
        title: 'ACID on object storage',
        difficulty: 'Medium',
        question: 'How does Delta Lake provide ACID guarantees on cheap, eventually consistent object storage like S3 or ADLS?',
        answer:
          'Delta maintains a transaction log (_delta_log) that records every commit as an atomic JSON checkpoint plus Parquet data files. Writers use optimistic concurrency: they read the latest version, write new files, then attempt to append a new log entry; conflicting commits fail and retry. Readers always see a consistent snapshot by replaying the log up to a committed version.',
        tags: ['acid', 'transaction-log', 'concurrency'],
        frequency: 'Very High',
      },
      {
        title: 'Transaction log structure',
        difficulty: 'Medium',
        question: 'Describe the Delta Lake transaction log and its role in table metadata.',
        answer:
          'The _delta_log folder stores ordered JSON commit files (00000000000000000000.json, etc.) describing actions like add, remove, metadata, and protocol changes. Spark replays these actions to reconstruct the current table state—file list, schema, partition info, and table properties. Checkpoints periodically compact the log into Parquet for faster startup on large tables.',
        tags: ['transaction-log', 'metadata', '_delta_log'],
        frequency: 'Very High',
      },
      {
        title: 'Optimistic concurrency control',
        difficulty: 'Hard',
        question: 'Explain optimistic concurrency in Delta Lake. What happens when two writers commit simultaneously?',
        answer:
          'Each writer reads the table version at the start, produces new data files, then tries to commit by writing the next sequential log entry. If another writer already committed a higher version, the second commit fails with a concurrent modification exception. The failed job must retry from the latest version—often by re-reading changed data and re-executing the merge or append logic.',
        tags: ['concurrency', 'conflict', 'retries'],
        frequency: 'High',
      },
      {
        title: 'Isolation levels',
        difficulty: 'Hard',
        question: 'What isolation level does Delta Lake provide for concurrent readers and writers?',
        answer:
          'Delta provides snapshot isolation: readers see a consistent table state at a specific version and are unaffected by in-flight writes. Writers serialize through the transaction log so only one commit wins per version increment. This is stronger than raw Parquet on a lake but not full serializable isolation across arbitrary multi-table transactions.',
        tags: ['isolation', 'snapshot-isolation', 'acid'],
        frequency: 'High',
      },
      {
        title: 'Schema enforcement vs evolution',
        difficulty: 'Medium',
        question: 'What is the difference between schema enforcement and schema evolution in Delta Lake?',
        answer:
          'Schema enforcement rejects writes whose columns or types do not match the registered table schema—preventing silent corruption from bad upstream data. Schema evolution allows controlled changes like adding nullable columns via mergeSchema option or ALTER TABLE. In interviews, emphasize enforcing at the silver layer while allowing evolution at bronze with validation downstream.',
        tags: ['schema', 'enforcement', 'evolution'],
        frequency: 'Very High',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'delta-time-travel',
    category: 'Time Travel',
    items: [
      {
        title: 'Time travel syntax',
        difficulty: 'Easy',
        question: 'How do you query a previous version of a Delta table in Spark SQL?',
        answer:
          'Use VERSION AS OF for a specific table version number or TIMESTAMP AS OF for a point in time. Example: SELECT * FROM my_table VERSION AS OF 5 or TIMESTAMP AS OF \'2024-01-15T10:00:00\'. The engine resolves the correct file snapshot from the transaction log without copying data.',
        tags: ['time-travel', 'version', 'sql'],
        frequency: 'Very High',
      },
      {
        title: 'DESCRIBE HISTORY',
        difficulty: 'Easy',
        question: 'How do you inspect commit history and audit who changed a Delta table?',
        answer:
          'Run DESCRIBE HISTORY table_name (or spark.read.format("delta").option("versionAsOf", n)) to list versions with timestamp, operation, user, and metrics like rows inserted. This is essential for debugging bad pipelines, compliance audits, and identifying when a schema change or MERGE introduced bad data.',
        tags: ['history', 'audit', 'operations'],
        frequency: 'Very High',
      },
      {
        title: 'RESTORE TABLE',
        difficulty: 'Medium',
        question: 'How do you roll back a Delta table to a previous state after a bad write?',
        answer:
          'Use RESTORE TABLE my_table TO VERSION AS OF n or TO TIMESTAMP AS OF to revert the table pointer to an earlier snapshot. Delta does not delete newer files immediately—they remain until VACUUM removes them per retention policy. Mention verifying the target version with DESCRIBE HISTORY before restoring in production.',
        tags: ['restore', 'rollback', 'recovery'],
        frequency: 'High',
      },
      {
        title: 'Retention and time travel limits',
        difficulty: 'Medium',
        question: 'What limits how far back Delta Lake time travel can go?',
        answer:
          'Time travel is bounded by log retention and deleted file retention settings. VACUUM removes data files no longer referenced by retained versions, and log cleanup removes old commits beyond delta.logRetentionDuration. Default deletedFileRetentionDuration is 7 days on Databricks—after that, older versions may be unrecoverable even if the log entry exists.',
        tags: ['retention', 'vacuum', 'limits'],
        frequency: 'High',
      },
      {
        title: 'Time travel for debugging',
        difficulty: 'Medium',
        question: 'Describe a production scenario where Delta time travel saved a pipeline incident investigation.',
        answer:
          'A nightly MERGE doubled row counts after a join bug. The team used DESCRIBE HISTORY to find the failing version timestamp, queried VERSION AS OF prior version to confirm correct row counts, compared schemas and metrics, then RESTOREd to the last good version. Time travel avoided a full reprocessing run from raw sources and provided an audit trail for the postmortem.',
        tags: ['debugging', 'incident', 'scenario'],
        frequency: 'High',
      },
      {
        title: 'Version vs timestamp resolution',
        difficulty: 'Hard',
        question: 'When querying TIMESTAMP AS OF, how does Delta pick the version if multiple commits share the same second?',
        answer:
          'Delta resolves to the latest table version whose commit timestamp is less than or equal to the requested timestamp. Sub-second ordering follows log sequence, not wall-clock alone. For precise rollback in automation, prefer VERSION AS OF with an explicit version from DESCRIBE HISTORY rather than timestamps when commits are bursty.',
        tags: ['timestamp', 'version', 'resolution'],
        frequency: 'Medium',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'delta-merge',
    category: 'MERGE',
    items: [
      {
        title: 'MERGE INTO basics',
        difficulty: 'Easy',
        question: 'What does MERGE INTO do in Delta Lake and when is it used?',
        answer:
          'MERGE performs upsert logic: match rows between a target Delta table and a source dataset on a join condition, then INSERT non-matches, UPDATE matches, or DELETE as specified. It replaces fragile multi-step insert/update/delete patterns and runs as a single atomic transaction. Common for CDC, dimension updates, and idempotent pipeline loads.',
        tags: ['merge', 'upsert', 'cdc'],
        frequency: 'Very High',
      },
      {
        title: 'MERGE syntax clauses',
        difficulty: 'Medium',
        question: 'Explain WHEN MATCHED, WHEN NOT MATCHED, and WHEN NOT MATCHED BY SOURCE in a Delta MERGE.',
        answer:
          'WHEN MATCHED updates or deletes rows in the target that join to the source—often with a condition for SCD Type 1 overwrites. WHEN NOT MATCHED inserts new source rows missing from the target. WHEN NOT MATCHED BY SOURCE handles target rows with no source match, useful for soft deletes or deactivating records in slowly changing dimensions.',
        tags: ['merge', 'syntax', 'scd'],
        frequency: 'Very High',
      },
      {
        title: 'SCD Type 2 with MERGE',
        difficulty: 'Hard',
        question: 'How would you implement SCD Type 2 historization using Delta MERGE?',
        answer:
          'Close current rows by setting end_date and is_current=false on matched keys where attributes changed, then insert new active rows with start_date and is_current=true for changed records. Some teams split into two MERGE statements or use ROW_NUMBER to detect changes. Delta\'s single MERGE handles Type 1; Type 2 often needs careful sequencing to avoid duplicate active rows.',
        tags: ['scd', 'type-2', 'merge'],
        frequency: 'High',
      },
      {
        title: 'Idempotent MERGE patterns',
        difficulty: 'Medium',
        question: 'How do you make a Delta MERGE pipeline idempotent for daily re-runs?',
        answer:
          'Key on a stable business key or event ID and use MERGE so reprocessing the same batch updates in place rather than duplicating rows. Track processed watermark or batch_id in the target and filter source to new records only. Combine with deterministic join keys and avoid non-deterministic functions in UPDATE clauses that would rewrite unchanged rows every run.',
        tags: ['idempotency', 'merge', 'pipeline'],
        frequency: 'Very High',
      },
      {
        title: 'MERGE performance',
        difficulty: 'Hard',
        question: 'What causes slow MERGE operations on large Delta tables and how do you optimize them?',
        answer:
          'MERGE requires a shuffle join on the merge keys—expensive when keys are skewed or tables are wide with many small files. Optimize with ZORDER or partition pruning on join columns, run OPTIMIZE to compact files, broadcast small sources, and reduce columns read early. For very large targets, consider partition-scoped MERGE or breaking by partition predicate if the business logic allows.',
        tags: ['merge', 'performance', 'optimization'],
        frequency: 'High',
      },
      {
        title: 'Conditional DELETE in MERGE',
        difficulty: 'Medium',
        question: 'How do you hard-delete rows from a target table when they disappear from the source feed?',
        answer:
          'Use WHEN NOT MATCHED BY SOURCE THEN DELETE (or UPDATE SET is_deleted=true for soft delete). Ensure the source truly represents the full current state—not an incremental delta—or you will incorrectly delete valid rows. Document this contract clearly in medallion silver/gold layers where full snapshots vs CDC streams differ.',
        tags: ['merge', 'delete', 'cdc'],
        frequency: 'High',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'delta-optimize',
    category: 'OPTIMIZE',
    items: [
      {
        title: 'Why OPTIMIZE matters',
        difficulty: 'Easy',
        question: 'Why do Delta tables need OPTIMIZE and what problem does compaction solve?',
        answer:
          'Streaming and frequent small writes create many tiny Parquet files, increasing metadata overhead and slowing reads due to open costs and poor vectorization. OPTIMIZE compacts small files into larger ones near the target size (typically ~128 MB–1 GB). Regular compaction keeps query performance stable as the table grows.',
        tags: ['optimize', 'compaction', 'file-size'],
        frequency: 'Very High',
      },
      {
        title: 'OPTIMIZE syntax',
        difficulty: 'Easy',
        question: 'Write the SQL to compact a partitioned Delta table for a single partition.',
        answer:
          'Run OPTIMIZE my_table WHERE partition_col = \'value\' to compact only that partition—cheaper than full table OPTIMIZE on large datasets. Without ZORDER: OPTIMIZE my_table. On Databricks, Auto Optimize can run compaction in the background, but manual OPTIMIZE remains important after large backfills or before critical reporting windows.',
        tags: ['optimize', 'sql', 'partitions'],
        frequency: 'High',
      },
      {
        title: 'Auto Optimize vs manual',
        difficulty: 'Medium',
        question: 'Compare Databricks Auto Optimize (auto compact + optimized writes) with scheduled OPTIMIZE jobs.',
        answer:
          'Optimized writes reduce small-file creation during writes by bin-packing output. Auto compact periodically merges small files without a full OPTIMIZE pass. Scheduled OPTIMIZE with ZORDER gives predictable layout before peak query hours and handles post-backfill cleanup Auto Optimize may lag on. Production teams often enable optimized writes and still schedule weekly OPTIMIZE for hot tables.',
        tags: ['auto-optimize', 'optimized-writes', 'operations'],
        frequency: 'High',
      },
      {
        title: 'OPTIMIZE cost trade-offs',
        difficulty: 'Medium',
        question: 'What are the costs and risks of running OPTIMIZE too frequently?',
        answer:
          'OPTIMIZE rewrites data files—consuming cluster compute and generating temporary storage for new files before old ones are vacuumed. Over-compacting churns the same data without benefit if write patterns already produce well-sized files. Balance with file count metrics from DESCRIBE DETAIL and query latency rather than blind daily OPTIMIZE on every table.',
        tags: ['optimize', 'cost', 'operations'],
        frequency: 'Medium',
      },
      {
        title: 'File size targets',
        difficulty: 'Hard',
        question: 'How do you choose target file size for Delta tables serving BI vs ML workloads?',
        answer:
          'BI scans favor fewer, larger files (~256 MB–1 GB) to maximize sequential read throughput. ML training with many parallel readers may prefer slightly smaller files to improve task parallelism without exploding file count. Tune using spark.sql.files.maxPartitionBytes, OPTIMIZE, and observe shuffle and scan metrics—there is no single default for all workloads.',
        tags: ['file-size', 'tuning', 'optimize'],
        frequency: 'Medium',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'delta-vacuum',
    category: 'VACUUM',
    items: [
      {
        title: 'What VACUUM removes',
        difficulty: 'Easy',
        question: 'What files does VACUUM delete from a Delta table directory?',
        answer:
          'VACUUM physically removes data files that are no longer referenced by the table state and are older than the retention threshold. It does not remove current active files or files still needed for time travel within retention. Log files have separate retention via delta.logRetentionDuration and are not removed by VACUUM alone.',
        tags: ['vacuum', 'cleanup', 'storage'],
        frequency: 'Very High',
      },
      {
        title: 'Retention configuration',
        difficulty: 'Medium',
        question: 'Explain deletedFileRetentionDuration and its impact on time travel and storage cost.',
        answer:
          'This table property sets the minimum age before VACUUM can delete unreferenced files—default 7 days on Databricks. Longer retention preserves more history for RESTORE and audit but increases storage from orphaned files after overwrites. Shortening retention saves cost but narrows the recovery window; align with compliance SLAs before changing defaults.',
        tags: ['retention', 'configuration', 'time-travel'],
        frequency: 'High',
      },
      {
        title: 'VACUUM vs DROP',
        difficulty: 'Medium',
        question: 'Why can VACUUM not recover deleted files, and how is that different from soft delete in the table?',
        answer:
          'VACUUM permanently deletes objects from object storage—there is no undo unless bucket versioning or backups exist. Soft delete via an is_deleted column keeps rows in the active table snapshot and is reversible with UPDATE. Interviewers want you to separate logical deletes (MERGE/UPDATE) from physical cleanup (VACUUM) and run VACUUM only after retention policy review.',
        tags: ['vacuum', 'delete', 'recovery'],
        frequency: 'High',
      },
      {
        title: 'Dry run and safety',
        difficulty: 'Medium',
        question: 'How do you safely run VACUUM in production without accidental data loss?',
        answer:
          'Use VACUUM my_table RETAIN 168 HOURS (or desired hours) explicitly rather than relying on implicit defaults. Review DESCRIBE HISTORY and confirm no pending rollback needs older files. On Databricks, vacuum dry-run logging shows candidate files. Coordinate with legal/compliance on retention before shortening intervals on regulated datasets.',
        tags: ['vacuum', 'safety', 'production'],
        frequency: 'Medium',
      },
      {
        title: 'Storage billing after MERGE',
        difficulty: 'Hard',
        question: 'Why does storage cost spike after a large MERGE even though row count is unchanged?',
        answer:
          'MERGE rewrites matched rows into new Parquet files and marks old files removed in the log—the table logical size is stable but physical storage doubles until VACUUM runs. High-churn tables need regular OPTIMIZE and VACUUM schedules to reclaim orphaned files. Monitor directory size separately from SUM(rows) for cost alerts.',
        tags: ['vacuum', 'storage', 'merge'],
        frequency: 'High',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'delta-zorder',
    category: 'ZORDER',
    items: [
      {
        title: 'ZORDER concept',
        difficulty: 'Easy',
        question: 'What is ZORDER in Delta Lake and how does it improve query performance?',
        answer:
          'ZORDER is a multi-dimensional clustering technique that colocates related rows in the same files based on one or more columns. Delta stores min/max statistics per file; queries with filters on ZORDER columns skip irrelevant files (data skipping). It helps when users filter on high-cardinality columns that are poor partition keys.',
        tags: ['zorder', 'data-skipping', 'performance'],
        frequency: 'Very High',
      },
      {
        title: 'ZORDER vs partitioning',
        difficulty: 'Medium',
        question: 'When should you use ZORDER instead of partitioning on a Delta table?',
        answer:
          'Partition on low-cardinality columns used in almost every query (date, region) to prune directories. ZORDER on high-cardinality columns (user_id, product_id) that appear in filters but would create too many small partitions. Over-partitioning causes the small-file problem; ZORDER keeps one partition directory but improves intra-partition pruning.',
        tags: ['zorder', 'partitioning', 'design'],
        frequency: 'Very High',
      },
      {
        title: 'OPTIMIZE ZORDER BY syntax',
        difficulty: 'Easy',
        question: 'How do you apply ZORDER clustering to an existing Delta table?',
        answer:
          'Run OPTIMIZE my_table ZORDER BY (col1, col2) to rewrite files with Z-ordering on those columns. Limit to a few columns—typically two or three—that co-occur in WHERE clauses. Re-run after large ingests because new writes are not automatically Z-ordered unless Auto Optimize layout is enabled on supported platforms.',
        tags: ['zorder', 'optimize', 'sql'],
        frequency: 'High',
      },
      {
        title: 'Liquid clustering',
        difficulty: 'Hard',
        question: 'What is Delta Liquid Clustering and how does it differ from classic ZORDER?',
        answer:
          'Liquid clustering (Databricks) replaces static ZORDER with incremental clustering keys defined at table creation—CLUSTER BY (cols). It adapts layout as data arrives without full rewrites on every OPTIMIZE and allows changing clustering keys with ALTER TABLE. Classic ZORDER requires periodic OPTIMIZE ZORDER BY passes to maintain layout after heavy writes.',
        tags: ['liquid-clustering', 'zorder', 'databricks'],
        frequency: 'Medium',
      },
      {
        title: 'Choosing ZORDER columns',
        difficulty: 'Medium',
        question: 'You have filters on date, customer_id, and status—which columns do you ZORDER?',
        answer:
          'Partition or filter on date first if queries always scope to date ranges. ZORDER BY (customer_id) or (customer_id, status) if customer_id drives selective lookups within dates. Avoid ZORDER on low-cardinality status alone. Validate with EXPLAIN and scan metrics: effective ZORDER shows sharply reduced files read on typical queries.',
        tags: ['zorder', 'column-selection', 'design'],
        frequency: 'High',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'delta-cdf',
    category: 'Change Data Feed',
    items: [
      {
        title: 'Enable Change Data Feed',
        difficulty: 'Easy',
        question: 'How do you enable Change Data Feed (CDF) on a Delta table?',
        answer:
          'Set table property delta.enableChangeDataFeed = true via CREATE TABLE ... TBLPROPERTIES or ALTER TABLE. Once enabled, Delta records row-level insert, update, and delete events in _change_data feed files alongside commits. Consumers read changes with table_changes() or Spark\'s readStream option readChangeFeed.',
        tags: ['cdf', 'configuration', 'cdc'],
        frequency: 'High',
      },
      {
        title: 'CDF vs streaming read',
        difficulty: 'Medium',
        question: 'Compare Delta Change Data Feed with reading a Delta table as a Structured Streaming source.',
        answer:
          'A streaming read tracks new files/commits for append-only ingestion—updates and deletes appear as new files without row-level change semantics. CDF emits explicit change types (_change_type: insert, update_preimage, update_postimage, delete) per row. Use CDF when downstream needs true CDC for sync to operational stores or incremental dimension processing.',
        tags: ['cdf', 'streaming', 'cdc'],
        frequency: 'Very High',
      },
      {
        title: 'table_changes function',
        difficulty: 'Medium',
        question: 'How do you consume CDF between two table versions in Spark SQL?',
        answer:
          'Use SELECT * FROM table_changes(\'my_table\', start_version, end_version) to retrieve change events in a version range. For streaming, readStream.format("delta").option("readChangeFeed", "true").option("startingVersion", n). Process _change_type to route inserts, updates, and deletes to appropriate sinks.',
        tags: ['cdf', 'table_changes', 'sql'],
        frequency: 'High',
      },
      {
        title: 'CDF retention',
        difficulty: 'Hard',
        question: 'What happens if a CDF consumer falls behind retention?',
        answer:
          'CDF change files follow the same retention boundaries as table history—VACUUM and log cleanup can remove data needed for old starting versions. Consumers must track last processed version in a checkpoint store and alert on lag. For long outages, fall back to a full snapshot reload or incremental batch from the earliest available version rather than assuming unbounded CDF history.',
        tags: ['cdf', 'retention', 'operations'],
        frequency: 'Medium',
      },
      {
        title: 'CDF in medallion pipelines',
        difficulty: 'Medium',
        question: 'Where does CDF fit in a medallion architecture syncing gold to a CRM?',
        answer:
          'Silver-to-gold builds curated entities in Delta; enabling CDF on gold lets a streaming job push inserts/updates/deletes to CRM APIs without full-table exports. The gold table remains the source of truth while CDF provides efficient outbound sync. Bronze typically stays append-only without CDF unless raw CDC capture is required.',
        tags: ['cdf', 'medallion', 'integration'],
        frequency: 'High',
      },
      {
        title: 'Update preimage and postimage',
        difficulty: 'Hard',
        question: 'Explain update_preimage and update_postimage in Delta CDF events.',
        answer:
          'An UPDATE emits two rows: update_preimage with values before the change and update_postimage with values after. Downstream systems can compute diffs, apply SCD logic, or propagate only changed columns to targets that need before/after semantics. DELETE emits delete rows; INSERT emits insert rows—handling all four types is required for correct CDC consumers.',
        tags: ['cdf', 'update', 'semantics'],
        frequency: 'Medium',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'delta-medallion',
    category: 'Medallion Architecture',
    items: [
      {
        title: 'Bronze silver gold layers',
        difficulty: 'Easy',
        question: 'Describe the bronze, silver, and gold layers in a Delta medallion architecture.',
        answer:
          'Bronze ingests raw data with minimal transformation—append-only, schema-on-read, full history. Silver cleans, deduplicates, conforms schemas, and applies business rules—quality gate for analytics. Gold aggregates into domain-specific tables for BI, ML features, and APIs. Each layer is typically separate Delta tables with increasing data quality and decreasing flexibility.',
        tags: ['medallion', 'bronze', 'silver', 'gold'],
        frequency: 'Very High',
      },
      {
        title: 'Delta at each medallion layer',
        difficulty: 'Medium',
        question: 'Why is Delta Lake preferred over raw Parquet for each medallion layer?',
        answer:
          'Delta adds transactions so concurrent pipeline stages do not corrupt tables, schema enforcement catches bad bronze loads early, and time travel aids debugging across layers. MERGE at silver supports dedup and SCD; OPTIMIZE/ZORDER at gold speeds dashboards. Unified format reduces format proliferation and simplifies ACLs in Unity Catalog.',
        tags: ['medallion', 'delta-lake', 'design'],
        frequency: 'Very High',
      },
      {
        title: 'Bronze ingestion patterns',
        difficulty: 'Medium',
        question: 'What are best practices for bronze Delta tables fed by streaming sources?',
        answer:
          'Append-only with ingestion_timestamp, source_file, and raw payload columns for audit. Use Auto Loader or Structured Streaming with checkpoint locations per table. Avoid heavy transforms at bronze—push validation to silver. Partition by ingestion date if queries replay recent batches; do not over-partition on high-cardinality IDs at bronze.',
        tags: ['bronze', 'streaming', 'ingestion'],
        frequency: 'High',
      },
      {
        title: 'Silver deduplication',
        difficulty: 'Hard',
        question: 'How do you deduplicate events arriving late or duplicated at the silver layer?',
        answer:
          'Use MERGE on natural or surrogate keys with ROW_NUMBER or QUALIFY to keep the latest event by event_time. Watermark streaming aggregations for lateness bounds. Store processing metadata (batch_id, processed_at) to support idempotent replays. Delta MERGE makes silver idempotent where raw bronze retains duplicates intentionally.',
        tags: ['silver', 'dedup', 'merge'],
        frequency: 'High',
      },
      {
        title: 'Gold aggregation strategy',
        difficulty: 'Medium',
        question: 'How should gold Delta tables differ structurally from silver tables?',
        answer:
          'Gold is denormalized, business-key oriented, and optimized for specific consumers—wide KPI tables, star schemas, or feature stores. Apply aggregations, conform dimensions, and precompute metrics silver should not duplicate. Use OPTIMIZE ZORDER on filter columns BI tools use and tighter SLAs on freshness documented per table.',
        tags: ['gold', 'aggregation', 'bi'],
        frequency: 'High',
      },
      {
        title: 'Cross-layer lineage and testing',
        difficulty: 'Hard',
        question: 'How do you test and track lineage across bronze, silver, and gold Delta tables?',
        answer:
          'Use Unity Catalog or data observability tools for column lineage from bronze through gold. Contract tests validate row counts and key metrics between layers after each run—compare hash aggregates or expect frameworks in CI. Version silver/gold with table properties documenting upstream dependencies so breaking schema changes trigger coordinated releases.',
        tags: ['lineage', 'testing', 'governance'],
        frequency: 'Medium',
      },
    ] satisfies QuestionInput[],
  },
  {
    sheet: 'delta-scenarios',
    category: 'Scenario Questions',
    items: [
      {
        title: 'Streaming sink exactly-once',
        difficulty: 'Hard',
        question: 'Design a Structured Streaming pipeline writing exactly-once to a Delta sink from Kafka.',
        answer:
          'Use Kafka structured streaming with checkpointing and Delta as foreachBatch or direct streaming sink. Delta transactions align batch IDs with log commits so retries do not duplicate writes. Enable idempotent producer on Kafka, dedupe with MERGE on event ID at silver if at-least-once sources exist, and monitor lag plus checkpoint recovery after driver restarts.',
        tags: ['streaming', 'exactly-once', 'kafka'],
        frequency: 'Very High',
      },
      {
        title: 'Schema drift from upstream',
        difficulty: 'Medium',
        question: 'An upstream API added columns mid-week. How do you handle schema drift in a Delta bronze-to-silver pipeline?',
        answer:
          'Allow mergeSchema on bronze append or detect new columns with Autoloader schema evolution alerts. Promote new columns to silver only after governance review—ALTER TABLE ADD COLUMN with defaults. Quarantine records failing silver validation to a dead-letter Delta table with time travel for replay once rules update. Document schema contracts with producers to reduce surprises.',
        tags: ['schema-drift', 'pipeline', 'governance'],
        frequency: 'Very High',
      },
      {
        title: 'Partition skew incident',
        difficulty: 'Hard',
        question: 'Users report one date partition queries timeout while others are fast. How do you diagnose and fix?',
        answer:
          'Check file counts and sizes in the hot partition with DESCRIBE DETAIL and the storage browser—likely a small-file storm or a single huge skewed key. Run OPTIMIZE on that partition, consider repartitioning writes by hash within the date partition, and ZORDER on filter columns. If one key dominates (null or default date), fix upstream data quality and add validation at silver.',
        tags: ['skew', 'partitions', 'incident'],
        frequency: 'High',
      },
      {
        title: 'Multi-hop clone for dev',
        difficulty: 'Medium',
        question: 'How do you give data scientists a safe copy of production gold tables without copying all history?',
        answer:
          'Use DEEP CLONE for a point-in-time copy including data and metadata, or SHALLOW CLONE for metadata-only cheap branching when storage sharing is acceptable. Time-travel to a recent version before clone to limit size. Mask PII via dynamic views or cloned tables run through sanitization jobs—never share raw production credentials in notebooks.',
        tags: ['clone', 'dev', 'governance'],
        frequency: 'Medium',
      },
      {
        title: 'Unified batch and streaming',
        difficulty: 'Hard',
        question: 'Your team maintains separate batch and streaming pipelines to the same Delta table. Propose a unified approach.',
        answer:
          'Adopt a single Delta table with Structured Streaming for real-time plus triggered batch backfills using the same MERGE logic in foreachBatch. Shared checkpoint paths per environment prevent collisions. Use table properties and job schedules so backfills run idempotent MERGE on overlapping keys without duplicating streaming output. Medallion silver becomes the convergence point before gold aggregations.',
        tags: ['batch', 'streaming', 'architecture'],
        frequency: 'High',
      },
    ] satisfies QuestionInput[],
  },
], 1500)
