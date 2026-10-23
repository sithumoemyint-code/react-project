import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'

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

const selectClass =
  'h-9 min-w-[150px] appearance-none rounded-md border border-border bg-surface bg-[length:12px_12px] bg-[position:right_10px_center] bg-no-repeat px-2.5 pr-7 text-[0.875rem] text-ink bg-[url("data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%2712%27%20viewBox=%270%200%2024%2024%27%20fill=%27none%27%3E%3Cpath%20d=%27M6%209l6%206%206-6%27%20stroke=%27%236b7280%27%20stroke-width=%272%27%20stroke-linecap=%27round%27%20stroke-linejoin=%27round%27/%3E%3C/svg%3E")]'

const badgeClass =
  'inline-flex h-7 min-w-[52px] items-center justify-center rounded-md bg-pink-100 px-2.5 text-xs font-bold tracking-wide text-pink-700'

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

  const viewBtnClass = (active: boolean) =>
    `inline-flex h-8 items-center gap-1.5 rounded-md border-0 px-2.5 text-[0.85rem] font-medium ${
      active
        ? 'bg-surface font-semibold text-slate-800 shadow-sm'
        : 'bg-transparent text-ink-muted hover:text-slate-800'
    }`

  return (
    <section className="flex flex-col gap-5">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="m-0 text-xs font-bold tracking-[0.08em] text-orange-500 uppercase">
            Mytel Developer CMS
          </p>
          <h1 className="m-0 text-[1.4rem] leading-tight font-bold tracking-tight text-slate-800 min-[769px]:text-[1.75rem]">
            Media Library
          </h1>
          <p className="m-0 max-w-[54ch] text-[0.95rem] leading-normal text-ink-muted">
            Upload, manage, and inspect media assets (images, documents, payload diagrams).
          </p>
        </div>
        <button
          type="button"
          className="h-10 shrink-0 rounded-md border-0 bg-orange-500 px-4 text-[0.9rem] font-semibold whitespace-nowrap text-white hover:bg-orange-600"
          onClick={() => setModalOpen(true)}
        >
          + Add New Media
        </button>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface p-3 shadow-soft">
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="inline-flex items-center gap-1 rounded-md border border-border bg-surface-subtle p-0.5"
            role="group"
            aria-label="View mode"
          >
            <button
              type="button"
              className={viewBtnClass(view === 'grid')}
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
              className={viewBtnClass(view === 'list')}
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
            className={selectClass}
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            aria-label="Filter by media type"
          >
            <option value="all">All media items</option>
            <option value="images">Images</option>
            <option value="documents">Documents</option>
          </select>

          <select
            className={selectClass}
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            aria-label="Filter by date"
          >
            <option value="all">All dates</option>
            <option value="oct-2024">October 2024</option>
            <option value="sep-2024">September 2024</option>
          </select>
        </div>

        <label className="relative flex min-w-[min(260px,100%)] max-w-80 flex-1 items-center max-md:max-w-none max-md:w-full">
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
            className="h-9 w-full rounded-md border border-border bg-surface py-0 pr-3 pl-9 text-[0.9rem] text-ink outline-none focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.15)]"
            placeholder="Search media items..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search media items"
          />
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="m-0 rounded-xl border border-dashed border-border bg-surface px-4 py-10 text-center text-ink-muted">
          No media items found.
        </p>
      ) : (
        <div
          className={
            view === 'grid'
              ? 'grid grid-cols-1 gap-4 min-[481px]:grid-cols-2 min-[769px]:grid-cols-3 min-[1201px]:grid-cols-5'
              : 'flex flex-col gap-2.5'
          }
        >
          {filtered.map((item) => (
            <article
              key={item.id}
              className={`overflow-hidden rounded-xl border border-border bg-surface shadow-soft ${
                view === 'list' ? 'grid grid-cols-[96px_1fr] items-stretch' : ''
              }`}
            >
              <div
                className={`grid place-items-center overflow-hidden bg-slate-100 ${
                  view === 'list'
                    ? 'aspect-square min-h-24 rounded-l-[10px] border-r border-border'
                    : 'aspect-[1.15] border-b border-border'
                }`}
              >
                {item.previewUrl ? (
                  <img src={item.previewUrl} alt="" className="size-full object-cover" />
                ) : item.badge ? (
                  <span className={badgeClass}>{item.badge}</span>
                ) : null}
              </div>
              <div className={`px-3.5 pt-3 pb-3.5 ${view === 'list' ? 'flex flex-col justify-center' : ''}`}>
                <h2 className="m-0 text-sm leading-snug font-bold break-words text-slate-800">{item.name}</h2>
                <p className="mt-1.5 mb-0 text-[0.8rem] leading-snug text-ink-muted">
                  {item.size} · {item.date}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      {modalOpen ? (
        <div className="fixed inset-0 z-40 grid place-items-center p-5" role="presentation">
          <button
            type="button"
            className="absolute inset-0 border-0 bg-slate-900/45"
            aria-label="Close add media dialog"
            onClick={closeModal}
          />
          <div
            className="relative z-1 flex w-full max-w-[520px] flex-col gap-4 rounded-[14px] bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.22)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-media-title"
          >
            <h2 id="add-media-title" className="m-0 text-xl font-bold text-slate-800">
              Add New Media
            </h2>

            {!pending ? (
              <div
                className={`flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-xl border-[1.5px] border-dashed px-5 py-7 text-center ${
                  dragging ? 'border-orange-500 bg-orange-50' : 'border-slate-300 bg-slate-50'
                }`}
                onDragOver={(event) => {
                  event.preventDefault()
                  setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
              >
                <span className="grid place-items-center text-orange-500" aria-hidden="true">
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
                <p className="m-0 text-[0.95rem] font-semibold text-slate-800">Drag files here to upload</p>
                <button
                  type="button"
                  className="h-10 rounded-md border-0 bg-orange-500 px-[18px] text-[0.9rem] font-semibold text-white hover:bg-orange-600"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select Files
                </button>
                <p className="m-0 text-[0.8rem] text-ink-muted">Maximum upload file size: 64 MB</p>
              </div>
            ) : (
              <div className="grid grid-cols-[96px_1fr] gap-3.5 rounded-xl border border-border bg-slate-50 p-3.5">
                <div className="grid size-24 place-items-center overflow-hidden rounded-[10px] bg-slate-100">
                  {pending.kind === 'image' || pending.kind === 'svg' ? (
                    <img src={pending.previewUrl} alt="" className="size-full object-cover" />
                  ) : (
                    <span className={badgeClass}>{pending.badge ?? 'FILE'}</span>
                  )}
                </div>
                <div className="flex min-w-0 flex-col justify-center gap-1.5">
                  <p className="m-0 text-[0.95rem] font-bold break-words text-slate-800">{pending.name}</p>
                  <p className="m-0 text-[0.85rem] text-ink-muted">{pending.sizeLabel}</p>
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-200" aria-hidden={!uploading}>
                    <div
                      className="h-full bg-orange-500 transition-[width] duration-200 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="m-0 text-[0.8rem] text-ink-muted">
                    {uploading ? `Uploading... ${progress}%` : 'Ready to upload'}
                  </p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                className="h-[42px] rounded-md border border-border bg-white text-[0.925rem] font-semibold text-slate-800 hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
                onClick={clearPending}
                disabled={!pending || uploading}
              >
                Remove
              </button>
              <button
                type="button"
                className="h-[42px] rounded-md border-0 bg-orange-400 text-[0.925rem] font-semibold text-white hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handleUpload}
                disabled={!pending || uploading}
              >
                Upload
              </button>
            </div>
            <button
              type="button"
              className="h-[42px] w-full rounded-md border border-border bg-white text-[0.925rem] font-semibold text-slate-800 hover:bg-surface-hover disabled:cursor-not-allowed disabled:opacity-50"
              onClick={closeModal}
              disabled={uploading}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div
          className="fixed right-6 bottom-6 z-50 rounded-[10px] bg-slate-800 px-4 py-3 text-[0.9rem] font-semibold text-white shadow-[0_10px_30px_rgba(15,23,42,0.25)]"
          role="status"
        >
          {toast}
        </div>
      ) : null}
    </section>
  )
}
