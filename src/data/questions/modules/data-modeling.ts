import { distributeQuestions } from '../../questionFactory'
import type { QuestionInput } from '../../questionFactory'

const module = 'data-modeling'

export const dataModelingQuestions = distributeQuestions(
  module,
  [
    {
      sheet: 'dm-oltp-olap',
      category: 'OLTP vs OLAP',
      items: [
        {
          title: 'OLTP vs OLAP defined',
          difficulty: 'Easy',
          question: 'What is the difference between OLTP and OLAP systems?',
          answer:
            'OLTP (Online Transaction Processing) handles high-volume, short, atomic transactions—normalized schemas, row-oriented, optimized for inserts/updates (orders, payments). OLAP (Online Analytical Processing) supports complex queries over large historical data—often denormalized star/snowflake schemas, columnar storage, optimized for reads and aggregations.',
          tags: ['oltp', 'olap', 'fundamentals'],
          frequency: 'Very High',
        },
        {
          title: 'Workload characteristics',
          difficulty: 'Easy',
          question: 'Compare typical OLTP vs OLAP query patterns and SLAs.',
          answer:
            'OLTP: point lookups, small result sets, millisecond latency, many concurrent users, ACID critical. OLAP: full scans, joins across facts/dims, aggregations, seconds to minutes acceptable, batch or BI concurrency, consistency often eventual at scale. ETL bridges OLTP → OLAP.',
          tags: ['oltp', 'olap', 'workloads'],
          frequency: 'Very High',
        },
        {
          title: 'HTAP and modern hybrids',
          difficulty: 'Medium',
          question: 'What is HTAP and when might you still separate OLTP and OLAP?',
          answer:
            'HTAP (Hybrid Transaction/Analytical Processing) runs both workloads on one platform (e.g., Snowflake Unistore, SQL Server columnstore on OLTP). Separate when scale, cost isolation, or schema optimization differ sharply—operational DB stays lean; warehouse absorbs analytical load without impacting transactions.',
          tags: ['htap', 'architecture'],
          frequency: 'Medium',
        },
        {
          title: 'Operational vs analytical data store',
          difficulty: 'Medium',
          question: 'Why not run BI reports directly on the production OLTP database?',
          answer:
            'Heavy analytical queries contend with transactional locks/I/O, degrade user-facing latency, and complex joins stress normalized schemas. OLTP retention is short; analytics needs history. Solution: replicate/CDC to a warehouse or read replica dedicated to reporting with appropriate modeling.',
          tags: ['oltp', 'architecture'],
          frequency: 'Very High',
        },
        {
          title: 'Data vault vs dimensional',
          difficulty: 'Hard',
          question: 'How does Data Vault modeling relate to OLTP/OLAP split?',
          answer:
            'Data Vault is a staging/integration layer (hubs, links, satellites) optimized for auditable, agile ingestion from many OLTP sources—not user-facing. Dimensional marts (star schema) sit downstream for OLAP consumption. Vault handles change and lineage; stars optimize query simplicity.',
          tags: ['data-vault', 'architecture'],
          frequency: 'Medium',
        },
      ] satisfies QuestionInput[],
    },
    {
      sheet: 'dm-star',
      category: 'Star Schema',
      items: [
        {
          title: 'Star schema components',
          difficulty: 'Easy',
          question: 'Describe the core components of a star schema.',
          answer:
            'Central fact table(s) with numeric measures and foreign keys to dimension tables. Dimensions describe business entities (customer, product, date)—wide, denormalized, human-readable attributes. Few joins (fact to dims), simple for BI tools and analysts. One fact table per business process at a defined grain.',
          tags: ['star-schema', 'fundamentals'],
          frequency: 'Very High',
        },
        {
          title: 'Why star over normalized for analytics',
          difficulty: 'Medium',
          question: 'Why is star schema preferred for data warehouse marts?',
          answer:
            'Denormalized dimensions reduce join count and query complexity—BI tools generate cleaner SQL. Predictable patterns enable indexing/partitioning on facts. Trade storage for query speed and usability. Kimball methodology: model dimensions as the business sees them.',
          tags: ['star-schema', 'kimball'],
          frequency: 'Very High',
        },
        {
          title: 'Multiple fact tables',
          difficulty: 'Medium',
          question: 'Can a star schema have multiple fact tables? How do they relate?',
          answer:
            'Yes—one fact per process (sales, inventory, shipments). Conformed dimensions (shared dim_date, dim_product) enable cross-process analysis and drill-across queries. Facts at different grains should not be merged into one table without careful alignment.',
          tags: ['star-schema', 'facts'],
          frequency: 'High',
        },
        {
          title: 'Fact table indexing',
          difficulty: 'Medium',
          question: 'How do you physically optimize a large fact table?',
          answer:
            'Partition by date (or surrogate date key range). Cluster/index on common filter columns (date_key, region_key). Columnar storage in modern warehouses. Pre-aggregate where queries repeat. Avoid over-indexing—load performance matters.',
          tags: ['star-schema', 'performance'],
          frequency: 'High',
        },
        {
          title: 'Star schema interview design',
          difficulty: 'Hard',
          question: 'Design a star schema for e-commerce order analytics.',
          answer:
            'Fact: f_order_line at line-item grain (order_line_id, order_date_key, customer_key, product_key, qty, unit_price, discount_amt, revenue). Dims: dim_date, dim_customer, dim_product, dim_payment_method. Degenerate: order_number on fact. Conform dims if linking to shipment fact later.',
          tags: ['star-schema', 'design'],
          frequency: 'Very High',
        },
      ] satisfies QuestionInput[],
    },
    {
      sheet: 'dm-snowflake',
      category: 'Snowflake Schema',
      items: [
        {
          title: 'Snowflake vs star',
          difficulty: 'Easy',
          question: 'What is a snowflake schema and how does it differ from a star schema?',
          answer:
            'Snowflake normalizes dimensions into hierarchies of lookup tables (dim_product → dim_category → dim_department). Star keeps dimensions flat/denormalized. Snowflake saves storage and enforces consistency; star minimizes joins and simplifies queries.',
          tags: ['snowflake-schema', 'fundamentals'],
          frequency: 'Very High',
        },
        {
          title: 'When to snowflake dimensions',
          difficulty: 'Medium',
          question: 'When would you choose snowflake over star for dimensions?',
          answer:
            'When dimension hierarchies are large, reused across many attributes, or updated centrally (product taxonomy shared by multiple dims). Also when source systems are highly normalized and refactoring cost is high. Modern columnar engines often still prefer denormalized stars for query speed.',
          tags: ['snowflake-schema', 'trade-offs'],
          frequency: 'High',
        },
        {
          title: 'Snowflake query impact',
          difficulty: 'Medium',
          question: 'What are the downsides of snowflake schemas for BI users?',
          answer:
            'More joins increase query complexity, latency, and error rates in ad hoc SQL. BI semantic layers must expose flattened views. Maintenance of many small dim tables adds ETL overhead. Mitigate with dimension views that join hierarchy levels for consumers.',
          tags: ['snowflake-schema', 'bi'],
          frequency: 'High',
        },
        {
          title: 'Bridge tables',
          difficulty: 'Medium',
          question: 'How do bridge tables relate to snowflake and many-to-many dimensions?',
          answer:
            'Bridge (factless fact) resolves many-to-many between fact and dimension—e.g., account with multiple customers. Contains keys and optionally weight factor for allocation. Not strictly snowflake but adds join complexity; document double-counting risks in metrics.',
          tags: ['bridge-table', 'snowflake-schema'],
          frequency: 'Medium',
        },
        {
          title: 'Hybrid modeling approach',
          difficulty: 'Hard',
          question: 'Describe a pragmatic hybrid of star and snowflake in a warehouse.',
          answer:
            'Store normalized staging and core dims in snowflake form for maintenance; publish denormalized mart views or materialized tables as stars for consumption. Slowly changing hierarchy levels may stay normalized while frequently queried attributes are flattened into dim views.',
          tags: ['snowflake-schema', 'architecture'],
          frequency: 'Medium',
        },
      ] satisfies QuestionInput[],
    },
    {
      sheet: 'dm-facts-dims',
      category: 'Facts & Dimensions',
      items: [
        {
          title: 'Grain definition',
          difficulty: 'Easy',
          question: 'What is grain in a fact table and why must it be declared?',
          answer:
            'Grain is the atomic level of one fact row—e.g., one line item per order per day. Every measure must be additive or semi-additive at that grain. Declaring grain prevents double-counting, guides dimension keys, and documents what one row represents for all consumers.',
          tags: ['grain', 'facts'],
          frequency: 'Very High',
        },
        {
          title: 'Additive vs semi-additive vs non-additive',
          difficulty: 'Medium',
          question: 'Classify measures: revenue, account balance, margin percentage.',
          answer:
            'Additive: sum across all dimensions (revenue, quantity). Semi-additive: sum across some dims but not time (account balance, inventory level—use end-of-period snapshot). Non-additive: ratios and percentages (margin %)—compute from summed components, never sum the ratio itself.',
          tags: ['measures', 'facts'],
          frequency: 'Very High',
        },
        {
          title: 'Degenerate dimensions',
          difficulty: 'Medium',
          question: 'What is a degenerate dimension?',
          answer:
            'Dimension attribute stored on the fact table without a separate dim table—typically low-cardinality identifiers like order_number, invoice_number, transaction_id. Avoids unnecessary joins when attributes are unique per fact row and not used for grouping large hierarchies.',
          tags: ['degenerate-dimension', 'facts'],
          frequency: 'High',
        },
        {
          title: 'Factless fact tables',
          difficulty: 'Medium',
          question: 'When do you use a factless fact table?',
          answer:
            'Records events or coverage without measures—student attendance (student_key, class_key, date_key), promotion coverage (product_key, store_key, promo_key). Supports existence/count queries ("how many stores sold product X"). Add dummy measure of 1 if tool requires numeric column.',
          tags: ['factless', 'facts'],
          frequency: 'High',
        },
        {
          title: 'Transaction vs snapshot vs accumulating snapshot',
          difficulty: 'Hard',
          question: 'Compare transaction, periodic snapshot, and accumulating snapshot fact tables.',
          answer:
            'Transaction: one row per event at lowest grain (sale). Periodic snapshot: regular interval state (daily inventory levels). Accumulating snapshot: tracks pipeline milestones with date keys updated as stages complete (order fulfillment—ordered, shipped, delivered dates on one row). Choose based on business process lifecycle.',
          tags: ['fact-types', 'facts'],
          frequency: 'Very High',
        },
      ] satisfies QuestionInput[],
    },
    {
      sheet: 'dm-scd',
      category: 'SCD Types',
      items: [
        {
          title: 'SCD Type 1',
          difficulty: 'Easy',
          question: 'Explain SCD Type 1 with an example.',
          answer:
            'Overwrite attribute in place—no history preserved. Example: customer corrects typo in address. Simple ETL (UPDATE dim SET col = new WHERE key = x). Use when change is correction or history irrelevant. Loses audit trail unless tracked elsewhere.',
          tags: ['scd', 'type-1'],
          frequency: 'Very High',
        },
        {
          title: 'SCD Type 2',
          difficulty: 'Medium',
          question: 'Explain SCD Type 2 and required columns.',
          answer:
            'Preserve history by inserting new row with new surrogate key when attribute changes. Columns: effective_start_date, effective_end_date (or current_flag), version/surrogate key. Fact rows keep original dim key—correct point-in-time reporting. Most common for analytics on slowly changing attributes (customer segment, product category).',
          tags: ['scd', 'type-2'],
          frequency: 'Very High',
        },
        {
          title: 'SCD Type 3',
          difficulty: 'Medium',
          question: 'When use SCD Type 3 instead of Type 2?',
          answer:
            'Store limited history—typically previous and current value columns (prior_region, current_region). Saves storage vs Type 2 but only one prior state. Rare in modern warehouses; Type 2 or snapshot facts preferred when full history needed.',
          tags: ['scd', 'type-3'],
          frequency: 'Medium',
        },
        {
          title: 'Detecting changes for Type 2',
          difficulty: 'Medium',
          question: 'How do you detect dimension changes in an ETL pipeline for Type 2 SCD?',
          answer:
            'Compare hash of tracked attributes (MD5/SHA of concatenated cols) between staging and current active dim row. On mismatch: expire old row (end_date = yesterday, current_flag = N), insert new row with new surrogate key and start_date = today. Handle late-arriving changes with effective dates.',
          tags: ['scd', 'etl'],
          frequency: 'Very High',
        },
        {
          title: 'Type 6 and hybrid SCD',
          difficulty: 'Hard',
          question: 'What is SCD Type 6 (hybrid)?',
          answer:
            'Combines Type 1, 2, and 3: Type 2 history rows plus current-value columns updated in place on the current record (Type 1 overlay) and optional Type 3 previous-value column. Enables both historical and current-attribute reporting from one table—more complex to maintain.',
          tags: ['scd', 'type-6'],
          frequency: 'Low',
        },
      ] satisfies QuestionInput[],
    },
    {
      sheet: 'dm-normalization',
      category: 'Normalization',
      items: [
        {
          title: 'First normal form (1NF)',
          difficulty: 'Easy',
          question: 'What is 1NF and give a violation example?',
          answer:
            'Each column holds atomic values; no repeating groups. Violation: order table with column products = "A,B,C". Fix: separate order_line table with one product per row. Eliminates array-like columns in relational modeling.',
          tags: ['normalization', '1nf'],
          frequency: 'High',
        },
        {
          title: 'Second and third normal form',
          difficulty: 'Medium',
          question: 'Explain 2NF and 3NF briefly.',
          answer:
            '2NF: 1NF plus no partial dependency on composite key—non-key attrs depend on entire key (split if attr depends on part of key). 3NF: 2NF plus no transitive dependency—non-key attrs depend only on key, not other non-key attrs (e.g., city → state stored separately from zip). Reduces redundancy and update anomalies.',
          tags: ['normalization', '2nf', '3nf'],
          frequency: 'Very High',
        },
        {
          title: 'BCNF',
          difficulty: 'Hard',
          question: 'What is BCNF and when does it differ from 3NF?',
          answer:
            'Boyce-Codd Normal Form: every determinant is a candidate key. Stricter than 3NF—handles cases where 3NF allows dependency on non-candidate key. Example: teacher→course if each course has one teacher but teachers teach multiple. May require decomposition beyond 3NF.',
          tags: ['normalization', 'bcnf'],
          frequency: 'Medium',
        },
        {
          title: 'Normalization in OLTP design',
          difficulty: 'Medium',
          question: 'Why normalize operational databases to 3NF?',
          answer:
            'Minimizes redundancy—single source of truth per fact. Updates/deletes avoid anomalies. Smaller row width for transactional access patterns. OLTP write path stays consistent. Denormalization deferred to read-optimized layers (warehouse marts).',
          tags: ['normalization', 'oltp'],
          frequency: 'High',
        },
        {
          title: 'Denormalization triggers',
          difficulty: 'Medium',
          question: 'When is normalization intentionally relaxed?',
          answer:
            'Read-heavy reporting marts, caching layers, or when join cost exceeds storage cost. Document accepted redundancy. Never denormalize OLTP without understanding write anomaly risk—prefer warehouse denormalization over polluting source systems.',
          tags: ['normalization', 'trade-offs'],
          frequency: 'High',
        },
      ] satisfies QuestionInput[],
    },
    {
      sheet: 'dm-denormalization',
      category: 'Denormalization',
      items: [
        {
          title: 'Purpose of denormalization',
          difficulty: 'Easy',
          question: 'Why denormalize in a data warehouse?',
          answer:
            'Improve query performance and simplify BI access by reducing joins and prejoining attributes. Columnar compression offsets storage cost. Accept redundancy in read-only/immutable-ish historical data where update anomalies are rare. Typical in dimensional marts, not OLTP.',
          tags: ['denormalization', 'fundamentals'],
          frequency: 'Very High',
        },
        {
          title: 'Pre-aggregation',
          difficulty: 'Medium',
          question: 'What are aggregate fact tables and when use them?',
          answer:
            'Summary tables at coarser grain (daily sales by store vs line-level). Speed up common dashboards. Maintain via ETL rollup from atomic fact or incremental refresh. Trade flexibility for speed—drill-down may require atomic fact. Match aggregates to known query patterns.',
          tags: ['denormalization', 'aggregation'],
          frequency: 'High',
        },
        {
          title: 'Wide tables in columnar stores',
          difficulty: 'Medium',
          question: 'Why are wide denormalized tables efficient in Snowflake/BigQuery?',
          answer:
            'Columnar storage reads only columns referenced—wide rows do not mean full row scan. Denormalized dims flatten attributes into one table without join penalty. Nested/repeated fields (STRUCT, ARRAY) can model one-to-many without snowflake joins when platform supports it.',
          tags: ['denormalization', 'columnar'],
          frequency: 'High',
        },
        {
          title: 'Risks of denormalization',
          difficulty: 'Medium',
          question: 'What problems can denormalization cause if applied incorrectly?',
          answer:
            'Inconsistent duplicated attributes if ETL sync fails. Increased storage and load times. Harder to propagate source changes. Metric double-counting if grain misunderstood. Mitigate with clear ownership, SCD strategy, and keeping atomic facts as source of truth.',
          tags: ['denormalization', 'risks'],
          frequency: 'High',
        },
        {
          title: 'Materialized views vs denormalized tables',
          difficulty: 'Hard',
          question: 'When use materialized views instead of physical denormalized tables?',
          answer:
            'Materialized views auto-refresh from base tables—good when logic is stable and platform supports incremental refresh. Physical tables offer full control over partitioning, clustering, and load scheduling. Use MVs for simpler rollups; tables for large, curated marts with complex SCD joins.',
          tags: ['denormalization', 'materialized-views'],
          frequency: 'Medium',
        },
      ] satisfies QuestionInput[],
    },
    {
      sheet: 'dm-surrogate-keys',
      category: 'Surrogate Keys',
      items: [
        {
          title: 'Natural vs surrogate key',
          difficulty: 'Easy',
          question: 'What is the difference between natural and surrogate keys?',
          answer:
            'Natural key: business identifier (SSN, email, SKU from source). Surrogate key: system-generated meaningless integer/UUID (customer_key) used in warehouse. Surrogates insulate warehouse from source key changes, support SCD Type 2, and unify disparate sources with conflicting natural keys.',
          tags: ['surrogate-keys', 'fundamentals'],
          frequency: 'Very High',
        },
        {
          title: 'Why not use natural keys in facts',
          difficulty: 'Medium',
          question: 'Why avoid natural keys as primary keys in dimension tables?',
          answer:
            'Natural keys may change (mergers, renumbering), be composite, nullable, or duplicated across systems. Wide string keys bloat fact tables and joins. Surrogate integer keys compress facts and stabilize joins. Always retain natural_key column for traceability and incremental loads.',
          tags: ['surrogate-keys', 'dimensions'],
          frequency: 'Very High',
        },
        {
          title: 'Conformed dimensions',
          difficulty: 'Medium',
          question: 'What makes a dimension conformed?',
          answer:
            'Same dimension definition, grain, and surrogate keys reused across multiple fact tables/marts—one dim_date, one dim_product shared by sales and inventory facts. Enables consistent drill-across and enterprise metrics. Requires governance and centralized dim ETL.',
          tags: ['conformed-dimensions', 'surrogate-keys'],
          frequency: 'Very High',
        },
        {
          title: 'UUID vs integer surrogates',
          difficulty: 'Medium',
          question: 'When choose UUID over integer surrogate keys?',
          answer:
            'UUIDs enable distributed generation without sequence coordination, merge datasets without collision, and obscure row counts. Integers are smaller, faster to join/index, and human-friendly. Many warehouses use auto-increment/bigint; UUID for microservices event dims or multi-region ingestion.',
          tags: ['surrogate-keys', 'uuid'],
          frequency: 'Medium',
        },
        {
          title: 'Late-arriving dimension keys',
          difficulty: 'Hard',
          question: 'How do surrogate keys handle late-arriving dimension rows?',
          answer:
            'Use unknown/not-applicable member (dim_customer_key = -1) on fact until dimension arrives. On dim load, backfill facts or leave historical unknown if policy dictates. Type 2 dims need careful effective dating so facts align to correct version. Hash keys in staging detect matches before surrogate assignment.',
          tags: ['surrogate-keys', 'etl'],
          frequency: 'High',
        },
      ] satisfies QuestionInput[],
    },
    {
      sheet: 'dm-dwh-design',
      category: 'Data Warehouse Design',
      items: [
        {
          title: 'Kimball vs Inmon',
          difficulty: 'Medium',
          question: 'Compare Kimball and Inmon warehouse architecture approaches.',
          answer:
            'Kimball: dimensional modeling first, bus architecture with conformed dims, marts deployed incrementally, star schemas at presentation layer. Inmon: enterprise data warehouse as normalized 3NF hub first, then departmental data marts derived. Kimball faster time-to-value; Inmon stronger enterprise consistency—often blended in practice.',
          tags: ['kimball', 'inmon', 'architecture'],
          frequency: 'Very High',
        },
        {
          title: 'Medallion architecture',
          difficulty: 'Medium',
          question: 'Explain bronze/silver/gold (medallion) layering.',
          answer:
            'Bronze: raw ingest, schema-on-read, minimal transforms. Silver: cleansed, conformed, deduplicated, business keys applied. Gold: aggregated dimensional marts and metrics for BI/ML. Each layer adds quality and semantic consistency. Common in lakehouse (Delta, Databricks).',
          tags: ['medallion', 'architecture'],
          frequency: 'Very High',
        },
        {
          title: 'Staging area role',
          difficulty: 'Easy',
          question: 'What is the staging layer and why is it needed?',
          answer:
            'Landing zone between source and warehouse—extract raw copies, apply cleansing, data type casting, dedup, and audit columns (load_timestamp, source_system). Isolates source from transform failures; enables reprocessing. Often ephemeral or retained for compliance window.',
          tags: ['staging', 'etl'],
          frequency: 'High',
        },
        {
          title: 'Data marts vs enterprise DW',
          difficulty: 'Medium',
          question: 'What is a data mart and how does it relate to an enterprise warehouse?',
          answer:
            'Subject-area focused subset (finance mart, marketing mart) optimized for specific consumers. Dependent mart sourced from enterprise DW; independent mart built directly from sources (faster but silo risk). Conformed dimensions link marts for enterprise reporting.',
          tags: ['data-mart', 'architecture'],
          frequency: 'High',
        },
        {
          title: 'Enterprise bus matrix',
          difficulty: 'Hard',
          question: 'What is a Kimball bus matrix?',
          answer:
            'Grid mapping business processes (rows) to conformed dimensions (columns). Checkmarks show which dims apply to each fact. Guides incremental warehouse rollout—implement shared dims first, then facts process by process. Communication tool for prioritizing conformed integration.',
          tags: ['kimball', 'bus-matrix'],
          frequency: 'Medium',
        },
      ] satisfies QuestionInput[],
    },
    {
      sheet: 'dm-scenarios',
      category: 'Scenario Questions',
      items: [
        {
          title: 'Model subscription business',
          difficulty: 'Hard',
          question: 'How would you model a SaaS subscription business for MRR reporting?',
          answer:
            'Fact: f_subscription_snapshot monthly grain (account_key, date_key, mrr_amount, plan_key, status). Type 2 dim_account for segment changes. dim_plan for pricing tiers. Transaction fact for upgrades/downgrades/churn events. Semi-additive MRR—sum across accounts at month end, not across months. Bridge if multi-account billing.',
          tags: ['scenarios', 'saas'],
          frequency: 'Very High',
        },
        {
          title: 'Handling merged companies',
          difficulty: 'Hard',
          question: 'Two companies merge—customer IDs overlap. How do you model in the warehouse?',
          answer:
            'Assign enterprise surrogate keys; map legacy natural keys in xref table (source_system, legacy_id → enterprise_customer_key). Type 2 dim for merged entity history. Rewire facts during cutover or maintain source-specific keys until unified. Document overlap resolution rules and effective dates.',
          tags: ['scenarios', 'integration'],
          frequency: 'High',
        },
        {
          title: 'Clickstream + transactions',
          difficulty: 'Hard',
          question: 'Design models linking web clickstream to purchase transactions.',
          answer:
            'Separate facts: f_click_event (session_key, page_key, timestamp) and f_order (order grain). Shared conformed dims: dim_customer (anonymous_id → known_id stitching), dim_product, dim_campaign. Bridge or attribution fact for multi-touch models. Different grains—join through customer/session with time window rules, avoid naive fan-out joins.',
          tags: ['scenarios', 'clickstream'],
          frequency: 'High',
        },
        {
          title: 'Currency conversion modeling',
          difficulty: 'Medium',
          question: 'How do you model multi-currency sales for global reporting?',
          answer:
            'Store amount_local and currency_code on fact; join dim_exchange_rate by date and currency to derive amount_usd (or report currency). Use rate type (daily close, monthly avg) consistently. Never sum mixed currencies without conversion. Type 1 rate dim if only current needed; date-keyed rates for history.',
          tags: ['scenarios', 'currency'],
          frequency: 'High',
        },
        {
          title: 'Real-time vs batch dimensions',
          difficulty: 'Medium',
          question: 'A dimension must reflect near-real-time changes for ops dashboards—what do you change?',
          answer:
            'Type 1 updates or micro-batch dim refreshes; consider streaming CDC into dim table. Accept brief inconsistency between fact (streaming) and dim (lagging). For critical attrs, embed degenerate snapshot on fact at event time. Separate operational datamart from historical Type 2 warehouse if SLAs conflict.',
          tags: ['scenarios', 'real-time'],
          frequency: 'Medium',
        },
      ] satisfies QuestionInput[],
    },
  ],
  1700,
)
