import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { Sidebar } from './Sidebar'
import './DashboardLayout.css'

export function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="dashboard">
      <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />

      {sidebarOpen ? (
        <button
          type="button"
          className="dashboard__backdrop"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <div className="dashboard__main">
        <header className="dashboard__header">
          <button
            type="button"
            className="dashboard__menu-btn"
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
          >
            Menu
          </button>
          <div className="dashboard__header-spacer" />
          <span className="dashboard__user">{user?.username}</span>
          <button type="button" className="dashboard__logout" onClick={handleLogout}>
            Logout
          </button>
        </header>

        <main className="dashboard__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
