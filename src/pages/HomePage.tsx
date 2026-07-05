import { Link } from 'react-router-dom'
import { sheets } from '../data/sheets'
import { getQuestionsBySheet, totalQuestionCount } from '../data/questions'
import { SheetCard } from '../components/UI'

const features = [
  {
    icon: '📋',
    title: 'SQL Master Sheet',
    description: 'Handpicked most frequently asked SQL questions in top MNC interviews.',
    link: '/sheet/sql-master-sheet',
  },
  {
    icon: '🔗',
    title: 'JOINs & Subqueries',
    description: 'Master relational joins, EXISTS, anti-joins, and nested queries.',
    link: '/sheet/joins-subqueries',
  },
  {
    icon: '🪟',
    title: 'Window Functions',
    description: 'ROW_NUMBER, RANK, LAG, LEAD — the analytical SQL toolkit.',
    link: '/sheet/window-functions',
  },
  {
    icon: '🏗️',
    title: 'Database Theory',
    description: 'Normalization, ACID, indexes, and schema design fundamentals.',
    link: '/sheet/database-theory',
  },
  {
    icon: '🎯',
    title: 'Practical Challenges',
    description: 'Real interview scenarios — second highest salary, cohorts, streaks.',
    link: '/sheet/practical-challenges',
  },
  {
    icon: '📊',
    title: 'Aggregations',
    description: 'GROUP BY, HAVING, pivot patterns, and conditional aggregation.',
    link: '/sheet/aggregations',
  },
]

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-[#2a2a38]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.18),_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-indigo-400">
            Learn · By Intuition
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Ultimate Guide to ace{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              SQL Interviews
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            {totalQuestionCount}+ curated SQL interview questions with clear answers and examples.
            From basics to window functions — everything you need for data analyst, backend, and
            database interviews.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/sheet/sql-master-sheet"
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-110"
            >
              Start Master Sheet
            </Link>
            <Link
              to="/sheets"
              className="rounded-xl border border-[#2a2a38] bg-[#1c1c26] px-6 py-3 text-sm font-semibold text-zinc-200 transition hover:border-indigo-500/40"
            >
              Browse All Sheets
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="mb-2 text-2xl font-bold text-white">SQL Interview Resources</h2>
        <p className="mb-10 text-zinc-400">Structured sheets to help you crack SQL interviews efficiently.</p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link
              key={f.title}
              to={f.link}
              className="group rounded-2xl border border-[#2a2a38] bg-[#1c1c26] p-6 transition hover:border-indigo-500/40"
            >
              <span className="text-2xl">{f.icon}</span>
              <h3 className="mt-4 text-lg font-semibold text-white group-hover:text-indigo-300">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{f.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-[#2a2a38] bg-[#12121a]/50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="mb-2 text-2xl font-bold text-white">Popular Sheets</h2>
          <p className="mb-10 text-zinc-400">Pick a sheet and start practicing — expand any question to see the answer.</p>
          <div className="grid gap-5 sm:grid-cols-2">
            {sheets.slice(0, 4).map((sheet) => (
              <SheetCard key={sheet.slug} {...sheet} count={getQuestionsBySheet(sheet.slug).length} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
