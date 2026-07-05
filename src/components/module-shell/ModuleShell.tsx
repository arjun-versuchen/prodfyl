import { Link, Outlet, useLocation, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { learningPathBySlug } from '../../data/learningPaths'
import { sheets } from '../../data/sheets'
import { totalQuestionCount } from '../../data/questions'
import { getSheetAccessTier } from '../../lib/access'
import { tokens } from '../../lib/design-tokens'
import { useAuth } from '../../contexts/AuthContext'

export default function ModuleShell() {
  const { pathSlug = '' } = useParams()
  const location = useLocation()
  const path = learningPathBySlug[pathSlug]
  const { isPremium } = useAuth()

  if (!path) {
    return null
  }

  if (path.status === 'coming_soon') {
    return <Outlet />
  }

  const sqlSheets = pathSlug === 'sql' ? sheets : []

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 lg:flex-row lg:px-6">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className={`${tokens.card} sticky top-24 p-4`}>
          <div className="mb-4 flex items-center gap-3">
            <span className="text-2xl">{path.icon}</span>
            <div>
              <p className="text-sm font-semibold text-foreground">{path.title}</p>
              <p className="text-xs text-muted">{totalQuestionCount}+ questions</p>
            </div>
          </div>
          <nav className="space-y-1">
            <Link
              to={`/learn/${pathSlug}`}
              className={`block rounded-lg px-3 py-2 text-sm transition ${
                location.pathname === `/learn/${pathSlug}`
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted hover:bg-surface hover:text-foreground'
              }`}
            >
              Overview
            </Link>
            {sqlSheets.map((sheet) => {
              const tier = getSheetAccessTier(sheet.slug)
              const locked = tier === 'premium' && !isPremium
              return (
                <Link
                  key={sheet.slug}
                  to={`/learn/${pathSlug}/sheet/${sheet.slug}`}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                    location.pathname.includes(sheet.slug)
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted hover:bg-surface hover:text-foreground'
                  }`}
                >
                  <span className="truncate">{sheet.title}</span>
                  {locked && <span className="text-xs">🔒</span>}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="min-w-0 flex-1"
      >
        <Outlet />
      </motion.div>
    </div>
  )
}
