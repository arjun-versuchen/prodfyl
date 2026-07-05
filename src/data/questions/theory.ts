import type { SqlQuestion } from '../../types'

type Q = Omit<SqlQuestion, 'id' | 'sheet' | 'category'>

const sheet = 'database-theory'
const category = 'Database Design & Theory'

const items: Q[] = [
  {
    title: 'ACID properties',
    difficulty: 'Medium',
    question: 'Explain ACID in database transactions.',
    answer: 'Atomicity: all or nothing. Consistency: valid state before and after. Isolation: concurrent transactions do not interfere improperly. Durability: committed data survives crashes. Foundation of reliable transactional systems.',
  },
  {
    title: 'Transaction isolation levels',
    difficulty: 'Hard',
    question: 'Name isolation levels and associated anomalies.',
    answer: 'Read Uncommitted (dirty reads). Read Committed (non-repeatable reads). Repeatable Read (phantom reads in some engines). Serializable (full isolation, slowest). PostgreSQL default is Read Committed; MySQL InnoDB default Repeatable Read.',
  },
  {
    title: 'Normalization 1NF',
    difficulty: 'Medium',
    question: 'What is First Normal Form (1NF)?',
    answer: 'Each column holds atomic (indivisible) values; no repeating groups or arrays in cells; each row is unique. Eliminates multi-valued attributes in single columns.',
  },
  {
    title: 'Normalization 2NF and 3NF',
    difficulty: 'Medium',
    question: 'Explain 2NF and 3NF.',
    answer: '2NF: 1NF plus no partial dependency on composite primary key (non-key attrs depend on full key). 3NF: 2NF plus no transitive dependency (non-key attrs depend only on primary key, not other non-key attrs).',
  },
  {
    title: 'BCNF',
    difficulty: 'Hard',
    question: 'What is Boyce-Codd Normal Form?',
    answer: 'Every determinant is a candidate key. Stricter than 3NF. Resolves anomalies when multiple overlapping candidate keys exist.',
  },
  {
    title: 'Denormalization',
    difficulty: 'Medium',
    question: 'When would you denormalize a schema?',
    answer: 'Denormalization duplicates data to improve read performance and simplify queries—common in analytics, reporting, and high-read systems. Trade-off: update anomalies and storage cost. Use intentionally with clear ownership of duplicated data.',
  },
  {
    title: 'Primary vs Foreign Key',
    difficulty: 'Easy',
    question: 'Explain primary and foreign keys.',
    answer: 'Primary key uniquely identifies a row. Foreign key references a primary/unique key in another table, enforcing referential integrity. ON DELETE CASCADE/SET NULL controls parent deletion behavior.',
  },
  {
    title: 'Clustered vs Non-clustered index',
    difficulty: 'Hard',
    question: 'Difference between clustered and non-clustered indexes?',
    answer: 'Clustered index determines physical row order (one per table in SQL Server). Non-clustered index is separate structure with pointers to data. In PostgreSQL, primary key creates a B-tree index; heap storage is separate.',
  },
  {
    title: 'B-Tree index',
    difficulty: 'Medium',
    question: 'How does a B-Tree index work?',
    answer: 'Balanced tree structure enabling O(log n) lookups, range scans, and ordered retrieval. Default index type in most RDBMS. Good for equality and range queries on indexed columns.',
  },
  {
    title: 'Composite index',
    difficulty: 'Medium',
    question: 'How does column order matter in composite indexes?',
    answer: 'Leftmost prefix rule: index (a, b, c) helps queries filtering on a, or a+b, or a+b+c—not b alone. Put most selective or most filtered columns first based on query patterns.',
  },
  {
    title: 'Covering index',
    difficulty: 'Hard',
    question: 'What is a covering index?',
    answer: 'An index containing all columns needed by a query, allowing index-only scans without touching the table heap. INCLUDE columns (SQL Server) or index-only scans (PostgreSQL) reduce I/O dramatically.',
  },
  {
    title: 'Index trade-offs',
    difficulty: 'Medium',
    question: 'What are downsides of too many indexes?',
    answer: 'Indexes speed reads but slow writes (INSERT/UPDATE/DELETE must update indexes), consume storage, and require maintenance. Index only columns used in WHERE, JOIN, ORDER BY with high selectivity.',
  },
  {
    title: 'View vs Materialized View',
    difficulty: 'Medium',
    question: 'Difference between view and materialized view?',
    answer: 'A view is a stored query executed at read time—always fresh. Materialized view stores results physically—faster reads but stale until refreshed. Used in warehouses and reporting.',
  },
  {
    title: 'Stored procedure',
    difficulty: 'Medium',
    question: 'What are stored procedures and their benefits?',
    answer: 'Precompiled SQL logic stored in the database. Benefits: reduced network traffic, centralized business logic, security (grant execute not table access). Drawbacks: harder to version control and test.',
  },
  {
    title: 'Trigger',
    difficulty: 'Medium',
    question: 'What is a database trigger?',
    answer: 'Automatic code firing on INSERT/UPDATE/DELETE events. Used for auditing, denormalized updates, validation. Can make debugging hard—use sparingly.',
  },
  {
    title: 'Deadlock',
    difficulty: 'Hard',
    question: 'What is a deadlock and how is it resolved?',
    answer: 'Two transactions wait for each other locks indefinitely. DBMS detects and aborts one victim transaction. Prevent with consistent lock ordering, shorter transactions, appropriate isolation levels.',
  },
  {
    title: 'CAP theorem',
    difficulty: 'Hard',
    question: 'Explain CAP theorem briefly.',
    answer: 'Distributed systems can guarantee at most two of: Consistency (all nodes see same data), Availability (every request gets response), Partition tolerance (works despite network splits). SQL databases traditionally favor CP or CA in single-node setups.',
  },
  {
    title: 'SQL vs NoSQL',
    difficulty: 'Medium',
    question: 'When choose SQL vs NoSQL?',
    answer: 'SQL: structured data, ACID transactions, complex joins, strong consistency. NoSQL: flexible schema, horizontal scale, high write throughput, document/graph/key-value models. Many systems use both (polyglot persistence).',
  },
  {
    title: 'ER modeling',
    difficulty: 'Medium',
    question: 'Explain entities, attributes, and relationships in ER diagrams.',
    answer: 'Entities are objects (Customer, Order). Attributes are properties. Relationships connect entities (one-to-many, many-to-many via junction table). Cardinality and optionality guide schema design.',
  },
  {
    title: 'Slow query investigation',
    difficulty: 'Hard',
    question: 'How do you debug a slow SQL query?',
    answer: 'Use EXPLAIN/EXPLAIN ANALYZE for execution plan. Check missing indexes, full table scans, bad join order, stale statistics, functions on indexed columns, SELECT *, and N+1 patterns. Monitor with query logs and APM tools.',
    example: 'EXPLAIN ANALYZE\nSELECT * FROM orders WHERE customer_id = 42;',
  },
]

export const theoryQuestions: SqlQuestion[] = items.map((item, i) => ({
  ...item,
  id: 400 + i + 1,
  sheet,
  category,
}))
