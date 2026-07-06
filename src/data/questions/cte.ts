import type { SqlQuestion } from '../../types'

type Q = Omit<SqlQuestion, 'id' | 'sheet' | 'category' | 'module'>

const sheet = 'joins-subqueries'
const category = 'CTEs & Advanced SQL'

const items: Q[] = [
  {
    title: 'CTE basics',
    difficulty: 'Medium',
    question: 'Rewrite a subquery using a CTE for better readability.',
    answer: 'WITH clause names intermediate results. Same performance as subquery in most optimizers but clearer for multi-step logic.',
    example: 'WITH dept_avg AS (\n  SELECT dept_id, AVG(salary) avg_sal FROM employees GROUP BY dept_id\n)\nSELECT e.name, e.salary, d.avg_sal\nFROM employees e\nJOIN dept_avg d ON e.dept_id = d.dept_id\nWHERE e.salary > d.avg_sal;',
  },
  {
    title: 'Multiple CTEs',
    difficulty: 'Medium',
    question: 'Chain multiple CTEs in one query.',
    answer: 'Define multiple comma-separated CTEs in WITH. Later CTEs can reference earlier ones. Final SELECT uses any CTE.',
  },
  {
    title: 'Recursive CTE',
    difficulty: 'Hard',
    question: 'Use recursive CTE to traverse an org chart.',
    answer: 'Anchor member selects root. Recursive member joins table to CTE until no new rows. UNION ALL combines them. Add depth limit to prevent infinite loops on cycles.',
    example: 'WITH RECURSIVE org AS (\n  SELECT id, name, manager_id, 1 AS depth\n  FROM employees WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.id, e.name, e.manager_id, o.depth + 1\n  FROM employees e JOIN org o ON e.manager_id = o.id\n)\nSELECT * FROM org;',
  },
  {
    title: 'CTE vs temp table',
    difficulty: 'Medium',
    question: 'When use CTE vs temporary table?',
    answer: 'CTEs are query-scoped and not stored physically (unless materialized). Temp tables persist for session, have statistics and indexes—better for large intermediate results reused multiple times.',
  },
  {
    title: 'MERGE / UPSERT',
    difficulty: 'Hard',
    question: 'Insert or update if exists—how?',
    answer: 'PostgreSQL: INSERT ON CONFLICT DO UPDATE. MySQL: INSERT ON DUPLICATE KEY UPDATE. SQL Server: MERGE statement. Idempotent data loading pattern.',
    example: 'INSERT INTO users (id, name) VALUES (1, \'Alice\')\nON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;',
  },
  {
    title: 'Dynamic SQL risks',
    difficulty: 'Medium',
    question: 'What is SQL injection and how to prevent it?',
    answer: 'Untrusted input concatenated into SQL allows malicious queries. Prevent with parameterized queries/prepared statements, ORM escaping, least privilege DB users, input validation.',
  },
  {
    title: 'EXPLAIN ANALYZE',
    difficulty: 'Medium',
    question: 'What does EXPLAIN ANALYZE show?',
    answer: 'Actual execution plan with real row counts and timing (PostgreSQL). Compare estimated vs actual rows to diagnose bad statistics. Run on production-like data for accuracy.',
  },
  {
    title: 'Partial index',
    difficulty: 'Hard',
    question: 'What is a partial index?',
    answer: 'Index with WHERE clause indexing subset of rows. Smaller, faster for queries matching the predicate—e.g., index only active users WHERE status = active.',
  },
  {
    title: 'JSON in SQL',
    difficulty: 'Medium',
    question: 'Query JSON column for a nested field.',
    answer: 'PostgreSQL: column->>\'key\' or jsonb_path_query. MySQL: JSON_EXTRACT. Enables semi-structured data without full NoSQL migration.',
    example: "SELECT data->>'city' AS city FROM users\nWHERE data->>'country' = 'India';",
  },
  {
    title: 'Common Table Expression materialization',
    difficulty: 'Hard',
    question: 'Can a CTE be evaluated multiple times?',
    answer: 'In PostgreSQL before v12, CTEs were optimization fences (always materialized). Modern versions may inline. Use MATERIALIZED or NOT MATERIALIZED hints in PG 12+ to control behavior.',
  },
]

export const cteQuestions: SqlQuestion[] = items.map((item, i) => ({
  ...item,
  id: 700 + i + 1,
  module: 'sql',
  sheet,
  category,
}))
