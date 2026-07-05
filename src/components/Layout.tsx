import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { totalQuestionCount } from '../data/questions'
import { UserMenu } from './auth/AuthButtons'
import { SITE_NAME } from './SEO'

export default function Layout() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const nav = [
    { to: '/', label: 'Home' },
    { to: '/learning-paths', label: 'Learning Paths' },
    { to: '/learn/sql', label: 'SQL' },
    { to: '/pricing', label: 'Pricing' },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-sm font-bold text-white shadow-lg shadow-primary/20">
              IM
            </span>
            <div>
              <div className="text-sm font-semibold tracking-tight group-hover:text-primary">{SITE_NAME}</div>
              <div className="text-xs text-muted">Data Engineering Interview Platform</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-primary/15 text-primary'
                      : 'text-muted hover:bg-surface hover:text-foreground'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:block">
            <UserMenu />
          </div>

          <button
            type="button"
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            Menu
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border md:hidden"
            >
              <div className="space-y-1 px-4 py-4">
                {nav.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-3">
                  <UserMenu />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="mt-20 border-t border-border">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
          <div>
            <p className="font-semibold text-foreground">{SITE_NAME}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Premium interview preparation for SQL, PySpark, Spark, Azure, Databricks, and beyond.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Platform</p>
            <div className="mt-3 space-y-2 text-sm text-muted">
              <Link to="/learning-paths" className="block hover:text-primary">
                Learning Paths
              </Link>
              <Link to="/learn/sql" className="block hover:text-primary">
                SQL Module
              </Link>
              <Link to="/pricing" className="block hover:text-primary">
                Pricing
              </Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Trust</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
              <span className="rounded-full border border-border px-3 py-1">{totalQuestionCount}+ SQL Qs</span>
              <span className="rounded-full border border-border px-3 py-1">Premium Dark UI</span>
              <span className="rounded-full border border-border px-3 py-1">Google Sign-In</span>
            </div>
          </div>
        </div>
        <div className="border-t border-border py-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} {SITE_NAME}. Built for data engineering careers.
        </div>
      </footer>
    </div>
  )
}
