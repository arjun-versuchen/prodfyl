import type { SqlQuestion } from '../../types'

type Q = Omit<SqlQuestion, 'id' | 'sheet' | 'category' | 'module'>

const sheet = 'practical-challenges'
const category = 'Practical Query Challenges'

const items: Q[] = [
  {
    title: 'Second highest salary',
    difficulty: 'Medium',
    question: 'Write a query to find the second highest salary.',
    answer: 'Options: subquery with MAX excluding top, DENSE_RANK = 2, OFFSET 1 LIMIT 1 with ORDER BY DESC. Handle ties and empty results.',
    example: 'SELECT MAX(salary) FROM employees\nWHERE salary < (SELECT MAX(salary) FROM employees);',
  },
  {
    title: 'Nth highest salary',
    difficulty: 'Hard',
    question: 'Find the Nth highest salary (parameterized).',
    answer: 'Use DENSE_RANK or OFFSET (N-1) LIMIT 1. OFFSET approach: ORDER BY salary DESC OFFSET N-1 LIMIT 1.',
    example: 'SELECT DISTINCT salary FROM employees\nORDER BY salary DESC\nOFFSET 2 LIMIT 1;  -- 3rd highest',
  },
  {
    title: 'Duplicate emails',
    difficulty: 'Easy',
    question: 'Delete duplicate emails keeping the row with smallest id.',
    answer: 'Identify duplicates with GROUP BY or ROW_NUMBER, delete where rn > 1. Always test in transaction first.',
    example: 'DELETE FROM users WHERE id NOT IN (\n  SELECT MIN(id) FROM users GROUP BY email\n);',
  },
  {
    title: 'Consecutive login days',
    difficulty: 'Hard',
    question: 'Find users with 3 or more consecutive login days.',
    answer: 'Island problem: login_date - ROW_NUMBER() days gives constant group id for consecutive streaks. Group and count.',
    example: 'WITH streaks AS (\n  SELECT user_id, login_date,\n    login_date - (ROW_NUMBER() OVER (\n      PARTITION BY user_id ORDER BY login_date\n    ))::int AS grp\n  FROM logins\n)\nSELECT user_id, COUNT(*) FROM streaks\nGROUP BY user_id, grp HAVING COUNT(*) >= 3;',
  },
  {
    title: 'Monthly active users',
    difficulty: 'Medium',
    question: 'Calculate monthly active users (MAU) from an events table.',
    answer: 'COUNT(DISTINCT user_id) grouped by month of event_timestamp. Use DATE_TRUNC for month boundaries.',
    example: "SELECT DATE_TRUNC('month', event_time) AS month,\n  COUNT(DISTINCT user_id) AS mau\nFROM events\nGROUP BY 1 ORDER BY 1;",
  },
  {
    title: 'Year-over-year growth',
    difficulty: 'Hard',
    question: 'Calculate YoY revenue growth percentage by month.',
    answer: 'Self-join or LAG on monthly aggregates: (current - previous_year) / previous_year * 100.',
    example: 'SELECT month, revenue,\n  LAG(revenue, 12) OVER (ORDER BY month) AS prev_year,\n  100.0 * (revenue - LAG(revenue, 12) OVER (ORDER BY month))\n    / NULLIF(LAG(revenue, 12) OVER (ORDER BY month), 0) AS yoy_pct\nFROM monthly_revenue;',
  },
  {
    title: 'Customers who bought all products',
    difficulty: 'Hard',
    question: 'Find customers who purchased every product in the catalog.',
    answer: 'Relational division: group by customer, count distinct products equals total products. Or double NOT EXISTS.',
    example: 'SELECT customer_id FROM orders\nGROUP BY customer_id\nHAVING COUNT(DISTINCT product_id) = (SELECT COUNT(*) FROM products);',
  },
  {
    title: 'Running balance',
    difficulty: 'Medium',
    question: 'Calculate running account balance from transactions.',
    answer: 'SUM(amount) OVER (ORDER BY txn_date, id) with credits positive and debits negative.',
    example: 'SELECT txn_date, amount,\n  SUM(amount) OVER (ORDER BY txn_date, id) AS balance\nFROM transactions;',
  },
  {
    title: 'First order date per customer',
    difficulty: 'Easy',
    question: 'Find each customer first order date and total lifetime orders.',
    answer: 'MIN(order_date) and COUNT(*) grouped by customer_id. Or FIRST_VALUE window function.',
    example: 'SELECT customer_id,\n  MIN(order_date) AS first_order,\n  COUNT(*) AS total_orders\nFROM orders\nGROUP BY customer_id;',
  },
  {
    title: 'Products never sold',
    difficulty: 'Easy',
    question: 'List products that have never been sold.',
    answer: 'LEFT JOIN order_items WHERE order_items.id IS NULL, or NOT EXISTS pattern.',
    example: 'SELECT p.* FROM products p\nLEFT JOIN order_items oi ON p.id = oi.product_id\nWHERE oi.id IS NULL;',
  },
  {
    title: 'Department above company average',
    difficulty: 'Medium',
    question: 'Find departments where average salary exceeds company average.',
    answer: 'Compare grouped AVG to scalar subquery or window AVG over entire table.',
    example: 'SELECT dept_id, AVG(salary) AS avg_sal\nFROM employees\nGROUP BY dept_id\nHAVING AVG(salary) > (SELECT AVG(salary) FROM employees);',
  },
  {
    title: 'Sessionization',
    difficulty: 'Hard',
    question: 'Group events into sessions where gap > 30 minutes starts new session.',
    answer: 'Use LAG on timestamp, flag new session when gap > 30 min, cumulative SUM of flags for session_id.',
  },
  {
    title: 'Retention cohort',
    difficulty: 'Hard',
    question: 'Calculate week-1 retention for user signup cohorts.',
    answer: 'Join users to activity on signup_cohort week + 1. Divide retained by cohort size. Classic cohort analysis pattern.',
  },
  {
    title: 'Exchange rows',
    difficulty: 'Medium',
    question: 'Swap values of two columns for all rows (name and nickname).',
    answer: 'Single UPDATE with column swap using temp variable pattern or parallel assignment in UPDATE.',
    example: 'UPDATE employees SET name = nickname, nickname = name;  -- dialect dependent',
  },
  {
    title: 'Hierarchy employee levels',
    difficulty: 'Hard',
    question: 'Count reporting levels from CEO down using recursive CTE.',
    answer: 'Recursive CTE: anchor is CEO (manager_id IS NULL), recursive joins employees to managers incrementing level.',
    example: 'WITH RECURSIVE hierarchy AS (\n  SELECT id, name, 0 AS level FROM employees WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.id, e.name, h.level + 1\n  FROM employees e JOIN hierarchy h ON e.manager_id = h.id\n)\nSELECT * FROM hierarchy;',
  },
  {
    title: 'Top customer per region',
    difficulty: 'Hard',
    question: 'Find the top-spending customer in each region.',
    answer: 'ROW_NUMBER partitioned by region ordered by total spend DESC, filter rn = 1.',
  },
  {
    title: 'Missing IDs in sequence',
    difficulty: 'Medium',
    question: 'Find missing IDs in a sequence 1 to N.',
    answer: 'Generate series with recursive CTE or numbers table, LEFT JOIN to find gaps.',
    example: 'SELECT s.id FROM generate_series(1, (SELECT MAX(id) FROM t)) s\nLEFT JOIN t ON t.id = s.id WHERE t.id IS NULL;',
  },
  {
    title: 'Pivot sales by quarter',
    difficulty: 'Hard',
    question: 'Show Q1-Q4 sales as columns for each year.',
    answer: 'Conditional aggregation with SUM(CASE WHEN quarter = n) or native PIVOT operator.',
  },
  {
    title: 'Active users last 7 days',
    difficulty: 'Easy',
    question: 'Count users active in the last 7 days.',
    answer: 'COUNT(DISTINCT user_id) WHERE last_active >= CURRENT_DATE - 7.',
    example: "SELECT COUNT(DISTINCT user_id) FROM users\nWHERE last_active >= CURRENT_DATE - INTERVAL '7 days';",
  },
  {
    title: 'Revenue by product rank',
    difficulty: 'Medium',
    question: 'Rank products by revenue and show cumulative revenue percentage.',
    answer: 'SUM revenue, RANK by revenue DESC, cumulative SUM / total for Pareto analysis.',
  },
]

export const practicalQuestions: SqlQuestion[] = items.map((item, i) => ({
  ...item,
  id: 500 + i + 1,
  module: 'sql',
  sheet,
  category,
}))
