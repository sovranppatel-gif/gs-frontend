import { useMemo, useState } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  ClipboardList,
  MessageSquare,
  Plus,
  Star,
} from 'lucide-react'
import { assignments, dashboardStats } from '../../../data/facultyData.js'
import {
  Panel,
  PrimaryButton,
  SearchInput,
  SecondaryButton,
  StatCard,
  StatusBadge,
} from '../shared/FacultyUI.jsx'

export default function AssignmentsPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')

  const counts = useMemo(() => {
    const pending = assignments.reduce((sum, a) => sum + a.pending, 0)
    const submitted = assignments.reduce((sum, a) => sum + a.submitted, 0)
    const late = assignments.reduce((sum, a) => sum + a.late, 0)
    const checked = assignments.reduce((sum, a) => sum + a.checked, 0)
    return { pending, submitted, late, checked }
  }, [])

  const filtered = assignments.filter((a) => {
    const matchQ =
      !query ||
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.subject.toLowerCase().includes(query.toLowerCase()) ||
      a.batch.toLowerCase().includes(query.toLowerCase())
    const matchF = filter === 'All' || a.status === filter
    return matchQ && matchF
  })

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Pending to Check" value={dashboardStats.pendingAssignments} icon={ClipboardList} />
          <StatCard label="Submissions" value={counts.submitted} icon={CheckCircle2} />
          <StatCard label="Late Submissions" value={counts.late} icon={AlertTriangle} />
          <StatCard label="Checked" value={counts.checked} icon={ClipboardCheck} hint={`${dashboardStats.assignmentsChecked} total checked`} />
        </div>
        <PrimaryButton className="shrink-0">
          <Plus size={14} />
          Create Assignment
        </PrimaryButton>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="min-w-[200px] flex-1">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search assignments…"
          />
        </div>
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

      <div className="grid gap-3 lg:grid-cols-2">
        {filtered.map((a) => (
          <Panel key={a.id}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium text-[#008C95]">{a.id}</p>
                <h3 className="text-base font-semibold text-slate-900">{a.title}</h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  {a.subject} · {a.batch}
                </p>
              </div>
              <StatusBadge status={a.status} />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 text-xs">
              <div className="rounded-xl bg-amber-50 px-2.5 py-2 text-center">
                <p className="text-slate-400">Pending</p>
                <p className="text-sm font-semibold text-amber-700">{a.pending}</p>
              </div>
              <div className="rounded-xl bg-[#00A896]/10 px-2.5 py-2 text-center">
                <p className="text-slate-400">Submitted</p>
                <p className="text-sm font-semibold text-[#005F6B]">{a.submitted}</p>
              </div>
              <div className="rounded-xl bg-rose-50 px-2.5 py-2 text-center">
                <p className="text-slate-400">Late</p>
                <p className="text-sm font-semibold text-rose-700">{a.late}</p>
              </div>
              <div className="rounded-xl bg-slate-50 px-2.5 py-2 text-center">
                <p className="text-slate-400">Checked</p>
                <p className="text-sm font-semibold text-slate-800">{a.checked}</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
              <p>
                Due: <span className="font-medium text-slate-700">{a.dueDate}</span>
              </p>
              <p>
                Max Marks: <span className="font-medium text-slate-700">{a.marks}</span>
              </p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {a.status === 'Pending' ? (
                <>
                  <PrimaryButton>
                    <ClipboardCheck size={14} />
                    Check Assignment
                  </PrimaryButton>
                  <SecondaryButton>
                    <Star size={14} />
                    Give Marks
                  </SecondaryButton>
                  <SecondaryButton>
                    <MessageSquare size={14} />
                    Feedback
                  </SecondaryButton>
                </>
              ) : (
                <>
                  <SecondaryButton>
                    <ClipboardCheck size={14} />
                    View Submissions
                  </SecondaryButton>
                  <SecondaryButton>
                    <Star size={14} />
                    View Marks
                  </SecondaryButton>
                </>
              )}
            </div>
          </Panel>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">No assignments match your search or filters.</p>
      ) : null}
    </section>
  )
}
