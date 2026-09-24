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
  Layers,
  Mail,
  Megaphone,
  MessageSquare,
  NotebookPen,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  Video,
} from 'lucide-react'
import {
  activities,
  dashboardStats,
  facultyProfile,
  instituteNews,
  motivationalQuote,
  pendingWork,
  quickActions,
  todaysSchedule,
  topStudents,
  upcomingEvents,
  weakStudents,
} from '../../../data/facultyData.js'
import { ProgressCircle } from '../shared/FacultyCharts.jsx'
import { Panel, PrimaryButton, ProgressBar, StatCard, StatusBadge } from '../shared/FacultyUI.jsx'

const actionIcons = {
  attendance: CheckCircle2,
  live: Video,
  notes: FileText,
  assignment: ClipboardList,
  exam: GraduationCap,
  marks: Award,
  students: Users,
  announce: Megaphone,
}

const activityIcons = {
  assignment: ClipboardList,
  notes: FileText,
  attendance: CheckCircle2,
  exam: GraduationCap,
  marks: Award,
  certificate: Award,
  live: Video,
  homework: NotebookPen,
}

const todayFormatted = new Date().toLocaleDateString('en-IN', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export default function DashboardHome({ onNavigate }) {
  const s = dashboardStats
  const p = facultyProfile

  const stats = [
    ['Total Students', s.totalStudents, Users],
    ['Active Students', s.activeStudents, User],
    ['Total Courses', s.totalCourses, BookOpen],
    ['Active Courses', s.activeCourses, BookOpen],
    ['Completed Courses', s.completedCourses, GraduationCap],
    ['Current Batches', s.currentBatches, Layers],
    ["Today's Classes", s.todaysClasses, CalendarClock],
    ['Weekly Classes', s.weeklyClasses, CalendarClock],
    ['Pending Assignments', s.pendingAssignments, ClipboardList],
    ['Assignments Checked', s.assignmentsChecked, CheckCircle2],
    ['Pending Homework', s.pendingHomework, NotebookPen],
    ['Live Classes Today', s.liveClassesToday, Video],
    ['Exams Scheduled', s.examScheduled, GraduationCap],
    ['Attendance Average', `${s.attendanceAverage}%`, CheckCircle2],
    ['Student Satisfaction', `${s.studentSatisfaction}/5`, Star],
    ['Certificates Issued', s.certificatesIssued, Award],
    ['Unread Messages', s.unreadMessages, MessageSquare],
    ['Unread Notifications', s.unreadNotifications, Bell],
    ['Teaching Hours (Week)', `${s.teachingHoursWeek}h`, Target],
    ['Weekly Goal Hours', `${s.weeklyGoalHours}h`, Target],
    ['Teaching Streak', `${s.teachingStreak} days`, Flame],
    ['Overall Rating', `${s.overallRating}/5`, Star],
    ['Teaching Progress', `${s.teachingProgress}%`, TrendingUp],
    ['Weekly Progress', `${s.weeklyProgress}%`, TrendingUp],
  ]

  return (
    <section className="space-y-4">
      {/* Welcome hero */}
      <div className="overflow-hidden rounded-2xl border border-[#00A896]/30 bg-gradient-to-br from-[#06151C] via-[#0a2530] to-[#005F6B] p-4 text-white shadow-[0_18px_45px_rgba(0,0,0,0.35)] sm:p-5">
        <div className="flex items-start gap-3 sm:gap-4">
          <img
            src={p.avatar}
            alt={p.name}
            className="h-14 w-14 shrink-0 rounded-2xl border-2 border-[#FF5E14]/50 object-cover shadow-lg sm:h-20 sm:w-20"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#00E5CC] sm:text-[11px]">
              Welcome back
            </p>
            <h2 className="mt-0.5 truncate text-lg font-bold sm:mt-1 sm:text-2xl">{p.name}</h2>
            <p className="mt-0.5 truncate text-xs text-slate-300 sm:text-sm">
              {p.empId} · {p.department}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] sm:mt-3 sm:gap-2 sm:text-[11px]">
              <span className="rounded-full border border-[#00A896]/35 bg-white/5 px-2 py-0.5 sm:px-2.5 sm:py-1">
                {p.designation}
              </span>
              <span className="rounded-full border border-[#00A896]/35 bg-white/5 px-2 py-0.5 sm:px-2.5 sm:py-1">
                {p.qualification}
              </span>
              <span className="rounded-full border border-[#00A896]/35 bg-white/5 px-2 py-0.5 sm:px-2.5 sm:py-1">
                {p.experience} experience
              </span>
              <span className="rounded-full border border-[#00A896]/35 bg-white/5 px-2 py-0.5 sm:px-2.5 sm:py-1">
                Joined {new Date(p.joiningDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:grid-cols-4 sm:gap-3">
          <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 px-1 py-3 sm:py-4">
            <ProgressCircle value={s.teachingProgress} size={78} label="Teaching" tone="dark" />
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 px-1 py-3 sm:py-4">
            <ProgressCircle value={s.weeklyProgress} size={78} label="Weekly" tone="dark" />
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 px-2 py-3 text-center sm:py-4">
            <p className="text-[10px] uppercase tracking-wide text-slate-400 sm:text-[11px]">Overall Rating</p>
            <p className="mt-1 flex items-center justify-center gap-1 text-2xl font-bold text-[#FFB380] sm:text-3xl">
              <Star size={18} className="fill-[#FFB380]" />
              {s.overallRating}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 px-2 py-3 text-center sm:py-4">
            <p className="text-[10px] uppercase tracking-wide text-slate-400 sm:text-[11px]">Today</p>
            <p className="mt-1 text-xs font-semibold leading-snug text-[#00E5CC] sm:text-sm">{todayFormatted}</p>
          </div>
        </div>

        <div className="mt-3 grid gap-2 sm:mt-5 sm:grid-cols-3 sm:gap-3">
          {todaysSchedule.slice(0, 3).map((slot, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-[10px] uppercase tracking-wide text-slate-400 sm:text-[11px]">
                {i === 0 ? 'Next Class' : `Class ${i + 1}`}
              </p>
              <p className="mt-1 text-sm font-semibold leading-snug">{slot.subject}</p>
              <p className="mt-0.5 text-xs text-slate-400">
                {slot.time} · {slot.batch} · {slot.room}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <article className="rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
          {quickActions.map((a) => {
            const Icon = actionIcons[a.id] || FileText
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => onNavigate?.(a.section)}
                className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:border-[#FF5E14]/40 hover:bg-[#FF5E14]/5 hover:text-[#FF5E14]"
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

      {/* Schedule, pending work, students */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Today's Schedule">
          <ul className="space-y-2">
            {todaysSchedule.map((slot, i) => (
              <li key={i} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{slot.subject}</p>
                    <p className="text-xs text-slate-500">
                      {slot.batch} · {slot.room}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-400">{slot.time}</p>
                  </div>
                  <StatusBadge status={slot.status} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Pending Work">
          <ul className="space-y-2">
            {pendingWork.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-2 rounded-xl border border-slate-100 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.type}</p>
                </div>
                <StatusBadge status={item.due === 'Today' ? 'Pending' : 'Scheduled'} />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Teaching Streak & Goals">
          <div className="flex items-center gap-3 rounded-xl bg-[#00A896]/10 p-3">
            <Flame className="text-[#FF5E14]" size={22} />
            <div>
              <p className="text-sm font-semibold text-slate-800">{s.teachingStreak}-day teaching streak</p>
              <p className="text-xs text-slate-500">
                {s.teachingHoursWeek}h / {s.weeklyGoalHours}h this week
              </p>
            </div>
          </div>
          <div className="mt-3 space-y-3">
            <ProgressBar value={(s.teachingHoursWeek / s.weeklyGoalHours) * 100} label="Weekly teaching hours" />
            <ProgressBar value={s.teachingProgress} label="Course teaching progress" color="teal" />
            <ProgressBar value={s.weeklyProgress} label="Weekly syllabus progress" />
          </div>
        </Panel>
      </div>

      {/* Top & weak students */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Top Students">
          <ul className="space-y-2">
            {topStudents.map((stu) => (
              <li key={stu.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#00A896]/10 text-xs font-bold text-[#008C95]">
                    {stu.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{stu.name}</p>
                    <p className="text-xs text-slate-500">{stu.batch}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="flex items-center gap-1 text-sm font-semibold text-[#008C95]">
                    <TrendingUp size={14} />
                    {stu.score}%
                  </p>
                  <p className="text-[11px] text-slate-400">{stu.progress}% progress</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Students Needing Attention">
          <ul className="space-y-2">
            {weakStudents.map((stu) => (
              <li key={stu.id} className="flex items-center justify-between gap-3 rounded-xl border border-rose-100 bg-rose-50/50 px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-xs font-bold text-rose-600">
                    {stu.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{stu.name}</p>
                    <p className="text-xs text-slate-500">{stu.batch}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="flex items-center gap-1 text-sm font-semibold text-rose-600">
                    <TrendingDown size={14} />
                    {stu.score}%
                  </p>
                  <p className="text-[11px] text-slate-400">{stu.attendance}% attendance</p>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Activities, events, news */}
      <div className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 lg:col-span-1">
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

        <article className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 lg:col-span-1">
          <h2 className="text-lg font-semibold text-slate-900">Upcoming Events</h2>
          <ul className="space-y-2">
            {upcomingEvents.map((ev) => (
              <li key={ev.id} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                <p className="text-sm font-medium text-slate-800">{ev.title}</p>
                <p className="text-xs text-slate-500">
                  {ev.date} · {ev.time}
                </p>
              </li>
            ))}
          </ul>
          <blockquote className="rounded-xl border border-[#00A896]/20 bg-gradient-to-br from-[#FFF0E6] to-[#e6faf7] p-3">
            <p className="text-sm italic text-slate-700">&ldquo;{motivationalQuote.text}&rdquo;</p>
            <p className="mt-2 text-[11px] font-semibold text-[#FF5E14]">— {motivationalQuote.author}</p>
          </blockquote>
        </article>

        <article className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4 lg:col-span-1">
          <h2 className="text-lg font-semibold text-slate-900">Institute News</h2>
          <ul className="space-y-2">
            {instituteNews.map((news) => (
              <li key={news.id} className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                <p className="text-sm font-medium text-slate-800">{news.title}</p>
                <p className="text-xs text-slate-500">{news.date}</p>
              </li>
            ))}
          </ul>
          <PrimaryButton onClick={() => onNavigate?.('My Profile')}>
            <User size={15} />
            View Profile
          </PrimaryButton>
        </article>
      </div>
    </section>
  )
}
