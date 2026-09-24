import { useMemo, useState } from 'react'
import { Download, Upload } from 'lucide-react'
import { assignments } from '../../../data/studentData.js'
import { Panel, PrimaryButton, ProgressBar, SearchInput, StatCard, StatusBadge } from '../shared/StudentUI.jsx'
import { ClipboardList, CheckCircle2, AlertTriangle } from 'lucide-react'

export default function AssignmentsPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')

  const counts = useMemo(() => {
    return {
      pending: assignments.filter((a) => a.status === 'Pending').length,
      completed: assignments.filter((a) => a.status === 'Completed').length,
      late: assignments.filter((a) => a.status === 'Late').length,
    }
  }, [])

  const filtered = assignments.filter((a) => {
    const matchQ =
      !query ||
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.subject.toLowerCase().includes(query.toLowerCase())
    const matchF = filter === 'All' || a.status === filter
    return matchQ && matchF
  })

  return (
    <section className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Pending" value={counts.pending} icon={ClipboardList} />
        <StatCard label="Completed" value={counts.completed} icon={CheckCircle2} />
        <StatCard label="Late" value={counts.late} icon={AlertTriangle} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="min-w-[200px] flex-1">
          <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search assignments…" />
        </div>
        {['All', 'Pending', 'Completed', 'Late'].map((f) => (
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
                  {a.subject} · Faculty: {a.faculty}
                </p>
              </div>
              <StatusBadge status={a.status} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
              <p>
                Due: <span className="font-medium text-slate-700">{a.dueDate}</span>
              </p>
              <p>
                Submitted: <span className="font-medium text-slate-700">{a.submittedDate || '—'}</span>
              </p>
              <p>
                Marks: <span className="font-medium text-slate-700">{a.marks}</span>
              </p>
              <p>
                Progress: <span className="font-medium text-slate-700">{a.progress}%</span>
              </p>
            </div>
            <div className="mt-3">
              <ProgressBar value={a.progress} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <PrimaryButton>
                <Download size={14} />
                Download
              </PrimaryButton>
              {a.status === 'Pending' ? (
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-[#00A896]/40 bg-[#00A896]/10 px-4 py-2 text-sm font-semibold text-[#005F6B] transition hover:bg-[#00A896]/20"
                >
                  <Upload size={14} />
                  Upload (Demo)
                </button>
              ) : null}
            </div>
          </Panel>
        ))}
      </div>
    </section>
  )
}
