import { FormEvent, useState } from 'react'
import './Overview.css'

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

export function Dashboard() {
  const [draftTitle, setDraftTitle] = useState('')
  const [draftNote, setDraftNote] = useState('')

  function handleSaveDraft(event: FormEvent) {
    event.preventDefault()
    setDraftTitle('')
    setDraftNote('')
  }

  return (
    <section className="overview">
      <header className="overview__hero">
        <p className="overview__eyebrow">Dashboard</p>
        <h1 className="overview__title">Welcome to Mytel Developer CMS!</h1>
        <p className="overview__subtitle">
          Manage your APIs, content, and developer platform from one workspace.
        </p>
      </header>

      <div className="overview__grid">
        <article className="overview-card overview-card--glance">
          <h2 className="overview-card__title">At a Glance</h2>
          <div className="overview-glance">
            {glanceStats.map((stat) => (
              <div key={stat.label} className="overview-glance__item">
                <p className="overview-glance__label">{stat.label}</p>
                <p
                  className={`overview-glance__value${
                    stat.valueTone === 'healthy' ? ' overview-glance__value--healthy' : ''
                  }`}
                >
                  {stat.valueTone === 'healthy' ? (
                    <span className="overview-glance__health">
                      <span className="overview-glance__dot" aria-hidden="true" />
                      {stat.value}
                    </span>
                  ) : (
                    stat.value
                  )}
                </p>
                <p
                  className={`overview-glance__meta${
                    stat.metaTone === 'positive' ? ' overview-glance__meta--positive' : ''
                  }`}
                >
                  {stat.meta}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="overview-card">
          <h2 className="overview-card__title">Quick Draft &amp; API Test</h2>
          <p className="overview-card__subtitle">Capture an idea or test a request quickly.</p>
          <form className="overview-draft" onSubmit={handleSaveDraft}>
            <input
              type="text"
              className="overview-draft__input"
              placeholder="Draft title"
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              aria-label="Draft title"
            />
            <textarea
              className="overview-draft__textarea"
              placeholder="Write a quick note or API payload..."
              value={draftNote}
              onChange={(event) => setDraftNote(event.target.value)}
              rows={5}
              aria-label="Draft note"
            />
            <div className="overview-draft__actions">
              <button type="submit" className="overview-draft__submit">
                Save Draft
              </button>
            </div>
          </form>
        </article>

        <article className="overview-card">
          <div className="overview-card__header">
            <h2 className="overview-card__title">Recent Activity / Audit Logs</h2>
            <a href="#activity" className="overview-card__link">
              View all
            </a>
          </div>
          <p className="overview-card__subtitle">Latest workspace events.</p>
          <ul className="overview-activity" id="activity">
            {activities.map((item) => (
              <li key={`${item.actor}-${item.target}-${item.time}`} className="overview-activity__item">
                <span className="overview-activity__avatar" aria-hidden="true">
                  {item.initials}
                </span>
                <div className="overview-activity__body">
                  <p className="overview-activity__text">
                    <strong>{item.actor}</strong> {item.action} <strong>{item.target}</strong>
                  </p>
                  <p className="overview-activity__time">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="overview-card">
          <h2 className="overview-card__title">Developer Quick Links</h2>
          <div className="overview-links">
            {quickLinks.map((link) => (
              <a key={link.title} href="#links" className="overview-links__item">
                <span className="overview-links__title">{link.title}</span>
                <span className="overview-links__desc">{link.description}</span>
              </a>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}
