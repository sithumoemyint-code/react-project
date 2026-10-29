import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { DashboardLayout } from './layouts/DashboardLayout/DashboardLayout'
import { Login } from './pages/Login/presentation/pages/Login'
import { appRoutes } from './routes/appRoutes'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              {appRoutes.map((route) => {
                const Page = route.element
                return route.routePath === '' ? (
                  <Route key={route.path} index element={<Page />} />
                ) : (
                  <Route key={route.path} path={route.routePath} element={<Page />} />
                )
              })}
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
