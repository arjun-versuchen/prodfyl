import { Link, useParams } from 'react-router-dom'
import { SEO } from '../../components/SEO'
import { PremiumLock } from '../../components/PremiumLock'
import { CodeBlock, DifficultyBadge, FrequencyBadge } from '../../components/UI'
import { getModuleTitle } from '../../data/questionModules'
import { questionById } from '../../data/questions'
import { sheetBySlug } from '../../data/sheets'
import { canAccessQuestion, isPremiumSheet } from '../../lib/access'
import { useAuth } from '../../contexts/AuthContext'

export default function ModuleQuestionPage() {
  const { pathSlug = '', id } = useParams()
  const question = questionById[Number(id)]
  const { isPremium } = useAuth()
  const moduleTitle = getModuleTitle(pathSlug)

  if (!question || question.module !== pathSlug) {
    return (
      <div className="py-10 text-center">
        <h1 className="text-2xl font-bold">Question not found</h1>
        <Link to={`/learn/${pathSlug}`} className="mt-4 inline-block text-primary hover:underline">
          Back to {moduleTitle}
        </Link>
      </div>
    )
  }

  const sheet = sheetBySlug[question.sheet]
  const lockedSheet = sheet && isPremiumSheet(sheet.slug) && !isPremium
  const lockedQuestion = !canAccessQuestion(question, isPremium)

  if (lockedSheet || lockedQuestion) {
    return (
      <>
        <SEO
          title={question.title}
          description="Premium interview question"
          path={`/learn/${pathSlug}/question/${question.id}`}
          noIndex
        />
        <Link to={`/learn/${pathSlug}/sheet/${question.sheet}`} className="text-sm text-muted hover:text-primary">
          ← Back to sheet
        </Link>
        <div className="mt-8">
          <PremiumLock />
        </div>
      </>
    )
  }

  const exampleLabel = pathSlug === 'sql' ? 'Example SQL' : 'Example'

  return (
    <>
      <SEO
        title={question.title}
        description={question.question.slice(0, 155)}
        path={`/learn/${pathSlug}/question/${question.id}`}
      />

      <Link to={`/learn/${pathSlug}/sheet/${question.sheet}`} className="text-sm text-muted hover:text-primary">
        ← {sheet?.title ?? 'Back to sheet'}
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <DifficultyBadge difficulty={question.difficulty} />
        {question.frequency && <FrequencyBadge frequency={question.frequency} />}
        <span className="text-sm text-muted">{question.category}</span>
      </div>

      <h1 className="mt-4 text-3xl font-bold">{question.title}</h1>

      <section className="mt-10 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Question</h2>
        <p className="mt-3 text-lg leading-relaxed">{question.question}</p>
      </section>

      <section className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">Answer</h2>
        <p className="mt-3 leading-relaxed text-foreground">{question.answer}</p>
      </section>

      {question.example && (
        <section className="mt-6">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-success">{exampleLabel}</h2>
          <CodeBlock code={question.example} />
        </section>
      )}

      {question.notes && isPremium && (
        <section className="mt-6 rounded-2xl border border-accent/20 bg-accent/5 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">Premium Notes</h2>
          <p className="mt-3 leading-relaxed text-muted">{question.notes}</p>
        </section>
      )}

      {question.tags && question.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {question.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-surface px-3 py-1 text-xs text-muted">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </>
  )
}
