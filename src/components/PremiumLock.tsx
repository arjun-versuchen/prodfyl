import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { tokens } from '../lib/design-tokens'

interface PremiumLockProps {
  title?: string
  description?: string
}

export function PremiumLock({
  title = 'Premium content locked',
  description = 'Upgrade to InterviewMaster AI Premium to unlock the Master Sheet, company-wise questions, advanced SQL, and premium notes.',
}: PremiumLockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${tokens.card} relative overflow-hidden p-8 text-center`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.12),_transparent_55%)]" />
      <div className="relative">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-3xl">
          🔒
        </div>
        <h3 className="mt-5 text-xl font-semibold text-foreground">{title}</h3>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted">{description}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/pricing" className={tokens.btnPrimary}>
            View Premium Plans
          </Link>
          <Link to="/learn/sql" className={tokens.btnSecondary}>
            Browse Free Content
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export function SheetSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={`${tokens.card} skeleton h-20`} />
      ))}
    </div>
  )
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`${tokens.card} skeleton h-44`} />
      ))}
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="skeleton mb-4 h-4 w-32 rounded" />
      <div className="skeleton mb-3 h-10 w-2/3 max-w-lg rounded" />
      <div className="skeleton mb-8 h-5 w-full max-w-2xl rounded" />
      <CardSkeleton count={6} />
    </div>
  )
}
