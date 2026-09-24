import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  ArrowRight,
  CalendarDays,
  CloudSun,
  GraduationCap,
  Quote,
  RefreshCw,
  Sparkles,
  Trophy,
  Users,
  Wallet,
  Zap,
} from 'lucide-react'
import logo from '../../../assets/logo.png'
import {
  AreaTrendChart,
  BarMetricChart,
  DonutChart,
  MultiLineChart,
} from '../shared/MasterAdminCharts.jsx'
import { Panel, ProgressBar } from '../shared/MasterAdminUI.jsx'
import { card, primaryBtn, secondaryBtn } from '../../../utils/masterAdminTheme.js'
import {
  coursePopularity,
  dashboardStats,
  feeDonut,
  instituteProfile,
  kpiTrend,
  quoteOfDay,
  recentActivities,
  topFaculty,
  topStudents,
  upcomingBirthdays,
  upcomingEvents,
  weather,
} from '../../../data/master-admin/dummyData.js'

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])
  return now
}

const quickActions = [
  'Admissions',
  'Students',
  'Fees',
  'Attendance',
  'Exams',
  'Certificates',
  'Analytics',
  'Help Desk',
]

export default function InstituteDashboard({ onNavigate }) {
  const now = useClock()
  const [pulse, setPulse] = useState(0)

  const dateStr = useMemo(
    () =>
      now.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    [now],
  )
  const timeStr = useMemo(() => now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }), [now])

  const highlightStats = dashboardStats.slice(0, 12)

  return (
    <section className="space-y-3">
      {/* Hero institute bar */}
      <div className="relative overflow-hidden rounded-lg border border-[#00A896]/30 bg-gradient-to-br from-[#06151C] via-[#0a2530] to-[#005F6B] p-3 text-white shadow-[0_18px_45px_rgba(0,0,0,0.35)] sm:p-4">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#FF5E14]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-[#00E5CC]/15 blur-3xl" />

        <div className="relative flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
            <div className="relative shrink-0">
              <div className="absolute inset-0 rounded-lg bg-[#FF5E14]/40 blur-md opacity-70" />
              <div className="relative grid h-12 w-12 place-items-center rounded-lg border border-white/40 bg-gradient-to-br from-[#FFF0E6] via-[#FFB380] to-[#FF5E14] p-1.5 shadow-[0_10px_35px_rgba(255,94,20,0.45)] sm:h-14 sm:w-14">
                <img src={logo} alt="Grow Skills Tech" className="h-8 w-8 object-contain sm:h-9 sm:w-9" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight sm:text-2xl">{instituteProfile.name}</h2>
                <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#00E5CC] ring-1 ring-[#00A896]/40">
                  Master Admin
                </span>
              </div>
              <p className="mt-1 text-xs text-white/75 sm:text-sm">
                {instituteProfile.branch} · {instituteProfile.academicYear}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-white/70">
                <span className="rounded-md bg-white/5 px-2 py-1 ring-1 ring-white/10">{instituteProfile.currentSession}</span>
                <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 ring-1 ring-white/10">
                  <CalendarDays size={12} className="text-[#FF7A00]" /> {dateStr}
                </span>
                <span className="rounded-md bg-white/5 px-2 py-1 font-mono tabular-nums ring-1 ring-white/10">{timeStr}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <div className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs backdrop-blur">
              <p className="text-white/55">Admin</p>
              <p className="font-semibold text-white">admin@growskillstech.com</p>
            </div>
            <button
              type="button"
              onClick={() => setPulse((p) => p + 1)}
              className="inline-flex items-center gap-2 rounded-full border border-[#00A896]/35 bg-white/5 px-3 py-2 text-xs font-medium text-white hover:border-[#FF5E14]/50 hover:text-[#FF7A00]"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>

        <div className="relative mt-3 grid gap-2 sm:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-white/5 p-2.5 backdrop-blur">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>Institute Health Score</span>
              <Activity size={14} className="text-[#00E5CC]" />
            </div>
            <p className="mt-1 text-3xl font-semibold tabular-nums text-white">{instituteProfile.healthScore}</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#FF5E14] to-[#00E5CC] transition-all duration-700"
                style={{ width: `${instituteProfile.healthScore}%` }}
              />
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-2.5 backdrop-blur">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>Overall Progress</span>
              <Sparkles size={14} className="text-[#FF7A00]" />
            </div>
            <p className="mt-1 text-3xl font-semibold tabular-nums text-white">{instituteProfile.overallProgress}%</p>
            <p className="mt-2 text-[11px] text-white/55">Curriculum + placements + collections</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-2.5 backdrop-blur">
            <div className="flex items-center justify-between text-xs text-white/60">
              <span>Institute Performance</span>
              <Trophy size={14} className="text-[#FF7A00]" />
            </div>
            <p className="mt-1 text-3xl font-semibold tabular-nums text-white">A+</p>
            <p className="mt-2 text-[11px] text-white/55">KPI grade · refreshed {pulse ? 'just now' : 'live'}</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className={`${card} p-2.5`}>
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Zap size={16} className="text-[#FF5E14]" />
          Quick Actions
        </div>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <button
              key={action}
              type="button"
              onClick={() => onNavigate?.(action)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-[#FF5E14]/40 hover:bg-[#FF5E14]/5 hover:text-[#FF5E14]"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        {highlightStats.map((s) => (
          <article key={s.key} className={`${card} p-3 transition hover:-translate-y-0.5 hover:shadow-md`}>
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
            <p className="mt-1.5 bg-gradient-to-r from-[#FF5E14] to-[#008C95] bg-clip-text text-2xl font-semibold tabular-nums text-transparent">
              {s.value}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">{s.hint}</p>
          </article>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onNavigate?.('Analytics')}
          className="text-xs font-semibold text-[#FF5E14] hover:underline"
        >
          View all {dashboardStats.length} KPIs in Analytics →
        </button>
      </div>

      {/* Charts */}
      <div className="grid gap-2 xl:grid-cols-3">
        <Panel title="Admissions & Revenue Trend" className="xl:col-span-2">
          <MultiLineChart
            data={kpiTrend}
            series={[
              { key: 'admissions', label: 'Admissions' },
              { key: 'revenue', label: 'Revenue (L)' },
            ]}
            height={260}
          />
        </Panel>
        <Panel title="Fee Collection Mix">
          <DonutChart data={feeDonut} height={260} />
        </Panel>
      </div>

      <div className="grid gap-2 lg:grid-cols-2">
        <Panel title="Attendance Pulse">
          <AreaTrendChart data={kpiTrend} xKey="name" yKey="attendance" yLabel="Attendance %" height={220} />
        </Panel>
        <Panel title="Course Popularity">
          <BarMetricChart data={coursePopularity} height={220} />
        </Panel>
      </div>

      {/* Widgets */}
      <div className="grid gap-2 xl:grid-cols-3">
        <Panel title="Recent Activities">
          <ul className="space-y-2">
            {recentActivities.map((a) => (
              <li key={a.id} className="rounded-lg border border-slate-100 bg-slate-50/80 px-2.5 py-2 text-sm">
                <p className="text-slate-700">{a.text}</p>
                <p className="mt-1 text-[11px] text-slate-400">{a.time}</p>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Upcoming Events"
          action={
            <button type="button" onClick={() => onNavigate?.('Events')} className="text-xs font-semibold text-[#FF5E14]">
              View all
            </button>
          }
        >
          <ul className="space-y-2">
            {upcomingEvents.map((e) => (
              <li key={e.id} className="flex items-start justify-between gap-2 rounded-lg border border-slate-100 px-2.5 py-2">
                <div>
                  <p className="text-sm font-medium text-slate-800">{e.title}</p>
                  <p className="text-[11px] text-slate-500">{e.venue}</p>
                </div>
                <span className="shrink-0 text-[11px] font-semibold text-[#008C95]">{e.date}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-2">
          <Panel title="Top Faculty">
            <ul className="space-y-2">
              {topFaculty.map((f) => (
                <li key={f.id} className="flex items-center justify-between gap-2 text-sm">
                  <div>
                    <p className="font-medium text-slate-800">{f.name}</p>
                    <p className="text-[11px] text-slate-500">{f.dept}</p>
                  </div>
                  <span className="rounded-full bg-[#FF5E14]/10 px-2 py-0.5 text-xs font-semibold text-[#FF5E14]">★ {f.rating}</span>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Top Students">
            <ul className="space-y-2">
              {topStudents.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-2 text-sm">
                  <div>
                    <p className="font-medium text-slate-800">{s.name}</p>
                    <p className="text-[11px] text-slate-500">{s.batch}</p>
                  </div>
                  <span className="font-semibold text-[#008C95]">CGPA {s.cgpa}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        <Panel title="Upcoming Birthdays">
          <ul className="space-y-2">
            {upcomingBirthdays.map((b) => (
              <li key={b.id} className="flex justify-between gap-2 text-sm">
                <div>
                  <p className="font-medium text-slate-800">{b.name}</p>
                  <p className="text-[11px] text-slate-500">{b.role}</p>
                </div>
                <span className="text-xs font-semibold text-[#FF5E14]">{b.date}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Revenue Summary">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-700">
              <Wallet size={16} className="text-[#008C95]" />
              <span className="text-sm">Monthly Revenue</span>
              <span className="ml-auto font-semibold">₹62.4L</span>
            </div>
            <ProgressBar value={72} label="Fee collection vs target" color="teal" />
            <ProgressBar value={46} label="Expense ratio" color="orange" />
          </div>
        </Panel>

        <Panel title="Weather">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#00A896]/10 text-[#008C95]">
              <CloudSun size={20} />
            </span>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{weather.temp}</p>
              <p className="text-xs text-slate-500">
                {weather.condition} · {weather.city}
              </p>
              <p className="text-[11px] text-slate-400">Humidity {weather.humidity}</p>
            </div>
          </div>
        </Panel>

        <Panel title="Motivational Quote">
          <div className="flex gap-2">
            <Quote size={18} className="shrink-0 text-[#FF5E14]" />
            <div>
              <p className="text-sm italic leading-relaxed text-slate-700">&ldquo;{quoteOfDay.text}&rdquo;</p>
              <p className="mt-2 text-xs font-semibold text-[#008C95]">— {quoteOfDay.author}</p>
            </div>
          </div>
        </Panel>
      </div>

      {/* Landing enquiries bridge */}
      <article className={`${card} flex flex-col gap-2.5 p-3 sm:flex-row sm:items-center sm:justify-between`}>
        <div className="flex items-start gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#FF5E14]/10 text-[#FF5E14]">
            <Users size={16} />
          </span>
          <div>
            <p className="font-semibold text-slate-900">Landing page enquiries</p>
            <p className="text-sm text-slate-500">
              Connect With Grow Skills Tech form submissions land in Enquiry Management. Online admissions appear under Admissions and the notification bell.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => onNavigate?.('Enquiry Management')} className={primaryBtn}>
            Enquiry Management <ArrowRight size={15} />
          </button>
          <button type="button" onClick={() => onNavigate?.('Admissions')} className={secondaryBtn}>
            Admissions
          </button>
        </div>
      </article>

      <div className="grid gap-2 sm:grid-cols-3">
        {[
          { label: 'Students', icon: GraduationCap, section: 'Students' },
          { label: 'Pending Fees', icon: Wallet, section: 'Fees' },
          { label: 'Analytics KPI', icon: Activity, section: 'Analytics' },
        ].map((item) => (
          <button
            key={item.section}
            type="button"
            onClick={() => onNavigate?.(item.section)}
            className={`${card} flex items-center gap-2.5 p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md`}
          >
            <item.icon size={18} className="text-[#FF5E14]" />
            <span className="text-sm font-semibold text-slate-800">{item.label}</span>
            <ArrowRight size={14} className="ml-auto text-slate-400" />
          </button>
        ))}
      </div>
    </section>
  )
}
