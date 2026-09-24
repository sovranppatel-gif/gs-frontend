import { Megaphone, Pin } from 'lucide-react'
import { announcements } from '../../../data/studentData.js'
import { Panel, StatusBadge } from '../shared/StudentUI.jsx'

export default function AnnouncementsPage() {
  const pinned = announcements.filter((a) => a.pinned)

  return (
    <section className="space-y-3">
      <Panel title="Pinned Announcements">
        <div className="space-y-3">
          {pinned.map((a) => (
            <article
              key={a.id}
              className="rounded-lg border border-[#FF5E14]/20 bg-gradient-to-br from-[#FFF0E6] to-white p-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <Pin size={14} className="mt-1 text-[#FF5E14]" />
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{a.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{a.body}</p>
                  </div>
                </div>
                <StatusBadge status={a.type} />
              </div>
              <p className="mt-2 text-[11px] text-slate-400">{a.date}</p>
            </article>
          ))}
        </div>
      </Panel>

      <Panel title="All Announcements">
        <div className="space-y-3">
          {announcements.map((a) => (
            <article key={a.id} className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#00A896]/10 text-[#008C95]">
                <Megaphone size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">{a.title}</h3>
                  <StatusBadge status={a.type} />
                </div>
                <p className="mt-1 text-sm text-slate-600">{a.body}</p>
                <p className="mt-2 text-[11px] text-slate-400">{a.date}</p>
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </section>
  )
}
