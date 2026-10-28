import {
  Card,
  CardContent,
  CardHeader, 
} from '@/components/ui/card'
import { Typography } from '@/reusable' 
import { Separator } from '@/components/ui/separator'


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
 
const cardClass = 'rounded-xl border border-border bg-surface p-5 shadow-soft' 
export function Dashboard() {

  return (
    <section className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_1fr]">
        <Card className="xl:col-span-2">
          <CardHeader> 
            <Typography size={16} weight={600}>At a Glance</Typography>
          </CardHeader> 
          <Separator />
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {glanceStats.map((stat) => (
                <Card key={stat.label} size="sm" className="min-w-0 shadow-none">
                  <CardContent>
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card> 

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
      </div>
    </section>
  )
}
