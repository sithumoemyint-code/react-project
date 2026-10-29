import { Outlet } from 'react-router-dom'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppSidebar } from '../../../AppSidebar/presentation/pages/AppSidebar'
import { AppTopbar } from '../../../AppTopbar/presentation/pages/AppTopbar'

export function DashboardLayout() {
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen>
        <AppSidebar />
        <SidebarInset className="bg-[#f7f9fc]">
          <AppTopbar />
          <main className="flex-1 overflow-auto p-4">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
