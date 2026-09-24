import { attendanceTrend, performanceData, subjectMarks } from '../../../data/studentData.js'
import {
  AssignmentCompletionChart,
  AttendanceTrendChart,
  LearningHoursChart,
  MarksComparisonChart,
  PerformanceOverviewChart,
  ProgressCircle,
  QuizBarChart,
} from '../shared/StudentCharts.jsx'
import { Panel, StatCard } from '../shared/StudentUI.jsx'
import { Activity, Clock, Target, TrendingUp } from 'lucide-react'

export default function PerformanceAnalyticsPage() {
  const p = performanceData

  return (
    <section className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="flex items-center justify-center rounded-lg border border-slate-200 bg-white p-3">
          <ProgressCircle value={p.overallScore} size={110} label="Overall" />
        </article>
        <StatCard label="Weekly Study Hours" value="18.5h" icon={Clock} />
        <StatCard label="Avg Quiz Score" value="83%" icon={Target} />
        <StatCard label="Monthly Progress" value="+4%" icon={TrendingUp} hint="vs last month" />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <Panel title="Weekly Progress (Learning Hours)">
          <LearningHoursChart data={p.weeklyProgress} />
        </Panel>
        <Panel title="Monthly Progress Overview">
          <PerformanceOverviewChart data={p.monthlyProgress} />
        </Panel>
        <Panel title="Subject Comparison">
          <MarksComparisonChart data={subjectMarks} />
        </Panel>
        <Panel title="Quiz Performance">
          <QuizBarChart data={p.quizPerformance} />
        </Panel>
        <Panel title="Assignment Performance">
          <AssignmentCompletionChart data={p.assignmentPerformance} />
        </Panel>
        <Panel title="Attendance Trend">
          <AttendanceTrendChart data={attendanceTrend} />
        </Panel>
      </div>

      <Panel title="Insights">
        <div className="flex items-start gap-3 rounded-lg bg-[#00A896]/10 p-3 text-sm text-slate-700">
          <Activity size={18} className="mt-0.5 shrink-0 text-[#008C95]" />
          <p>
            Strong performance in UI/UX and Soft Skills. Focus next week on DevOps practice labs to lift module score
            above 80%. Your learning streak and assignment completion rate are above batch average.
          </p>
        </div>
      </Panel>
    </section>
  )
}
