import { FormEvent, useMemo, useState } from 'react'
import './Users.css'

type UserStatus = 'Active' | 'Inactive'
type AvatarTone = 'orange' | 'purple' | 'yellow'
type UserRole = 'Admin' | 'Editor' | 'Author'

type CmsUser = {
  id: string
  name: string
  email: string
  initials: string
  avatarTone: AvatarTone
  role: UserRole
  status: UserStatus
  created: string
}

const initialUsers: CmsUser[] = [
  {
    id: '1',
    name: 'Ko Sai',
    email: 'ko.sai@mytel.com.mm',
    initials: 'KS',
    avatarTone: 'orange',
    role: 'Admin',
    status: 'Active',
    created: 'Oct 02, 2024',
  },
  {
    id: '2',
    name: 'May Thu',
    email: 'may.thu@mytel.com.mm',
    initials: 'MT',
    avatarTone: 'purple',
    role: 'Editor',
    status: 'Active',
    created: 'Sep 28, 2024',
  },
  {
    id: '3',
    name: 'Aung Naing',
    email: 'aung.naing@mytel.com.mm',
    initials: 'AN',
    avatarTone: 'yellow',
    role: 'Author',
    status: 'Inactive',
    created: 'Sep 14, 2024',
  },
]

const avatarTones: AvatarTone[] = ['orange', 'purple', 'yellow']

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '??'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

function formatCreated(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

export function Users() {
  const [users, setUsers] = useState(initialUsers)
  const [query, setQuery] = useState('')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<UserRole>('Author')

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return users
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(normalized) ||
        user.email.toLowerCase().includes(normalized),
    )
  }, [users, query])

  function resetForm() {
    setDisplayName('')
    setEmail('')
    setRole('Author')
  }

  function closeModal() {
    setModalOpen(false)
    resetForm()
  }

  function handleCreateUser(event: FormEvent) {
    event.preventDefault()
    const name = displayName.trim()
    const mail = email.trim()
    if (!name || !mail) return

    setUsers((prev) => [
      {
        id: String(Date.now()),
        name,
        email: mail,
        initials: getInitials(name),
        avatarTone: avatarTones[prev.length % avatarTones.length],
        role,
        status: 'Active',
        created: formatCreated(),
      },
      ...prev,
    ])
    closeModal()
  }

  return (
    <section className="users">
      <header className="users__header">
        <div className="users__intro">
          <p className="users__eyebrow">Mytel Developer CMS</p>
          <h1 className="users__title">CMS Users</h1>
          <p className="users__subtitle">Manage access, roles, and publishing permissions.</p>
        </div>
        <button type="button" className="users__add" onClick={() => setModalOpen(true)}>
          + Add User
        </button>
      </header>

      <label className="users__search">
        <span className="users__search-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="search"
          placeholder="Search users by name or email..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search users by name or email"
        />
      </label>

      <div className="users__table-wrap">
        <table className="users__table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th className="users__th-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="users__empty">
                  No users found.
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="users__identity">
                      <span
                        className={`users__avatar users__avatar--${user.avatarTone}`}
                        aria-hidden="true"
                      >
                        {user.initials}
                      </span>
                      <div>
                        <p className="users__name">{user.name}</p>
                        <p className="users__email">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="users__role">{user.role}</span>
                  </td>
                  <td>
                    <span
                      className={`users__status${
                        user.status === 'Active' ? ' users__status--active' : ' users__status--inactive'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="users__created">{user.created}</td>
                  <td className="users__actions">
                    <div className="users__menu">
                      <button
                        type="button"
                        className="users__menu-btn"
                        aria-label={`Actions for ${user.name}`}
                        aria-expanded={openMenuId === user.id}
                        onClick={() =>
                          setOpenMenuId((current) => (current === user.id ? null : user.id))
                        }
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <circle cx="5" cy="12" r="1.8" />
                          <circle cx="12" cy="12" r="1.8" />
                          <circle cx="19" cy="12" r="1.8" />
                        </svg>
                      </button>
                      {openMenuId === user.id ? (
                        <div className="users__menu-panel" role="menu">
                          <button type="button" role="menuitem" onClick={() => setOpenMenuId(null)}>
                            Edit
                          </button>
                          <button type="button" role="menuitem" onClick={() => setOpenMenuId(null)}>
                            Reset password
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            className="users__menu-danger"
                            onClick={() => setOpenMenuId(null)}
                          >
                            Deactivate
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen ? (
        <div className="users-modal" role="presentation">
          <button
            type="button"
            className="users-modal__backdrop"
            aria-label="Close add user dialog"
            onClick={closeModal}
          />
          <form
            className="users-modal__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-user-title"
            onSubmit={handleCreateUser}
          >
            <div className="users-modal__header">
              <h2 id="add-user-title" className="users-modal__title">
                Add User
              </h2>
              <button
                type="button"
                className="users-modal__close"
                aria-label="Close"
                onClick={closeModal}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <label className="users-modal__field">
              <span className="users-modal__label">Display Name</span>
              <input
                type="text"
                placeholder="Display name"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                required
                autoFocus
              />
            </label>

            <label className="users-modal__field">
              <span className="users-modal__label">Email</span>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label className="users-modal__field">
              <span className="users-modal__label">Role</span>
              <select
                value={role}
                onChange={(event) => setRole(event.target.value as UserRole)}
              >
                <option value="Author">Author</option>
                <option value="Editor">Editor</option>
                <option value="Admin">Admin</option>
              </select>
            </label>

            <div className="users-modal__actions">
              <button type="button" className="users-modal__btn users-modal__btn--ghost" onClick={closeModal}>
                Cancel
              </button>
              <button type="submit" className="users-modal__btn users-modal__btn--primary">
                Create user
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  )
}
