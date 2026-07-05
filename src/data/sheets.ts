import type { Sheet } from '../types'

export const sheets: Sheet[] = [
  {
    slug: 'sql-master-sheet',
    title: 'SQL Master Sheet',
    description: 'Handpicked MOST frequently asked SQL interview questions in top MNCs and product companies.',
    icon: '⭐',
    color: 'from-primary to-accent',
    accessTier: 'premium',
  },
  {
    slug: 'sql-basics',
    title: 'SQL Basics',
    description: 'SELECT, WHERE, ORDER BY, DISTINCT, and fundamental query writing.',
    icon: '📘',
    color: 'from-info to-primary',
    accessTier: 'free',
  },
  {
    slug: 'joins-subqueries',
    title: 'JOINs & Subqueries',
    description: 'INNER, LEFT, RIGHT, FULL joins and nested query patterns.',
    icon: '🔗',
    color: 'from-success to-info',
    accessTier: 'mixed',
  },
  {
    slug: 'aggregations',
    title: 'Aggregations & GROUP BY',
    description: 'COUNT, SUM, AVG, GROUP BY, HAVING, and rollup patterns.',
    icon: '📊',
    color: 'from-warning to-accent',
    accessTier: 'mixed',
  },
  {
    slug: 'window-functions',
    title: 'Window Functions',
    description: 'ROW_NUMBER, RANK, LAG, LEAD, and analytical SQL patterns.',
    icon: '🪟',
    color: 'from-accent to-primary',
    accessTier: 'premium',
  },
  {
    slug: 'database-theory',
    title: 'Database Design & Theory',
    description: 'Normalization, keys, ACID, indexes, and schema design.',
    icon: '🏗️',
    color: 'from-primary to-info',
    accessTier: 'premium',
  },
  {
    slug: 'practical-challenges',
    title: 'Practical Query Challenges',
    description: 'Real-world scenarios asked in data analyst and backend interviews.',
    icon: '🎯',
    color: 'from-warning to-success',
    accessTier: 'premium',
  },
]

export const sheetBySlug = Object.fromEntries(sheets.map((s) => [s.slug, s]))
