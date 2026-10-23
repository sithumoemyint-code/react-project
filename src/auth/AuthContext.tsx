import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const SESSION_KEY = 'mytel-cms-session'
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7
const DEMO_USERNAME = 'admin'
const DEMO_PASSWORD = 'admin123'

type User = {
  username: string
}

type AuthContextValue = {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => { ok: true } | { ok: false; error: string }
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function getCookie(name: string): string | null {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function setCookie(name: string, value: string, maxAgeSeconds = SESSION_MAX_AGE_SECONDS) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`
}

function removeCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`
}

function readSession(): User | null {
  try {
    const raw = getCookie(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as User
    if (!parsed?.username) return null
    return parsed
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readSession())

  const login = useCallback((username: string, password: string) => {
    const trimmed = username.trim()
    if (!trimmed || !password) {
      return { ok: false as const, error: 'Username and password are required.' }
    }
    if (trimmed !== DEMO_USERNAME || password !== DEMO_PASSWORD) {
      return { ok: false as const, error: 'Invalid username or password.' }
    }
    const next: User = { username: trimmed }
    setCookie(SESSION_KEY, JSON.stringify(next))
    setUser(next)
    return { ok: true as const }
  }, [])

  const logout = useCallback(() => {
    removeCookie(SESSION_KEY)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
