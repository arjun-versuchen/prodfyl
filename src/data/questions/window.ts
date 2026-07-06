import type { SqlQuestion } from '../../types'

type Q = Omit<SqlQuestion, 'id' | 'sheet' | 'category' | 'module'>

const sheet = 'window-functions'
const category = 'Window Functions'

const items: Q[] = [
  {
    title: 'What are window functions?',
    difficulty: 'Medium',
    question: 'Explain window functions and how they differ from GROUP BY.',
    answer: 'Window functions perform calculations across a set of rows related to the current row without collapsing them into a single output row. GROUP BY reduces rows; window functions add computed columns while preserving row granularity.',
  },
  {
    title: 'OVER clause syntax',
    difficulty: 'Medium',
    question: 'Explain PARTITION BY and ORDER BY in OVER().',
    answer: 'PARTITION BY defines window groups (like GROUP BY but without collapsing). ORDER BY defines sort within the partition for ranking and frame-based functions. Both are optional but commonly used together.',
    example: 'SELECT name, salary,\n  AVG(salary) OVER (PARTITION BY dept_id) AS dept_avg\nFROM employees;',
  },
  {
    title: 'ROW_NUMBER',
    difficulty: 'Medium',
    question: 'Assign unique sequential numbers to rows per department by salary.',
    answer: 'ROW_NUMBER() assigns unique integers even when ties exist. Ties get different numbers based on ORDER BY tie-breaking.',
    example: 'SELECT name, dept_id, salary,\n  ROW_NUMBER() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rn\nFROM employees;',
  },
  {
    title: 'RANK vs DENSE_RANK',
    difficulty: 'Medium',
    question: 'Difference between RANK, DENSE_RANK, and ROW_NUMBER?',
    answer: 'RANK skips numbers after ties (1,1,3). DENSE_RANK does not skip (1,1,2). ROW_NUMBER always unique. Use based on whether tied rows should share rank and whether gaps matter.',
    example: 'SELECT salary,\n  RANK() OVER (ORDER BY salary DESC) AS rnk,\n  DENSE_RANK() OVER (ORDER BY salary DESC) AS dense_rnk\nFROM employees;',
  },
  {
    title: 'NTILE',
    difficulty: 'Medium',
    question: 'Divide employees into 4 salary quartiles.',
    answer: 'NTILE(n) distributes rows into n roughly equal buckets ordered by the specified sort.',
    example: 'SELECT name, salary,\n  NTILE(4) OVER (ORDER BY salary) AS quartile\nFROM employees;',
  },
  {
    title: 'LAG and LEAD',
    difficulty: 'Medium',
    question: 'Compare each month sales to previous and next month.',
    answer: 'LAG accesses a prior row; LEAD accesses a following row within the partition. Useful for period-over-period analysis.',
    example: 'SELECT month, revenue,\n  LAG(revenue) OVER (ORDER BY month) AS prev_month,\n  LEAD(revenue) OVER (ORDER BY month) AS next_month\nFROM monthly_revenue;',
  },
  {
    title: 'FIRST_VALUE and LAST_VALUE',
    difficulty: 'Hard',
    question: 'Get the highest salary in each department on every row.',
    answer: 'FIRST_VALUE/LAST_VALUE with ORDER BY in OVER clause. Mind the frame specification—default frame may not include full partition for LAST_VALUE.',
    example: 'SELECT name, dept_id, salary,\n  FIRST_VALUE(salary) OVER (\n    PARTITION BY dept_id ORDER BY salary DESC\n  ) AS top_salary\nFROM employees;',
  },
  {
    title: 'Running average',
    difficulty: 'Medium',
    question: 'Calculate 7-day moving average of daily users.',
    answer: 'Use AVG() OVER with ROWS BETWEEN 6 PRECEDING AND CURRENT ROW for a sliding window frame.',
    example: 'SELECT day, users,\n  AVG(users) OVER (\n    ORDER BY day\n    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW\n  ) AS moving_avg_7d\nFROM daily_users;',
  },
  {
    title: 'Window frame specification',
    difficulty: 'Hard',
    question: 'Explain ROWS vs RANGE in window frames.',
    answer: 'ROWS uses physical row offsets. RANGE uses logical value ranges based on ORDER BY expression (peers with equal sort keys). ROWS is more predictable for moving averages.',
  },
  {
    title: 'Dedup with ROW_NUMBER',
    difficulty: 'Hard',
    question: 'Keep only the latest order per customer.',
    answer: 'ROW_NUMBER partitioned by customer ordered by date DESC, filter rn = 1. Alternative: DISTINCT ON in PostgreSQL or GROUP BY with MAX(date).',
    example: 'WITH ranked AS (\n  SELECT *, ROW_NUMBER() OVER (\n    PARTITION BY customer_id ORDER BY order_date DESC\n  ) rn FROM orders\n)\nSELECT * FROM ranked WHERE rn = 1;',
  },
  {
    title: 'Percent rank',
    difficulty: 'Medium',
    question: 'What does PERCENT_RANK return?',
    answer: 'PERCENT_RANK returns relative rank as (rank - 1) / (total_rows - 1), a value from 0 to 1 showing percentile position within the partition.',
  },
  {
    title: 'Cumulative distribution',
    difficulty: 'Hard',
    question: 'Explain CUME_DIST.',
    answer: 'CUME_DIST (cumulative distribution) returns the proportion of partition values less than or equal to the current value. Useful for percentile bucket analysis.',
  },
  {
    title: 'Window functions in WHERE',
    difficulty: 'Medium',
    question: 'Can you use window functions directly in WHERE?',
    answer: 'No. Window functions execute after WHERE. Wrap in a subquery or CTE, then filter the computed column in the outer query.',
  },
  {
    title: 'SUM OVER PARTITION',
    difficulty: 'Medium',
    question: 'Show each employee salary and department total side by side.',
    answer: 'SUM(salary) OVER (PARTITION BY dept_id) computes department total on every employee row without GROUP BY collapse.',
    example: 'SELECT name, salary,\n  SUM(salary) OVER (PARTITION BY dept_id) AS dept_total\nFROM employees;',
  },
  {
    title: 'Gap and island problems',
    difficulty: 'Hard',
    question: 'What are gap and island problems in SQL?',
    answer: 'Islands are consecutive groups of rows (e.g., consecutive login days). Gaps are missing values in sequences. Solved with ROW_NUMBER tricks: grp = date - ROW_NUMBER days, then GROUP BY grp.',
  },
]

export const windowQuestions: SqlQuestion[] = items.map((item, i) => ({
  ...item,
  id: 300 + i + 1,
  module: 'sql',
  sheet,
  category,
}))
