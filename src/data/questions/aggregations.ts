import type { SqlQuestion } from '../../types'

type Q = Omit<SqlQuestion, 'id' | 'sheet' | 'category' | 'module'>

const sheet = 'aggregations'
const category = 'Aggregations & GROUP BY'

const items: Q[] = [
  {
    title: 'Aggregate functions overview',
    difficulty: 'Easy',
    question: 'List common aggregate functions and their purpose.',
    answer: 'COUNT counts rows (COUNT(*) counts all including NULLs; COUNT(col) skips NULLs). SUM, AVG, MIN, MAX operate on numeric columns. Aggregates collapse multiple rows into one summary row per group.',
  },
  {
    title: 'GROUP BY basics',
    difficulty: 'Easy',
    question: 'Find total salary spend per department.',
    answer: 'GROUP BY splits rows into groups sharing the same values. Aggregates compute per group. Every non-aggregated SELECT column must appear in GROUP BY (in strict SQL mode).',
    example: 'SELECT dept_id, SUM(salary) AS total_salary\nFROM employees\nGROUP BY dept_id;',
  },
  {
    title: 'HAVING vs WHERE',
    difficulty: 'Medium',
    question: 'Difference between HAVING and WHERE?',
    answer: 'WHERE filters rows before grouping. HAVING filters groups after aggregation. Use HAVING for conditions on aggregate results like COUNT(*) > 5.',
    example: 'SELECT dept_id, AVG(salary) AS avg_sal\nFROM employees\nGROUP BY dept_id\nHAVING AVG(salary) > 60000;',
  },
  {
    title: 'COUNT distinct',
    difficulty: 'Medium',
    question: 'Count unique customers who placed orders.',
    answer: 'COUNT(DISTINCT column) counts unique non-NULL values. Useful for deduplicated metrics.',
    example: 'SELECT COUNT(DISTINCT customer_id) FROM orders;',
  },
  {
    title: 'GROUP BY multiple columns',
    difficulty: 'Medium',
    question: 'Find order count by year and month.',
    answer: 'Grouping by multiple columns creates finer-grained buckets. Extract date parts with YEAR(), MONTH(), or DATE_TRUNC.',
    example: "SELECT DATE_TRUNC('month', order_date) AS month, COUNT(*)\nFROM orders\nGROUP BY 1\nORDER BY 1;",
  },
  {
    title: 'Filtering groups with HAVING COUNT',
    difficulty: 'Medium',
    question: 'Find customers with more than 3 orders.',
    answer: 'Group by customer_id, count orders, filter with HAVING.',
    example: 'SELECT customer_id, COUNT(*) AS order_count\nFROM orders\nGROUP BY customer_id\nHAVING COUNT(*) > 3;',
  },
  {
    title: 'ROLLUP',
    difficulty: 'Hard',
    question: 'What does GROUP BY ROLLUP do?',
    answer: 'ROLLUP generates subtotals and a grand total by progressively removing grouping columns from right to left. Useful for hierarchical reports.',
    example: 'SELECT dept_id, job_title, SUM(salary)\nFROM employees\nGROUP BY ROLLUP(dept_id, job_title);',
  },
  {
    title: 'CUBE',
    difficulty: 'Hard',
    question: 'Explain GROUP BY CUBE.',
    answer: 'CUBE generates all possible grouping combinations of the specified columns, including subtotals at every level. More comprehensive than ROLLUP but more rows.',
  },
  {
    title: 'GROUPING SETS',
    difficulty: 'Hard',
    question: 'What are GROUPING SETS?',
    answer: 'GROUPING SETS lets you specify multiple group-by combinations in one query, equivalent to UNION ALL of separate grouped queries but more efficient.',
  },
  {
    title: 'Average with NULL',
    difficulty: 'Medium',
    question: 'How does AVG handle NULL values?',
    answer: 'AVG ignores NULLs—it divides sum of non-null values by count of non-null values, not total row count. Use COALESCE or FILTER if you need different behavior.',
  },
  {
    title: 'Conditional aggregation',
    difficulty: 'Medium',
    question: 'Count active vs inactive users in one query.',
    answer: 'Use conditional aggregates: SUM(CASE WHEN status = \'active\' THEN 1 ELSE 0 END) or COUNT(*) FILTER (WHERE status = \'active\') in PostgreSQL.',
    example: "SELECT\n  SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active,\n  SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) AS inactive\nFROM users;",
  },
  {
    title: 'Percent of total',
    difficulty: 'Hard',
    question: 'Calculate each department salary as percentage of company total.',
    answer: 'Use window function SUM() OVER() for total, or subquery for company total, then divide group sum by total * 100.',
    example: 'SELECT dept_id, SUM(salary) AS dept_total,\n  100.0 * SUM(salary) / SUM(SUM(salary)) OVER() AS pct\nFROM employees GROUP BY dept_id;',
  },
  {
    title: 'Top N per group',
    difficulty: 'Hard',
    question: 'Find top 3 salaries in each department.',
    answer: 'Use ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) in a subquery/CTE, filter rn <= 3.',
    example: 'WITH ranked AS (\n  SELECT *, ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) rn\n  FROM employees\n)\nSELECT * FROM ranked WHERE rn <= 3;',
  },
  {
    title: 'Median in SQL',
    difficulty: 'Hard',
    question: 'How do you calculate median salary?',
    answer: 'PostgreSQL has PERCENTILE_CONT(0.5). Other engines use ROW_NUMBER approach or approximate functions. Median is not a built-in aggregate in standard SQL.',
    example: 'SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary) FROM employees;',
  },
  {
    title: 'Running total with SUM OVER',
    difficulty: 'Medium',
    question: 'Calculate running total of daily sales.',
    answer: 'Window SUM with ORDER BY creates a running total. Default frame is RANGE UNBOUNDED PRECEDING to current row.',
    example: 'SELECT order_date, amount,\n  SUM(amount) OVER (ORDER BY order_date) AS running_total\nFROM daily_sales;',
  },
  {
    title: 'Pivot without PIVOT',
    difficulty: 'Hard',
    question: 'Pivot sales by product category into columns using CASE.',
    answer: 'Conditional aggregation with GROUP BY: SUM(CASE WHEN category = X THEN amount END) for each column. Native PIVOT exists in SQL Server and Oracle.',
    example: 'SELECT region,\n  SUM(CASE WHEN category = \'Electronics\' THEN amount END) AS electronics,\n  SUM(CASE WHEN category = \'Books\' THEN amount END) AS books\nFROM sales GROUP BY region;',
  },
  {
    title: 'Duplicate detection with GROUP BY',
    difficulty: 'Medium',
    question: 'Find email addresses that appear more than once.',
    answer: 'GROUP BY email HAVING COUNT(*) > 1 finds duplicates. Use MIN(id) or ROW_NUMBER to pick rows to keep when deduplicating.',
    example: 'SELECT email, COUNT(*) FROM users\nGROUP BY email HAVING COUNT(*) > 1;',
  },
]

export const aggregationsQuestions: SqlQuestion[] = items.map((item, i) => ({
  ...item,
  id: 200 + i + 1,
  module: 'sql',
  sheet,
  category,
}))
