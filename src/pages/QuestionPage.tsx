import { Link, useParams } from 'react-router-dom'
import { questionById } from '../data/questions'
import { sheetBySlug } from '../data/sheets'
import { CodeBlock, DifficultyBadge } from '../components/UI'

export default function QuestionPage() {
  const { id } = useParams()
  const question = questionById[Number(id)]

  if (!question) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-white">Question not found</h1>
        <Link to="/sheets" className="mt-4 inline-block text-indigo-400 hover:underline">
          Browse sheets
        </Link>
      </div>
    )
  }

  const sheet = sheetBySlug[question.sheet]

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link to={`/sheet/${question.sheet}`} className="text-sm text-zinc-500 hover:text-indigo-400">
        ← {sheet?.title ?? 'Back to sheet'}
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <DifficultyBadge difficulty={question.difficulty} />
        <span className="text-sm text-zinc-500">{question.category}</span>
      </div>

      <h1 className="mt-4 text-3xl font-bold text-white">{question.title}</h1>

      <section className="mt-10 rounded-2xl border border-[#2a2a38] bg-[#1c1c26] p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Question</h2>
        <p className="mt-3 text-lg leading-relaxed text-zinc-200">{question.question}</p>
      </section>

      <section className="mt-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-indigo-400">Answer</h2>
        <p className="mt-3 leading-relaxed text-zinc-300">{question.answer}</p>
      </section>

      {question.example && (
        <section className="mt-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-400">Example SQL</h2>
          <CodeBlock code={question.example} />
        </section>
      )}

      {question.tags && question.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {question.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-400">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
