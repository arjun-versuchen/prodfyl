import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SEO } from '../../components/SEO'
import { SheetCard } from '../../components/UI'
import { getModuleSeoDescription, getModuleTitle, isQuestionModule } from '../../data/questionModules'
import { getQuestionsByModule } from '../../data/questions'
import { getSheetsByModule } from '../../data/sheets'
import { getQuestionsBySheet } from '../../data/questions'
import { getSheetAccessTier } from '../../lib/access'
import { useAuth } from '../../contexts/AuthContext'
import { tokens } from '../../lib/design-tokens'
import { NotFoundPage } from '../marketing/errors/ErrorPages'

export default function ModuleHome() {
  const { pathSlug = '' } = useParams()
  const { isPremium } = useAuth()

  if (!isQuestionModule(pathSlug)) {
    return <NotFoundPage />
  }

  const moduleSheets = getSheetsByModule(pathSlug)
  const totalCount = getQuestionsByModule(pathSlug).length

  return (
    <>
      <SEO
        title={`${getModuleTitle(pathSlug)}`}
        description={getModuleSeoDescription(pathSlug)}
        path={`/learn/${pathSlug}`}
      />

      <div>
        <p className="text-sm text-muted">Learning Path</p>
        <h1 className="mt-2 text-3xl font-bold">{getModuleTitle(pathSlug)}</h1>
        <p className="mt-4 max-w-3xl leading-relaxed text-muted">
          Structured, high-density interview preparation with {totalCount}+ curated questions. Free sheets give you
          enough value to trust the platform — Premium unlocks advanced sheets and full access across every module.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {moduleSheets.map((sheet, index) => (
            <motion.div
              key={sheet.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <SheetCard
                pathSlug={pathSlug}
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
            <h2 className="text-lg font-semibold">Unlock Premium</h2>
            <p className="mt-2 text-sm text-muted">
              Get advanced sheets, scenario questions, and full access across SQL, PySpark, Spark, Azure, Python, and
              more.
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
