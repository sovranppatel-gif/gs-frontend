import { Clock, Copy, ExternalLink, Plus, Users, Video } from 'lucide-react'
import { liveClasses } from '../../../data/facultyData.js'
import { Panel, PrimaryButton, SecondaryButton, StatusBadge } from '../shared/FacultyUI.jsx'

function ClassCard({ item, showJoin }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-[#FF5E14]/30 hover:bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FF5E14]/10 text-[#FF5E14]">
            <Video size={20} />
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-900">{item.title}</p>
            <p className="mt-0.5 text-xs text-slate-500">
              {item.batch} · {item.time}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Clock size={12} />
                {item.duration}
              </span>
              <span className="inline-flex items-center gap-1">
                <Users size={12} />
                {item.participants} participants
              </span>
            </div>
          </div>
        </div>
        <StatusBadge status={item.status} />
      </div>

      {item.link && item.link !== '—' ? (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
          <ExternalLink size={14} className="shrink-0 text-[#008C95]" />
          <span className="min-w-0 flex-1 truncate text-xs text-slate-600">{item.link}</span>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#008C95] hover:text-[#FF5E14]"
          >
            <Copy size={11} />
            Copy
          </button>
        </div>
      ) : null}

      {showJoin && item.status !== 'Completed' ? (
        <div className="mt-3 flex gap-2">
          <PrimaryButton>
            <Video size={14} />
            Join Meeting
          </PrimaryButton>
          <SecondaryButton>Share Link</SecondaryButton>
        </div>
      ) : null}
    </div>
  )
}

function ClassList({ items, showJoin }) {
  if (items.length === 0) {
    return <p className="py-4 text-center text-sm text-slate-500">No sessions in this category.</p>
  }
  return (
    <div className="space-y-3">
      {items.map((c) => (
        <ClassCard key={c.id} item={c} showJoin={showJoin} />
      ))}
    </div>
  )
}

export default function LiveClassesPage() {
  const today = liveClasses.filter((c) => c.time.toLowerCase().includes('today'))
  const upcoming = liveClasses.filter(
    (c) => c.status === 'Upcoming' && !c.time.toLowerCase().includes('today')
  )
  const completed = liveClasses.filter((c) => c.status === 'Completed')

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <PrimaryButton>
          <Plus size={14} />
          Create Meeting
        </PrimaryButton>
        <SecondaryButton>
          <Video size={14} />
          Start Instant Class
        </SecondaryButton>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-2xl font-semibold text-[#FF5E14]">{today.length}</p>
          <p className="text-sm text-slate-500">Today&apos;s Classes</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-2xl font-semibold text-sky-600">{upcoming.length}</p>
          <p className="text-sm text-slate-500">Upcoming</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-2xl font-semibold text-[#008C95]">{completed.length}</p>
          <p className="text-sm text-slate-500">Completed</p>
        </article>
      </div>

      <Panel title="Today's Live Classes">
        <ClassList items={today} showJoin />
      </Panel>

      <Panel title="Upcoming Live Classes">
        <ClassList items={upcoming} showJoin />
      </Panel>

      <Panel title="Completed Sessions">
        <ClassList items={completed} showJoin={false} />
      </Panel>
    </section>
  )
}
