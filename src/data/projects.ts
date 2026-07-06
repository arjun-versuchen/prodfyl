import type { ProjectWalkthrough } from '../types'

export const projects: ProjectWalkthrough[] = [
  {
    slug: 'ecommerce-sales-analytics',
    title: 'E-Commerce Sales Analytics Pipeline',
    description:
      'Build a batch ETL pipeline that ingests daily order data, transforms it into a star schema, and powers sales dashboards.',
    icon: '🛒',
    color: 'from-success to-info',
    difficulty: 'Beginner',
    accessTier: 'free',
    duration: '1–2 weeks',
    techStack: ['Python', 'PostgreSQL', 'SQL', 'Airflow', 'dbt'],
    outcome: 'A portfolio-ready batch analytics pipeline you can explain end-to-end in junior DE interviews.',
    sections: [],
    enhanced: {
      businessProblem:
        'Sales and Finance rely on manual CSV exports to track daily revenue. Reports arrive late, numbers do not match, and nobody trusts a single source of truth. The company needs automated daily sales analytics by 6 AM.',
      architectureFlow: [
        'PostgreSQL / CSV',
        'Python Extract',
        'Staging',
        'dbt Transform',
        'Star Schema',
        'Dashboard',
      ],
      pipelineSteps: [
        {
          title: 'Extract',
          description: 'Pull incremental orders from PostgreSQL using an updated_at watermark and ingest the daily payment-gateway CSV.',
          checklist: [
            'Watermark table tracks last successful extract timestamp',
            'CSV landed to dated folder: raw/payments/yyyy-mm-dd/',
            'Each extract tagged with batch_id for traceability',
          ],
        },
        {
          title: 'Stage',
          description: 'Load raw data into staging tables without transformation — preserve source fidelity for replay and audit.',
          checklist: [
            'Append-only staging with loaded_at and source_file columns',
            'Reject files missing required headers before load',
            'Record row counts in a pipeline metadata table',
          ],
        },
        {
          title: 'Transform',
          description: 'Run dbt models: staging → intermediate → marts. Build conformed dimensions and an order line-item fact table.',
          checklist: [
            'dedupe orders by order_id + line_id in intermediate layer',
            'Join to dim_customers, dim_products, dim_dates',
            'Materialize fct_orders at line-item grain',
          ],
        },
        {
          title: 'Test',
          description: 'Validate data quality before dashboards refresh — failed tests block downstream tasks.',
          checklist: [
            'Unique and not-null tests on primary keys',
            'Reconcile row counts: source vs staging vs marts (±0.1%)',
            'Freshness: max(order_date) must be current or previous day',
          ],
        },
        {
          title: 'Serve',
          description: 'Expose gold marts to BI. Pre-aggregate daily revenue, orders, and top products for fast dashboard loads.',
          checklist: [
            'mart_daily_revenue consumed by Metabase / Looker',
            'Dashboard cache refresh triggered after dbt success',
            'Role-based access: Finance read-only, Sales filtered by region',
          ],
        },
        {
          title: 'Monitor',
          description: 'Alert on failures and anomalies. On-call should know within minutes if the 6 AM SLA is at risk.',
          checklist: [
            'Airflow SLA miss → Slack #data-alerts',
            'Revenue drop >40% vs 7-day avg → PagerDuty warning',
            'Daily pipeline run summary posted to Slack on success',
          ],
        },
      ],
      failureScenarios: [
        {
          title: 'Duplicate file load',
          problem: 'The same payment CSV is uploaded twice after an operator re-runs the job manually.',
          detection: 'Row-count reconciliation fails — staging count is 2× the expected daily average. batch_id metadata shows two loads for the same source_file.',
          fix: 'Make loads idempotent: dedupe on (source_file, row_hash) in staging, or use MERGE with a natural key. Add Airflow task concurrency limit of 1 for the ingest task.',
          interviewAnswer:
            '"I design staging loads to be idempotent. We track source_file and row_hash, skip already-loaded rows, and enforce single-writer concurrency on ingest tasks so a manual re-run cannot double-count revenue."',
        },
        {
          title: 'Late arriving data',
          problem: 'Orders created near midnight land in OLTP after the nightly extract watermark has already passed.',
          detection: 'Finance reports revenue mismatch vs payment gateway. max(order_date) freshness test passes but reconciliation against payments shows a gap for the prior day.',
          fix: 'Run a 3-day lookback window on incremental extract instead of 1 day. Add a weekly backfill DAG to catch stragglers. Document SLAs with source teams.',
          interviewAnswer:
            '"Batch does not mean blind to late data. I use a sliding lookback window on incremental extracts and a weekly reconciliation job. That way late orders get picked up without full reloads."',
        },
        {
          title: 'Corrupt CSV',
          problem: 'Payment gateway file arrives truncated — missing footer rows or malformed quoting mid-file.',
          detection: 'Python ingest raises ParseError; row count is 60% below expected. File checksum does not match the manifest email from the gateway.',
          fix: 'Quarantine corrupt files to an error/ prefix, alert the team, and do not promote staging to marts. Request re-send from vendor. Add schema + row-count pre-checks before load.',
          interviewAnswer:
            '"I never let a bad file reach marts. Corrupt files go to quarantine, alerts fire immediately, and downstream dbt tasks are skipped via Airflow short-circuit. We fix upstream before reprocessing."',
        },
        {
          title: 'Schema change',
          problem: 'Payment CSV adds a new discount_code column without notice — staging load succeeds but dbt models break.',
          detection: 'dbt run fails on staging model compile. Airflow task marked failed; schema drift alert compares CSV headers against expected schema registry.',
          fix: 'Version the staging schema, add nullable columns in a migration step, update dbt staging models, and backfill. Establish a schema contract with the payment team.',
          interviewAnswer:
            '"I treat schema changes as first-class events. We maintain a schema registry, allow additive changes in staging, and use dbt tests to catch breaking changes before dashboards refresh."',
        },
        {
          title: 'DAG failure',
          problem: 'dbt transform task fails at 4 AM due to a transient warehouse connection timeout.',
          detection: 'Airflow marks transform task failed; SLA clock still running. Retry exhausts after 3 attempts. Slack alert includes task_id and log link.',
          fix: 'Configure exponential backoff retries on transient tasks. Isolate transform from extract so re-run starts at failed task, not from scratch. Document runbook: check warehouse status → clear lock → retry from transform.',
          interviewAnswer:
            '"I structure DAGs so retries are cheap — extract and transform are separate with idempotent tasks. On failure, we retry with backoff, and the runbook tells on-call exactly which task to restart without re-extracting six hours of data."',
        },
      ],
      interviewScript:
        '"At [Company], Sales and Finance needed daily revenue by 6 AM but relied on manual exports that often disagreed. I built a nightly batch pipeline: Python extracts incremental orders from PostgreSQL plus a payment CSV, lands both to staging, and dbt transforms them into a star schema — dimensions for customers, products, and dates, and a line-item fact table for orders. Before dashboards refresh, dbt tests check keys, row counts, and freshness. If anything fails, Airflow blocks downstream tasks and Slack alerts the team. The result was trusted daily dashboards for Sales and Finance, and I can walk through exactly how I handled duplicate loads and late-arriving orders."',
    },
    interviewQuestions: [
      'Why did you choose batch over streaming for this use case?',
      'How do you handle late-arriving orders or backfills?',
      'What happens if the same file is loaded twice?',
      'How would you scale this if order volume grew 10x?',
      'Walk me through your dbt model layers and testing strategy.',
    ],
    resumeBullets: [
      'Built nightly batch ETL pipeline ingesting 500K+ monthly e-commerce orders from PostgreSQL and CSV into a star-schema warehouse with 6 AM SLA',
      'Designed idempotent staging loads and dbt data-quality tests that reduced reporting discrepancies between Finance and Sales by 60%',
      'Automated daily revenue dashboards in Metabase, eliminating 2 hours of manual CSV reporting for stakeholders',
    ],
  },
  {
    slug: 'log-ingestion-monitoring',
    title: 'Server Log Ingestion & Monitoring',
    description:
      'Ingest application logs in near real-time, aggregate error rates, and alert when SLO thresholds are breached.',
    icon: '📡',
    color: 'from-warning to-accent',
    difficulty: 'Intermediate',
    accessTier: 'mixed',
    duration: '2–3 weeks',
    techStack: ['Kafka', 'Spark Structured Streaming', 'Parquet', 'Python', 'Grafana'],
    outcome: 'Demonstrate streaming ingestion, windowed aggregations, and operational monitoring — common mid-level DE topics.',
    sections: [
      {
        id: 'context',
        title: 'Business Context',
        content:
          'A microservices platform generates JSON logs from 50+ services. On-call engineers need error-rate dashboards and alerts within 2 minutes of a spike. Historical logs must be retained for 90 days for audit and debugging.',
        bullets: [
          'Ingestion latency target: < 2 minutes end-to-end',
          'Retention: 90 days hot storage, archive to cold storage after',
          'Key metric: 5-minute error rate per service',
        ],
      },
      {
        id: 'architecture',
        title: 'Architecture Overview',
        content:
          'Producers ship logs to Kafka. Spark Structured Streaming consumes, parses, enriches, and writes partitioned Parquet to a data lake. A serving layer pre-aggregates metrics for Grafana dashboards.',
        bullets: [
          'Kafka topics partitioned by service name for parallelism',
          'Spark streaming job: parse JSON, extract level/status/latency fields',
          'Lake storage: s3://logs/year=YYYY/month=MM/day=DD/hour=HH/',
          'Metrics table: 5-min tumbling windows per service',
        ],
      },
      {
        id: 'streaming',
        title: 'Stream Processing Logic',
        content:
          'Use Structured Streaming with watermarking to handle late events and stateful window aggregations for error counts.',
        code: `-- Conceptual aggregation (Spark SQL)
SELECT
  window(timestamp, '5 minutes') AS w,
  service_name,
  COUNT(*) AS total_events,
  SUM(CASE WHEN level = 'ERROR' THEN 1 ELSE 0 END) AS error_count
FROM parsed_logs
WHERE timestamp > current_timestamp() - INTERVAL 1 HOUR
GROUP BY window(timestamp, '5 minutes'), service_name`,
      },
      {
        id: 'ops',
        title: 'Monitoring & Alerting',
        content:
          'Operational excellence separates production pipelines from demos. Define SLOs, dashboards, and runbooks.',
        bullets: [
          'Dashboard: error rate, p99 latency, lag per Kafka partition',
          'Alert: error_rate > 5% for 10 consecutive minutes → PagerDuty',
          'Runbook: check consumer lag → restart executor → replay from checkpoint',
          'Checkpointing: S3 checkpoint location for exactly-once semantics',
        ],
      },
      {
        id: 'interview',
        title: 'Interview Talking Points',
        content:
          'Interviewers probe trade-offs: Kafka vs Kinesis, micro-batch vs continuous processing, and how you debug consumer lag.',
        bullets: [
          'Explain why Kafka (decoupling, replay, multiple consumers)',
          'Discuss watermark delay vs completeness trade-off',
          'Describe one production incident and how checkpoints saved you',
        ],
      },
    ],
    interviewQuestions: [
      'How do you handle poison messages or malformed JSON in the stream?',
      'What is consumer lag and how do you reduce it?',
      'Explain checkpointing and why it matters.',
      'Batch vs streaming — when would you rebuild this as batch?',
    ],
    resumeBullets: [
      'Designed Kafka + Spark streaming pipeline ingesting 2M+ daily log events with sub-2-min latency',
      'Built error-rate alerting that reduced mean time to detect incidents by 45%',
      'Implemented checkpointed Structured Streaming jobs for fault-tolerant log aggregation',
    ],
  },
  {
    slug: 'customer-360-lakehouse',
    title: 'Customer 360 Lakehouse',
    description:
      'Unify CRM, web, and transaction data in a Delta Lake lakehouse with SCD Type 2 customer history and a gold Customer 360 mart.',
    icon: '🧑‍💼',
    color: 'from-primary to-accent',
    difficulty: 'Advanced',
    accessTier: 'premium',
    duration: '3–4 weeks',
    techStack: ['Delta Lake', 'Spark', 'Azure ADLS', 'dbt', 'Python'],
    outcome: 'A strong senior-level project showcasing medallion architecture, slowly changing dimensions, and lakehouse patterns.',
    sections: [
      {
        id: 'context',
        title: 'Business Context',
        content:
          'Marketing and support teams need a single view of each customer: profile, lifetime value, last login, open tickets, and segment. Data arrives from Salesforce (CRM), Snowplow (web events), and the billing system — each with different refresh cadences and schemas.',
      },
      {
        id: 'medallion',
        title: 'Medallion Architecture',
        content:
          'Bronze stores raw payloads as-is. Silver applies typing, deduplication, and SCD logic. Gold exposes business-ready marts.',
        bullets: [
          'Bronze: append-only Delta tables, ingestion timestamp, source metadata',
          'Silver: conformed customer_id, deduped events, SCD Type 2 dim_customer',
          'Gold: customer_360 mart joining profile, LTV, engagement score, churn risk',
        ],
      },
      {
        id: 'scd',
        title: 'SCD Type 2 Implementation',
        content:
          'Track historical changes to customer attributes (segment, plan tier, address) with effective dates and current flag.',
        code: `dim_customer_scd2 (
  customer_sk,          -- surrogate key
  customer_id,          -- natural key
  segment, plan_tier, city,
  effective_from,
  effective_to,
  is_current
)`,
        bullets: [
          'Merge logic: close current row when attributes change, insert new version',
          'Use Delta MERGE for atomic upserts',
          'Query pattern: filter is_current = true for latest; join on date range for point-in-time',
        ],
      },
      {
        id: 'quality',
        title: 'Data Quality & Governance',
        content:
          'Lakehouse without governance becomes a swamp. Enforce contracts at silver layer boundaries.',
        bullets: [
          'Expectations: email format, non-null customer_id, referential integrity to dim tables',
          'Lineage: document source → bronze → silver → gold in a data catalog',
          'PII: hash emails in bronze, restrict gold access via RBAC',
        ],
      },
      {
        id: 'interview',
        title: 'How to Defend This Project',
        content:
          'Senior interviews focus on design trade-offs: Delta vs Iceberg, SCD2 vs SCD1, batch vs streaming silver layer.',
        bullets: [
          'Justify Delta Lake (ACID merges, time travel for debugging bad loads)',
          'Explain merge performance optimizations (Z-order, partition pruning)',
          'Discuss how you would add real-time web events without rebuilding bronze',
        ],
      },
    ],
    interviewQuestions: [
      'Why SCD Type 2 instead of Type 1 for customer segment?',
      'How does Delta Lake MERGE work under the hood?',
      'How would you backfill six months of historical CRM data?',
      'What is medallion architecture and what problems does it solve?',
      'How do you handle duplicate events from web tracking?',
    ],
    resumeBullets: [
      'Architected Customer 360 lakehouse on Delta Lake unifying CRM, web, and billing sources',
      'Implemented SCD Type 2 merges serving 2M+ customers with point-in-time analytics',
      'Established bronze/silver/gold layers with dbt tests and PII governance controls',
    ],
  },
  {
    slug: 'azure-adf-batch-orchestration',
    title: 'Azure Data Factory Batch Orchestration',
    description:
      'Orchestrate multi-source batch ingestion and transformation using Azure Data Factory, ADLS Gen2, and Synapse serverless SQL.',
    icon: '☁️',
    color: 'from-info to-primary',
    difficulty: 'Intermediate',
    accessTier: 'premium',
    duration: '2–3 weeks',
    techStack: ['Azure Data Factory', 'ADLS Gen2', 'Synapse', 'SQL', 'Power BI'],
    outcome: 'Azure-focused portfolio piece for DE roles requiring cloud orchestration experience.',
    sections: [
      {
        id: 'context',
        title: 'Business Context',
        content:
          'A retail chain uploads daily POS CSV files to ADLS, pulls inventory from Azure SQL, and needs a unified daily inventory-sales dataset for regional managers.',
      },
      {
        id: 'adf-design',
        title: 'ADF Pipeline Design',
        content:
          'Master pipeline triggers child pipelines for each source, with dependency gates and parameterized datasets.',
        bullets: [
          'Linked services: ADLS Gen2, Azure SQL, Key Vault for secrets',
          'Datasets: parameterized by date partition (yyyy/MM/dd)',
          'Activities: Copy Data → Data Flow transform → Stored Procedure for merge',
          'Trigger: tumbling window schedule at 2 AM daily with retry policy',
        ],
      },
      {
        id: 'patterns',
        title: 'Key Patterns',
        content:
          'Use metadata-driven pipelines when source count grows — store file paths and schemas in a control table instead of hardcoding.',
        bullets: [
          'Lookup activity reads control table → ForEach iterates sources',
          'Staging zone: parquet with snappy compression before curated layer',
          'Error rows routed to quarantine folder with rejection reason column',
        ],
      },
      {
        id: 'interview',
        title: 'Interview Focus Areas',
        content:
          'Azure DE interviews often ask about IR (integration runtime), cost optimization, and monitoring ADF runs.',
        bullets: [
          'Self-hosted vs Azure IR — when each is needed',
          'How you monitor pipeline failures (Azure Monitor, alerts)',
          'Parameterization vs separate pipelines for each source',
        ],
      },
    ],
    interviewQuestions: [
      'Explain linked services vs datasets vs pipelines in ADF.',
      'How do you handle secrets in ADF pipelines?',
      'What is the difference between Copy activity and Mapping Data Flow?',
      'How would you reprocess a failed day without duplicating data?',
    ],
    resumeBullets: [
      'Built Azure Data Factory orchestration ingesting POS and inventory data from 200+ store locations',
      'Designed metadata-driven pipelines reducing new source onboarding from days to hours',
      'Integrated Synapse serverless SQL and Power BI for regional inventory dashboards',
    ],
  },
  {
    slug: 'fraud-detection-streaming',
    title: 'Real-Time Fraud Detection Pipeline',
    description:
      'Score payment transactions in real time using streaming joins against user profiles and rule-based + velocity checks.',
    icon: '🛡️',
    color: 'from-accent to-warning',
    difficulty: 'Advanced',
    accessTier: 'premium',
    duration: '3–4 weeks',
    techStack: ['Kafka', 'Flink / Spark Streaming', 'Redis', 'Python', 'PostgreSQL'],
    outcome: 'High-impact streaming project demonstrating joins, stateful processing, and low-latency decisioning.',
    sections: [
      {
        id: 'context',
        title: 'Business Context',
        content:
          'A fintech platform must flag suspicious transactions within 500ms before authorization completes. Rules include velocity limits, geo-impossible travel, and device fingerprint mismatches.',
        bullets: [
          'Latency SLA: p99 < 500ms for scoring decision',
          'Throughput: 5K transactions/second peak',
          'False positive target: < 2% to avoid blocking legitimate users',
        ],
      },
      {
        id: 'architecture',
        title: 'Streaming Architecture',
        content:
          'Transaction events stream through Kafka. A Flink/Spark job enriches with user profile from Redis, applies rules, and emits fraud scores to a decision topic.',
        bullets: [
          'Hot path: stream processor with keyed state per user_id',
          'Redis: cached profile + rolling 1-hour transaction count',
          'Cold path: flagged transactions land in investigation queue (PostgreSQL)',
          'Feedback loop: analyst labels used to tune rule thresholds',
        ],
      },
      {
        id: 'rules',
        title: 'Rule Engine Design',
        content:
          'Start with interpretable rules before ML — interviewers prefer clear logic you can explain.',
        bullets: [
          'Velocity: > 5 transactions in 10 minutes from same card',
          'Geo: country change within 2 hours of last transaction',
          'Amount: transaction > 3x user historical 99th percentile',
          'Device: new device + high amount + new merchant category',
        ],
      },
      {
        id: 'interview',
        title: 'Senior Interview Angles',
        content:
          'Discuss exactly-once processing, state backend sizing, and how you A/B tested rule changes without blocking payments.',
        bullets: [
          'Stateful stream joins: Kafka stream + Redis lookup pattern',
          'Handling late events without double-counting velocity',
          'Shadow mode: score in parallel before enforcing new rules',
        ],
      },
    ],
    interviewQuestions: [
      'How do you join a Kafka stream with a database/Redis lookup at scale?',
      'What state does your streaming job maintain and how is it checkpointed?',
      'How would you migrate from rules to a machine learning model?',
      'Explain the trade-off between latency and accuracy in fraud detection.',
    ],
    resumeBullets: [
      'Built real-time fraud scoring pipeline processing 5K TPS with p99 latency under 500ms',
      'Implemented velocity and geo-impossible-travel rules using Flink stateful streaming',
      'Reduced fraudulent chargebacks by 28% while keeping false positives below 2%',
    ],
  },
]

export const projectBySlug = Object.fromEntries(projects.map((p) => [p.slug, p]))

export const totalProjectCount = projects.length

export const liveProjectCount = projects.length
