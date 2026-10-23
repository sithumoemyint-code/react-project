import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

export function Login() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    const result = login(username, password)
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate('/', { replace: true })
  }

  return (
    <div className="flex min-h-full items-center justify-center bg-[linear-gradient(180deg,#f8f9fb_0%,#ffffff_55%,#f3f5f8_100%)] p-6">
      <form
        className="flex w-full max-w-[400px] flex-col gap-4 rounded-xl border border-border bg-surface px-7 py-8 shadow-soft"
        onSubmit={handleSubmit}
      >
        <div>
          <h1 className="m-0 text-[1.35rem] font-semibold tracking-tight">Mytel for Developers</h1>
          <p className="mt-1.5 mb-2 text-[0.95rem] text-ink-muted">CMS Administration</p>
        </div>

        <label className="flex flex-col gap-1.5 text-sm text-ink">
          <span>Username</span>
          <input
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            className="h-[42px] rounded-md border border-border bg-surface px-3 text-ink outline-none transition focus:border-accent focus:shadow-[0_0_0_3px_rgba(11,95,255,0.15)]"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-ink">
          <span>Password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="h-[42px] rounded-md border border-border bg-surface px-3 text-ink outline-none transition focus:border-accent focus:shadow-[0_0_0_3px_rgba(11,95,255,0.15)]"
          />
        </label>

        {error ? <p className="m-0 text-sm text-danger">{error}</p> : null}

        <button
          type="submit"
          className="mt-1 h-[42px] rounded-md border-0 bg-accent font-semibold text-white transition hover:bg-accent-hover"
        >
          Sign in
        </button>

        <p className="mt-1 mb-0 text-center text-[0.8rem] text-ink-muted">Demo: admin / admin123</p>
      </form>
    </div>
  )
}
