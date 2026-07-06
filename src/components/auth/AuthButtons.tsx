import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { User } from 'firebase/auth'
import { useAuth } from '../../contexts/AuthContext'
import { tokens } from '../../lib/design-tokens'
import type { UserProfile } from '../../types'

function getUserInitial(user: User, profile: UserProfile | null): string {
  const label = profile?.displayName ?? user.displayName ?? user.email ?? '?'
  return label.charAt(0).toUpperCase()
}

function getDisplayName(user: User, profile: UserProfile | null): string {
  return profile?.displayName ?? user.displayName ?? user.email?.split('@')[0] ?? 'Account'
}

function UserAvatar({
  user,
  profile,
  size = 'sm',
}: {
  user: User
  profile: UserProfile | null
  size?: 'sm' | 'md'
}) {
  const [imageError, setImageError] = useState(false)
  const photoURL = user.photoURL?.trim() ?? ''
  const sizeClass = size === 'md' ? 'h-10 w-10 text-sm' : 'h-8 w-8 text-xs'

  useEffect(() => {
    setImageError(false)
  }, [photoURL])

  const showImage = photoURL.length > 0 && !imageError

  if (showImage) {
    return (
      <img
        src={photoURL}
        alt=""
        referrerPolicy="no-referrer"
        className={`${sizeClass} shrink-0 rounded-full border border-border object-cover`}
        onError={() => setImageError(true)}
      />
    )
  }

  return (
    <div
      className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-full border border-border bg-gradient-to-br from-primary/30 to-accent/30 font-bold text-foreground`}
      aria-hidden="true"
    >
      {getUserInitial(user, profile)}
    </div>
  )
}

function PremiumBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent ${className}`}
    >
      Premium
    </span>
  )
}

const upgradeCtaClass =
  'inline-flex items-center rounded-lg border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-xs font-semibold text-primary transition hover:border-primary/50 hover:bg-primary/15'

export function GoogleSignInButton({ className = '' }: { className?: string }) {
  const { signInWithGoogle, loading, isConfigured, authError } = useAuth()

  if (!isConfigured) {
    return (
      <p className="text-xs text-warning">
        Firebase not configured. Add env vars to enable Google sign-in.
      </p>
    )
  }

  return (
    <div className={className}>
      <button
        type="button"
        disabled={loading}
        onClick={() => void signInWithGoogle()}
        className={`${tokens.btnSecondary} gap-2 disabled:opacity-60`}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>
      {authError && <p className="mt-2 text-xs text-warning">{authError}</p>}
    </div>
  )
}

function UserMenuSkeleton({ variant }: { variant: 'desktop' | 'mobile' }) {
  if (variant === 'mobile') {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="skeleton h-10 w-10 rounded-full" />
          <div className="space-y-1.5">
            <div className="skeleton h-4 w-28 rounded" />
            <div className="skeleton h-3 w-36 rounded" />
          </div>
        </div>
      </div>
    )
  }

  return <div className="skeleton h-9 w-36 rounded-xl" />
}

function DesktopUserMenu() {
  const { user, profile, signOut, isPremium } = useAuth()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  if (!user) return null

  const displayName = getDisplayName(user, profile)
  const email = user.email ?? profile?.email

  useEffect(() => {
    if (!open) return

    function handleClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  return (
    <div
      ref={menuRef}
      className="relative flex items-center gap-1 rounded-xl border border-border bg-surface/60 p-1 pl-2"
    >
      {isPremium ? (
        <PremiumBadge className="mr-1" />
      ) : (
        <Link to="/pricing" className={`${upgradeCtaClass} mr-1`}>
          Upgrade
        </Link>
      )}

      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
        onClick={() => setOpen((value) => !value)}
        className={`flex items-center gap-1.5 rounded-lg py-1 pl-1 pr-2 transition ${
          open ? 'bg-surface' : 'hover:bg-surface'
        }`}
      >
        <UserAvatar user={user} profile={profile} />
        <svg
          className={`h-3.5 w-3.5 text-muted transition ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-60 overflow-hidden rounded-xl border border-border bg-card shadow-xl shadow-black/25"
        >
          <div className="border-b border-border px-3 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted">Signed in as</p>
            <p className="mt-1 truncate text-sm font-semibold text-foreground">{displayName}</p>
            {email && <p className="truncate text-xs text-muted">{email}</p>}
          </div>

          <div className="p-1">
            {!isPremium && (
              <Link
                to="/pricing"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-primary transition hover:bg-primary/10"
              >
                Upgrade
              </Link>
            )}
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false)
                void signOut()
              }}
              className="flex w-full items-center rounded-lg px-3 py-2 text-sm text-muted transition hover:bg-surface hover:text-foreground"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function MobileUserMenu() {
  const { user, profile, signOut, isPremium } = useAuth()

  if (!user) return null

  const displayName = getDisplayName(user, profile)
  const email = user.email ?? profile?.email

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <UserAvatar user={user} profile={profile} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{displayName}</p>
          {email && <p className="truncate text-xs text-muted">{email}</p>}
        </div>
        {isPremium && <PremiumBadge />}
      </div>

      {!isPremium && (
        <Link to="/pricing" className={`${upgradeCtaClass} w-full justify-center py-2`}>
          Upgrade to Premium
        </Link>
      )}

      <button
        type="button"
        onClick={() => void signOut()}
        className={`${tokens.btnSecondary} w-full justify-center py-2 text-sm`}
      >
        Sign out
      </button>
    </div>
  )
}

export function UserMenu({ variant = 'desktop' }: { variant?: 'desktop' | 'mobile' }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <UserMenuSkeleton variant={variant} />
  }

  if (!user) {
    return <GoogleSignInButton className={variant === 'mobile' ? 'w-full' : ''} />
  }

  return variant === 'mobile' ? <MobileUserMenu /> : <DesktopUserMenu />
}
