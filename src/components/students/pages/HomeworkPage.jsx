import { CheckCircle2, Circle } from 'lucide-react'
import { homeworkList } from '../../../data/studentData.js'
import { Panel, StatusBadge } from '../shared/StudentUI.jsx'

export default function HomeworkPage() {
  return (
    <section className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        {homeworkList.map((hw) => (
          <article
            key={hw.id}
            className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                {hw.completed ? (
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#00A896]" />
                ) : (
                  <Circle size={18} className="mt-0.5 shrink-0 text-slate-300" />
                )}
                <div>
                  <h3 className="text-base font-semibold text-slate-900">{hw.title}</h3>
                  <p className="mt-0.5 text-xs text-[#008C95]">{hw.subject}</p>
                </div>
              </div>
              <StatusBadge status={hw.priority} />
            </div>
            <p className="mt-3 text-sm text-slate-600">{hw.description}</p>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span>Due: {hw.dueDate}</span>
              <StatusBadge status={hw.completed ? 'Completed' : 'Pending'} />
            </div>
          </article>
        ))}
      </div>
      <Panel title="Tips">
        <p className="text-sm text-slate-600">
          Complete high-priority homework first. Marking as complete here is demo-only and will sync with your trainer
          portal when APIs are connected.
        </p>
      </Panel>
    </section>
  )
}
