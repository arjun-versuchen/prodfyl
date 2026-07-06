import type { SqlQuestion } from '../../types'

type Q = Omit<SqlQuestion, 'id' | 'sheet' | 'category' | 'module'>

const sheet = 'sql-master-sheet'
const category = 'SQL Master Sheet'

const items: Q[] = [
  {
    title: 'Most asked: Second highest salary',
    difficulty: 'Medium',
    question: 'Find the second highest salary in the employees table.',
    answer: 'Classic interview question. Use subquery, DENSE_RANK, or LIMIT OFFSET. Discuss tie handling and NULL when fewer than 2 rows.',
    example: 'SELECT MAX(salary) FROM employees\nWHERE salary < (SELECT MAX(salary) FROM employees);',
    tags: ['faang', 'must-know'],
    notes: 'Premium tip: Interviewers often follow up asking how you handle duplicate top salaries — mention DENSE_RANK vs ROW_NUMBER.',
  },
  {
    title: 'Most asked: Department top earners',
    difficulty: 'Hard',
    question: 'Return employees who earn the maximum salary in their department.',
    answer: 'Correlated subquery, window RANK, or JOIN to grouped MAX. Window approach is clean and handles ties with RANK vs ROW_NUMBER choice.',
    example: 'SELECT * FROM (\n  SELECT *, RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) r\n  FROM employees\n) t WHERE r = 1;',
    tags: ['faang', 'must-know'],
    notes: 'Company-wise favorite at Amazon and Flipkart data interviews. Always state tie-breaking behavior aloud.',
  },
  {
    title: 'Most asked: Duplicate removal',
    difficulty: 'Medium',
    question: 'Remove duplicate rows from a table without a unique key.',
    answer: 'Use ROW_NUMBER with PARTITION BY duplicate-defining columns, delete rn > 1. Prefer adding unique constraint afterward to prevent recurrence.',
    tags: ['faang', 'must-know'],
  },
  {
    title: 'Most asked: JOIN vs subquery',
    difficulty: 'Medium',
    question: 'When do you prefer JOIN over subquery?',
    answer: 'JOINs often optimize better for large datasets and are clearer for multi-table relationships. Subqueries excel for scalar lookups, EXISTS checks, and readable filtering. Modern optimizers often rewrite equivalently—readability and plan matter.',
    tags: ['conceptual'],
  },
  {
    title: 'Most asked: Index when to add',
    difficulty: 'Medium',
    question: 'Which columns should you index?',
    answer: 'Columns in WHERE, JOIN ON, ORDER BY with high cardinality. Avoid indexing low-cardinality flags alone. Composite indexes matching query filter order. Monitor with EXPLAIN.',
    tags: ['conceptual'],
  },
  {
    title: 'Most asked: DELETE vs TRUNCATE',
    difficulty: 'Medium',
    question: 'Difference between DELETE, TRUNCATE, and DROP?',
    answer: 'DELETE removes rows with optional WHERE, row-by-row, triggers fire, can rollback. TRUNCATE removes all rows fast, resets identity, minimal logging in some engines. DROP removes table structure entirely.',
    tags: ['conceptual'],
  },
  {
    title: 'Most asked: CTE explained',
    difficulty: 'Medium',
    question: 'What is a Common Table Expression (CTE)?',
    answer: 'Named temporary result set defined with WITH clause, referenced in main query. Improves readability. Recursive CTEs handle hierarchies. In PostgreSQL 12+, can be inlined or materialized.',
    example: 'WITH high_earners AS (\n  SELECT * FROM employees WHERE salary > 100000\n)\nSELECT * FROM high_earners WHERE dept_id = 5;',
    tags: ['must-know'],
  },
  {
    title: 'Most asked: INNER vs LEFT JOIN choice',
    difficulty: 'Easy',
    question: 'When to use LEFT JOIN instead of INNER JOIN?',
    answer: 'When you need all rows from the preserved (left) table even without matches—finding missing relationships, optional data, counts including zero.',
    tags: ['must-know'],
  },
  {
    title: 'Most asked: WHERE vs HAVING',
    difficulty: 'Easy',
    question: 'Filter groups with average order value > 100.',
    answer: 'Must use HAVING after GROUP BY because WHERE cannot reference aggregates.',
    example: 'SELECT customer_id, AVG(order_value) avg_val\nFROM orders GROUP BY customer_id\nHAVING AVG(order_value) > 100;',
    tags: ['must-know'],
  },
  {
    title: 'Most asked: NULL in aggregates',
    difficulty: 'Medium',
    question: 'How many rows does COUNT(*) vs COUNT(column) return for a table with NULLs?',
    answer: 'COUNT(*) counts all rows. COUNT(col) counts non-NULL values only. Important for accurate reporting metrics.',
    tags: ['must-know'],
  },
  {
    title: 'Most asked: Self join manager chain',
    difficulty: 'Medium',
    question: 'List employees with their direct manager name.',
    answer: 'Self join on manager_id = id. LEFT JOIN if top-level has no manager.',
    example: 'SELECT e.name, m.name AS manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id;',
    tags: ['faang'],
  },
  {
    title: 'Most asked: Running total interview',
    difficulty: 'Medium',
    question: 'Compute cumulative sales by date.',
    answer: 'Window SUM OVER (ORDER BY date). Frequently tested to assess window function knowledge.',
    example: 'SELECT date, amount,\n  SUM(amount) OVER (ORDER BY date) AS cumulative\nFROM sales;',
    tags: ['faang'],
  },
  {
    title: 'Most asked: Find gaps in dates',
    difficulty: 'Hard',
    question: 'Find dates with no sales in a daily sales table.',
    answer: 'Generate date series, LEFT JOIN sales, filter NULL. Tests date generation and anti-join patterns.',
    tags: ['faang'],
  },
  {
    title: 'Most asked: Optimistic vs pessimistic locking',
    difficulty: 'Hard',
    question: 'Explain optimistic and pessimistic concurrency control.',
    answer: 'Pessimistic: lock rows upfront (SELECT FOR UPDATE). Optimistic: version column checked at update time; conflict fails transaction. Optimistic scales better for low contention.',
    tags: ['conceptual'],
  },
  {
    title: 'Most asked: Explain execution plan',
    difficulty: 'Hard',
    question: 'What do Seq Scan, Index Scan, and Nested Loop mean in EXPLAIN output?',
    answer: 'Seq Scan: full table read. Index Scan: uses index to find rows. Nested Loop: for each outer row, scan inner (OK for small sets). Hash Join: builds hash table. Merge Join: sorted merge. Cost estimates guide optimization.',
    tags: ['conceptual'],
  },
  {
    title: 'Most asked: VARCHAR vs CHAR',
    difficulty: 'Easy',
    question: 'Difference between CHAR and VARCHAR?',
    answer: 'CHAR is fixed-length, padded with spaces. VARCHAR is variable length with length limit. VARCHAR saves space for variable data; CHAR can be faster for fixed-size codes.',
    tags: ['conceptual'],
  },
  {
    title: 'Most asked: COMMIT and ROLLBACK',
    difficulty: 'Easy',
    question: 'Explain COMMIT and ROLLBACK.',
    answer: 'COMMIT persists transaction changes. ROLLBACK undoes all changes since transaction start. ACID durability applies after successful COMMIT.',
    tags: ['conceptual'],
  },
  {
    title: 'Most asked: Schema vs Database',
    difficulty: 'Easy',
    question: 'Difference between database and schema?',
    answer: 'Database is the top-level container (server instance may host multiple). Schema is a namespace within a database grouping tables, views, procedures. MySQL uses database/schema interchangeably; PostgreSQL distinguishes them.',
    tags: ['conceptual'],
  },
]

export const masterQuestions: SqlQuestion[] = items.map((item, i) => ({
  ...item,
  id: 600 + i + 1,
  module: 'sql',
  sheet,
  category,
}))
