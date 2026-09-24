import { useMemo, useState } from 'react'
import { Download, FileSpreadsheet, GraduationCap, PenLine, Trophy } from 'lucide-react'
import { dashboardStats, examPerformanceChart, marksResults } from '../../../data/facultyData.js'
import { ExamPerformanceChart } from '../shared/FacultyCharts.jsx'
import {
  Panel,
  PrimaryButton,
  SearchInput,
  SecondaryButton,
  StatCard,
  StatusBadge,
} from '../shared/FacultyUI.jsx'

export default function MarksResultsPage() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return marksResults.filter(
      (m) =>
        !query ||
        m.student.toLowerCase().includes(query.toLowerCase()) ||
        m.batch.toLowerCase().includes(query.toLowerCase()) ||
        m.exam.toLowerCase().includes(query.toLowerCase())
    )
  }, [query])

  const passCount = marksResults.filter((m) => m.status === 'Pass').length
  const avgPercent = Math.round(
    marksResults.reduce((sum, m) => sum + m.percent, 0) / marksResults.length
  )

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <PrimaryButton>
          <PenLine size={14} />
          Enter Marks
        </PrimaryButton>
        <SecondaryButton>
          <FileSpreadsheet size={14} />
          Generate Marksheet
        </SecondaryButton>
        <SecondaryButton>
          <Download size={14} />
          Download Report
        </SecondaryButton>
        <div className="min-w-[200px] flex-1">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search student, batch or exam…"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Students Evaluated" value={marksResults.length} icon={GraduationCap} />
        <StatCard label="Pass Rate" value={`${Math.round((passCount / marksResults.length) * 100)}%`} icon={Trophy} />
        <StatCard label="Average Score" value={`${avgPercent}%`} />
        <StatCard label="Exams Scheduled" value={dashboardStats.examScheduled} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Exam Performance Overview">
          <ExamPerformanceChart data={examPerformanceChart} />
        </Panel>

        <Panel title="Quick Summary">
          <div className="space-y-3">
            {marksResults.slice(0, 3).map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{m.student}</p>
                  <p className="text-xs text-slate-500">
                    Rank #{m.rank} · Grade {m.grade}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#008C95]">{m.percent}%</p>
                  <StatusBadge status={m.status} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <Panel
        title="Marks & Results"
        action={
          <PrimaryButton>
            <Download size={14} />
            Download Marksheet
          </PrimaryButton>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="px-3 py-3 font-medium">Student</th>
                <th className="px-3 py-3 font-medium">Batch</th>
                <th className="px-3 py-3 font-medium">Exam</th>
                <th className="px-3 py-3 font-medium">Internal</th>
                <th className="px-3 py-3 font-medium">External</th>
                <th className="px-3 py-3 font-medium">Practical</th>
                <th className="px-3 py-3 font-medium">Total</th>
                <th className="px-3 py-3 font-medium">Grade</th>
                <th className="px-3 py-3 font-medium">%</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Rank</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-b border-slate-100 transition hover:bg-slate-50/80">
                  <td className="px-3 py-3 font-medium text-slate-800">{m.student}</td>
                  <td className="px-3 py-3 text-slate-600">{m.batch}</td>
                  <td className="px-3 py-3 text-slate-600">{m.exam}</td>
                  <td className="px-3 py-3">{m.internal}</td>
                  <td className="px-3 py-3">{m.external}</td>
                  <td className="px-3 py-3">{m.practical}</td>
                  <td className="px-3 py-3 font-semibold text-slate-800">{m.total}</td>
                  <td className="px-3 py-3">
                    <span className="inline-flex rounded-full bg-[#00A896]/10 px-2 py-0.5 text-xs font-semibold text-[#005F6B]">
                      {m.grade}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-semibold text-[#008C95]">{m.percent}%</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={m.status} />
                  </td>
                  <td className="px-3 py-3 font-medium text-slate-700">#{m.rank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">No results match your search.</p>
        ) : null}
      </Panel>
    </section>
  )
}
