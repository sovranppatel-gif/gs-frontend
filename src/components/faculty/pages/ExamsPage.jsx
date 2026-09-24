import { useMemo, useState } from 'react'
import { AlertTriangle, Calendar, Clock, GraduationCap, Plus, Users } from 'lucide-react'
import { exams } from '../../../data/facultyData.js'
import {
  Panel,
  PrimaryButton,
  SearchInput,
  SecondaryButton,
  StatusBadge,
} from '../shared/FacultyUI.jsx'

const statusFilters = ['All', 'Scheduled', 'Completed']

export default function ExamsPage() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const filtered = useMemo(() => {
    return exams.filter((e) => {
      const q =
        !query ||
        e.title.toLowerCase().includes(query.toLowerCase()) ||
        e.batch.toLowerCase().includes(query.toLowerCase())
      const s = statusFilter === 'All' || e.status === statusFilter
      return q && s
    })
  }, [query, statusFilter])

  const scheduled = exams.filter((e) => e.status === 'Scheduled')
  const completed = exams.filter((e) => e.status === 'Completed')

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <PrimaryButton>
          <Plus size={14} />
          Create Exam
        </PrimaryButton>
        <SecondaryButton>
          <Calendar size={14} />
          Schedule Exam
        </SecondaryButton>
        <div className="min-w-[200px] flex-1">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search exams…"
          />
        </div>
        {statusFilters.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              statusFilter === s
                ? 'bg-gradient-to-r from-[#FF5E14] to-[#008C95] text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-[#FF5E14]/30'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-2xl font-semibold text-slate-900">{exams.length}</p>
          <p className="text-sm text-slate-500">Total Exams</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-2xl font-semibold text-sky-600">{scheduled.length}</p>
          <p className="text-sm text-slate-500">Scheduled</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-2xl font-semibold text-[#008C95]">{completed.length}</p>
          <p className="text-sm text-slate-500">Completed</p>
        </article>
      </div>

      <Panel title="Exam List">
        <div className="space-y-3">
          {filtered.map((e) => (
            <div
              key={e.id}
              className="rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:border-[#008C95]/30 hover:bg-white"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#00A896]/10 text-[#008C95]">
                    <GraduationCap size={20} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{e.title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {e.batch} · {e.date}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          e.type === 'Online'
                            ? 'bg-[#00A896]/15 text-[#005F6B]'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {e.type}
                      </span>
                      <StatusBadge status={e.status} />
                      {e.negative ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700">
                          <AlertTriangle size={11} />
                          Negative Marking
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Clock size={12} />
                    {e.duration}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                    {e.marks} marks
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users size={12} />
                    {e.students} students
                  </span>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                {e.status === 'Scheduled' ? (
                  <>
                    <PrimaryButton>Edit Exam</PrimaryButton>
                    <SecondaryButton>View Students</SecondaryButton>
                  </>
                ) : (
                  <>
                    <PrimaryButton>View Results</PrimaryButton>
                    <SecondaryButton>Download Report</SecondaryButton>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">No exams match your filters.</p>
        ) : null}
      </Panel>
    </section>
  )
}
