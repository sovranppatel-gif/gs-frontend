import { useMemo, useState } from 'react'
import { Mail, Phone, TrendingUp, User, Users } from 'lucide-react'
import { batches, dashboardStats, students } from '../../../data/facultyData.js'
import { Panel, ProgressBar, SearchInput, StatCard, StatusBadge } from '../shared/FacultyUI.jsx'

export default function StudentsPage() {
  const [query, setQuery] = useState('')
  const [batchFilter, setBatchFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const batchOptions = ['All', ...new Set(students.map((s) => s.batch))]

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const q = query.trim().toLowerCase()
      const matchQ =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.batch.toLowerCase().includes(q)
      const matchBatch = batchFilter === 'All' || s.batch === batchFilter
      const matchStatus = statusFilter === 'All' || s.status === statusFilter
      return matchQ && matchBatch && matchStatus
    })
  }, [query, batchFilter, statusFilter])

  const avgAttendance = Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / students.length)
  const avgPerformance = Math.round(students.reduce((sum, s) => sum + s.performance, 0) / students.length)
  const feesDue = students.filter((s) => s.feesStatus === 'Due' || s.feesStatus === 'Partial').length

  return (
    <section className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Total Students" value={dashboardStats.totalStudents} icon={Users} />
        <StatCard label="Active Students" value={dashboardStats.activeStudents} icon={User} />
        <StatCard label="In View" value={filtered.length} icon={Users} />
        <StatCard label="Avg Attendance" value={`${avgAttendance}%`} icon={TrendingUp} />
        <StatCard label="Avg Performance" value={`${avgPerformance}%`} icon={TrendingUp} hint={`${feesDue} with fee pending/partial`} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="min-w-[200px] flex-1">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, ID, email or batch…"
          />
        </div>
        <select
          value={batchFilter}
          onChange={(e) => setBatchFilter(e.target.value)}
          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#00A896]"
        >
          {batchOptions.map((b) => (
            <option key={b} value={b}>
              {b === 'All' ? 'All Batches' : b}
            </option>
          ))}
        </select>
        {['All', 'Active'].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setStatusFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              statusFilter === f
                ? 'bg-gradient-to-r from-[#FF5E14] to-[#008C95] text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-[#FF5E14]/40'
            }`}
          >
            {f === 'All' ? 'All Status' : f}
          </button>
        ))}
      </div>

      <Panel title={`Students (${filtered.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="px-3 py-3 font-medium">Student</th>
                <th className="px-3 py-3 font-medium">Batch</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Attendance</th>
                <th className="px-3 py-3 font-medium">Performance</th>
                <th className="px-3 py-3 font-medium">Assignment</th>
                <th className="px-3 py-3 font-medium">Fees</th>
                <th className="px-3 py-3 font-medium">Progress</th>
                <th className="px-3 py-3 font-medium">Marks</th>
                <th className="px-3 py-3 font-medium">Contact</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                  <td className="px-3 py-3">
                    <p className="font-medium text-slate-800">{s.name}</p>
                    <p className="text-[11px] text-slate-400">{s.id}</p>
                  </td>
                  <td className="px-3 py-3 text-slate-600">{s.batch}</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="px-3 py-3">
                    <span className={`font-semibold ${s.attendance >= 85 ? 'text-[#008C95]' : s.attendance >= 70 ? 'text-amber-600' : 'text-rose-600'}`}>
                      {s.attendance}%
                    </span>
                  </td>
                  <td className="px-3 py-3 font-semibold text-slate-700">{s.performance}%</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={s.assignmentStatus} />
                  </td>
                  <td className="px-3 py-3">
                    <StatusBadge status={s.feesStatus} />
                  </td>
                  <td className="px-3 py-3">
                    <div className="min-w-[80px]">
                      <ProgressBar value={s.progress} />
                    </div>
                  </td>
                  <td className="px-3 py-3 font-semibold text-[#008C95]">{s.marks}%</td>
                  <td className="px-3 py-3">
                    <div className="space-y-1 text-[11px] text-slate-500">
                      <p className="flex items-center gap-1">
                        <Mail size={10} className="shrink-0" />
                        <span className="truncate max-w-[140px]">{s.email}</span>
                      </p>
                      <p className="flex items-center gap-1">
                        <Phone size={10} className="shrink-0" />
                        {s.phone}
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">No students match your search or filters.</p>
        ) : null}
      </Panel>

      <p className="text-xs text-slate-400">
        Showing {filtered.length} of {students.length} students across {batches.length} batches.
      </p>
    </section>
  )
}
