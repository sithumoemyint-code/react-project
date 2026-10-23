import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { DashboardLayout } from './layouts/DashboardLayout'
import { Content } from './pages/Content'
import { Dashboard } from './pages/Dashboard'
import { Login } from './pages/Login'
import { Media } from './pages/Media'
import { PostNew } from './pages/PostNew'
import { Taxonomies } from './pages/Taxonomies'
import { Users } from './pages/Users'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="posts" element={<Content />} />
              <Route path="posts/new" element={<PostNew />} />
              <Route path="media" element={<Media />} />
              <Route path="taxonomies" element={<Taxonomies />} />
              <Route path="users" element={<Users />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
