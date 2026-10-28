import type { IconType } from 'react-icons'
import {
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineLogout,
  HiOutlinePhotograph,
  HiOutlineTemplate,
  HiOutlineUserGroup,
  HiOutlineViewGrid,
} from 'react-icons/hi'
import { NavLink, useMatch, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

const menuItems: {
  to: string
  label: string
  icon: IconType
  end?: boolean
}[] = [
  { to: '/', label: 'Dashboard', icon: HiOutlineViewGrid, end: true },
  { to: '/posts', label: 'Posts', icon: HiOutlineDocumentText },
  { to: '/taxonomies', label: 'Categories', icon: HiOutlineTemplate },
  { to: '/media', label: 'Media Library', icon: HiOutlinePhotograph },
  { to: '/users', label: 'Users', icon: HiOutlineUserGroup },
  { to: '/activity', label: 'Activity Logs', icon: HiOutlineClock },
]

function SidebarNavItem({
  to,
  label,
  icon: Icon,
  end,
}: {
  to: string
  label: string
  icon: IconType
  end?: boolean
}) {
  const match = useMatch({ path: to, end: end ?? false })
  const isActive = !!match
  const { isMobile, setOpenMobile } = useSidebar()

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        render={
          <NavLink
            to={to}
            end={end}
            onClick={() => isMobile && setOpenMobile(false)}
          />
        }
        isActive={isActive}
        className={cn(
          'h-10 gap-3 rounded-xl px-3 text-[0.95rem] font-medium text-slate-500 hover:bg-surface-hover hover:text-slate-700',
          isActive &&
            'bg-brand-soft font-semibold text-brand hover:bg-brand-soft hover:text-brand',
        )}
      >
        <Icon className={cn('size-[1.15rem] shrink-0', isActive ? 'text-brand' : 'text-slate-400')} />
        <span>{label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function AppSidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { isMobile, setOpenMobile } = useSidebar()

  function handleLogout() {
    logout()
    if (isMobile) setOpenMobile(false)
    navigate('/login', { replace: true })
  }

  return (
    <Sidebar collapsible="offcanvas" className="border-sidebar-border">
      <SidebarHeader className="border-b border-slate-200 px-4 py-5.5">
        <div className="flex items-center gap-3">
          <img
            src="/images/logo.webp"
            alt="Mytel CMS"
            className="size-10 shrink-0 rounded-xl object-contain"
          />
          <div className="min-w-0">
            <strong className="block truncate text-[1.05rem] leading-tight font-bold text-slate-900">
              Mytel CMS
            </strong>
            <span className="mt-0.5 block truncate text-xs text-slate-400">
              Developer Workspace
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup className="p-2">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {menuItems.map((item) => (
                <SidebarNavItem key={item.to} {...item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-danger-soft text-[0.95rem] font-semibold text-danger transition-colors hover:bg-red-100"
        >
          <HiOutlineLogout className="size-5" />
          Log out
        </button>
      </SidebarFooter>
    </Sidebar>
  )
}
