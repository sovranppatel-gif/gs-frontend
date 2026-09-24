import { Download, GraduationCap } from 'lucide-react'
import { dashboardStats, exams, subjectMarks } from '../../../data/studentData.js'
import { MarksComparisonChart, ProgressCircle } from '../shared/StudentCharts.jsx'
import { Panel, PrimaryButton, StatCard, StatusBadge } from '../shared/StudentUI.jsx'

export default function ExamResultsPage() {
  const upcoming = exams.filter((e) => e.status === 'Upcoming')
  const previous = exams.filter((e) => e.status === 'Completed')

  return (
    <section className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Overall GPA" value={dashboardStats.currentGpa} icon={GraduationCap} />
        <StatCard label="Last Exam %" value="86%" />
        <StatCard label="Batch Rank" value="#5" />
        <article className="flex items-center justify-center rounded-lg border border-slate-200 bg-white p-3">
          <ProgressCircle value={86} size={100} label="Last Score" />
        </article>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Upcoming Exams">
          <div className="space-y-3">
            {upcoming.map((e) => (
              <div key={e.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{e.title}</p>
                  <p className="text-xs text-slate-500">
                    {e.subject} · {e.date}
                  </p>
                </div>
                <StatusBadge status={e.status} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Subject-wise Marks">
          <MarksComparisonChart data={subjectMarks} />
        </Panel>
      </div>

      <Panel
        title="Previous Exams"
        action={
          <PrimaryButton>
            <Download size={14} />
            Download Marksheet
          </PrimaryButton>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="px-3 py-3 font-medium">Exam</th>
                <th className="px-3 py-3 font-medium">Subject</th>
                <th className="px-3 py-3 font-medium">Date</th>
                <th className="px-3 py-3 font-medium">Marks</th>
                <th className="px-3 py-3 font-medium">%</th>
                <th className="px-3 py-3 font-medium">Rank</th>
              </tr>
            </thead>
            <tbody>
              {previous.map((e) => (
                <tr key={e.id} className="border-b border-slate-100">
                  <td className="px-3 py-3 font-medium text-slate-800">{e.title}</td>
                  <td className="px-3 py-3">{e.subject}</td>
                  <td className="px-3 py-3">{e.date}</td>
                  <td className="px-3 py-3">{e.marks}</td>
                  <td className="px-3 py-3 font-semibold text-[#008C95]">{e.percentage}%</td>
                  <td className="px-3 py-3">#{e.rank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </section>
  )
}
