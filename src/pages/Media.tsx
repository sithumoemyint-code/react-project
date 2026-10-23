import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from 'react'
import './Media.css'

type MediaKind = 'image' | 'svg' | 'json' | 'pdf' | 'file'

type MediaItem = {
  id: string
  name: string
  size: string
  date: string
  kind: MediaKind
  badge?: string
  previewUrl?: string
}

type PendingFile = {
  file: File
  previewUrl: string
  name: string
  sizeLabel: string
  kind: MediaKind
  badge?: string
}

const initialMediaItems: MediaItem[] = [
  {
    id: '1',
    name: 'developer-portal-banner.png',
    size: '2.4 MB',
    date: 'Oct 14, 2024',
    kind: 'image',
  },
  {
    id: '2',
    name: 'api-flow-diagram.svg',
    size: '184 KB',
    date: 'Oct 12, 2024',
    kind: 'svg',
    badge: 'SVG',
  },
  {
    id: '3',
    name: 'webhook-payload.json',
    size: '12 KB',
    date: 'Oct 07, 2024',
    kind: 'json',
    badge: 'JSON',
  },
  {
    id: '4',
    name: 'release-notes.pdf',
    size: '860 KB',
    date: 'Sep 29, 2024',
    kind: 'pdf',
    badge: 'PDF',
  },
  {
    id: '5',
    name: 'product-grid.png',
    size: '1.8 MB',
    date: 'Sep 21, 2024',
    kind: 'image',
  },
]

type ViewMode = 'grid' | 'list'

const MAX_BYTES = 64 * 1024 * 1024

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`
  return `${bytes} B`
}

function formatDate(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

function detectKind(file: File): { kind: MediaKind; badge?: string } {
  const name = file.name.toLowerCase()
  if (name.endsWith('.svg') || file.type === 'image/svg+xml') return { kind: 'svg', badge: 'SVG' }
  if (name.endsWith('.json') || file.type === 'application/json') return { kind: 'json', badge: 'JSON' }
  if (name.endsWith('.pdf') || file.type === 'application/pdf') return { kind: 'pdf', badge: 'PDF' }
  if (file.type.startsWith('image/')) return { kind: 'image' }
  const ext = name.includes('.') ? name.split('.').pop()?.toUpperCase() : undefined
  return { kind: 'file', badge: ext?.slice(0, 5) }
}

export function Media() {
  const [items, setItems] = useState(initialMediaItems)
  const [view, setView] = useState<ViewMode>('grid')
  const [typeFilter, setTypeFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [pending, setPending] = useState<PendingFile | null>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [toast, setToast] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return items.filter((item) => {
      if (typeFilter === 'images' && item.kind !== 'image' && item.kind !== 'svg') return false
      if (typeFilter === 'documents' && item.kind !== 'pdf' && item.kind !== 'json') return false
      if (dateFilter === 'oct-2024' && !item.date.includes('Oct')) return false
      if (dateFilter === 'sep-2024' && !item.date.includes('Sep')) return false
      if (normalized && !item.name.toLowerCase().includes(normalized)) return false
      return true
    })
  }, [items, typeFilter, dateFilter, query])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 2800)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    return () => {
      if (pending?.previewUrl) URL.revokeObjectURL(pending.previewUrl)
    }
  }, [pending])

  function clearPending() {
    if (pending?.previewUrl) URL.revokeObjectURL(pending.previewUrl)
    setPending(null)
    setProgress(0)
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function closeModal() {
    clearPending()
    setModalOpen(false)
    setDragging(false)
  }

  function captureFile(file: File | undefined) {
    if (!file) return
    if (file.size > MAX_BYTES) {
      setToast('File exceeds the 64 MB limit.')
      return
    }
    if (pending?.previewUrl) URL.revokeObjectURL(pending.previewUrl)
    const { kind, badge } = detectKind(file)
    setPending({
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
      sizeLabel: formatBytes(file.size),
      kind,
      badge,
    })
    setProgress(0)
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    captureFile(event.target.files?.[0])
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragging(false)
    captureFile(event.dataTransfer.files?.[0])
  }

  function handleUpload() {
    if (!pending || uploading) return
    setUploading(true)
    setProgress(12)

    const steps = [35, 62, 88, 100]
    let index = 0
    const timer = window.setInterval(() => {
      setProgress(steps[index])
      index += 1
      if (index >= steps.length) {
        window.clearInterval(timer)
        const keepPreview = pending.kind === 'image' || pending.kind === 'svg'
        setItems((prev) => [
          {
            id: String(Date.now()),
            name: pending.name,
            size: pending.sizeLabel,
            date: formatDate(),
            kind: pending.kind,
            badge: pending.badge,
            previewUrl: keepPreview ? pending.previewUrl : undefined,
          },
          ...prev,
        ])
        if (!keepPreview) URL.revokeObjectURL(pending.previewUrl)
        setPending(null)
        setUploading(false)
        setProgress(0)
        setModalOpen(false)
        setToast('Media uploaded successfully.')
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }, 220)
  }

  return (
    <section className="media">
      <header className="media__header">
        <div className="media__intro">
          <p className="media__eyebrow">Mytel Developer CMS</p>
          <h1 className="media__title">Media Library</h1>
          <p className="media__subtitle">
            Upload, manage, and inspect media assets (images, documents, payload diagrams).
          </p>
        </div>
        <button type="button" className="media__add" onClick={() => setModalOpen(true)}>
          + Add New Media
        </button>
      </header>

      <div className="media__toolbar">
        <div className="media__toolbar-left">
          <div className="media__view-toggle" role="group" aria-label="View mode">
            <button
              type="button"
              className={`media__view-btn${view === 'grid' ? ' media__view-btn--active' : ''}`}
              onClick={() => setView('grid')}
              aria-pressed={view === 'grid'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
              </svg>
              Grid
            </button>
            <button
              type="button"
              className={`media__view-btn${view === 'list' ? ' media__view-btn--active' : ''}`}
              onClick={() => setView('list')}
              aria-pressed={view === 'list'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M8 6h13M8 12h13M8 18h13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="4" cy="6" r="1.5" fill="currentColor" />
                <circle cx="4" cy="12" r="1.5" fill="currentColor" />
                <circle cx="4" cy="18" r="1.5" fill="currentColor" />
              </svg>
              List
            </button>
          </div>

          <select
            className="media__select"
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            aria-label="Filter by media type"
          >
            <option value="all">All media items</option>
            <option value="images">Images</option>
            <option value="documents">Documents</option>
          </select>

          <select
            className="media__select"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            aria-label="Filter by date"
          >
            <option value="all">All dates</option>
            <option value="oct-2024">October 2024</option>
            <option value="sep-2024">September 2024</option>
          </select>
        </div>

        <label className="media__search">
          <span className="media__search-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <input
            type="search"
            placeholder="Search media items..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search media items"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="media__empty">No media items found.</p>
      ) : (
        <div className={view === 'grid' ? 'media__grid' : 'media__list'}>
          {filtered.map((item) => (
            <article key={item.id} className="media-card">
              <div className="media-card__preview">
                {item.previewUrl ? (
                  <img src={item.previewUrl} alt="" className="media-card__thumb" />
                ) : item.badge ? (
                  <span className="media-card__badge">{item.badge}</span>
                ) : null}
              </div>
              <div className="media-card__meta">
                <h2 className="media-card__name">{item.name}</h2>
                <p className="media-card__info">
                  {item.size} · {item.date}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      {modalOpen ? (
        <div className="media-modal" role="presentation">
          <button
            type="button"
            className="media-modal__backdrop"
            aria-label="Close add media dialog"
            onClick={closeModal}
          />
          <div
            className="media-modal__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-media-title"
          >
            <h2 id="add-media-title" className="media-modal__title">
              Add New Media
            </h2>

            {!pending ? (
              <div
                className={`media-modal__dropzone${dragging ? ' media-modal__dropzone--active' : ''}`}
                onDragOver={(event) => {
                  event.preventDefault()
                  setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
              >
                <span className="media-modal__upload-icon" aria-hidden="true">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
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
                </span>
                <p className="media-modal__drop-text">Drag files here to upload</p>
                <button
                  type="button"
                  className="media-modal__select"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select Files
                </button>
                <p className="media-modal__hint">Maximum upload file size: 64 MB</p>
              </div>
            ) : (
              <div className="media-modal__preview">
                <div className="media-modal__preview-thumb">
                  {pending.kind === 'image' || pending.kind === 'svg' ? (
                    <img src={pending.previewUrl} alt="" />
                  ) : (
                    <span className="media-card__badge">{pending.badge ?? 'FILE'}</span>
                  )}
                </div>
                <div className="media-modal__preview-meta">
                  <p className="media-modal__preview-name">{pending.name}</p>
                  <p className="media-modal__preview-size">{pending.sizeLabel}</p>
                  <div className="media-modal__progress" aria-hidden={!uploading}>
                    <div className="media-modal__progress-bar" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="media-modal__progress-label">
                    {uploading ? `Uploading... ${progress}%` : 'Ready to upload'}
                  </p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              className="media-modal__file"
              onChange={handleFileChange}
            />

            <div className="media-modal__actions">
              <button
                type="button"
                className="media-modal__btn media-modal__btn--ghost"
                onClick={clearPending}
                disabled={!pending || uploading}
              >
                Remove
              </button>
              <button
                type="button"
                className="media-modal__btn media-modal__btn--primary"
                onClick={handleUpload}
                disabled={!pending || uploading}
              >
                Upload
              </button>
            </div>
            <button
              type="button"
              className="media-modal__btn media-modal__btn--cancel"
              onClick={closeModal}
              disabled={uploading}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="media-toast" role="status">
          {toast}
        </div>
      ) : null}
    </section>
  )
}
