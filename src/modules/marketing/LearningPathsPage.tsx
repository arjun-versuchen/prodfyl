import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SEO } from '../../components/SEO'
import { learningPaths } from '../../data/learningPaths'
import { tokens } from '../../lib/design-tokens'

export default function LearningPathsPage() {
  return (
    <>
      <SEO
        title="Data Engineering Learning Paths"
        description="SQL, PySpark, Spark, Azure Data Factory, Databricks & Python interview paths — all live. Mock interviews coming soon. Start practicing today."
        path="/learning-paths"
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-medium uppercase tracking-widest text-primary">Platform</p>
          <h1 className="mt-3 text-4xl font-bold">Data Engineering Learning Paths</h1>
          <p className="mt-4 max-w-3xl text-lg text-muted">
            Your data engineering interview roadmap in one place. SQL, PySpark, Spark, Azure Data Factory, Databricks,
            Python, Delta Lake, and Data Modeling are live with 50+ questions each. System Design and Mock Interviews are
            coming next.{' '}
            <Link to="/pricing" className="font-medium text-primary hover:underline">
              View Premium plans
            </Link>
            .
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {learningPaths.map((path, index) => (
            <motion.div
              key={path.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Link
                to={path.status === 'live' ? `/learn/${path.slug}` : `/coming-soon/${path.slug}`}
                className={`block h-full ${tokens.card} ${tokens.cardHover} p-6`}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-3xl">{path.icon}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      path.status === 'live' ? 'bg-success/10 text-success' : 'bg-surface text-muted'
                    }`}
                  >
                    {path.status === 'live' ? 'Live' : 'Coming Soon'}
                  </span>
                </div>
                <h2 className="mt-5 text-xl font-semibold">{path.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">{path.description}</p>
                {path.highlights && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {path.highlights.map((item) => (
                      <span key={item} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  )
}
