import { useState, type FormEvent } from 'react'

const glanceStats = [
  {
    label: 'Total APIs Active',
    value: '24',
    meta: '+3 this month',
    metaTone: 'positive' as const,
  },
  {
    label: 'Published Posts',
    value: '150',
    meta: 'Across 4 locales',
    metaTone: 'muted' as const,
  },
  {
    label: 'Active VAS Packages',
    value: '8',
    meta: 'All systems nominal',
    metaTone: 'muted' as const,
  },
  {
    label: 'System Health',
    value: 'Healthy',
    meta: '99.98% uptime',
    metaTone: 'muted' as const,
    valueTone: 'healthy' as const,
  },
]

const activities = [
  {
    initials: 'KS',
    actor: 'Ko Sai',
    action: 'published',
    target: 'List users endpoint',
    time: '2 min ago',
  },
  {
    initials: 'MT',
    actor: 'May Thu',
    action: 'updated',
    target: 'Developers taxonomy',
    time: '18 min ago',
  },
  {
    initials: 'AN',
    actor: 'Aung Naing',
    action: 'created',
    target: 'Draft release notes',
    time: '1 hour ago',
  },
  {
    initials: 'KS',
    actor: 'Ko Sai',
    action: 'deployed',
    target: 'Posts API v1.4',
    time: '3 hours ago',
  },
]

const quickLinks = [
  { title: 'API Credentials', description: 'Manage API keys, tokens, and secrets' },
  { title: 'Webhooks', description: 'Manage API keys, tokens, and secrets' },
  { title: 'Error Logs', description: 'Manage API keys, tokens, and secrets' },
  { title: 'Rate Limits', description: 'Manage API keys, tokens, and secrets' },
]

const cardClass = 'rounded-xl border border-border bg-surface p-5 shadow-soft'
const fieldClass =
  'w-full rounded-md border border-border bg-surface px-3 py-2.5 text-[0.925rem] text-ink outline-none transition focus:border-orange-500 focus:shadow-[0_0_0_3px_rgba(249,115,22,0.15)]'

export function Dashboard() {
  const [draftTitle, setDraftTitle] = useState('')
  const [draftNote, setDraftNote] = useState('')

  function handleSaveDraft(event: FormEvent) {
    event.preventDefault()
    setDraftTitle('')
    setDraftNote('')
  }

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-1.5">
        <p className="m-0 text-xs font-bold tracking-[0.08em] text-orange-500 uppercase">Dashboard</p>
        <h1 className="m-0 text-[1.75rem] leading-tight font-bold tracking-tight text-slate-800">
          Welcome to Mytel Developer CMS!
        </h1>
        <p className="m-0 max-w-[54ch] text-[0.95rem] leading-normal text-ink-muted">
          Manage your APIs, content, and developer platform from one workspace.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_1fr]">
        <article className={`${cardClass} xl:col-span-2`}>
          <h2 className="m-0 text-[1.05rem] font-bold text-slate-800">At a Glance</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-0">
            {glanceStats.map((stat, index) => (
              <div
                key={stat.label}
                className={`min-w-0 px-0 md:px-4 ${index > 0 ? 'md:border-l md:border-border' : ''} ${index === 0 ? 'md:pl-0' : ''} ${index === glanceStats.length - 1 ? 'md:pr-0' : ''}`}
              >
                <p className="m-0 text-[0.8rem] leading-snug text-ink-muted">{stat.label}</p>
                <p
                  className={`my-2 text-[1.75rem] leading-none font-bold tracking-tight ${
                    stat.valueTone === 'healthy' ? 'text-[1.35rem] text-green-600' : 'text-slate-800'
                  }`}
                >
                  {stat.valueTone === 'healthy' ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="size-2 shrink-0 rounded-full bg-green-600" aria-hidden="true" />
                      {stat.value}
                    </span>
                  ) : (
                    stat.value
                  )}
                </p>
                <p
                  className={`m-0 text-[0.8rem] leading-snug ${
                    stat.metaTone === 'positive' ? 'font-semibold text-green-600' : 'text-ink-muted'
                  }`}
                >
                  {stat.meta}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className={cardClass}>
          <h2 className="m-0 text-[1.05rem] font-bold text-slate-800">Quick Draft &amp; API Test</h2>
          <p className="mt-1.5 mb-0 text-sm leading-snug text-ink-muted">
            Capture an idea or test a request quickly.
          </p>
          <form className="mt-3.5 flex flex-col gap-3" onSubmit={handleSaveDraft}>
            <input
              type="text"
              className={fieldClass}
              placeholder="Draft title"
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              aria-label="Draft title"
            />
            <textarea
              className={`${fieldClass} min-h-[110px] resize-y leading-snug`}
              placeholder="Write a quick note or API payload..."
              value={draftNote}
              onChange={(event) => setDraftNote(event.target.value)}
              rows={5}
              aria-label="Draft note"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="h-[38px] rounded-md border-0 bg-orange-500 px-4 font-semibold text-white hover:bg-orange-600"
              >
                Save Draft
              </button>
            </div>
          </form>
        </article>

        <article className={cardClass}>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="m-0 text-[1.05rem] font-bold text-slate-800">Recent Activity / Audit Logs</h2>
            <a href="#activity" className="whitespace-nowrap text-sm font-semibold text-orange-500 hover:text-orange-600">
              View all
            </a>
          </div>
          <p className="mt-1.5 mb-0 text-sm leading-snug text-ink-muted">Latest workspace events.</p>
          <ul className="mt-4 m-0 flex list-none flex-col gap-3 p-0" id="activity">
            {activities.map((item) => (
              <li key={`${item.actor}-${item.target}-${item.time}`} className="flex gap-3">
                <span
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-subtle text-xs font-semibold text-slate-700"
                  aria-hidden="true"
                >
                  {item.initials}
                </span>
                <div className="min-w-0">
                  <p className="m-0 text-sm text-ink">
                    <strong>{item.actor}</strong> {item.action} <strong>{item.target}</strong>
                  </p>
                  <p className="mt-0.5 mb-0 text-xs text-ink-muted">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className={`${cardClass} xl:col-span-2`}>
          <h2 className="m-0 text-[1.05rem] font-bold text-slate-800">Developer Quick Links</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((link) => (
              <a
                key={link.title}
                href="#links"
                className="rounded-lg border border-border bg-surface-subtle px-4 py-3 transition hover:border-orange-300 hover:bg-white"
              >
                <span className="block text-sm font-semibold text-slate-800">{link.title}</span>
                <span className="mt-1 block text-xs text-ink-muted">{link.description}</span>
              </a>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}
