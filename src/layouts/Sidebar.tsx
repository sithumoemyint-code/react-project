import { NavLink } from 'react-router-dom'

const menuItems = [
  { to: '/', label: 'Overview', end: true },
  { to: '/posts', label: 'Posts' },
  { to: '/media', label: 'Media' },
  { to: '/taxonomies', label: 'Taxonomies' },
  { to: '/users', label: 'CMS Users' },
]

type SidebarProps = {
  open: boolean
  onNavigate?: () => void
}

export function Sidebar({ open, onNavigate }: SidebarProps) {
  return (
    <aside
      className={`z-20 flex h-full w-sidebar shrink-0 flex-col border-r border-border bg-surface max-md:fixed max-md:top-0 max-md:left-0 max-md:shadow-soft max-md:transition-transform max-md:duration-200 ${
        open ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'
      }`}
    >
      <div className="flex h-header items-center gap-3 border-b border-border px-4">
        <span className="grid size-8 place-items-center rounded-md bg-accent text-[0.95rem] font-bold text-white">
          M
        </span>
        <div>
          <strong className="block text-[0.95rem] leading-tight">Mytel CMS</strong>
          <span className="block text-xs text-ink-muted">For Developers</span>
        </div>
      </div>

      <nav className="flex flex-col gap-1 px-3 py-4" aria-label="Main">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `block rounded-md px-3 py-2.5 text-[0.925rem] transition-colors ${
                isActive
                  ? 'bg-[rgba(11,95,255,0.1)] font-semibold text-accent'
                  : 'text-ink hover:bg-surface-hover'
              }`
            }
            onClick={onNavigate}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
