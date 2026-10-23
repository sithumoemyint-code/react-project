import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Sidebar } from './Sidebar'

export function DashboardLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex h-full bg-surface-subtle">
      <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />

      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-[15] hidden border-0 bg-[rgba(26,29,35,0.35)] max-md:block"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-header items-center gap-3 border-b border-border bg-surface px-5">
          <button
            type="button"
            className="hidden h-[34px] items-center rounded-md border border-border bg-surface px-3 text-sm text-ink max-md:inline-flex"
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
          >
            Menu
          </button>
          <div className="flex-1" />
          <button
            type="button"
            className="h-[34px] rounded-md border border-border bg-surface px-3 text-sm text-ink hover:bg-surface-hover"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
