import { HiOutlineUser } from 'react-icons/hi'
import { useLocation } from 'react-router-dom'
import { SidebarTrigger } from '@/components/ui/sidebar'

const pageMeta: Record<
  string,
  { eyebrow: string; title: string; description: string }
> = {
  '/': {
    eyebrow: 'Dashboard',
    title: 'Welcome to Mytel Developer CMS!',
    description: 'Manage your APIs, contents and developer platform from one workspace.',
  },
  '/posts': {
    eyebrow: 'Posts',
    title: 'Content Posts',
    description: 'Create, edit, and publish developer content.',
  },
  '/posts/new': {
    eyebrow: 'Posts',
    title: 'New Post',
    description: 'Draft a new content post for the developer platform.',
  },
  '/taxonomies': {
    eyebrow: 'Categories',
    title: 'Categories',
    description: 'Organize content with taxonomies and categories.',
  },
  '/media': {
    eyebrow: 'Media Library',
    title: 'Media Library',
    description: 'Upload and manage images and other media assets.',
  },
  '/users': {
    eyebrow: 'Users',
    title: 'CMS Users',
    description: 'Manage admin accounts and workspace access.',
  },
  '/activity': {
    eyebrow: 'Activity Logs',
    title: 'Activity Logs',
    description: 'Review recent workspace events and audit history.',
  },
}

function resolveMeta(pathname: string) {
  if (pageMeta[pathname]) return pageMeta[pathname]
  const match = Object.keys(pageMeta).find(
    (key) => key !== '/' && pathname.startsWith(key),
  )
  return match ? pageMeta[match] : pageMeta['/']
}

export function AppTopbar() {
  const { pathname } = useLocation()
  const meta = resolveMeta(pathname)

  return (
    <header className="flex  shrink-0 items-center justify-between gap-4 border-b border-border bg-surface p-4 md:p-4">
      <div className="flex min-w-0 items-center gap-3">
        <SidebarTrigger className="md:hidden" />
        <div className="min-w-0">
          <p className="m-0 text-[0.65rem] font-bold tracking-[0.08em] text-brand uppercase">
            {meta.eyebrow}
          </p>
          <h1 className="m-0 truncate text-base leading-tight font-bold tracking-tight text-slate-900 md:text-lg">
            {meta.title}
          </h1>
          <p className="mt-0.5 mb-0 hidden max-w-[54ch] truncate text-xs leading-none text-slate-500 sm:block">
            {meta.description}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span
          className="grid size-8 place-items-center rounded-full bg-slate-100 text-slate-500"
          aria-hidden="true"
        >
          <HiOutlineUser className="size-4" />
        </span>
        <span className="hidden text-sm font-medium text-slate-800 sm:inline">
          Kitto, Admin
        </span>
      </div>
    </header>
  )
}
