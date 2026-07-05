import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SEO } from '../../components/SEO'
import { SheetCard } from '../../components/UI'
import { sheets } from '../../data/sheets'
import { getQuestionsBySheet, totalQuestionCount } from '../../data/questions'
import { getSheetAccessTier } from '../../lib/access'
import { useAuth } from '../../contexts/AuthContext'
import { tokens } from '../../lib/design-tokens'

export default function SqlModuleHome() {
  const { isPremium } = useAuth()

  return (
    <>
      <SEO
        title="SQL Learning Path"
        description="130+ SQL interview questions with answers — basics, joins, aggregations, window functions, theory, and practical challenges."
        path="/learn/sql"
      />

      <div>
        <p className="text-sm text-muted">Learning Path</p>
        <h1 className="mt-2 text-3xl font-bold">SQL Interview Mastery</h1>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted">
          Structured, high-density SQL preparation with {totalQuestionCount}+ curated questions. Free sheets give you enough value to trust the platform — Premium unlocks the Master Sheet, company-wise questions, and advanced content.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {sheets.map((sheet, index) => (
            <motion.div
              key={sheet.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <SheetCard
                slug={sheet.slug}
                title={sheet.title}
                description={sheet.description}
                icon={sheet.icon}
                color={sheet.color}
                count={getQuestionsBySheet(sheet.slug).length}
                accessTier={sheet.accessTier}
                locked={getSheetAccessTier(sheet.slug) === 'premium' && !isPremium}
              />
            </motion.div>
          ))}
        </div>

        {!isPremium && (
          <div className={`${tokens.card} mt-10 p-6`}>
            <h2 className="text-lg font-semibold">Unlock Premium SQL</h2>
            <p className="mt-2 text-sm text-muted">
              Get the Master Sheet, company-wise questions, advanced SQL, and premium notes.
            </p>
            <Link to="/pricing" className={`${tokens.btnPrimary} mt-4 inline-flex`}>
              View Premium Plans
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
