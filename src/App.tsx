import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import ModuleShell from './components/module-shell/ModuleShell'
import { ErrorBoundary } from './components/ErrorBoundary'
import { PageSkeleton } from './components/PremiumLock'
import {
  ForbiddenPage,
  NotFoundPage,
  OfflinePage,
  PaymentFailedPage,
  ServerErrorPage,
  SubscriptionExpiredPage,
} from './modules/marketing/errors/ErrorPages'
import ComingSoonRoute from './modules/marketing/errors/ComingSoonRoute'
import {
  LegacyQuestionRedirect,
  LegacySheetRedirect,
  LegacySheetsRedirect,
} from './components/routing/LegacyRedirects'
import { learningPathBySlug } from './data/learningPaths'
import { initAnalytics } from './lib/analytics'

const HomePage = lazy(() => import('./modules/marketing/HomePage'))
const LearningPathsPage = lazy(() => import('./modules/marketing/LearningPathsPage'))
const PricingPage = lazy(() => import('./modules/marketing/PricingPage'))
const SqlModuleHome = lazy(() => import('./modules/sql/SqlModuleHome'))
const SqlSheetPage = lazy(() => import('./modules/sql/SqlSheetPage'))
const SqlQuestionPage = lazy(() => import('./modules/sql/SqlQuestionPage'))

function LearnPathGate({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const slug = location.pathname.split('/')[2] ?? ''
  const path = learningPathBySlug[slug]

  if (!path) return <NotFoundPage />
  if (path.status === 'coming_soon') return <Navigate to={`/coming-soon/${slug}`} replace />

  return <>{children}</>
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  useEffect(() => {
    initAnalytics()
  }, [])

  return (
    <ErrorBoundary>
      <ScrollToTop />
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="learning-paths" element={<LearningPathsPage />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="403" element={<ForbiddenPage />} />
            <Route path="500" element={<ServerErrorPage />} />
            <Route path="offline" element={<OfflinePage />} />
            <Route path="payment/failed" element={<PaymentFailedPage />} />
            <Route path="subscription/expired" element={<SubscriptionExpiredPage />} />
            <Route path="coming-soon/:pathSlug" element={<ComingSoonRoute />} />

            <Route
              path="learn/:pathSlug"
              element={
                <LearnPathGate>
                  <ModuleShell />
                </LearnPathGate>
              }
            >
              <Route index element={<SqlModuleHome />} />
              <Route path="sheet/:sheetSlug" element={<SqlSheetPage />} />
              <Route path="question/:id" element={<SqlQuestionPage />} />
            </Route>

            <Route path="sheets" element={<LegacySheetsRedirect />} />
            <Route path="sheet/:slug" element={<LegacySheetRedirect />} />
            <Route path="question/:id" element={<LegacyQuestionRedirect />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}
