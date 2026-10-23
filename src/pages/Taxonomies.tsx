import { FormEvent, useMemo, useState } from 'react'
import './Taxonomies.css'

type TaxonomyType = 'Category' | 'Tag'

type Taxonomy = {
  id: string
  name: string
  slug: string
  type: TaxonomyType
  parent: string | null
  postCount: number
  depth: number
}

const initialTaxonomies: Taxonomy[] = [
  {
    id: '1',
    name: 'Developers',
    slug: 'developers',
    type: 'Category',
    parent: null,
    postCount: 18,
    depth: 0,
  },
  {
    id: '2',
    name: 'Products',
    slug: 'products',
    type: 'Category',
    parent: null,
    postCount: 12,
    depth: 0,
  },
  {
    id: '3',
    name: 'API Reference',
    slug: 'api-reference',
    type: 'Category',
    parent: 'Developers',
    postCount: 24,
    depth: 1,
  },
  {
    id: '4',
    name: 'Tutorials',
    slug: 'tutorials',
    type: 'Category',
    parent: 'Developers',
    postCount: 9,
    depth: 1,
  },
  {
    id: '5',
    name: 'featured',
    slug: 'featured',
    type: 'Tag',
    parent: null,
    postCount: 31,
    depth: 0,
  },
]

function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function Taxonomies() {
  const [items, setItems] = useState(initialTaxonomies)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)
  const [type, setType] = useState<TaxonomyType>('Category')
  const [parent, setParent] = useState('none')
  const [description, setDescription] = useState('')
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selected, setSelected] = useState<string[]>([])

  const parentOptions = useMemo(
    () => items.filter((item) => item.type === 'Category' && item.depth === 0),
    [items],
  )

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return items.filter((item) => {
      if (typeFilter !== 'all' && item.type.toLowerCase() !== typeFilter) return false
      if (!normalized) return true
      return (
        item.name.toLowerCase().includes(normalized) ||
        item.slug.toLowerCase().includes(normalized)
      )
    })
  }, [items, query, typeFilter])

  const allSelected =
    filtered.length > 0 && filtered.every((item) => selected.includes(item.id))

  function handleNameChange(value: string) {
    setName(value)
    if (!slugTouched) setSlug(toSlug(value))
  }

  function handleAdd(event: FormEvent) {
    event.preventDefault()
    const trimmedName = name.trim()
    const finalSlug = slug.trim() || toSlug(trimmedName)
    if (!trimmedName || !finalSlug) return

    const parentName = parent === 'none' ? null : parent
    setItems((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: trimmedName,
        slug: finalSlug,
        type,
        parent: parentName,
        postCount: 0,
        depth: parentName ? 1 : 0,
      },
    ])
    setName('')
    setSlug('')
    setSlugTouched(false)
    setType('Category')
    setParent('none')
    setDescription('')
  }

  function toggleAll() {
    if (allSelected) {
      setSelected((prev) => prev.filter((id) => !filtered.some((item) => item.id === id)))
      return
    }
    setSelected((prev) => [...new Set([...prev, ...filtered.map((item) => item.id)])])
  }

  function toggleOne(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <section className="taxonomies">
      <header className="taxonomies__hero">
        <p className="taxonomies__eyebrow">Mytel Developer CMS</p>
        <h1 className="taxonomies__title">Taxonomies</h1>
        <p className="taxonomies__subtitle">Add and manage categories and tags in a single place.</p>
      </header>

      <div className="taxonomies__layout">
        <form className="tax-form" onSubmit={handleAdd}>
          <div className="tax-form__intro">
            <h2 className="tax-form__title">Add New Taxonomy</h2>
            <p className="tax-form__subtitle">Create categories and tags for your content.</p>
          </div>

          <label className="tax-form__field">
            <span className="tax-form__label">Name</span>
            <input
              type="text"
              placeholder="e.g., Announcements"
              value={name}
              onChange={(event) => handleNameChange(event.target.value)}
              required
            />
            <span className="tax-form__help">The name as it appears on your site.</span>
          </label>

          <label className="tax-form__field">
            <span className="tax-form__label">Slug</span>
            <input
              type="text"
              placeholder="e.g., announcements"
              value={slug}
              onChange={(event) => {
                setSlugTouched(true)
                setSlug(event.target.value)
              }}
              required
            />
            <span className="tax-form__help">The URL-friendly version of the name.</span>
          </label>

          <label className="tax-form__field">
            <span className="tax-form__label">Taxonomy Type</span>
            <select
              value={type}
              onChange={(event) => setType(event.target.value as TaxonomyType)}
            >
              <option value="Category">Category</option>
              <option value="Tag">Tag</option>
            </select>
          </label>

          <label className="tax-form__field">
            <span className="tax-form__label">Parent Category</span>
            <select value={parent} onChange={(event) => setParent(event.target.value)}>
              <option value="none">No parent</option>
              {parentOptions.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label className="tax-form__field">
            <span className="tax-form__label">Description</span>
            <textarea
              placeholder="Optional description..."
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>

          <button type="submit" className="tax-form__submit">
            Add Taxonomy
          </button>
        </form>

        <div className="tax-table-card">
          <div className="tax-table-card__top">
            <label className="tax-table-card__search">
              <span className="tax-table-card__search-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <input
                type="search"
                placeholder="Search taxonomies..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search taxonomies"
              />
            </label>
            <select
              className="tax-table-card__select"
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              aria-label="Filter by type"
            >
              <option value="all">All Types</option>
              <option value="category">Category</option>
              <option value="tag">Tag</option>
            </select>
          </div>

          <div className="tax-table-card__actions">
            <div className="tax-table-card__actions-left">
              <select className="tax-table-card__select" defaultValue="" aria-label="Bulk actions">
                <option value="" disabled>
                  Bulk Actions
                </option>
                <option value="delete">Delete</option>
              </select>
              <button type="button" className="tax-table-card__ghost">
                Apply
              </button>
            </div>
            <p className="tax-table-card__count">{filtered.length} items</p>
          </div>

          <div className="tax-table-wrap">
            <table className="tax-table">
              <thead>
                <tr>
                  <th className="tax-table__check">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAll}
                      aria-label="Select all taxonomies"
                    />
                  </th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Type</th>
                  <th>Parent</th>
                  <th>Post Count</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="tax-table__empty">
                      No taxonomies found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id}>
                      <td className="tax-table__check">
                        <input
                          type="checkbox"
                          checked={selected.includes(item.id)}
                          onChange={() => toggleOne(item.id)}
                          aria-label={`Select ${item.name}`}
                        />
                      </td>
                      <td>
                        <div
                          className={`tax-table__name-cell${
                            item.depth > 0 ? ' tax-table__name-cell--child' : ''
                          }`}
                        >
                          {item.depth > 0 ? (
                            <span className="tax-table__branch" aria-hidden="true">
                              └
                            </span>
                          ) : null}
                          <div>
                            <button type="button" className="tax-table__name">
                              {item.name}
                            </button>
                            <div className="tax-table__row-links">
                              <button type="button">Edit</button>
                              <span aria-hidden="true">|</span>
                              <button type="button">Quick Edit</button>
                              <span aria-hidden="true">|</span>
                              <button type="button" className="tax-table__row-links--danger">
                                Delete
                              </button>
                              <span aria-hidden="true">|</span>
                              <button type="button">View</button>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="tax-table__slug">{item.slug}</td>
                      <td>
                        <span
                          className={`tax-badge${
                            item.type === 'Tag' ? ' tax-badge--tag' : ' tax-badge--category'
                          }`}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td className="tax-table__parent">{item.parent ?? '—'}</td>
                      <td>{item.postCount}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="tax-table-card__footer">
            <p className="tax-table-card__showing">Showing {filtered.length} items</p>
            <div className="tax-table-card__pagination" role="navigation" aria-label="Pagination">
              <button type="button" className="tax-page-btn" disabled>
                Previous
              </button>
              <button type="button" className="tax-page-btn tax-page-btn--active">
                1
              </button>
              <button type="button" className="tax-page-btn" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
