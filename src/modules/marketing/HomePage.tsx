import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SEO } from '../../components/SEO'
import { TrustBadges } from '../../components/UI'
import { learningPaths, livePaths } from '../../data/learningPaths'
import { sheets } from '../../data/sheets'
import { getQuestionsBySheet, totalQuestionCount } from '../../data/questions'
import { tokens } from '../../lib/design-tokens'

export default function HomePage() {
  return (
    <>
      <SEO
        title="InterviewMaster AI"
        description="Premium Data Engineering interview prep. SQL live with 130+ questions. PySpark, Spark, Azure, Databricks and more coming soon."
        path="/"
      />

      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(129,140,248,0.18),_transparent_55%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 text-sm font-medium uppercase tracking-widest text-primary"
          >
            Premium Data Engineering Interview Platform
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          >
            Ace your interviews with{' '}
            <span className={tokens.gradientText}>InterviewMaster AI</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-muted"
          >
            Content-rich learning paths built for data engineering careers. SQL is live today with{' '}
            {totalQuestionCount}+ curated questions. PySpark, Spark, Azure, Databricks, and more are on the way.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8"
          >
            <TrustBadges />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link to="/learn/sql" className={tokens.btnPrimary}>
              Start SQL Module
            </Link>
            <Link to="/learning-paths" className={tokens.btnSecondary}>
              Explore Learning Paths
            </Link>
            <Link to="/pricing" className={tokens.btnSecondary}>
              View Pricing
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Learning Paths</h2>
            <p className="mt-2 text-muted">One platform. Every data engineering interview topic.</p>
          </div>
          <Link to="/learning-paths" className="text-sm font-medium text-primary hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {learningPaths.slice(0, 6).map((path, index) => (
            <motion.div
              key={path.slug}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
            >
              <Link
                to={path.status === 'live' ? `/learn/${path.slug}` : `/coming-soon/${path.slug}`}
                className={`block ${tokens.card} ${tokens.cardHover} p-6`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{path.icon}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      path.status === 'live'
                        ? 'bg-success/10 text-success'
                        : 'bg-surface text-muted'
                    }`}
                  >
                    {path.status === 'live' ? 'Live' : 'Coming Soon'}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{path.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{path.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface/40">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold">Popular SQL Sheets</h2>
          <p className="mt-2 text-muted">High-density practice inspired by top interview prep platforms — with premium polish.</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {sheets.slice(0, 4).map((sheet) => (
              <Link
                key={sheet.slug}
                to={`/learn/sql/sheet/${sheet.slug}`}
                className={`${tokens.card} ${tokens.cardHover} p-5`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{sheet.icon}</span>
                  <div>
                    <h3 className="font-semibold">{sheet.title}</h3>
                    <p className="text-xs text-muted">{getQuestionsBySheet(sheet.slug).length} questions</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-3xl font-bold">Ready to level up?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Start free with SQL Basics and sample JOINs/Aggregations. Unlock Premium for the Master Sheet, company questions, and advanced SQL.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/pricing" className={tokens.btnPrimary}>
              Go Premium
            </Link>
            <Link to={`/learn/${livePaths[0]?.slug ?? 'sql'}`} className={tokens.btnSecondary}>
              Practice Free SQL
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
