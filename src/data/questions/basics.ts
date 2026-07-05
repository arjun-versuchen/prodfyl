import type { SqlQuestion } from '../../types'

type Q = Omit<SqlQuestion, 'id' | 'sheet' | 'category'>

const sheet = 'sql-basics'
const category = 'SQL Basics'

const items: Q[] = [
  {
    title: 'What is SQL?',
    difficulty: 'Easy',
    question: 'Explain what SQL is and what it is used for.',
    answer: 'SQL (Structured Query Language) is a standard language for managing and querying relational databases. It is used to create, read, update, and delete data (CRUD), define schema, enforce constraints, and control access. SQL is declarative—you describe what data you want, and the database engine decides how to retrieve it.',
  },
  {
    title: 'Difference between SQL and MySQL',
    difficulty: 'Easy',
    question: 'What is the difference between SQL and MySQL?',
    answer: 'SQL is a query language standard. MySQL is a relational database management system (RDBMS) that implements SQL. Other RDBMS include PostgreSQL, Oracle, SQL Server, and SQLite. Syntax is largely similar but each engine has dialect-specific extensions.',
  },
  {
    title: 'SELECT statement basics',
    difficulty: 'Easy',
    question: 'Write a query to fetch all columns from an employees table.',
    answer: 'Use SELECT * FROM employees; to retrieve every column. In production, prefer listing specific columns to reduce I/O and avoid breaking changes when schema evolves.',
    example: 'SELECT * FROM employees;\n-- Better:\nSELECT id, name, department FROM employees;',
  },
  {
    title: 'WHERE clause filtering',
    difficulty: 'Easy',
    question: 'How do you filter rows where salary is greater than 50000?',
    answer: 'The WHERE clause filters rows before aggregation. Use comparison operators like >, <, =, BETWEEN, IN, and LIKE.',
    example: 'SELECT name, salary\nFROM employees\nWHERE salary > 50000;',
  },
  {
    title: 'DISTINCT keyword',
    difficulty: 'Easy',
    question: 'What does DISTINCT do? Find unique departments from employees.',
    answer: 'DISTINCT removes duplicate values from the result set. It applies to the entire selected row combination, not just one column.',
    example: 'SELECT DISTINCT department FROM employees;',
  },
  {
    title: 'ORDER BY ascending and descending',
    difficulty: 'Easy',
    question: 'Sort employees by salary descending, then by name ascending.',
    answer: 'ORDER BY sorts the final result. ASC is default; DESC sorts descending. Multiple columns are evaluated left to right.',
    example: 'SELECT name, salary\nFROM employees\nORDER BY salary DESC, name ASC;',
  },
  {
    title: 'LIMIT and TOP',
    difficulty: 'Easy',
    question: 'How do you fetch only the top 5 highest-paid employees?',
    answer: 'Use LIMIT (MySQL, PostgreSQL, SQLite) or TOP (SQL Server) or FETCH FIRST (standard SQL). Combine with ORDER BY for meaningful top-N results.',
    example: 'SELECT name, salary\nFROM employees\nORDER BY salary DESC\nLIMIT 5;',
  },
  {
    title: 'LIKE and wildcard patterns',
    difficulty: 'Easy',
    question: 'Find all customers whose name starts with "A".',
    answer: 'LIKE performs pattern matching. % matches any sequence of characters; _ matches exactly one character. Case sensitivity depends on collation.',
    example: "SELECT * FROM customers\nWHERE name LIKE 'A%';",
  },
  {
    title: 'IN vs BETWEEN',
    difficulty: 'Easy',
    question: 'Explain IN and BETWEEN with examples.',
    answer: 'IN checks membership in a list of values. BETWEEN checks if a value falls within an inclusive range. Both can use subqueries.',
    example: "SELECT * FROM products WHERE category IN ('Electronics', 'Books');\nSELECT * FROM orders WHERE order_date BETWEEN '2024-01-01' AND '2024-12-31';",
  },
  {
    title: 'IS NULL handling',
    difficulty: 'Easy',
    question: 'Why does WHERE column = NULL not work? How do you find NULL values?',
    answer: 'NULL represents unknown/missing data. Any comparison with NULL yields UNKNOWN, not TRUE. Use IS NULL or IS NOT NULL. COALESCE and IFNULL provide defaults.',
    example: 'SELECT * FROM employees WHERE manager_id IS NULL;\nSELECT COALESCE(phone, \'N/A\') FROM employees;',
  },
  {
    title: 'INSERT, UPDATE, DELETE',
    difficulty: 'Easy',
    question: 'Write examples of INSERT, UPDATE, and DELETE statements.',
    answer: 'INSERT adds rows, UPDATE modifies existing rows (always use WHERE to avoid mass updates), DELETE removes rows. These are DML operations.',
    example: "INSERT INTO employees (name, salary) VALUES ('Alice', 60000);\nUPDATE employees SET salary = 65000 WHERE id = 1;\nDELETE FROM employees WHERE id = 99;",
  },
  {
    title: 'Primary Key vs Unique Key',
    difficulty: 'Medium',
    question: 'What is the difference between a primary key and a unique constraint?',
    answer: 'A table can have only one primary key; it uniquely identifies rows and cannot be NULL. A table can have multiple unique constraints. Primary keys are often clustered indexes in many engines. Unique allows one NULL in some databases (PostgreSQL) or multiple NULLs depending on engine.',
  },
  {
    title: 'Data types in SQL',
    difficulty: 'Medium',
    question: 'Name common SQL data types and when to use them.',
    answer: 'Integers (INT, BIGINT), decimals (DECIMAL for money), floats (FLOAT—approximate), strings (VARCHAR, TEXT), dates (DATE, TIMESTAMP, TIMESTAMPTZ), boolean, JSON/JSONB (PostgreSQL). Choose types based on precision, range, and storage needs.',
  },
  {
    title: 'Aliases in SQL',
    difficulty: 'Easy',
    question: 'What are column and table aliases used for?',
    answer: 'Aliases rename columns or tables in the result for readability. Table aliases shorten join syntax. In some databases, column aliases cannot be used in WHERE but can appear in ORDER BY.',
    example: 'SELECT e.name AS employee_name, d.name AS dept\nFROM employees e\nJOIN departments d ON e.dept_id = d.id;',
  },
  {
    title: 'CASE expression',
    difficulty: 'Medium',
    question: 'Categorize employees as Senior if salary > 80000 else Junior using CASE.',
    answer: 'CASE provides conditional logic in SQL, similar to if-else. Searched CASE uses WHEN conditions; simple CASE matches a single expression.',
    example: 'SELECT name, salary,\n  CASE WHEN salary > 80000 THEN \'Senior\' ELSE \'Junior\' END AS level\nFROM employees;',
  },
  {
    title: 'String functions',
    difficulty: 'Medium',
    question: 'How do you concatenate strings and extract substrings in SQL?',
    answer: 'Common functions: CONCAT (or || in PostgreSQL), SUBSTRING, LENGTH/LEN, UPPER, LOWER, TRIM, REPLACE. Functions vary slightly by dialect.',
    example: "SELECT CONCAT(first_name, ' ', last_name) AS full_name,\n       SUBSTRING(email, 1, 5) AS prefix\nFROM users;",
  },
  {
    title: 'Date functions',
    difficulty: 'Medium',
    question: 'How do you filter records from the last 30 days?',
    answer: 'Use date arithmetic with CURRENT_DATE, NOW(), DATEADD (SQL Server), or INTERVAL (PostgreSQL/MySQL). Store timestamps in UTC when possible.',
    example: "SELECT * FROM orders\nWHERE order_date >= CURRENT_DATE - INTERVAL '30 days';",
  },
]

export const basicsQuestions: SqlQuestion[] = items.map((item, i) => ({
  ...item,
  id: i + 1,
  sheet,
  category,
}))
