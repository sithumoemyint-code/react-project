import { FormEvent, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './Posts.css'

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

function matchesTab(post: Post, tab: StatusTab) {
  if (tab === 'all') return post.status !== 'Trash'
  if (tab === 'published') return post.status === 'Published'
  if (tab === 'drafts') return post.status === 'Draft'
  if (tab === 'private') return post.status === 'Private'
  return post.status === 'Trash'
}

function statusClass(status: PostStatus) {
  if (status === 'Published') return 'posts-badge--published'
  if (status === 'Draft') return 'posts-badge--draft'
  if (status === 'Private') return 'posts-badge--private'
  return 'posts-badge--trash'
}

export function Content() {
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

  function handleSearch(event: FormEvent) {
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
    <section className="posts">
      <div className="posts__toolbar">
        <div className="posts__heading">
          <h1 className="posts__title">Posts</h1>
          <Link to="/posts/new" className="posts__add">
            + Add New
          </Link>
        </div>

        <form className="posts__search" onSubmit={handleSearch}>
          <label className="posts__search-field">
            <span className="posts__search-icon" aria-hidden="true">
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
            />
          </label>
          <button type="submit" className="posts__search-btn">
            Search Posts
          </button>
        </form>
      </div>

      <nav className="posts__tabs" aria-label="Post status">
        {tabs.map((tab, index) => (
          <span key={tab.id} className="posts__tab-wrap">
            {index > 0 ? <span className="posts__tab-sep" aria-hidden="true" /> : null}
            <button
              type="button"
              className={`posts__tab${activeTab === tab.id ? ' posts__tab--active' : ''}`}
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

      <div className="posts__filters">
        <div className="posts__filters-left">
          <select className="posts__select" defaultValue="" aria-label="Bulk actions">
            <option value="" disabled>
              Bulk Actions
            </option>
            <option value="edit">Edit</option>
            <option value="trash">Move to Trash</option>
          </select>
          <button type="button" className="posts__ghost-btn">
            Apply
          </button>

          <select className="posts__select" defaultValue="all" aria-label="Filter by date">
            <option value="all">All dates</option>
            <option value="oct-2024">October 2024</option>
            <option value="sep-2024">September 2024</option>
          </select>
          <select className="posts__select" defaultValue="all" aria-label="Filter by category">
            <option value="all">All Categories</option>
            <option value="general">General</option>
            <option value="announcements">Announcements</option>
            <option value="promotions">Promotions</option>
          </select>
          <button type="button" className="posts__ghost-btn">
            Filter
          </button>
        </div>
        <p className="posts__count">{statusCounts.all} items</p>
      </div>

      <div className="posts__table-wrap">
        <table className="posts__table">
          <thead>
            <tr>
              <th className="posts__th-check">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={toggleAllVisible}
                  aria-label="Select all posts"
                />
              </th>
              <th>Title</th>
              <th>Author</th>
              <th>Categories</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="posts__empty">
                  No posts found.
                </td>
              </tr>
            ) : (
              filtered.map((post) => (
                <tr key={post.id}>
                  <td className="posts__td-check">
                    <input
                      type="checkbox"
                      checked={selected.includes(post.id)}
                      onChange={() => toggleOne(post.id)}
                      aria-label={`Select ${post.title}`}
                    />
                  </td>
                  <td>
                    <div className="posts__title-cell">
                      <button type="button" className="posts__post-title">
                        {post.title}
                      </button>
                      <div className="posts__row-links">
                        <button type="button">Edit</button>
                        <span aria-hidden="true">|</span>
                        <button type="button">Quick Edit</button>
                        <span aria-hidden="true">|</span>
                        <button type="button" className="posts__row-links--danger">
                          Trash
                        </button>
                        <span aria-hidden="true">|</span>
                        <button type="button">View</button>
                      </div>
                    </div>
                  </td>
                  <td>{post.author}</td>
                  <td>{post.category}</td>
                  <td>
                    <span className={`posts-badge ${statusClass(post.status)}`}>{post.status}</span>
                  </td>
                  <td className="posts__date">{post.date}</td>
                  <td>
                    <div className="posts__icon-actions">
                      <button type="button" aria-label={`Edit ${post.title}`} className="posts__icon-btn">
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
                      <button type="button" aria-label={`Delete ${post.title}`} className="posts__icon-btn posts__icon-btn--danger">
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

      <div className="posts__footer">
        <p className="posts__showing">
          Showing {filtered.length} of {statusCounts.all} posts
        </p>
        <div className="posts__pagination" role="navigation" aria-label="Pagination">
          <button type="button" className="posts__page-btn" disabled={page === 1} onClick={() => setPage(1)}>
            Previous
          </button>
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              type="button"
              className={`posts__page-btn posts__page-btn--num${page === num ? ' posts__page-btn--active' : ''}`}
              onClick={() => setPage(num)}
            >
              {num}
            </button>
          ))}
          <button type="button" className="posts__page-btn" disabled={page === 3} onClick={() => setPage(3)}>
            Next
          </button>
        </div>
      </div>
    </section>
  )
}
