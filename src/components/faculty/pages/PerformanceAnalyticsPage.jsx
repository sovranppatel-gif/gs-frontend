import {
  Activity,
  Clock,
  Star,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'
import {
  assignmentStatusChart,
  attendanceTrend,
  courseCompletionChart,
  dashboardStats,
  examPerformanceChart,
  facultyProfile,
  facultyRatingChart,
  monthlyProgressChart,
  studentGrowthChart,
  studentPerformanceChart,
  teachingHours,
  weeklyProgressChart,
} from '../../../data/facultyData.js'
import {
  AssignmentStatusChart,
  AttendanceTrendChart,
  CourseCompletionChart,
  ExamPerformanceChart,
  FacultyRatingChart,
  MonthlyProgressChart,
  ProgressCircle,
  StudentGrowthChart,
  StudentPerformanceChart,
  TeachingHoursChart,
  WeeklyProgressChart,
} from '../shared/FacultyCharts.jsx'
import { Panel, StatCard } from '../shared/FacultyUI.jsx'

export default function PerformanceAnalyticsPage() {
  const stats = dashboardStats

  return (
    <section className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <ProgressCircle value={stats.teachingProgress} size={110} label="Teaching" />
        </article>
        <StatCard
          label="Teaching Hours (Week)"
          value={`${stats.teachingHoursWeek}h`}
          icon={Clock}
          hint={`Goal: ${stats.weeklyGoalHours}h`}
        />
        <StatCard label="Active Students" value={stats.activeStudents} icon={Users} />
        <StatCard label="Faculty Rating" value={facultyProfile.rating} icon={Star} hint="out of 5.0" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Attendance Average" value={`${stats.attendanceAverage}%`} icon={Target} />
        <StatCard label="Weekly Progress" value={`${stats.weeklyProgress}%`} icon={TrendingUp} />
        <StatCard label="Teaching Streak" value={`${stats.teachingStreak} days`} icon={Activity} />
        <StatCard label="Student Satisfaction" value={stats.studentSatisfaction} icon={Star} hint="batch avg" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Teaching Hours (This Week)">
          <TeachingHoursChart data={teachingHours} />
        </Panel>
        <Panel title="Attendance Trend">
          <AttendanceTrendChart data={attendanceTrend} />
        </Panel>
        <Panel title="Student Performance by Subject">
          <StudentPerformanceChart data={studentPerformanceChart} />
        </Panel>
        <Panel title="Assignment Status">
          <AssignmentStatusChart data={assignmentStatusChart} />
        </Panel>
        <Panel title="Course Completion vs Attendance">
          <CourseCompletionChart data={courseCompletionChart} />
        </Panel>
        <Panel title="Exam Performance">
          <ExamPerformanceChart data={examPerformanceChart} />
        </Panel>
        <Panel title="Weekly Teaching Progress">
          <WeeklyProgressChart data={weeklyProgressChart} />
        </Panel>
        <Panel title="Monthly Teaching Hours">
          <MonthlyProgressChart data={monthlyProgressChart} />
        </Panel>
        <Panel title="Faculty Rating Trend">
          <FacultyRatingChart data={facultyRatingChart} />
        </Panel>
        <Panel title="Student Growth">
          <StudentGrowthChart data={studentGrowthChart} />
        </Panel>
      </div>

      <Panel title="Insights">
        <div className="flex items-start gap-3 rounded-xl bg-[#00A896]/10 p-4 text-sm text-slate-700">
          <Activity size={18} className="mt-0.5 shrink-0 text-[#008C95]" />
          <p>
            Teaching progress is at {stats.teachingProgress}% with {stats.teachingStreak}-day streak.
            Attendance across batches averages {stats.attendanceAverage}%. React and Soft Skills show
            strongest student performance; focus DevOps module to lift batch average above 80%.
            Student count grew to {stats.totalStudents} this month — {stats.certificatesIssued} certificates
            issued to date.
          </p>
        </div>
      </Panel>
    </section>
  )
}
