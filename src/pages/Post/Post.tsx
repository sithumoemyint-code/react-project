import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

type PostStatus = 'Published' | 'Draft' | 'Private' | 'Trash'

type Post = {
  id: string
  title: string
  author: string
  category: string
  status: PostStatus
  date: string
}

type StatusTab = 'all' | 'published' | 'drafts' | 'private' | 'trash'

const posts: Post[] = [
  {
    id: '1',
    title: 'Developer onboarding guide',
    author: 'Admin',
    category: 'General',
    status: 'Published',
    date: 'Oct 14, 2024 · 10:42 am',
  },
  {
    id: '2',
    title: 'Mytel API reference',
    author: 'Developer',
    category: 'Announcements',
    status: 'Published',
    date: 'Oct 11, 2024 · 04:18 pm',
  },
  {
    id: '3',
    title: 'Getting started with webhooks',
    author: 'Admin',
    category: 'Promotions',
    status: 'Draft',
    date: 'Oct 07, 2024 · 09:05 am',
  },
  {
    id: '4',
    title: 'Products and services',
    author: 'Developer',
    category: 'General',
    status: 'Private',
    date: 'Sep 29, 2024 · 02:31 pm',
  },
]

const statusCounts = {
  all: 129,
  published: 120,
  drafts: 6,
  private: 3,
  trash: 0,
}

const tabs: { id: StatusTab; label: string; count: number }[] = [
  { id: 'all', label: 'All', count: statusCounts.all },
  { id: 'published', label: 'Published', count: statusCounts.published },
  { id: 'drafts', label: 'Drafts', count: statusCounts.drafts },
  { id: 'private', label: 'Private', count: statusCounts.private },
  { id: 'trash', label: 'Trash', count: statusCounts.trash },
]

const selectChevron =
  "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")] bg-[length:12px_12px] bg-[position:right_10px_center] bg-no-repeat"

const selectClass = `h-[34px] min-w-[130px] appearance-none rounded-md border border-border bg-surface px-2.5 pr-7 text-sm text-ink ${selectChevron}`

function matchesTab(post: Post, tab: StatusTab) {
  if (tab === 'all') return post.status !== 'Trash'
  if (tab === 'published') return post.status === 'Published'
  if (tab === 'drafts') return post.status === 'Draft'
  if (tab === 'private') return post.status === 'Private'
  return post.status === 'Trash'
}

function statusBadgeClass(status: PostStatus) {
  const base = 'inline-flex h-6 items-center whitespace-nowrap rounded-full px-2.5 text-xs font-semibold'
  if (status === 'Published') return `${base} bg-green-100 text-green-700`
  if (status === 'Draft') return `${base} bg-slate-100 text-slate-500`
  if (status === 'Private') return `${base} bg-teal-100 text-teal-700`
  return `${base} bg-red-100 text-danger`
}

export function Post() {
  const [activeTab, setActiveTab] = useState<StatusTab>('all')
  const [searchInput, setSearchInput] = useState('')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return posts.filter((post) => {
      if (!matchesTab(post, activeTab)) return false
      if (!normalized) return true
      return post.title.toLowerCase().includes(normalized)
    })
  }, [activeTab, query])

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((post) => selected.includes(post.id))

  function handleSearch(event: any) {
    event.preventDefault()
    setQuery(searchInput)
    setPage(1)
  }

  function toggleAllVisible() {
    if (allVisibleSelected) {
      setSelected((prev) => prev.filter((id) => !filtered.some((post) => post.id === id)))
      return
    }
    setSelected((prev) => [...new Set([...prev, ...filtered.map((post) => post.id)])])
  }

  function toggleOne(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="m-0 text-[1.75rem] font-bold tracking-tight text-ink max-md:text-[1.4rem]">
            Posts
          </h1>
          <Link
            to="/posts/new"
            className="inline-flex h-9 items-center rounded-md border-0 bg-accent px-3.5 text-[0.9rem] font-semibold text-white hover:bg-accent-hover"
          >
            + Add New
          </Link>
        </div>

        <form
          className="flex items-center gap-2 max-md:w-full"
          onSubmit={handleSearch}
        >
          <label className="relative flex items-center max-md:flex-1">
            <span
              className="pointer-events-none absolute left-3 grid place-items-center text-ink-muted"
              aria-hidden="true"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Search Posts"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              aria-label="Search posts"
              className="h-[38px] w-[min(280px,70vw)] rounded-md border border-border bg-surface py-0 pr-3 pl-9 text-[0.9rem] text-ink outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(11,95,255,0.15)] max-md:w-full"
            />
          </label>
          <button
            type="submit"
            className="h-[38px] shrink-0 rounded-md border-0 bg-ink px-3.5 text-sm font-semibold whitespace-nowrap text-white hover:bg-slate-900"
          >
            Search Posts
          </button>
        </form>
      </div>

      <nav className="flex flex-wrap items-center gap-y-1" aria-label="Post status">
        {tabs.map((tab, index) => (
          <span key={tab.id} className="inline-flex items-center">
            {index > 0 ? (
              <span className="mx-2.5 h-3.5 w-px bg-border" aria-hidden="true" />
            ) : null}
            <button
              type="button"
              className={`border-0 bg-transparent p-0 text-[0.9rem] font-medium ${
                activeTab === tab.id
                  ? 'font-bold text-accent'
                  : 'text-ink-muted hover:text-ink'
              }`}
              onClick={() => {
                setActiveTab(tab.id)
                setPage(1)
              }}
            >
              {tab.label} ({tab.count})
            </button>
          </span>
        ))}
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-border bg-surface px-3.5 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <select className={selectClass} defaultValue="" aria-label="Bulk actions">
            <option value="" disabled>
              Bulk Actions
            </option>
            <option value="edit">Edit</option>
            <option value="trash">Move to Trash</option>
          </select>
          <button
            type="button"
            className="h-[34px] rounded-md border border-border bg-surface px-3 text-sm font-medium text-ink hover:bg-surface-hover"
          >
            Apply
          </button>

          <select className={selectClass} defaultValue="all" aria-label="Filter by date">
            <option value="all">All dates</option>
            <option value="oct-2024">October 2024</option>
            <option value="sep-2024">September 2024</option>
          </select>
          <select className={selectClass} defaultValue="all" aria-label="Filter by category">
            <option value="all">All Categories</option>
            <option value="general">General</option>
            <option value="announcements">Announcements</option>
            <option value="promotions">Promotions</option>
          </select>
          <button
            type="button"
            className="h-[34px] rounded-md border border-border bg-surface px-3 text-sm font-medium text-ink hover:bg-surface-hover"
          >
            Filter
          </button>
        </div>
        <p className="m-0 text-sm whitespace-nowrap text-ink-muted">{statusCounts.all} items</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface shadow-soft">
        <table className="w-full min-w-[860px] border-collapse [&_tbody_tr:last-child_td]:border-b-0">
          <thead>
            <tr>
              <th className="w-[42px] border-b border-border px-3.5 py-3 text-left text-[0.7rem] font-bold tracking-wider whitespace-nowrap text-slate-400 uppercase">
                <input
                  type="checkbox"
                  className="size-[15px] accent-accent"
                  checked={allVisibleSelected}
                  onChange={toggleAllVisible}
                  aria-label="Select all posts"
                />
              </th>
              <th className="border-b border-border px-3.5 py-3 text-left text-[0.7rem] font-bold tracking-wider whitespace-nowrap text-slate-400 uppercase">
                Title
              </th>
              <th className="border-b border-border px-3.5 py-3 text-left text-[0.7rem] font-bold tracking-wider whitespace-nowrap text-slate-400 uppercase">
                Author
              </th>
              <th className="border-b border-border px-3.5 py-3 text-left text-[0.7rem] font-bold tracking-wider whitespace-nowrap text-slate-400 uppercase">
                Categories
              </th>
              <th className="border-b border-border px-3.5 py-3 text-left text-[0.7rem] font-bold tracking-wider whitespace-nowrap text-slate-400 uppercase">
                Status
              </th>
              <th className="border-b border-border px-3.5 py-3 text-left text-[0.7rem] font-bold tracking-wider whitespace-nowrap text-slate-400 uppercase">
                Date
              </th>
              <th className="border-b border-border px-3.5 py-3 text-left text-[0.7rem] font-bold tracking-wider whitespace-nowrap text-slate-400 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3.5 py-8 text-center text-ink-muted">
                  No posts found.
                </td>
              </tr>
            ) : (
              filtered.map((post) => (
                <tr key={post.id}>
                  <td className="w-[42px] border-b border-border px-3.5 py-3.5 align-middle">
                    <input
                      type="checkbox"
                      className="size-[15px] accent-accent"
                      checked={selected.includes(post.id)}
                      onChange={() => toggleOne(post.id)}
                      aria-label={`Select ${post.title}`}
                    />
                  </td>
                  <td className="border-b border-border px-3.5 py-3.5 align-middle text-[0.9rem] text-ink">
                    <div className="flex flex-col gap-1.5">
                      <button
                        type="button"
                        className="border-0 bg-transparent p-0 text-left text-[0.95rem] font-semibold text-accent hover:text-accent-hover hover:underline"
                      >
                        {post.title}
                      </button>
                      <div className="flex items-center gap-1.5 text-xs text-slate-300">
                        <button
                          type="button"
                          className="border-0 bg-transparent p-0 text-xs text-ink-muted hover:text-ink"
                        >
                          Edit
                        </button>
                        <span aria-hidden="true">|</span>
                        <button
                          type="button"
                          className="border-0 bg-transparent p-0 text-xs text-ink-muted hover:text-ink"
                        >
                          Quick Edit
                        </button>
                        <span aria-hidden="true">|</span>
                        <button
                          type="button"
                          className="border-0 bg-transparent p-0 text-xs text-danger hover:text-ink"
                        >
                          Trash
                        </button>
                        <span aria-hidden="true">|</span>
                        <button
                          type="button"
                          className="border-0 bg-transparent p-0 text-xs text-ink-muted hover:text-ink"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="border-b border-border px-3.5 py-3.5 align-middle text-[0.9rem] text-ink">
                    {post.author}
                  </td>
                  <td className="border-b border-border px-3.5 py-3.5 align-middle text-[0.9rem] text-ink">
                    {post.category}
                  </td>
                  <td className="border-b border-border px-3.5 py-3.5 align-middle text-[0.9rem] text-ink">
                    <span className={statusBadgeClass(post.status)}>{post.status}</span>
                  </td>
                  <td className="border-b border-border px-3.5 py-3.5 align-middle text-[0.9rem] whitespace-nowrap text-ink-muted">
                    {post.date}
                  </td>
                  <td className="border-b border-border px-3.5 py-3.5 align-middle text-[0.9rem] text-ink">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label={`Edit ${post.title}`}
                        className="grid size-8 place-items-center rounded-md border-0 bg-transparent text-ink-muted hover:bg-surface-hover hover:text-ink"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path
                            d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinejoin="round"
                          />
                          <path d="M12.5 6.5l3 3" stroke="currentColor" strokeWidth="1.8" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${post.title}`}
                        className="grid size-8 place-items-center rounded-md border-0 bg-transparent text-ink-muted hover:bg-red-50 hover:text-danger"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <path d="M5 7h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                          <path d="M9 7V5h6v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                          <path
                            d="M8 7l1 12h6l1-12"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="m-0 text-sm text-ink-muted">
          Showing {filtered.length} of {statusCounts.all} posts
        </p>
        <div className="flex items-center gap-1.5" role="navigation" aria-label="Pagination">
          <button
            type="button"
            className="h-[34px] min-w-[34px] rounded-md border border-border bg-surface px-3 text-sm font-medium text-ink hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-45"
            disabled={page === 1}
            onClick={() => setPage(1)}
          >
            Previous
          </button>
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              type="button"
              className={`h-[34px] min-w-[34px] rounded-md border px-0 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-45 ${
                page === num
                  ? 'border-accent bg-accent text-white'
                  : 'border-border bg-surface text-ink hover:bg-surface-hover'
              }`}
              onClick={() => setPage(num)}
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            className="h-[34px] min-w-[34px] rounded-md border border-border bg-surface px-3 text-sm font-medium text-ink hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-45"
            disabled={page === 3}
            onClick={() => setPage(3)}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  )
}
