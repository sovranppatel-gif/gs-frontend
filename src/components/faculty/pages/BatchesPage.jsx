import { Clock, Layers, TrendingUp, User, Users } from 'lucide-react'
import { batches } from '../../../data/facultyData.js'
import { Panel, ProgressBar, StatCard, StatusBadge } from '../shared/FacultyUI.jsx'

export default function BatchesPage() {
  const totalStudents = batches.reduce((sum, b) => sum + b.students, 0)
  const avgAttendance = Math.round(batches.reduce((sum, b) => sum + b.attendance, 0) / batches.length)
  const avgPerformance = Math.round(batches.reduce((sum, b) => sum + b.performance, 0) / batches.length)

  return (
    <section className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Batches" value={batches.length} icon={Layers} />
        <StatCard label="Total Students" value={totalStudents} icon={Users} />
        <StatCard label="Avg Attendance" value={`${avgAttendance}%`} icon={TrendingUp} />
        <StatCard label="Avg Performance" value={`${avgPerformance}%`} icon={TrendingUp} />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {batches.map((b) => (
          <article
            key={b.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-semibold text-slate-900">{b.name}</h3>
                <p className="mt-0.5 text-xs text-slate-500">{b.course}</p>
              </div>
              <StatusBadge status={b.status} />
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Clock size={12} className="text-[#008C95]" />
                {b.timing}
              </span>
              <span className="inline-flex items-center gap-1">
                <Users size={12} className="text-[#008C95]" />
                {b.students} students
              </span>
              <span className="inline-flex items-center gap-1">
                <User size={12} className="text-[#008C95]" />
                {b.trainer}
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-2.5 text-center">
                <p className="text-[11px] text-slate-400">Attendance</p>
                <p className="text-sm font-semibold text-[#008C95]">{b.attendance}%</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-2.5 text-center">
                <p className="text-[11px] text-slate-400">Performance</p>
                <p className="text-sm font-semibold text-[#FF5E14]">{b.performance}%</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-2.5 text-center">
                <p className="text-[11px] text-slate-400">Progress</p>
                <p className="text-sm font-semibold text-slate-800">{b.progress}%</p>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <ProgressBar value={b.attendance} label="Attendance" color="teal" />
              <ProgressBar value={b.performance} label="Performance" />
              <ProgressBar value={b.progress} label="Syllabus Progress" color="teal" />
            </div>
          </article>
        ))}
      </div>

      <Panel title="Batch Overview Table">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="px-3 py-3 font-medium">Batch</th>
                <th className="px-3 py-3 font-medium">Course</th>
                <th className="px-3 py-3 font-medium">Timing</th>
                <th className="px-3 py-3 font-medium">Students</th>
                <th className="px-3 py-3 font-medium">Trainer</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Attendance</th>
                <th className="px-3 py-3 font-medium">Performance</th>
                <th className="px-3 py-3 font-medium">Progress</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b) => (
                <tr key={b.id} className="border-b border-slate-100">
                  <td className="px-3 py-3 font-medium text-slate-800">{b.name}</td>
                  <td className="px-3 py-3 text-slate-600">{b.course}</td>
                  <td className="px-3 py-3 text-xs text-slate-500">{b.timing}</td>
                  <td className="px-3 py-3">{b.students}</td>
                  <td className="px-3 py-3 text-slate-600">{b.trainer}</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-3 py-3 font-semibold text-[#008C95]">{b.attendance}%</td>
                  <td className="px-3 py-3 font-semibold text-[#FF5E14]">{b.performance}%</td>
                  <td className="px-3 py-3">
                    <div className="min-w-[100px]">
                      <ProgressBar value={b.progress} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </section>
  )
}
