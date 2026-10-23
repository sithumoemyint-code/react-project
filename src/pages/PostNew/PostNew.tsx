import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const categories = ['General', 'Announcements', 'Promotions'] as const

const selectChevron =
  "bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6 9l6 6 6-6' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")] bg-[length:12px_12px] bg-[position:right_10px_center] bg-no-repeat"

const cardClass = 'rounded-xl border border-border bg-surface shadow-soft'

const fieldFocus =
  'outline-none focus:border-accent focus:shadow-[0_0_0_3px_rgba(11,95,255,0.15)]'

export function PostNew() {
  const navigate = useNavigate()
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [endpoint, setEndpoint] = useState('/api/v1/posts')
  const [method, setMethod] = useState('POST')
  const [auth, setAuth] = useState('Authenticated')
  const [editorMode, setEditorMode] = useState<'visual' | 'text'>('visual')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['General'])
  const [featuredName, setFeaturedName] = useState<string | null>(null)
  const [status] = useState('Draft')
  const [visibility] = useState('Public')

  function toggleCategory(name: string) {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name],
    )
  }

  function wrapSelection(before: string, after = before) {
    const el = contentRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = content.slice(start, end)
    const next = content.slice(0, start) + before + selected + after + content.slice(end)
    setContent(next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(start + before.length, start + before.length + selected.length)
    })
  }

  function handlePublish(event: FormEvent) {
    event.preventDefault()
    navigate('/posts')
  }

  function handleSaveDraft() {
    navigate('/posts')
  }

  return (
    <section className="flex flex-col gap-[18px]">
      <header>
        <div className="flex flex-col gap-2.5">
          <Link
            to="/posts"
            className="inline-flex w-fit items-center gap-1 text-[0.9rem] font-semibold text-accent hover:text-accent-hover"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M15 6l-6 6 6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Posts
          </Link>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="m-0 text-[1.75rem] font-bold tracking-tight text-ink max-sm:text-[1.4rem]">
              Add New Post
            </h1>
            <span className="inline-flex h-7 items-center rounded-full bg-blue-50 px-3 text-[0.8rem] font-bold text-accent">
              {status}
            </span>
          </div>
        </div>
      </header>

      <form
        className="grid items-start gap-5 max-[980px]:grid-cols-1 min-[980px]:grid-cols-[minmax(0,1fr)_300px]"
        onSubmit={handlePublish}
      >
        <div className="flex flex-col gap-4">
          <article className={`${cardClass} p-4`}>
            <input
              type="text"
              className={`h-12 w-full rounded-md border border-border px-3.5 text-[1.05rem] font-medium text-ink ${fieldFocus}`}
              placeholder="Enter Post Title here..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              aria-label="Post title"
            />

            <div className="mt-3.5 rounded-[10px] bg-blue-50 p-3.5">
              <p className="m-0 mb-2.5 text-[0.8rem] font-bold text-slate-700">API Endpoint Details</p>
              <div className="grid gap-2 max-[980px]:grid-cols-1 min-[980px]:grid-cols-[minmax(0,1fr)_110px_140px]">
                <input
                  type="text"
                  className={`h-[38px] rounded-md border border-blue-200 bg-surface px-3 font-mono text-sm text-ink ${fieldFocus}`}
                  value={endpoint}
                  onChange={(event) => setEndpoint(event.target.value)}
                  aria-label="API endpoint"
                />
                <select
                  className={`h-[38px] appearance-none rounded-md border border-blue-200 bg-surface px-2.5 pr-7 text-sm text-ink ${selectChevron} ${fieldFocus}`}
                  value={method}
                  onChange={(event) => setMethod(event.target.value)}
                  aria-label="HTTP method"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                </select>
                <select
                  className={`h-[38px] appearance-none rounded-md border border-blue-200 bg-surface px-2.5 pr-7 text-sm text-ink ${selectChevron} ${fieldFocus}`}
                  value={auth}
                  onChange={(event) => setAuth(event.target.value)}
                  aria-label="Authentication"
                >
                  <option value="Authenticated">Authenticated</option>
                  <option value="Public">Public</option>
                </select>
              </div>
            </div>
          </article>

          <article className={`${cardClass} p-4`}>
            <div className="-mx-4 -mt-4 mb-3 flex flex-wrap items-center justify-between gap-3 rounded-t-xl border-b border-border bg-surface-subtle px-3 py-2.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  className="h-8 rounded-md border border-orange-200 bg-orange-50 px-2.5 text-[0.825rem] font-semibold text-accent hover:bg-surface-hover"
                >
                  Add Media
                </button>
                <button
                  type="button"
                  className="h-8 rounded-md border border-border bg-surface px-2.5 text-[0.825rem] font-semibold text-ink hover:bg-surface-hover"
                  aria-label="Bold"
                  onClick={() => wrapSelection('**')}
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  className="h-8 rounded-md border border-border bg-surface px-2.5 text-[0.825rem] font-semibold text-ink hover:bg-surface-hover"
                  aria-label="Italic"
                  onClick={() => wrapSelection('*')}
                >
                  <em>I</em>
                </button>
                <button
                  type="button"
                  className="h-8 rounded-md border border-border bg-surface px-2.5 text-[0.825rem] font-semibold text-ink hover:bg-surface-hover"
                  onClick={() => wrapSelection('- ', '')}
                >
                  List
                </button>
                <button
                  type="button"
                  className="h-8 rounded-md border border-border bg-surface px-2.5 text-[0.825rem] font-semibold text-ink hover:bg-surface-hover"
                  onClick={() => wrapSelection('[', '](url)')}
                >
                  Link
                </button>
              </div>
              <div className="inline-flex items-center gap-2 text-[0.85rem] text-slate-300" role="group" aria-label="Editor mode">
                <button
                  type="button"
                  className={`border-0 bg-transparent p-0 text-[0.85rem] font-medium ${
                    editorMode === 'visual' ? 'font-bold text-ink' : 'text-ink-muted'
                  }`}
                  onClick={() => setEditorMode('visual')}
                >
                  Visual
                </button>
                <span aria-hidden="true">|</span>
                <button
                  type="button"
                  className={`border-0 bg-transparent p-0 text-[0.85rem] font-medium ${
                    editorMode === 'text' ? 'font-bold text-ink' : 'text-ink-muted'
                  }`}
                  onClick={() => setEditorMode('text')}
                >
                  Text
                </button>
              </div>
            </div>
            <textarea
              ref={contentRef}
              className={`min-h-60 w-full resize-y rounded-md border border-border p-3 font-[inherit] text-[0.925rem] leading-normal text-ink ${fieldFocus}`}
              placeholder="Start writing your English and Myanmar content..."
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={12}
              aria-label="Post content"
            />
          </article>

          <article className={`${cardClass} p-4`}>
            <h2 className="m-0 mb-2.5 text-[0.95rem] font-bold text-ink">Short Description / Excerpt</h2>
            <textarea
              className={`min-h-[100px] w-full resize-y rounded-md border border-border p-3 font-[inherit] text-[0.925rem] leading-normal text-ink ${fieldFocus}`}
              placeholder="Write a short excerpt..."
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              rows={4}
              aria-label="Excerpt"
            />
          </article>
        </div>

        <aside className="flex flex-col gap-4">
          <article className={`${cardClass} p-4`}>
            <h2 className="m-0 mb-3.5 text-base font-bold text-ink">Publish</h2>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="h-9 rounded-md border border-border bg-surface text-sm font-semibold text-ink hover:bg-surface-hover"
                onClick={handleSaveDraft}
              >
                Save Draft
              </button>
              <button
                type="button"
                className="h-9 rounded-md border border-border bg-surface text-sm font-semibold text-ink hover:bg-surface-hover"
              >
                Preview
              </button>
            </div>
            <div className="my-3.5 flex flex-col gap-1.5">
              <p className="m-0 text-sm text-ink-muted">
                Status: <strong className="text-ink">{status}</strong>
              </p>
              <p className="m-0 text-sm text-ink-muted">
                Visibility: <strong className="text-ink">{visibility}</strong>
              </p>
            </div>
            <button
              type="submit"
              className="h-[42px] w-full rounded-md border-0 bg-accent text-[0.9rem] font-bold text-white hover:bg-accent-hover"
            >
              Publish Post &amp; Endpoint
            </button>
          </article>

          <article className={`${cardClass} p-4`}>
            <h2 className="m-0 mb-3.5 text-base font-bold text-ink">Categories</h2>
            <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
              {categories.map((category) => (
                <li key={category}>
                  <label className="inline-flex cursor-pointer items-center gap-2 text-[0.9rem] text-ink">
                    <input
                      type="checkbox"
                      className="size-[15px] accent-accent"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                    />
                    <span>{category}</span>
                  </label>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-3.5 border-0 bg-transparent p-0 text-left text-sm font-semibold text-accent hover:text-accent-hover"
            >
              + Add New Category
            </button>
          </article>

          <article className={`${cardClass} p-4`}>
            <h2 className="m-0 mb-3.5 text-base font-bold text-ink">Featured Image</h2>
            <button
              type="button"
              className="flex min-h-[120px] w-full flex-col items-center justify-center gap-2 rounded-[10px] border-[1.5px] border-dashed border-slate-300 bg-surface-subtle text-sm font-medium text-ink-muted hover:border-accent hover:bg-blue-50 hover:text-ink"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 16V5m0 0l-4 4m4-4l4 4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 16.5V18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              <span>{featuredName ?? 'Set featured image'}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]
                setFeaturedName(file ? file.name : null)
              }}
            />
          </article>
        </aside>
      </form>
    </section>
  )
}
