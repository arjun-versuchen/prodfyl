import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { SEO } from '../../components/SEO'
import { PremiumLock } from '../../components/PremiumLock'
import { DifficultyBadge } from '../../components/UI'
import { sheetBySlug } from '../../data/sheets'
import { getQuestionsBySheet, getRandomQuestion } from '../../data/questions'
import {
  canAccessQuestion,
  filterAccessibleQuestions,
  getSheetAccessTier,
  isPremiumSheet,
} from '../../lib/access'
import { useAuth } from '../../contexts/AuthContext'
import { tokens } from '../../lib/design-tokens'
import type { Difficulty } from '../../types'

export default function SqlSheetPage() {
  const { pathSlug = 'sql', sheetSlug = '' } = useParams()
  const navigate = useNavigate()
  const sheet = sheetBySlug[sheetSlug]
  const { isPremium } = useAuth()
  const questions = useMemo(() => getQuestionsBySheet(sheetSlug), [sheetSlug])
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const [filter, setFilter] = useState<Difficulty | 'All'>('All')
  const [search, setSearch] = useState('')

  if (!sheet) {
    return (
      <div className="py-10 text-center">
        <h1 className="text-2xl font-bold">Sheet not found</h1>
        <Link to={`/learn/${pathSlug}`} className="mt-4 inline-block text-primary hover:underline">
          Back to SQL module
        </Link>
      </div>
    )
  }

  const tier = getSheetAccessTier(sheet.slug)
  const sheetLocked = isPremiumSheet(sheet.slug) && !isPremium

  if (sheetLocked) {
    return (
      <>
        <SEO title={sheet.title} description={sheet.description} path={`/learn/${pathSlug}/sheet/${sheet.slug}`} />
        <Link to={`/learn/${pathSlug}`} className="text-sm text-muted hover:text-primary">
          ← SQL Overview
        </Link>
        <h1 className="mt-4 text-3xl font-bold">{sheet.title}</h1>
        <div className="mt-8">
          <PremiumLock
            title={`${sheet.title} is Premium`}
            description="Upgrade to unlock this sheet along with the Master Sheet, company-wise questions, advanced SQL, and premium notes."
          />
        </div>
      </>
    )
  }

  const searchablePool = filterAccessibleQuestions(questions, isPremium)
  const filtered = searchablePool.filter((q) => {
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
    const accessible = filterAccessibleQuestions(questions, isPremium)
    if (accessible.length === 0) return
    const q = accessible[Math.floor(Math.random() * accessible.length)] ?? getRandomQuestion(sheetSlug)
    navigate(`/learn/${pathSlug}/question/${q.id}`)
  }

  return (
    <>
      <SEO title={sheet.title} description={sheet.description} path={`/learn/${pathSlug}/sheet/${sheet.slug}`} />

      <Link to={`/learn/${pathSlug}`} className="text-sm text-muted hover:text-primary">
        ← SQL Overview
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{sheet.icon}</span>
            <h1 className="text-3xl font-bold">{sheet.title}</h1>
          </div>
          <p className="mt-3 max-w-2xl text-muted">{sheet.description}</p>
          <p className="mt-2 text-sm text-muted">
            {filtered.length} visible questions · {tier === 'mixed' ? 'First section free, rest Premium' : 'Free sheet'}
          </p>
        </div>

        <button type="button" onClick={randomQ} className={tokens.btnPrimary}>
          Random Question
        </button>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <input
          type="search"
          placeholder="Search free content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${tokens.input} max-w-xs`}
        />
        <div className="flex flex-wrap gap-2">
          {(['All', 'Easy', 'Medium', 'Hard'] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setFilter(d)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filter === d ? 'bg-primary/20 text-primary' : 'bg-surface text-muted hover:text-foreground'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <button type="button" onClick={expandAll} className="text-xs text-muted hover:text-primary">
          Expand All
        </button>
        <button type="button" onClick={collapseAll} className="text-xs text-muted hover:text-primary">
          Collapse All
        </button>
      </div>

      <div className="mt-8 space-y-3">
        {filtered.map((q, idx) => {
          const locked = !canAccessQuestion(q, isPremium)
          const isOpen = expanded.has(q.id)

          if (locked) {
            return (
              <div key={q.id} className={`${tokens.card} px-5 py-4`}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">🔒</span>
                  <div>
                    <h3 className="font-semibold text-foreground">{q.title}</h3>
                    <p className="text-sm text-muted">Premium question — upgrade to unlock.</p>
                  </div>
                </div>
              </div>
            )
          }

          return (
            <div key={q.id} className={`overflow-hidden ${tokens.card} hover:border-primary/30`}>
              <button
                type="button"
                onClick={() => toggle(q.id)}
                className="flex w-full items-start gap-4 px-5 py-4 text-left"
              >
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-surface text-xs font-bold text-muted">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{q.title}</h3>
                    <DifficultyBadge difficulty={q.difficulty} />
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-muted">{q.question}</p>
                </div>
                <span className="shrink-0 text-muted">{isOpen ? '−' : '+'}</span>
              </button>

              {isOpen && (
                <div className="border-t border-border px-5 pb-5 pt-4">
                  <p className="text-sm font-medium text-foreground">Question</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{q.question}</p>
                  <p className="mt-4 text-sm font-medium text-primary">Answer</p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground">{q.answer}</p>
                  {q.example && (
                    <>
                      <p className="mt-4 text-sm font-medium text-success">Example SQL</p>
                      <pre className="mt-2 overflow-x-auto rounded-lg bg-background p-4 text-sm text-success">
                        <code>{q.example}</code>
                      </pre>
                    </>
                  )}
                  {q.notes && isPremium && (
                    <>
                      <p className="mt-4 text-sm font-medium text-accent">Premium Notes</p>
                      <p className="mt-1 text-sm text-muted">{q.notes}</p>
                    </>
                  )}
                  <Link
                    to={`/learn/${pathSlug}/question/${q.id}`}
                    className="mt-4 inline-block text-xs font-medium text-primary hover:underline"
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
        <p className="mt-12 text-center text-muted">No questions match your filters in the free content set.</p>
      )}

      {tier === 'mixed' && !isPremium && (
        <div className="mt-10">
          <PremiumLock title="Unlock the full sheet" description="Premium unlocks every question in this sheet plus Master Sheet, company-wise questions, and advanced SQL." />
        </div>
      )}
    </>
  )
}
