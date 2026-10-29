import { HiOutlineUser } from 'react-icons/hi' 
import { SidebarTrigger } from '@/components/ui/sidebar'  
import {usePageMeta} from '../hooks/AppTopBarUtils'
import { Typography } from '@/reusable'
 
export function AppTopbar() {
  const meta = usePageMeta()

  return (
    <header className="flex  shrink-0 items-center justify-between gap-4 border-b border-border bg-surface p-4 md:p-4">
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger className="md:hidden" />
        <div className="min-w-0">
          <Typography size={24} weight={600} fontFamily='poppins'>{meta.eyebrow}</Typography>
          <Typography color='#7D7D7D' className="mt-0.5 mb-0 hidden max-w-[54ch] truncate leading-none sm:block">{meta.description}</Typography>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span
          className="grid size-8 place-items-center rounded-full bg-slate-100 text-slate-500"
          aria-hidden="true"
        >
          <HiOutlineUser className="size-4" />
        </span>
        <Typography weight={600}>Kitto, Admin</Typography>
      </div>
    </header>
  )
}
