import type { IconType } from 'react-icons'
import { NavLink } from 'react-router-dom'
import {
  SidebarMenuButton,
  SidebarMenuItem, 
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { useSidebarNavItem } from './AppSidebarUtils'

export function SidebarNavItem({
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
  const { isActive, isMobile, setOpenMobile } = useSidebarNavItem(to, end)

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