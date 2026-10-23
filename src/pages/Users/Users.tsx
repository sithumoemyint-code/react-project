import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'

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

const avatarToneClass: Record<AvatarTone, string> = {
  orange: 'bg-orange-100 text-orange-700',
  purple: 'bg-violet-100 text-violet-700',
  yellow: 'bg-amber-100 text-amber-700',
}

const selectChevron =
  'appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%2712%27%20viewBox=%270%200%2024%2024%27%20fill=%27none%27%3E%3Cpath%20d=%27M6%209l6%206%206-6%27%20stroke=%27%236b7280%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27/%3E%3C/svg%3E")] bg-[length:12px_12px] bg-[position:right_12px_center] bg-no-repeat'

const modalFieldClass =
  'w-full rounded-md border border-border bg-white text-[0.925rem] text-slate-800 outline-none focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.15)]'

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
    <section className="flex flex-col gap-[18px]">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="m-0 text-xs font-bold tracking-[0.08em] text-orange-500 uppercase">Mytel Developer CMS</p>
          <h1 className="m-0 text-[1.4rem] leading-tight font-bold tracking-tight text-slate-800 min-[641px]:text-[1.75rem]">
            CMS Users
          </h1>
          <p className="m-0 text-[0.95rem] leading-normal text-ink-muted">
            Manage access, roles, and publishing permissions.
          </p>
        </div>
        <button
          type="button"
          className="h-10 shrink-0 rounded-md border-0 bg-orange-500 px-4 text-[0.9rem] font-semibold whitespace-nowrap text-white hover:bg-orange-600"
          onClick={() => setModalOpen(true)}
        >
          + Add User
        </button>
      </header>

      <label className="relative flex items-center">
        <span
          className="pointer-events-none absolute left-3.5 grid place-items-center text-ink-muted"
          aria-hidden="true"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        <input
          type="search"
          className="h-11 w-full rounded-[10px] border border-border bg-surface py-0 pr-3.5 pl-[42px] text-[0.925rem] text-ink shadow-soft outline-none focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.15)]"
          placeholder="Search users by name or email..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search users by name or email"
        />
      </label>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-soft">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr>
              <th className="border-b border-border bg-[#fafbfc] px-[18px] py-3.5 text-left text-[0.7rem] font-bold tracking-[0.06em] whitespace-nowrap text-slate-500 uppercase">
                User
              </th>
              <th className="border-b border-border bg-[#fafbfc] px-[18px] py-3.5 text-left text-[0.7rem] font-bold tracking-[0.06em] whitespace-nowrap text-slate-500 uppercase">
                Role
              </th>
              <th className="border-b border-border bg-[#fafbfc] px-[18px] py-3.5 text-left text-[0.7rem] font-bold tracking-[0.06em] whitespace-nowrap text-slate-500 uppercase">
                Status
              </th>
              <th className="border-b border-border bg-[#fafbfc] px-[18px] py-3.5 text-left text-[0.7rem] font-bold tracking-[0.06em] whitespace-nowrap text-slate-500 uppercase">
                Created
              </th>
              <th className="w-[72px] border-b border-border bg-[#fafbfc] px-[18px] py-3.5 text-right text-[0.7rem] font-bold tracking-[0.06em] whitespace-nowrap text-slate-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-[18px] py-9 text-center text-ink-muted">
                  No users found.
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.id}>
                  <td className="border-b border-border px-[18px] py-4 align-middle text-[0.9rem] text-slate-800 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <span
                        className={`grid size-10 shrink-0 place-items-center rounded-full text-[0.8rem] font-bold ${avatarToneClass[user.avatarTone]}`}
                        aria-hidden="true"
                      >
                        {user.initials}
                      </span>
                      <div>
                        <p className="m-0 text-[0.95rem] leading-snug font-bold text-slate-800">{user.name}</p>
                        <p className="mt-0.5 mb-0 text-[0.825rem] leading-snug text-ink-muted">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-border px-[18px] py-4 align-middle text-[0.9rem] text-slate-800 last:border-b-0">
                    <span className="inline-flex h-[26px] items-center rounded-full bg-orange-50 px-2.5 text-[0.775rem] font-semibold whitespace-nowrap text-orange-500">
                      {user.role}
                    </span>
                  </td>
                  <td className="border-b border-border px-[18px] py-4 align-middle text-[0.9rem] last:border-b-0">
                    <span
                      className={`text-[0.9rem] font-semibold ${
                        user.status === 'Active' ? 'text-green-600' : 'text-ink-muted'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="border-b border-border px-[18px] py-4 align-middle text-[0.9rem] whitespace-nowrap text-ink-muted last:border-b-0">
                    {user.created}
                  </td>
                  <td className="w-[72px] border-b border-border px-[18px] py-4 text-right align-middle last:border-b-0">
                    <div className="relative inline-flex justify-end">
                      <button
                        type="button"
                        className="grid size-8 place-items-center rounded-md border-0 bg-transparent text-ink-muted hover:bg-surface-hover hover:text-slate-800"
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
                        <div
                          className="absolute top-[calc(100%+4px)] right-0 z-5 flex min-w-40 flex-col rounded-[10px] border border-border bg-surface p-1.5 shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
                          role="menu"
                        >
                          <button
                            type="button"
                            role="menuitem"
                            className="rounded-md border-0 bg-transparent px-2.5 py-2 text-left text-[0.875rem] text-slate-800 hover:bg-surface-hover"
                            onClick={() => setOpenMenuId(null)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            className="rounded-md border-0 bg-transparent px-2.5 py-2 text-left text-[0.875rem] text-slate-800 hover:bg-surface-hover"
                            onClick={() => setOpenMenuId(null)}
                          >
                            Reset password
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            className="rounded-md border-0 bg-transparent px-2.5 py-2 text-left text-[0.875rem] text-red-600 hover:bg-surface-hover"
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
        <div className="fixed inset-0 z-40 grid place-items-center p-5" role="presentation">
          <button
            type="button"
            className="absolute inset-0 border-0 bg-slate-900/45"
            aria-label="Close add user dialog"
            onClick={closeModal}
          />
          <form
            className="relative z-1 flex w-full max-w-[440px] flex-col gap-4 rounded-[14px] bg-white px-[22px] pt-[22px] pb-5 shadow-[0_20px_50px_rgba(15,23,42,0.22)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-user-title"
            onSubmit={handleCreateUser}
          >
            <div className="flex items-center justify-between gap-3">
              <h2 id="add-user-title" className="m-0 text-[1.2rem] font-bold text-slate-800">
                Add User
              </h2>
              <button
                type="button"
                className="grid size-8 place-items-center rounded-md border-0 bg-transparent text-ink-muted hover:bg-surface-hover hover:text-slate-800"
                aria-label="Close"
                onClick={closeModal}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-[0.7rem] font-bold tracking-[0.06em] text-ink-muted uppercase">
                Display Name
              </span>
              <input
                type="text"
                className={`${modalFieldClass} h-[42px] px-3`}
                placeholder="Display name"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                required
                autoFocus
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[0.7rem] font-bold tracking-[0.06em] text-ink-muted uppercase">Email</span>
              <input
                type="email"
                className={`${modalFieldClass} h-[42px] px-3`}
                placeholder="name@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[0.7rem] font-bold tracking-[0.06em] text-ink-muted uppercase">Role</span>
              <select
                className={`${modalFieldClass} ${selectChevron} h-[42px] px-3 pr-7`}
                value={role}
                onChange={(event) => setRole(event.target.value as UserRole)}
              >
                <option value="Author">Author</option>
                <option value="Editor">Editor</option>
                <option value="Admin">Admin</option>
              </select>
            </label>

            <div className="mt-1 flex justify-end gap-2.5">
              <button
                type="button"
                className="h-10 rounded-md border border-border bg-white px-4 text-[0.9rem] font-semibold text-slate-800 hover:bg-surface-hover"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 rounded-md border-0 bg-orange-500 px-4 text-[0.9rem] font-semibold text-white hover:bg-orange-600"
              >
                Create user
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  )
}
