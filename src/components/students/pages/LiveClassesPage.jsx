import { Video } from 'lucide-react'
import { liveClasses } from '../../../data/studentData.js'
import { Panel, PrimaryButton, StatusBadge } from '../shared/StudentUI.jsx'

function ClassList({ items, showJoin }) {
  return (
    <div className="space-y-3">
      {items.map((c) => (
        <div
          key={c.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5"
        >
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF5E14]/10 text-[#FF5E14]">
              <Video size={18} />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">{c.title}</p>
              <p className="text-xs text-slate-500">
                {c.trainer} · {c.time}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={c.status} />
            {showJoin && c.status !== 'Completed' ? (
              <PrimaryButton>
                <Video size={14} />
                Join
              </PrimaryButton>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function LiveClassesPage() {
  const today = liveClasses.filter((c) => c.when === 'today')
  const upcoming = liveClasses.filter((c) => c.when === 'upcoming')
  const previous = liveClasses.filter((c) => c.when === 'previous')

  return (
    <section className="space-y-3">
      <Panel title="Today's Live Classes">
        <ClassList items={today} showJoin />
      </Panel>
      <Panel title="Upcoming Live Classes">
        <ClassList items={upcoming} showJoin />
      </Panel>
      <Panel title="Previous Sessions">
        <ClassList items={previous} showJoin={false} />
      </Panel>
    </section>
  )
}
