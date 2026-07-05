import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '../lib/firebase/config'
import { fetchUserProfile, upsertUserProfile } from '../lib/firebase/users'
import { isSubscriptionActive } from '../lib/access'
import type { UserProfile } from '../types'

interface AuthContextValue {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  isPremium: boolean
  isConfigured: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  authError: string | null
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState<string | null>(null)

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null)
      return
    }
    const next = await fetchUserProfile(user.uid)
    setProfile(next)
  }, [user])

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      setLoading(true)
      setAuthError(null)
      setUser(nextUser)

      if (nextUser) {
        try {
          const nextProfile = await upsertUserProfile({
            uid: nextUser.uid,
            email: nextUser.email ?? '',
            displayName: nextUser.displayName,
            photoURL: nextUser.photoURL,
          })
          setProfile(nextProfile)
        } catch {
          setAuthError('Unable to sync your profile. Please try again.')
          setProfile(null)
        }
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signInWithGoogle = useCallback(async () => {
    if (!auth) {
      setAuthError('Firebase is not configured.')
      return
    }
    setAuthError(null)
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch {
      setAuthError('Google sign-in failed. Please try again.')
    }
  }, [])

  const signOut = useCallback(async () => {
    if (!auth) return
    await firebaseSignOut(auth)
    setProfile(null)
  }, [])

  const isPremium = isSubscriptionActive(profile?.plan, profile?.subscription.status)

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isPremium,
      isConfigured: isFirebaseConfigured,
      signInWithGoogle,
      signOut,
      refreshProfile,
      authError,
    }),
    [user, profile, loading, isPremium, signInWithGoogle, signOut, refreshProfile, authError],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
