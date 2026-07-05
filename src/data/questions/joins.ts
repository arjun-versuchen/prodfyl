import type { SqlQuestion } from '../../types'

type Q = Omit<SqlQuestion, 'id' | 'sheet' | 'category'>

const sheet = 'joins-subqueries'
const category = 'JOINs & Subqueries'

const items: Q[] = [
  {
    title: 'Types of JOINs',
    difficulty: 'Easy',
    question: 'Explain INNER, LEFT, RIGHT, and FULL OUTER JOIN.',
    answer: 'INNER JOIN returns matching rows from both tables. LEFT JOIN returns all left rows plus matches from right (NULL if no match). RIGHT JOIN is the mirror. FULL OUTER JOIN returns all rows from both, with NULLs where no match exists.',
  },
  {
    title: 'INNER JOIN example',
    difficulty: 'Easy',
    question: 'Join employees with departments to show employee name and department name.',
    answer: 'Match foreign key dept_id to departments.id. Only employees with valid departments appear.',
    example: 'SELECT e.name, d.name AS department\nFROM employees e\nINNER JOIN departments d ON e.dept_id = d.id;',
  },
  {
    title: 'LEFT JOIN for missing data',
    difficulty: 'Medium',
    question: 'Find all departments including those with zero employees.',
    answer: 'Start from departments (LEFT table) and LEFT JOIN employees so departments without employees still appear with NULL employee columns.',
    example: 'SELECT d.name, COUNT(e.id) AS emp_count\nFROM departments d\nLEFT JOIN employees e ON d.id = e.dept_id\nGROUP BY d.name;',
  },
  {
    title: 'Self JOIN',
    difficulty: 'Medium',
    question: 'How would you find employees and their managers using a self join?',
    answer: 'A self join joins a table to itself with different aliases. Match employee.manager_id to manager.id.',
    example: 'SELECT e.name AS employee, m.name AS manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id;',
  },
  {
    title: 'CROSS JOIN',
    difficulty: 'Medium',
    question: 'What is a CROSS JOIN and when is it used?',
    answer: 'CROSS JOIN produces the Cartesian product—every row of A paired with every row of B. Used for generating combinations or when no join condition exists. Can explode result size quickly.',
    example: 'SELECT * FROM colors CROSS JOIN sizes;',
  },
  {
    title: 'Multiple JOINs',
    difficulty: 'Medium',
    question: 'Join orders, customers, and products in one query.',
    answer: 'Chain JOINs sequentially. Each ON clause defines the relationship. Order of joins can affect optimization but not logical result for inner joins.',
    example: 'SELECT c.name, p.product_name, o.quantity\nFROM orders o\nJOIN customers c ON o.customer_id = c.id\nJOIN products p ON o.product_id = p.id;',
  },
  {
    title: 'Subquery in WHERE',
    difficulty: 'Medium',
    question: 'Find employees earning more than the company average salary.',
    answer: 'Use a scalar subquery in WHERE. The subquery must return a single value for comparison operators.',
    example: 'SELECT name, salary FROM employees\nWHERE salary > (SELECT AVG(salary) FROM employees);',
  },
  {
    title: 'Subquery with IN',
    difficulty: 'Medium',
    question: 'Find customers who placed at least one order.',
    answer: 'Use IN with a subquery returning customer IDs from orders, or use EXISTS which often performs better on large datasets.',
    example: 'SELECT * FROM customers\nWHERE id IN (SELECT DISTINCT customer_id FROM orders);',
  },
  {
    title: 'EXISTS vs IN',
    difficulty: 'Hard',
    question: 'Compare EXISTS and IN for subqueries.',
    answer: 'EXISTS returns true if the subquery returns any row—it short-circuits on first match. IN materializes the subquery list. EXISTS handles NULLs better and is often faster for correlated subqueries. IN is readable for small static lists.',
  },
  {
    title: 'Correlated subquery',
    difficulty: 'Hard',
    question: 'Find the highest-paid employee in each department using a correlated subquery.',
    answer: 'A correlated subquery references the outer query. For each employee row, the subquery checks if their salary equals the max in their department.',
    example: 'SELECT e.name, e.dept_id, e.salary\nFROM employees e\nWHERE e.salary = (\n  SELECT MAX(salary) FROM employees WHERE dept_id = e.dept_id\n);',
  },
  {
    title: 'Subquery in FROM (derived table)',
    difficulty: 'Medium',
    question: 'What is a derived table?',
    answer: 'A subquery in the FROM clause creates an inline view (derived table). It must have an alias. Useful for multi-step transformations before outer query processing.',
    example: 'SELECT dept, avg_sal FROM (\n  SELECT dept_id AS dept, AVG(salary) AS avg_sal\n  FROM employees GROUP BY dept_id\n) t WHERE avg_sal > 50000;',
  },
  {
    title: 'UNION vs UNION ALL',
    difficulty: 'Medium',
    question: 'Difference between UNION and UNION ALL?',
    answer: 'UNION combines result sets and removes duplicates (requires sort/distinct pass). UNION ALL keeps all rows including duplicates and is faster when duplicates are acceptable or impossible.',
    example: 'SELECT name FROM employees_2023\nUNION ALL\nSELECT name FROM employees_2024;',
  },
  {
    title: 'INTERSECT and EXCEPT',
    difficulty: 'Medium',
    question: 'Find customers who ordered in both 2023 and 2024.',
    answer: 'Use INTERSECT (or INNER JOIN on customer_id between year-filtered sets). EXCEPT finds rows in first set not in second.',
    example: 'SELECT customer_id FROM orders WHERE year = 2023\nINTERSECT\nSELECT customer_id FROM orders WHERE year = 2024;',
  },
  {
    title: 'Anti-join pattern',
    difficulty: 'Hard',
    question: 'Find customers who never placed an order.',
    answer: 'Use LEFT JOIN with WHERE orders.id IS NULL, or NOT EXISTS, or NOT IN (careful with NULLs in NOT IN).',
    example: 'SELECT c.* FROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nWHERE o.id IS NULL;',
  },
  {
    title: 'Semi-join with EXISTS',
    difficulty: 'Hard',
    question: 'Find products that appear in at least one order using EXISTS.',
    answer: 'EXISTS implements a semi-join—returning rows from the outer table when the subquery finds a match, without duplicating outer rows.',
    example: 'SELECT p.* FROM products p\nWHERE EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id = p.id);',
  },
  {
    title: 'NATURAL JOIN caveat',
    difficulty: 'Medium',
    question: 'Why is NATURAL JOIN discouraged?',
    answer: 'NATURAL JOIN matches all columns with the same name automatically. Schema changes can silently alter join behavior. Explicit ON conditions are clearer and safer.',
  },
  {
    title: 'Non-equi join',
    difficulty: 'Hard',
    question: 'Give an example of a non-equi join.',
    answer: 'Joins using operators other than =, such as finding overlapping date ranges or bucketing values by range tables.',
    example: 'SELECT e.name, g.grade\nFROM employees e\nJOIN salary_grades g\n  ON e.salary BETWEEN g.min_sal AND g.max_sal;',
  },
]

export const joinsQuestions: SqlQuestion[] = items.map((item, i) => ({
  ...item,
  id: 100 + i + 1,
  sheet,
  category,
}))
