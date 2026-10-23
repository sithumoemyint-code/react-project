import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const SESSION_KEY = 'mytel-cms-session'
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

function readSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
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
    localStorage.setItem(SESSION_KEY, JSON.stringify(next))
    setUser(next)
    return { ok: true as const }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
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
