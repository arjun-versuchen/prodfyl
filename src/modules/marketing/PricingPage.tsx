import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SEO } from '../../components/SEO'
import { GoogleSignInButton } from '../../components/auth/AuthButtons'
import { useAuth } from '../../contexts/AuthContext'
import {
  createRazorpayOrder,
  openRazorpayCheckout,
  PaymentError,
  recoverPendingPayment,
  verifyRazorpayPayment,
} from '../../lib/firebase/payments'
import { isSubscriptionExpired } from '../../lib/access'
import { trackEvent } from '../../lib/analytics'
import { tokens } from '../../lib/design-tokens'
import type { BillingPlan } from '../../types'

const plans = [
  {
    id: 'monthly' as BillingPlan,
    name: 'Premium Monthly',
    price: '₹499',
    period: '/ month',
    description: 'Full SQL premium content with monthly flexibility.',
    features: [
      'SQL Master Sheet',
      'Company-wise questions',
      'Advanced SQL & premium notes',
      'Early access placeholders for upcoming paths',
    ],
  },
  {
    id: 'yearly' as BillingPlan,
    name: 'Premium Yearly',
    price: '₹4,999',
    period: '/ year',
    description: 'Best value for serious interview prep.',
    featured: true,
    features: [
      'Everything in Monthly',
      'Save vs monthly billing',
      'Priority access to new modules',
      'Premium support channel (coming soon)',
    ],
  },
]

export default function PricingPage() {
  const { user, profile, isPremium, refreshProfile, isConfigured } = useAuth()
  const [loadingPlan, setLoadingPlan] = useState<BillingPlan | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || isPremium) return

    void recoverPendingPayment()
      .then(async (result) => {
        if (result.recovered) {
          setInfo(result.message)
          await refreshProfile()
        }
      })
      .catch(() => {
        // Silent best-effort recovery on pricing page load.
      })
  }, [user, isPremium, refreshProfile])

  const expired = isSubscriptionExpired(
    profile?.plan,
    profile?.subscription.status,
    profile?.subscription.currentPeriodEnd,
  )

  const handleSubscribe = async (plan: BillingPlan) => {
    if (!user) {
      setError('Please sign in with Google before purchasing Premium.')
      return
    }
    if (isPremium) {
      setInfo('You already have active Premium access.')
      return
    }

    setError(null)
    setInfo(null)
    setLoadingPlan(plan)
    trackEvent('begin_checkout', { plan })

    try {
      const order = await createRazorpayOrder(plan)
      await openRazorpayCheckout({
        order,
        userEmail: user.email ?? '',
        userName: user.displayName,
        onDismiss: () => {
          setLoadingPlan(null)
          setInfo('Checkout closed. You can retry anytime.')
        },
        onFailure: (message) => {
          setLoadingPlan(null)
          setError(message)
          navigate('/payment/failed')
        },
        onSuccess: async (payload) => {
          try {
            const result = await verifyRazorpayPayment({
              razorpayOrderId: payload.razorpay_order_id,
              razorpayPaymentId: payload.razorpay_payment_id,
              razorpaySignature: payload.razorpay_signature,
              plan,
              device: 'web',
            })
            await refreshProfile()
            trackEvent('purchase', { plan })
            setInfo(
              result.alreadyProcessed
                ? 'Premium is already active on your account.'
                : 'Payment successful. Premium access is now active.',
            )
            navigate('/learn/sql')
          } catch (err) {
            setError(
              err instanceof PaymentError
                ? err.message
                : 'Payment verification failed. Try again or use Recover Payment after login.',
            )
            navigate('/payment/failed')
          } finally {
            setLoadingPlan(null)
          }
        },
      })
    } catch (err) {
      setError(err instanceof PaymentError ? err.message : 'Unable to start checkout.')
      setLoadingPlan(null)
    }
  }

  const handleRecover = async () => {
    if (!user) {
      setError('Sign in to recover a pending payment.')
      return
    }
    setError(null)
    setInfo(null)
    try {
      const result = await recoverPendingPayment()
      if (result.recovered) {
        await refreshProfile()
        setInfo(result.message)
      } else {
        setInfo(result.message)
      }
    } catch (err) {
      setError(err instanceof PaymentError ? err.message : 'Unable to recover payment.')
    }
  }

  return (
    <>
      <SEO
        title="Pricing"
        description="InterviewMaster AI Premium — unlock Master Sheet, company questions, advanced SQL, and premium notes."
        path="/pricing"
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">Premium</p>
          <h1 className="mt-3 text-4xl font-bold">Simple pricing for serious prep</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Start free with SQL Basics and sample content. Upgrade when you are ready for the Master Sheet, company-wise questions, and advanced modules.
          </p>
        </div>

        {!isConfigured && (
          <p className="mx-auto mt-8 max-w-2xl rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-center text-sm text-warning">
            Firebase is not configured yet. Add environment variables to enable Google sign-in and Razorpay checkout.
          </p>
        )}

        {!user && (
          <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6">
            <p className="text-sm text-muted">Sign in to purchase Premium</p>
            <GoogleSignInButton />
          </div>
        )}

        {expired && (
          <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3 text-center text-sm text-warning">
            Your Premium access has expired.{' '}
            <Link to="/subscription/expired" className="font-medium underline">
              Renew Premium
            </Link>
          </div>
        )}

        {isPremium && (
          <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-success/30 bg-success/10 px-4 py-3 text-center text-sm text-success">
            You already have active Premium access. Enjoy the full SQL library.
          </div>
        )}

        {info && (
          <p className="mx-auto mt-6 max-w-xl text-center text-sm text-info">{info}</p>
        )}

        {error && (
          <p className="mx-auto mt-6 max-w-xl text-center text-sm text-warning">{error}</p>
        )}

        {user && !isPremium && (
          <div className="mx-auto mt-6 flex justify-center">
            <button type="button" onClick={() => void handleRecover()} className={tokens.btnSecondary}>
              Recover Pending Payment
            </button>
          </div>
        )}

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative ${tokens.card} p-8 ${
                plan.featured ? 'border-primary/40 shadow-lg shadow-primary/10' : ''
              }`}
            >
              {plan.featured && (
                <span className="absolute right-6 top-6 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
                  Best Value
                </span>
              )}
              <h2 className="text-2xl font-bold">{plan.name}</h2>
              <p className="mt-2 text-sm text-muted">{plan.description}</p>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-4xl font-extrabold">{plan.price}</span>
                <span className="pb-1 text-muted">{plan.period}</span>
              </div>
              <ul className="mt-8 space-y-3 text-sm text-muted">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="text-success">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={!!loadingPlan || isPremium}
                onClick={() => void handleSubscribe(plan.id)}
                className={`${tokens.btnPrimary} mt-8 w-full disabled:opacity-50`}
              >
                {loadingPlan === plan.id ? 'Opening checkout…' : isPremium ? 'Active Premium' : 'Get Premium'}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-3xl rounded-2xl border border-border bg-surface p-6">
          <h3 className="font-semibold">Free tier includes</h3>
          <p className="mt-2 text-sm text-muted">
            SQL Basics, sample JOINs and Aggregations, search within free content, learning path previews, and pricing access.
          </p>
          <Link to="/learn/sql" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
            Start practicing free SQL →
          </Link>
        </div>
      </div>
    </>
  )
}
