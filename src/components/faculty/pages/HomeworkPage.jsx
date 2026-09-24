import { useMemo, useState } from 'react'
import { Calendar, CheckCircle2, Circle, Clock, Plus, Users } from 'lucide-react'
import { dashboardStats, homework } from '../../../data/facultyData.js'
import { Panel, PrimaryButton, SecondaryButton, StatCard, StatusBadge } from '../shared/FacultyUI.jsx'

export default function HomeworkPage() {
  const [filter, setFilter] = useState('All')

  const counts = useMemo(() => {
    return {
      pending: homework.filter((h) => h.status === 'Pending').length,
      completed: homework.filter((h) => h.status === 'Completed').length,
      high: homework.filter((h) => h.priority === 'High').length,
      totalSubmissions: homework.reduce((sum, h) => sum + h.submissions, 0),
    }
  }, [])

  const filtered = homework.filter((h) => filter === 'All' || h.status === filter)

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Pending Homework" value={dashboardStats.pendingHomework} icon={Circle} />
          <StatCard label="Pending Items" value={counts.pending} icon={Clock} />
          <StatCard label="Completed" value={counts.completed} icon={CheckCircle2} />
          <StatCard label="Total Submissions" value={counts.totalSubmissions} icon={Users} hint={`${counts.high} high priority`} />
        </div>
        <PrimaryButton className="shrink-0">
          <Plus size={14} />
          Create Homework
        </PrimaryButton>
      </div>

      <div className="flex flex-wrap gap-2">
        {['All', 'Pending', 'Completed'].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              filter === f
                ? 'bg-gradient-to-r from-[#FF5E14] to-[#008C95] text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-[#FF5E14]/40'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map((hw) => (
          <article
            key={hw.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2">
                {hw.status === 'Completed' ? (
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#00A896]" />
                ) : (
                  <Circle size={18} className="mt-0.5 shrink-0 text-slate-300" />
                )}
                <div>
                  <p className="text-xs font-medium text-[#008C95]">{hw.id}</p>
                  <h3 className="text-base font-semibold text-slate-900">{hw.title}</h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {hw.subject} · {hw.batch}
                  </p>
                </div>
              </div>
              <StatusBadge status={hw.priority} />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Calendar size={12} className="text-[#FF5E14]" />
                Due: {hw.dueDate}
              </span>
              <span className="inline-flex items-center gap-1">
                <Users size={12} className="text-[#008C95]" />
                {hw.submissions} submissions
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <StatusBadge status={hw.status} />
              {hw.status === 'Pending' ? (
                <div className="flex gap-2">
                  <SecondaryButton className="!px-3 !py-1.5 text-xs">Review</SecondaryButton>
                  <PrimaryButton className="!px-3 !py-1.5 text-xs">Mark Checked</PrimaryButton>
                </div>
              ) : (
                <SecondaryButton className="!px-3 !py-1.5 text-xs">View Submissions</SecondaryButton>
              )}
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">No homework matches the selected filter.</p>
      ) : null}

      <Panel title="Homework Tips">
        <p className="text-sm text-slate-600">
          Assign high-priority homework for concepts students struggle with. Use due dates to align with upcoming
          classes. Submission counts update in demo mode — connect APIs for live sync with the student portal.
        </p>
      </Panel>
    </section>
  )
}
