import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { SEO } from '../../components/SEO'
import { PremiumLock } from '../../components/PremiumLock'
import { AccessBadge, CodeBlock, ProjectDifficultyBadge } from '../../components/UI'
import { projectBySlug } from '../../data/projects'
import {
  canAccessProjectSection,
  getProjectAccessTier,
  isPremiumProject,
  PROJECT_MIXED_FREE_SECTIONS,
} from '../../lib/access'
import { useAuth } from '../../contexts/AuthContext'
import { tokens } from '../../lib/design-tokens'
import type { FailureScenario, ProjectWalkthrough } from '../../types'

const STAR_SCHEMA_CODE = `-- Star schema (line-item grain)
dim_customers (customer_id, name, segment, city)
dim_products  (product_id, name, category, brand)
dim_dates     (date_key, date, month, quarter)

fct_orders (
  order_id, line_id, customer_id, product_id, date_key,
  quantity, unit_price, discount, revenue
)`

function FailureScenarioAccordion({ scenario }: { scenario: FailureScenario }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`overflow-hidden ${tokens.card}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-surface/50"
      >
        <span className="font-semibold text-foreground">{scenario.title}</span>
        <span className="shrink-0 text-muted">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="space-y-4 border-t border-border px-5 pb-5 pt-4">
          <ScenarioRow label="Problem" value={scenario.problem} />
          <ScenarioRow label="Detection" value={scenario.detection} accent="text-warning" />
          <ScenarioRow label="Fix" value={scenario.fix} accent="text-success" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Interview answer</p>
            <p className="mt-2 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm leading-relaxed text-foreground">
              {scenario.interviewAnswer}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function ScenarioRow({ label, value, accent = 'text-muted' }: { label: string; value: string; accent?: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className={`mt-1 text-sm leading-relaxed ${accent}`}>{value}</p>
    </div>
  )
}

function EnhancedProjectContent({ project }: { project: ProjectWalkthrough }) {
  const enhanced = project.enhanced!
  const tier = getProjectAccessTier(project.slug)

  return (
    <>
      <section className={`${tokens.card} mt-8 p-6`}>
        <h2 className="text-lg font-semibold text-foreground">Project Overview</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Business problem</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">{enhanced.businessProblem}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Outcome</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">{project.outcome}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border pt-6">
          <ProjectDifficultyBadge difficulty={project.difficulty} />
          <AccessBadge tier={tier} />
          <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted">{project.duration}</span>
          {project.techStack.map((tech) => (
            <span key={tech} className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-muted">
              {tech}
            </span>
          ))}
        </div>
      </section>

      <section className={`${tokens.card} mt-6 p-6`}>
        <h2 className="text-lg font-semibold text-foreground">Architecture Flow</h2>
        <p className="mt-2 text-sm text-muted">End-to-end batch flow from source systems to dashboards.</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {enhanced.architectureFlow.map((step, index) => (
            <div key={step} className="flex items-center gap-2 sm:gap-3">
              <span className="rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-center text-xs font-semibold text-primary sm:text-sm">
                {step}
              </span>
              {index < enhanced.architectureFlow.length - 1 && (
                <span className="text-muted" aria-hidden="true">
                  →
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6">
          <CodeBlock code={STAR_SCHEMA_CODE} />
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-semibold text-foreground">Pipeline Walkthrough</h2>
        <p className="mt-2 text-sm text-muted">Six idempotent stages orchestrated by Airflow — extract through monitor.</p>
        <div className="mt-6 space-y-4">
          {enhanced.pipelineSteps.map((step, index) => (
            <div key={step.title} className={`${tokens.card} p-5`}>
              <div className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-sm font-bold text-primary">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{step.description}</p>
                  <ul className="mt-4 space-y-2">
                    {step.checklist.map((item) => (
                      <li key={item} className="flex gap-2 text-sm text-muted">
                        <span className="text-success">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-foreground">Failure Scenarios</h2>
        <p className="mt-2 text-sm text-muted">
          Five production issues interviewers ask about — expand each for detection, fix, and a ready-made answer.
        </p>
        <div className="mt-6 space-y-3">
          {enhanced.failureScenarios.map((scenario) => (
            <FailureScenarioAccordion key={scenario.title} scenario={scenario} />
          ))}
        </div>
      </section>

      <section className={`${tokens.card} mt-10 p-6`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-foreground">Interview Explanation</h2>
          <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            ~90 seconds
          </span>
        </div>
        <p className="mt-4 rounded-xl border border-border bg-surface p-5 text-sm leading-relaxed text-foreground">
          {enhanced.interviewScript}
        </p>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          <li className="flex gap-2">
            <span className="text-primary">1.</span>
            <span>Problem &amp; stakeholders (15 sec)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">2.</span>
            <span>Architecture flow &amp; tech choices (30 sec)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">3.</span>
            <span>One failure scenario you handled (25 sec)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">4.</span>
            <span>Measurable outcome (20 sec)</span>
          </li>
        </ul>
      </section>

      <section className={`${tokens.card} mt-6 p-6`}>
        <h2 className="text-lg font-semibold text-foreground">Resume Bullets</h2>
        <p className="mt-2 text-sm text-muted">Copy, adapt metrics to your experience, and keep each bullet impact-first.</p>
        <ul className="mt-4 space-y-3">
          {project.resumeBullets.map((bullet) => (
            <li
              key={bullet}
              className="flex gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm leading-relaxed text-foreground"
            >
              <span className="text-success">✓</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

function GenericProjectContent({
  project,
  isPremium,
  tier,
}: {
  project: ProjectWalkthrough
  isPremium: boolean
  tier: ReturnType<typeof getProjectAccessTier>
}) {
  const lockedSectionCount =
    project.sections.length -
    project.sections.filter((_, index) => canAccessProjectSection(project.slug, index, isPremium)).length
  const showPremiumExtras = isPremium || tier === 'free'

  return (
    <>
      <div className={`${tokens.card} mt-8 p-6`}>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">Outcome</h2>
        <p className="mt-2 leading-relaxed text-foreground">{project.outcome}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <span key={tech} className="rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-muted">
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-10 space-y-6">
        {project.sections.map((section, index) => {
          const locked = !canAccessProjectSection(project.slug, index, isPremium)
          if (locked) return null

          return (
            <section key={section.id} className={`${tokens.card} p-6`}>
              <h2 className="text-lg font-semibold text-foreground">{section.title}</h2>
              <p className="mt-3 leading-relaxed text-muted">{section.content}</p>
              {section.bullets && (
                <ul className="mt-4 space-y-2">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-2 text-sm text-muted">
                      <span className="text-primary">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
              {section.code && (
                <div className="mt-4">
                  <CodeBlock code={section.code} />
                </div>
              )}
            </section>
          )
        })}
      </div>

      {lockedSectionCount > 0 && !isPremium && (
        <div className="mt-10">
          <PremiumLock
            title={`${lockedSectionCount} more section${lockedSectionCount > 1 ? 's' : ''} in this walkthrough`}
            description={`Premium unlocks the full ${project.title} walkthrough plus all advanced projects, interview questions, and resume bullets.`}
          />
        </div>
      )}

      {showPremiumExtras && (
        <>
          <section className={`${tokens.card} mt-10 p-6`}>
            <h2 className="text-lg font-semibold">Sample Interview Questions</h2>
            <ul className="mt-4 space-y-3">
              {project.interviewQuestions.map((question) => (
                <li key={question} className="flex gap-2 text-sm text-muted">
                  <span className="font-medium text-primary">Q.</span>
                  <span>{question}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={`${tokens.card} mt-6 p-6`}>
            <h2 className="text-lg font-semibold">Resume Bullets</h2>
            <ul className="mt-4 space-y-3">
              {project.resumeBullets.map((bullet) => (
                <li key={bullet} className="flex gap-2 text-sm text-muted">
                  <span className="text-success">✓</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {tier === 'mixed' && !isPremium && (
        <p className="mt-6 text-center text-xs text-muted">
          Showing first {PROJECT_MIXED_FREE_SECTIONS} sections free. Upgrade for the full walkthrough, interview
          questions, and resume bullets.
        </p>
      )}
    </>
  )
}

export default function ProjectPage() {
  const { pathSlug = '', projectSlug = '' } = useParams()
  const { isPremium } = useAuth()
  const project = projectBySlug[projectSlug]

  if (pathSlug !== 'projects') {
    return (
      <div className="py-10 text-center">
        <h1 className="text-2xl font-bold">Not found</h1>
        <Link to="/learn/projects" className="mt-4 inline-block text-primary hover:underline">
          Back to Projects
        </Link>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="py-10 text-center">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <Link to="/learn/projects" className="mt-4 inline-block text-primary hover:underline">
          Back to Projects
        </Link>
      </div>
    )
  }

  const tier = getProjectAccessTier(project.slug)
  const projectLocked = isPremiumProject(project.slug) && !isPremium

  if (projectLocked) {
    return (
      <>
        <SEO title={project.title} description={project.description} path={`/learn/projects/project/${project.slug}`} />
        <Link to="/learn/projects" className="text-sm text-muted hover:text-primary">
          ← Projects Overview
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-3xl">{project.icon}</span>
          <h1 className="text-3xl font-bold">{project.title}</h1>
        </div>
        <p className="mt-3 max-w-2xl text-muted">{project.description}</p>
        <div className="mt-8">
          <PremiumLock
            title={`${project.title} is Premium`}
            description="Upgrade to unlock full project walkthroughs including lakehouse, Azure ADF, and real-time streaming pipelines with interview questions and resume bullets."
          />
        </div>
      </>
    )
  }

  return (
    <>
      <SEO
        title={project.title}
        description={project.description}
        path={`/learn/projects/project/${project.slug}`}
      />

      <Link to="/learn/projects" className="text-sm text-muted hover:text-primary">
        ← Projects Overview
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{project.icon}</span>
            <h1 className="text-3xl font-bold">{project.title}</h1>
          </div>
          <p className="mt-3 max-w-2xl text-muted">{project.description}</p>
          {!project.enhanced && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <ProjectDifficultyBadge difficulty={project.difficulty} />
              <AccessBadge tier={tier} />
              <span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted">{project.duration}</span>
            </div>
          )}
        </div>
      </div>

      {project.enhanced ? (
        <EnhancedProjectContent project={project} />
      ) : (
        <GenericProjectContent project={project} isPremium={isPremium} tier={tier} />
      )}
    </>
  )
}
