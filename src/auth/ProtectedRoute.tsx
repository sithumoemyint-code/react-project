import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  console.log(isAuthenticated,  ' isAuthenticated');

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />

  return <Outlet />
}
