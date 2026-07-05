import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SEO } from '../../../components/SEO'
import { tokens } from '../../../lib/design-tokens'

interface ErrorPageProps {
  code: string
  title: string
  description: string
  primaryLabel: string
  primaryTo: string
  secondaryLabel?: string
  secondaryTo?: string
  path: string
  noIndex?: boolean
}

export function ErrorPageLayout({
  code,
  title,
  description,
  primaryLabel,
  primaryTo,
  secondaryLabel,
  secondaryTo,
  path,
  noIndex = true,
}: ErrorPageProps) {
  return (
    <>
      <SEO title={title} description={description} path={path} noIndex={noIndex} />
      <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{code}</p>
          <h1 className="mt-4 text-4xl font-bold">{title}</h1>
          <p className="mt-4 text-muted">{description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to={primaryTo} className={tokens.btnPrimary}>
              {primaryLabel}
            </Link>
            {secondaryLabel && secondaryTo && (
              <Link to={secondaryTo} className={tokens.btnSecondary}>
                {secondaryLabel}
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </>
  )
}

export function NotFoundPage() {
  return (
    <ErrorPageLayout
      code="404"
      title="Page not found"
      description="The page you are looking for does not exist or may have moved."
      primaryLabel="Go Home"
      primaryTo="/"
      secondaryLabel="Browse SQL"
      secondaryTo="/learn/sql"
      path="/404"
    />
  )
}

export function ForbiddenPage() {
  return (
    <ErrorPageLayout
      code="403"
      title="Access denied"
      description="You do not have permission to view this page."
      primaryLabel="Go Home"
      primaryTo="/"
      secondaryLabel="View Pricing"
      secondaryTo="/pricing"
      path="/403"
    />
  )
}

export function ServerErrorPage() {
  return (
    <ErrorPageLayout
      code="500"
      title="Something went wrong"
      description="We encountered an unexpected error. Please try again in a moment."
      primaryLabel="Refresh"
      primaryTo="/"
      secondaryLabel="Contact Support"
      secondaryTo="/"
      path="/500"
    />
  )
}

export function OfflinePage() {
  return (
    <ErrorPageLayout
      code="Offline"
      title="You are offline"
      description="Check your internet connection and try again."
      primaryLabel="Retry"
      primaryTo="/"
      path="/offline"
    />
  )
}

export function PaymentFailedPage() {
  return (
    <ErrorPageLayout
      code="Payment"
      title="Payment failed"
      description="Your payment could not be verified. No charges were applied to your Premium account."
      primaryLabel="Try Again"
      primaryTo="/pricing"
      secondaryLabel="Go Home"
      secondaryTo="/"
      path="/payment/failed"
    />
  )
}

export function SubscriptionExpiredPage() {
  return (
    <ErrorPageLayout
      code="Premium"
      title="Subscription expired"
      description="Your Premium access has expired. Renew to continue accessing Master Sheet, company questions, and advanced SQL."
      primaryLabel="Renew Premium"
      primaryTo="/pricing"
      secondaryLabel="Browse Free SQL"
      secondaryTo="/learn/sql"
      path="/subscription/expired"
    />
  )
}

export function ComingSoonPage({ pathSlug }: { pathSlug?: string }) {
  const title = pathSlug
    ? pathSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'This path'

  return (
    <ErrorPageLayout
      code="Coming Soon"
      title={`${title} is coming soon`}
      description="InterviewMaster AI is expanding module by module. SQL is live today — more Data Engineering paths are on the way."
      primaryLabel="Practice SQL Now"
      primaryTo="/learn/sql"
      secondaryLabel="All Learning Paths"
      secondaryTo="/learning-paths"
      path={pathSlug ? `/coming-soon/${pathSlug}` : '/coming-soon'}
    />
  )
}
