import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { sheetBySlug } from '../data/sheets'
import { getQuestionsBySheet, getRandomQuestion } from '../data/questions'
import { DifficultyBadge } from '../components/UI'
import type { Difficulty } from '../types'

export default function SheetPage() {
  const { slug = '' } = useParams()
  const navigate = useNavigate()
  const sheet = sheetBySlug[slug]
  const questions = useMemo(() => getQuestionsBySheet(slug), [slug])
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const [filter, setFilter] = useState<Difficulty | 'All'>('All')
  const [search, setSearch] = useState('')

  if (!sheet) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-white">Sheet not found</h1>
        <Link to="/sheets" className="mt-4 inline-block text-indigo-400 hover:underline">
          Back to sheets
        </Link>
      </div>
    )
  }

  const filtered = questions.filter((q) => {
    const matchDiff = filter === 'All' || q.difficulty === filter
    const matchSearch =
      !search ||
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.question.toLowerCase().includes(search.toLowerCase())
    return matchDiff && matchSearch
  })

  const toggle = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const expandAll = () => setExpanded(new Set(filtered.map((q) => q.id)))
  const collapseAll = () => setExpanded(new Set())

  const randomQ = () => {
    const q = getRandomQuestion(slug)
    navigate(`/question/${q.id}`)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link to="/sheets" className="text-sm text-zinc-500 hover:text-indigo-400">
        ← All Sheets
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{sheet.icon}</span>
            <h1 className="text-3xl font-bold text-white">{sheet.title}</h1>
          </div>
          <p className="mt-3 max-w-2xl text-zinc-400">{sheet.description}</p>
          <p className="mt-2 text-sm text-zinc-500">{questions.length} questions</p>
        </div>

        <button
          onClick={randomQ}
          className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:brightness-110"
        >
          Random Question
        </button>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-xs rounded-xl border border-[#2a2a38] bg-[#1c1c26] px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-indigo-500/50 focus:outline-none"
        />
        <div className="flex flex-wrap gap-2">
          {(['All', 'Easy', 'Medium', 'Hard'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filter === d
                  ? 'bg-indigo-500/20 text-indigo-300'
                  : 'bg-white/5 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <button onClick={expandAll} className="text-xs text-zinc-500 hover:text-indigo-400">
          Expand All
        </button>
        <button onClick={collapseAll} className="text-xs text-zinc-500 hover:text-indigo-400">
          Collapse All
        </button>
      </div>

      <div className="mt-8 space-y-3">
        {filtered.map((q, idx) => {
          const isOpen = expanded.has(q.id)
          return (
            <div
              key={q.id}
              className="overflow-hidden rounded-xl border border-[#2a2a38] bg-[#1c1c26] transition hover:border-indigo-500/30"
            >
              <button
                onClick={() => toggle(q.id)}
                className="flex w-full items-start gap-4 px-5 py-4 text-left"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-zinc-400">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-zinc-100">{q.title}</h3>
                    <DifficultyBadge difficulty={q.difficulty} />
                  </div>
                  <p className="mt-1 text-sm text-zinc-500 line-clamp-1">{q.question}</p>
                </div>
                <span className="shrink-0 text-zinc-500">{isOpen ? '−' : '+'}</span>
              </button>

              {isOpen && (
                <div className="border-t border-[#2a2a38] px-5 pb-5 pt-4">
                  <p className="text-sm font-medium text-zinc-300">Question</p>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-400">{q.question}</p>
                  <p className="mt-4 text-sm font-medium text-indigo-300">Answer</p>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-300">{q.answer}</p>
                  {q.example && (
                    <>
                      <p className="mt-4 text-sm font-medium text-emerald-400">Example SQL</p>
                      <pre className="mt-2 overflow-x-auto rounded-lg bg-[#12121a] p-4 text-sm text-emerald-300">
                        <code>{q.example}</code>
                      </pre>
                    </>
                  )}
                  <Link
                    to={`/question/${q.id}`}
                    className="mt-4 inline-block text-xs font-medium text-indigo-400 hover:underline"
                  >
                    Open full page →
                  </Link>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-zinc-500">No questions match your filters.</p>
      )}
    </div>
  )
}
