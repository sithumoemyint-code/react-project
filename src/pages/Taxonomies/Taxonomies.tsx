import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'

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

const selectChevron =
  'bg-[url("data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%2712%27%20viewBox=%270%200%2024%2024%27%20fill=%27none%27%3E%3Cpath%20d=%27M6%209l6%206%206-6%27%20stroke=%27%236b7280%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27/%3E%3C/svg%3E")] bg-[length:12px_12px] bg-[position:right_10px_center] bg-no-repeat'

const formFieldClass =
  'w-full rounded-md border border-border bg-surface text-[0.9rem] text-ink outline-none focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.15)]'

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
    <section className="flex flex-col gap-5">
      <header className="flex flex-col gap-1.5">
        <p className="m-0 text-xs font-bold tracking-[0.08em] text-orange-500 uppercase">Mytel Developer CMS</p>
        <h1 className="m-0 text-[1.4rem] font-bold tracking-tight text-slate-800 min-[641px]:text-[1.75rem]">
          Taxonomies
        </h1>
        <p className="m-0 text-[0.95rem] leading-normal text-ink-muted">
          Add and manage categories and tags in a single place.
        </p>
      </header>

      <div className="grid items-start gap-5 min-[1101px]:grid-cols-[minmax(280px,340px)_minmax(0,1fr)]">
        <form
          className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 shadow-soft max-[640px]:p-3.5"
          onSubmit={handleAdd}
        >
          <div className="flex flex-col gap-1">
            <h2 className="m-0 text-[1.05rem] font-bold text-slate-800">Add New Taxonomy</h2>
            <p className="m-0 text-[0.875rem] leading-snug text-ink-muted">
              Create categories and tags for your content.
            </p>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-[0.7rem] font-bold tracking-[0.06em] text-ink-muted uppercase">Name</span>
            <input
              type="text"
              className={`${formFieldClass} h-[38px] px-3`}
              placeholder="e.g., Announcements"
              value={name}
              onChange={(event) => handleNameChange(event.target.value)}
              required
            />
            <span className="text-[0.8rem] leading-snug text-ink-muted">The name as it appears on your site.</span>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[0.7rem] font-bold tracking-[0.06em] text-ink-muted uppercase">Slug</span>
            <input
              type="text"
              className={`${formFieldClass} h-[38px] px-3`}
              placeholder="e.g., announcements"
              value={slug}
              onChange={(event) => {
                setSlugTouched(true)
                setSlug(event.target.value)
              }}
              required
            />
            <span className="text-[0.8rem] leading-snug text-ink-muted">
              The URL-friendly version of the name.
            </span>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[0.7rem] font-bold tracking-[0.06em] text-ink-muted uppercase">
              Taxonomy Type
            </span>
            <select
              className={`${formFieldClass} ${selectChevron} h-[38px] appearance-none px-3 pr-7`}
              value={type}
              onChange={(event) => setType(event.target.value as TaxonomyType)}
            >
              <option value="Category">Category</option>
              <option value="Tag">Tag</option>
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[0.7rem] font-bold tracking-[0.06em] text-ink-muted uppercase">
              Parent Category
            </span>
            <select
              className={`${formFieldClass} ${selectChevron} h-[38px] appearance-none px-3 pr-7`}
              value={parent}
              onChange={(event) => setParent(event.target.value)}
            >
              <option value="none">No parent</option>
              {parentOptions.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[0.7rem] font-bold tracking-[0.06em] text-ink-muted uppercase">Description</span>
            <textarea
              className={`${formFieldClass} min-h-[110px] resize-y px-3 py-2.5 leading-snug`}
              placeholder="Optional description..."
              rows={5}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>

          <button
            type="submit"
            className="h-[42px] rounded-md border-0 bg-orange-500 text-[0.95rem] font-semibold text-white hover:bg-orange-600"
          >
            Add Taxonomy
          </button>
        </form>

        <div className="flex min-w-0 flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-soft max-[640px]:p-3.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <label className="relative flex min-w-[200px] flex-1 items-center">
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
                className="h-[38px] w-full rounded-md border border-border bg-surface py-0 pr-3 pl-9 text-[0.9rem] text-ink outline-none focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.15)]"
                placeholder="Search taxonomies..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search taxonomies"
              />
            </label>
            <select
              className={`h-[38px] min-w-[130px] appearance-none rounded-md border border-border bg-surface px-2.5 pr-7 text-[0.875rem] text-ink ${selectChevron}`}
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              aria-label="Filter by type"
            >
              <option value="all">All Types</option>
              <option value="category">Category</option>
              <option value="tag">Tag</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <select
                className={`h-[38px] min-w-[130px] appearance-none rounded-md border border-border bg-surface px-2.5 pr-7 text-[0.875rem] text-ink ${selectChevron}`}
                defaultValue=""
                aria-label="Bulk actions"
              >
                <option value="" disabled>
                  Bulk Actions
                </option>
                <option value="delete">Delete</option>
              </select>
              <button
                type="button"
                className="h-[38px] rounded-md border border-border bg-surface px-3 text-[0.875rem] font-medium text-slate-800 hover:bg-surface-hover"
              >
                Apply
              </button>
            </div>
            <p className="m-0 text-[0.875rem] text-ink-muted">{filtered.length} items</p>
          </div>

          <div className="overflow-x-auto rounded-[10px] border border-border">
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr>
                  <th className="w-[42px] border-b border-border bg-[#fafbfc] px-3.5 py-3 text-left text-[0.7rem] font-bold tracking-[0.06em] whitespace-nowrap text-slate-400 uppercase">
                    <input
                      type="checkbox"
                      className="size-[15px] accent-orange-500"
                      checked={allSelected}
                      onChange={toggleAll}
                      aria-label="Select all taxonomies"
                    />
                  </th>
                  <th className="border-b border-border bg-[#fafbfc] px-3.5 py-3 text-left text-[0.7rem] font-bold tracking-[0.06em] whitespace-nowrap text-slate-400 uppercase">
                    Name
                  </th>
                  <th className="border-b border-border bg-[#fafbfc] px-3.5 py-3 text-left text-[0.7rem] font-bold tracking-[0.06em] whitespace-nowrap text-slate-400 uppercase">
                    Slug
                  </th>
                  <th className="border-b border-border bg-[#fafbfc] px-3.5 py-3 text-left text-[0.7rem] font-bold tracking-[0.06em] whitespace-nowrap text-slate-400 uppercase">
                    Type
                  </th>
                  <th className="border-b border-border bg-[#fafbfc] px-3.5 py-3 text-left text-[0.7rem] font-bold tracking-[0.06em] whitespace-nowrap text-slate-400 uppercase">
                    Parent
                  </th>
                  <th className="border-b border-border bg-[#fafbfc] px-3.5 py-3 text-left text-[0.7rem] font-bold tracking-[0.06em] whitespace-nowrap text-slate-400 uppercase">
                    Post Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3.5 py-8 text-center text-ink-muted">
                      No taxonomies found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id}>
                      <td className="w-[42px] border-b border-border px-3.5 py-3.5 align-middle last:border-b-0">
                        <input
                          type="checkbox"
                          className="size-[15px] accent-orange-500"
                          checked={selected.includes(item.id)}
                          onChange={() => toggleOne(item.id)}
                          aria-label={`Select ${item.name}`}
                        />
                      </td>
                      <td className="border-b border-border px-3.5 py-3.5 align-middle text-[0.9rem] text-slate-800 last:border-b-0">
                        <div
                          className={`flex items-start gap-2 ${item.depth > 0 ? 'pl-2' : ''}`}
                        >
                          {item.depth > 0 ? (
                            <span className="mt-px text-[0.95rem] leading-snug text-slate-300" aria-hidden="true">
                              └
                            </span>
                          ) : null}
                          <div>
                            <button
                              type="button"
                              className="border-0 bg-transparent p-0 text-left text-[0.95rem] font-semibold text-orange-500 hover:text-orange-600 hover:underline"
                            >
                              {item.name}
                            </button>
                            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-300">
                              <button
                                type="button"
                                className="border-0 bg-transparent p-0 text-xs text-ink-muted hover:text-slate-800"
                              >
                                Edit
                              </button>
                              <span aria-hidden="true">|</span>
                              <button
                                type="button"
                                className="border-0 bg-transparent p-0 text-xs text-ink-muted hover:text-slate-800"
                              >
                                Quick Edit
                              </button>
                              <span aria-hidden="true">|</span>
                              <button
                                type="button"
                                className="border-0 bg-transparent p-0 text-xs text-red-600 hover:text-red-700"
                              >
                                Delete
                              </button>
                              <span aria-hidden="true">|</span>
                              <button
                                type="button"
                                className="border-0 bg-transparent p-0 text-xs text-ink-muted hover:text-slate-800"
                              >
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="border-b border-border px-3.5 py-3.5 align-middle text-[0.9rem] text-ink-muted last:border-b-0">
                        {item.slug}
                      </td>
                      <td className="border-b border-border px-3.5 py-3.5 align-middle text-[0.9rem] text-slate-800 last:border-b-0">
                        <span
                          className={`inline-flex h-6 items-center rounded-full px-2.5 text-xs font-semibold whitespace-nowrap ${
                            item.type === 'Tag'
                              ? 'bg-violet-100 text-violet-700'
                              : 'bg-orange-50 text-orange-500'
                          }`}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td className="border-b border-border px-3.5 py-3.5 align-middle text-[0.9rem] text-ink-muted last:border-b-0">
                        {item.parent ?? '—'}
                      </td>
                      <td className="border-b border-border px-3.5 py-3.5 align-middle text-[0.9rem] text-slate-800 last:border-b-0">
                        {item.postCount}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="m-0 text-[0.875rem] text-ink-muted">Showing {filtered.length} items</p>
            <div className="flex items-center gap-1.5" role="navigation" aria-label="Pagination">
              <button
                type="button"
                className="h-[34px] min-w-[34px] rounded-md border border-border bg-surface px-3 text-[0.875rem] font-medium text-slate-800 disabled:cursor-not-allowed disabled:opacity-45"
                disabled
              >
                Previous
              </button>
              <button
                type="button"
                className="h-[34px] min-w-[34px] rounded-md border border-orange-500 bg-orange-500 px-3 text-[0.875rem] font-medium text-white"
              >
                1
              </button>
              <button
                type="button"
                className="h-[34px] min-w-[34px] rounded-md border border-border bg-surface px-3 text-[0.875rem] font-medium text-slate-800 disabled:cursor-not-allowed disabled:opacity-45"
                disabled
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
