import { useMatch } from 'react-router-dom'
import { useSidebar } from '@/components/ui/sidebar'
import {  useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

export function useSidebarNavItem(to: string, end?: boolean) {
  const match = useMatch({ path: to, end: end ?? false })
  const isActive = !!match
  const { isMobile, setOpenMobile } = useSidebar()

  return { isActive, isMobile, setOpenMobile }
}

export function useSidebarLogout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { isMobile, setOpenMobile } = useSidebar()

  function handleLogout() {
    logout()
    if (isMobile) setOpenMobile(false)
    navigate('/login', { replace: true })
  }

  return { handleLogout }
}