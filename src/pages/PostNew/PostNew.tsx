import { useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './PostNew.css'

const categories = ['General', 'Announcements', 'Promotions'] as const

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
    <section className="post-new">
      <header className="post-new__header">
        <div className="post-new__header-main">
          <Link to="/posts" className="post-new__back">
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
          <div className="post-new__title-row">
            <h1 className="post-new__title">Add New Post</h1>
            <span className="post-new__draft-badge">{status}</span>
          </div>
        </div>
      </header>

      <form className="post-new__layout" onSubmit={handlePublish}>
        <div className="post-new__main">
          <article className="post-card">
            <input
              type="text"
              className="post-card__title-input"
              placeholder="Enter Post Title here..."
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              aria-label="Post title"
            />

            <div className="post-card__api">
              <p className="post-card__api-label">API Endpoint Details</p>
              <div className="post-card__api-row">
                <input
                  type="text"
                  className="post-card__api-endpoint"
                  value={endpoint}
                  onChange={(event) => setEndpoint(event.target.value)}
                  aria-label="API endpoint"
                />
                <select
                  className="post-card__api-select"
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
                  className="post-card__api-select"
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

          <article className="post-card">
            <div className="post-editor__toolbar">
              <div className="post-editor__tools">
                <button type="button" className="post-editor__tool post-editor__tool--media">
                  Add Media
                </button>
                <button
                  type="button"
                  className="post-editor__tool"
                  aria-label="Bold"
                  onClick={() => wrapSelection('**')}
                >
                  <strong>B</strong>
                </button>
                <button
                  type="button"
                  className="post-editor__tool"
                  aria-label="Italic"
                  onClick={() => wrapSelection('*')}
                >
                  <em>I</em>
                </button>
                <button
                  type="button"
                  className="post-editor__tool"
                  onClick={() => wrapSelection('- ', '')}
                >
                  List
                </button>
                <button
                  type="button"
                  className="post-editor__tool"
                  onClick={() => wrapSelection('[', '](url)')}
                >
                  Link
                </button>
              </div>
              <div className="post-editor__modes" role="group" aria-label="Editor mode">
                <button
                  type="button"
                  className={`post-editor__mode${editorMode === 'visual' ? ' post-editor__mode--active' : ''}`}
                  onClick={() => setEditorMode('visual')}
                >
                  Visual
                </button>
                <span aria-hidden="true">|</span>
                <button
                  type="button"
                  className={`post-editor__mode${editorMode === 'text' ? ' post-editor__mode--active' : ''}`}
                  onClick={() => setEditorMode('text')}
                >
                  Text
                </button>
              </div>
            </div>
            <textarea
              ref={contentRef}
              className="post-editor__content"
              placeholder="Start writing your English and Myanmar content..."
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={12}
              aria-label="Post content"
            />
          </article>

          <article className="post-card">
            <h2 className="post-card__heading">Short Description / Excerpt</h2>
            <textarea
              className="post-card__excerpt"
              placeholder="Write a short excerpt..."
              value={excerpt}
              onChange={(event) => setExcerpt(event.target.value)}
              rows={4}
              aria-label="Excerpt"
            />
          </article>
        </div>

        <aside className="post-new__side">
          <article className="post-side-card">
            <h2 className="post-side-card__title">Publish</h2>
            <div className="post-side-card__row">
              <button type="button" className="post-side-card__ghost" onClick={handleSaveDraft}>
                Save Draft
              </button>
              <button type="button" className="post-side-card__ghost">
                Preview
              </button>
            </div>
            <div className="post-side-card__meta">
              <p>
                Status: <strong>{status}</strong>
              </p>
              <p>
                Visibility: <strong>{visibility}</strong>
              </p>
            </div>
            <button type="submit" className="post-side-card__publish">
              Publish Post &amp; Endpoint
            </button>
          </article>

          <article className="post-side-card">
            <h2 className="post-side-card__title">Categories</h2>
            <ul className="post-side-card__categories">
              {categories.map((category) => (
                <li key={category}>
                  <label className="post-side-card__check">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                    />
                    <span>{category}</span>
                  </label>
                </li>
              ))}
            </ul>
            <button type="button" className="post-side-card__add-cat">
              + Add New Category
            </button>
          </article>

          <article className="post-side-card">
            <h2 className="post-side-card__title">Featured Image</h2>
            <button
              type="button"
              className="post-side-card__featured"
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
              className="post-side-card__file"
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
