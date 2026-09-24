import {
  Award,
  Bell,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  FileText,
  Flame,
  GraduationCap,
  IndianRupee,
  Target,
  Trophy,
  User,
  Video,
} from 'lucide-react'
import {
  activities,
  badges,
  dashboardStats,
  motivationalQuote,
  quickActions,
  studentProfile,
  upcomingEvents,
  upcomingHighlights,
} from '../../../data/studentData.js'
import { primaryBtn } from '../../../utils/masterAdminTheme.js'
import { ProgressBar, StatCard, formatINR } from '../shared/StudentUI.jsx'
import { ProgressCircle } from '../shared/StudentCharts.jsx'

const actionIcons = {
  notes: FileText,
  live: Video,
  attendance: CheckCircle2,
  fees: IndianRupee,
  assignment: ClipboardList,
  result: Award,
}

const activityIcons = {
  assignment: ClipboardList,
  fee: IndianRupee,
  exam: GraduationCap,
  certificate: Award,
  attendance: CheckCircle2,
  homework: BookOpen,
}

export default function DashboardHome({ onNavigate }) {
  const s = dashboardStats
  const feeDue = upcomingHighlights.feeDue

  const stats = [
    ['Attendance %', `${s.attendancePercent}%`, CheckCircle2],
    ['Present Days', s.presentDays, CalendarClock],
    ['Absent Days', s.absentDays, CalendarClock],
    ['Assignments Pending', s.assignmentsPending, ClipboardList],
    ['Assignments Completed', s.assignmentsCompleted, CheckCircle2],
    ['Total Courses', s.totalCourses, BookOpen],
    ['Completed Courses', s.completedCourses, GraduationCap],
    ['Certificates Earned', s.certificatesEarned, Award],
    ['Fee Pending', formatINR(s.feePending), IndianRupee],
    ['Fee Paid', formatINR(s.feePaid), IndianRupee],
    ["Today's Classes", s.todaysClasses, Video],
    ['Unread Notifications', s.unreadNotifications, Bell],
  ]

  return (
    <section className="space-y-3">
      {/* Welcome hero */}
      <div className="overflow-hidden rounded-lg border border-[#00A896]/30 bg-gradient-to-br from-[#06151C] via-[#0a2530] to-[#005F6B] p-3 text-white shadow-[0_18px_45px_rgba(0,0,0,0.35)] sm:p-4">
        <div className="flex items-start gap-3 sm:gap-4">
          <img
            src={studentProfile.avatar}
            alt={studentProfile.name}
            className="h-14 w-14 shrink-0 rounded-lg border-2 border-[#FF5E14]/50 object-cover shadow-lg sm:h-20 sm:w-20"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#00E5CC] sm:text-[11px]">
              Welcome back
            </p>
            <h2 className="mt-0.5 truncate text-lg font-bold sm:mt-1 sm:text-2xl">{studentProfile.name}</h2>
            <p className="mt-0.5 truncate text-xs text-slate-300 sm:text-sm">
              {studentProfile.id} · {studentProfile.batch}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] sm:mt-3 sm:gap-2 sm:text-[11px]">
              <span className="rounded-full border border-[#00A896]/35 bg-white/5 px-2 py-0.5 sm:px-2.5 sm:py-1">
                {studentProfile.course}
              </span>
              <span className="rounded-full border border-[#00A896]/35 bg-white/5 px-2 py-0.5 sm:px-2.5 sm:py-1">
                {studentProfile.semester}
              </span>
              <span className="rounded-full border border-[#00A896]/35 bg-white/5 px-2 py-0.5 sm:px-2.5 sm:py-1">
                Trainer: {studentProfile.trainer}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 sm:mt-5 sm:gap-3">
          <div className="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-white/5 px-1 py-3 sm:py-4">
            <ProgressCircle value={s.overallCompletion} size={78} label="Complete" tone="dark" />
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-white/5 px-2 py-3 text-center sm:py-4">
            <p className="text-[10px] uppercase tracking-wide text-slate-400 sm:text-[11px]">Attendance</p>
            <p className="mt-1 text-2xl font-bold text-[#00E5CC] sm:text-3xl">{s.attendancePercent}%</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-white/5 px-2 py-3 text-center sm:py-4">
            <p className="text-[10px] uppercase tracking-wide text-slate-400 sm:text-[11px]">Current GPA</p>
            <p className="mt-1 text-2xl font-bold text-[#FFB380] sm:text-3xl">{s.currentGpa}</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2 sm:mt-5 sm:grid-cols-3 sm:gap-3">
          <div className="rounded-lg border border-white/10 bg-white/5 p-3">
            <p className="text-[10px] uppercase tracking-wide text-slate-400 sm:text-[11px]">Upcoming Class</p>
            <p className="mt-1 text-sm font-semibold leading-snug">{upcomingHighlights.nextClass.subject}</p>
            <p className="mt-0.5 text-xs text-slate-400">{upcomingHighlights.nextClass.time}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-3">
            <p className="text-[10px] uppercase tracking-wide text-slate-400 sm:text-[11px]">Next Assignment</p>
            <p className="mt-1 text-sm font-semibold leading-snug">{upcomingHighlights.nextAssignment.title}</p>
            <p className="mt-0.5 text-xs text-slate-400">Due {upcomingHighlights.nextAssignment.due}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-3">
            <p className="text-[10px] uppercase tracking-wide text-slate-400 sm:text-[11px]">Fee Due</p>
            <p className="mt-1 text-sm font-semibold leading-snug">{formatINR(feeDue.amount)}</p>
            <p className="mt-0.5 text-xs text-slate-400">
              {feeDue.installment} · {feeDue.dueDate}
            </p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <article className="rounded-lg border border-slate-200 bg-white p-3">
        <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {quickActions.map((a) => {
            const Icon = actionIcons[a.id] || FileText
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => onNavigate?.(a.section)}
                className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:border-[#FF5E14]/40 hover:bg-[#FF5E14]/5 hover:text-[#FF5E14]"
              >
                <Icon size={16} className="shrink-0 text-[#008C95]" />
                <span className="truncate">{a.label}</span>
              </button>
            )
          })}
        </div>
      </article>

      {/* Stats grid */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {stats.map(([label, value, Icon]) => (
          <StatCard key={label} label={label} value={value} icon={Icon} />
        ))}
      </div>

      {/* Extra widgets + timeline */}
      <div className="grid gap-3 lg:grid-cols-3">
        <article className="space-y-3 rounded-lg border border-slate-200 bg-white p-3 lg:col-span-1">
          <h2 className="text-lg font-semibold text-slate-900">Goals & Streak</h2>
          <div className="flex items-center gap-3 rounded-lg bg-[#00A896]/10 p-3">
            <Flame className="text-[#FF5E14]" size={22} />
            <div>
              <p className="text-sm font-semibold text-slate-800">{s.learningStreak}-day learning streak</p>
              <p className="text-xs text-slate-500">{s.studyHoursWeek}h studied this week</p>
            </div>
          </div>
          <ProgressBar value={(s.studyHoursWeek / s.weeklyGoal) * 100} label={`Weekly goal (${s.weeklyGoal}h)`} />
          <ProgressBar value={72} label={`Monthly goal (${s.monthlyGoal}h)`} color="teal" />
          <div className="flex items-center gap-2 rounded-lg border border-slate-100 p-3">
            <Trophy size={18} className="text-[#FF5E14]" />
            <div>
              <p className="text-sm font-semibold text-slate-800">Leaderboard #{s.leaderboardPosition}</p>
              <p className="text-xs text-slate-500">Batch Full Stack 2025-A</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {badges.map((b) => (
              <span
                key={b.id}
                className="inline-flex items-center gap-1 rounded-full bg-[#FF5E14]/10 px-2.5 py-1 text-[11px] font-semibold text-[#FF5E14]"
              >
                <Target size={12} />
                {b.label}
              </span>
            ))}
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-3 lg:col-span-1">
          <h2 className="text-lg font-semibold text-slate-900">Recent Activities</h2>
          <ul className="mt-3 space-y-3">
            {activities.slice(0, 6).map((act) => {
              const Icon = activityIcons[act.type] || User
              return (
                <li key={act.id} className="flex gap-3 border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                  <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#00A896]/10 text-[#008C95]">
                    <Icon size={14} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-800">{act.title}</p>
                    <p className="truncate text-xs text-slate-500">{act.detail}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">{act.time}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </article>

        <article className="space-y-3 rounded-lg border border-slate-200 bg-white p-3 lg:col-span-1">
          <h2 className="text-lg font-semibold text-slate-900">Upcoming Events</h2>
          <ul className="space-y-2">
            {upcomingEvents.map((ev) => (
              <li key={ev.id} className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5">
                <p className="text-sm font-medium text-slate-800">{ev.title}</p>
                <p className="text-xs text-slate-500">
                  {ev.date} · {ev.time}
                </p>
              </li>
            ))}
          </ul>
          <blockquote className="rounded-lg border border-[#00A896]/20 bg-gradient-to-br from-[#FFF0E6] to-[#e6faf7] p-3">
            <p className="text-sm italic text-slate-700">&ldquo;{motivationalQuote.text}&rdquo;</p>
            <p className="mt-2 text-[11px] font-semibold text-[#FF5E14]">— {motivationalQuote.author}</p>
          </blockquote>
          <button type="button" onClick={() => onNavigate?.('My Profile')} className={primaryBtn}>
            <User size={15} />
            View Profile
          </button>
        </article>
      </div>
    </section>
  )
}
