import { useMemo, useState } from 'react'
import { CalendarDays, CheckCircle2, Download, Filter, Users, XCircle } from 'lucide-react'
import {
  attendanceRecords,
  attendanceTrend,
  dashboardStats,
  subjectAttendance,
} from '../../../data/facultyData.js'
import { AttendanceTrendChart } from '../shared/FacultyCharts.jsx'
import { Panel, PrimaryButton, SecondaryButton, StatCard, StatusBadge } from '../shared/FacultyUI.jsx'

const statusColor = {
  present: 'bg-emerald-500',
  absent: 'bg-rose-500',
  leave: 'bg-sky-500',
}

export default function AttendancePage() {
  const [batchFilter, setBatchFilter] = useState('All')

  const batchOptions = ['All', ...new Set(attendanceRecords.map((r) => r.batch))]

  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter((r) => batchFilter === 'All' || r.batch === batchFilter)
  }, [batchFilter])

  const totals = useMemo(() => {
    const present = filteredRecords.reduce((sum, r) => sum + r.present, 0)
    const absent = filteredRecords.reduce((sum, r) => sum + r.absent, 0)
    const leave = filteredRecords.reduce((sum, r) => sum + r.leave, 0)
    const avg = filteredRecords.length
      ? Math.round(filteredRecords.reduce((sum, r) => sum + r.percent, 0) / filteredRecords.length)
      : 0
    return { present, absent, leave, avg }
  }, [filteredRecords])

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <PrimaryButton>
            <CheckCircle2 size={14} />
            Mark Attendance
          </PrimaryButton>
          <SecondaryButton>
            <Users size={14} />
            Bulk Attendance
          </SecondaryButton>
          <SecondaryButton>
            <Download size={14} />
            Download Report
          </SecondaryButton>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Attendance Average" value={`${dashboardStats.attendanceAverage}%`} icon={CalendarDays} />
        <StatCard label="Present (Records)" value={totals.present} icon={CheckCircle2} />
        <StatCard label="Absent (Records)" value={totals.absent} icon={XCircle} />
        <StatCard label="On Leave" value={totals.leave} />
        <StatCard label="Filtered Avg" value={`${totals.avg}%`} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Filter size={14} className="text-[#008C95]" />
        <select
          value={batchFilter}
          onChange={(e) => setBatchFilter(e.target.value)}
          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-[#00A896]"
        >
          {batchOptions.map((b) => (
            <option key={b} value={b}>
              {b === 'All' ? 'All Batches' : b}
            </option>
          ))}
        </select>
      </div>

      <Panel title="Daily Attendance Records">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="px-3 py-3 font-medium">Date</th>
                <th className="px-3 py-3 font-medium">Batch</th>
                <th className="px-3 py-3 font-medium">Subject</th>
                <th className="px-3 py-3 font-medium">Present</th>
                <th className="px-3 py-3 font-medium">Absent</th>
                <th className="px-3 py-3 font-medium">Leave</th>
                <th className="px-3 py-3 font-medium">%</th>
                <th className="px-3 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((row) => (
                <tr key={row.id} className="border-b border-slate-100">
                  <td className="px-3 py-3 text-slate-600">
                    {new Date(row.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-3 py-3 font-medium text-slate-800">{row.batch}</td>
                  <td className="px-3 py-3">{row.subject}</td>
                  <td className="px-3 py-3 text-emerald-600">{row.present}</td>
                  <td className="px-3 py-3 text-rose-600">{row.absent}</td>
                  <td className="px-3 py-3 text-sky-600">{row.leave}</td>
                  <td className="px-3 py-3 font-semibold text-[#008C95]">{row.percent}%</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={row.percent >= 90 ? 'Present' : row.percent >= 75 ? 'Partial' : 'Absent'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Subject-wise Attendance">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="px-3 py-3 font-medium">Subject</th>
                  <th className="px-3 py-3 font-medium">Attendance %</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {subjectAttendance.map((row) => (
                  <tr key={row.subject} className="border-b border-slate-100">
                    <td className="px-3 py-3 font-medium text-slate-800">{row.subject}</td>
                    <td className="px-3 py-3 font-semibold text-[#008C95]">{row.percent}%</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={row.percent >= 90 ? 'Present' : row.percent >= 75 ? 'Partial' : 'Absent'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Attendance Trend">
          <AttendanceTrendChart data={attendanceTrend} />
        </Panel>
      </div>

      <Panel title="Recent Attendance (Calendar View)">
        <div className="mb-3 flex flex-wrap gap-3 text-[11px] text-slate-500">
          {Object.entries(statusColor).map(([k, c]) => (
            <span key={k} className="inline-flex items-center gap-1.5 capitalize">
              <span className={`h-2.5 w-2.5 rounded-full ${c}`} />
              {k}
            </span>
          ))}
        </div>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {attendanceRecords.map((rec) => (
            <li
              key={rec.id}
              className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
            >
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white text-center">
                <span className="text-[10px] font-semibold uppercase text-slate-400">
                  {new Date(rec.date).toLocaleDateString('en-IN', { month: 'short' })}
                </span>
                <span className="text-lg font-bold text-slate-800">{new Date(rec.date).getDate()}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800">{rec.subject}</p>
                <p className="text-xs text-slate-500">{rec.batch}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-1 text-emerald-600">
                    <span className={`h-1.5 w-1.5 rounded-full ${statusColor.present}`} />
                    {rec.present} present
                  </span>
                  <span className="inline-flex items-center gap-1 text-rose-600">
                    <span className={`h-1.5 w-1.5 rounded-full ${statusColor.absent}`} />
                    {rec.absent} absent
                  </span>
                  {rec.leave > 0 ? (
                    <span className="inline-flex items-center gap-1 text-sky-600">
                      <span className={`h-1.5 w-1.5 rounded-full ${statusColor.leave}`} />
                      {rec.leave} leave
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs font-semibold text-[#008C95]">{rec.percent}% attendance</p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </section>
  )
}
