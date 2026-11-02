import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { PageLoader } from './reusable/page-loader/PageLoader'
import { appRoutes } from './routes/appRoutes'

const DashboardLayout = lazy(() =>
  import('./layouts/DashboardLayout/presentation/pages/DashboardLayout').then((module) => ({
    default: module.DashboardLayout,
  })),
)
const Login = lazy(() =>
  import('./pages/Login/presentation/pages/Login').then((module) => ({ default: module.Login })),
)

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader className="min-h-svh" />}>
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
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
