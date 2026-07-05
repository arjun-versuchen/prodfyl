import { Link } from 'react-router-dom'
import type { Difficulty, SheetAccessTier } from '../types'
import { tokens } from '../lib/design-tokens'

const difficultyStyles: Record<Difficulty, string> = {
  Easy: 'bg-success/15 text-success border-success/30',
  Medium: 'bg-warning/15 text-warning border-warning/30',
  Hard: 'bg-accent/15 text-accent border-accent/30',
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${difficultyStyles[difficulty]}`}>
      {difficulty}
    </span>
  )
}

export function AccessBadge({ tier }: { tier: SheetAccessTier }) {
  const label = tier === 'free' ? 'Free' : tier === 'mixed' ? 'Free + Premium' : 'Premium'
  const style =
    tier === 'free'
      ? 'border-success/30 bg-success/10 text-success'
      : tier === 'mixed'
        ? 'border-info/30 bg-info/10 text-info'
        : 'border-accent/30 bg-accent/10 text-accent'
  return <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${style}`}>{label}</span>
}

export function SheetCard({
  slug,
  pathSlug = 'sql',
  title,
  description,
  icon,
  color,
  count,
  accessTier,
  locked = false,
}: {
  slug: string
  pathSlug?: string
  title: string
  description: string
  icon: string
  color: string
  count: number
  accessTier: SheetAccessTier
  locked?: boolean
}) {
  return (
    <Link
      to={`/learn/${pathSlug}/sheet/${slug}`}
      className={`group relative overflow-hidden ${tokens.card} ${tokens.cardHover} p-6`}
    >
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${color}`} />
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="text-3xl">{icon}</span>
        <div className="flex flex-col items-end gap-2">
          <span className="rounded-full bg-surface px-2.5 py-1 text-xs text-muted">{count} Qs</span>
          <AccessBadge tier={accessTier} />
        </div>
      </div>
      <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-foreground group-hover:text-primary">
        {title}
        {locked && <span className="text-sm">🔒</span>}
      </h3>
      <p className="text-sm leading-relaxed text-muted">{description}</p>
    </Link>
  )
}

export function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border bg-background p-4 text-sm leading-relaxed text-success">
      <code>{code}</code>
    </pre>
  )
}

export function TrustBadges() {
  const badges = ['130+ SQL Questions', 'Premium Notes', 'Company-wise Prep', 'More Paths Coming']
  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <span key={badge} className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
          {badge}
        </span>
      ))}
    </div>
  )
}
