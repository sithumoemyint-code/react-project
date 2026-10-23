import { NavLink } from 'react-router-dom'
import './Sidebar.css'

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
    <aside className={`sidebar ${open ? 'sidebar--open' : ''}`}>
      <div className="sidebar__brand">
        <span className="sidebar__brand-mark">M</span>
        <div>
          <strong>Mytel CMS</strong>
          <span>For Developers</span>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Main">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `sidebar__link${isActive ? ' sidebar__link--active' : ''}`
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
