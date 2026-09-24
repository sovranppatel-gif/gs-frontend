import { useMemo } from 'react'
import {
  Cake,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  PartyPopper,
  Users,
} from 'lucide-react'
import { calendarEvents } from '../../../data/facultyData.js'
import { Panel, StatusBadge } from '../shared/FacultyUI.jsx'

const TODAY = '2026-07-14'

const typeConfig = {
  Meeting: { icon: Users, color: 'text-[#008C95]', bg: 'bg-[#00A896]/10' },
  Exam: { icon: GraduationCap, color: 'text-rose-600', bg: 'bg-rose-50' },
  Assignment: { icon: ClipboardList, color: 'text-amber-600', bg: 'bg-amber-50' },
  Holiday: { icon: PartyPopper, color: 'text-purple-600', bg: 'bg-purple-50' },
  Birthday: { icon: Cake, color: 'text-pink-600', bg: 'bg-pink-50' },
}

const typeOrder = ['Meeting', 'Exam', 'Assignment', 'Holiday', 'Birthday']

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function CalendarPage() {
  const todaysEvents = useMemo(
    () => calendarEvents.filter((e) => e.date === TODAY),
    []
  )

  const grouped = useMemo(() => {
    const map = {}
    typeOrder.forEach((type) => {
      map[type] = calendarEvents.filter((e) => e.type === type)
    })
    return map
  }, [])

  return (
    <section className="space-y-4">
      <Panel title="Today's Events">
        {todaysEvents.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">No events scheduled for today.</p>
        ) : (
          <div className="space-y-2">
            {todaysEvents.map((e) => {
              const cfg = typeConfig[e.type] || typeConfig.Meeting
              const Icon = cfg.icon
              return (
                <div
                  key={e.id}
                  className="flex items-center gap-3 rounded-xl border border-[#FF5E14]/25 bg-gradient-to-r from-[#FFF0E6]/80 to-white px-4 py-3"
                >
                  <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${cfg.bg} ${cfg.color}`}>
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900">{e.title}</p>
                    <p className="text-xs text-slate-500">
                      {e.time} · {formatDate(e.date)}
                    </p>
                  </div>
                  <StatusBadge status="current" />
                </div>
              )
            })}
          </div>
        )}
      </Panel>

      {typeOrder.map((type) => {
        const events = grouped[type]
        if (!events || events.length === 0) return null
        const cfg = typeConfig[type]
        const Icon = cfg.icon

        return (
          <Panel key={type} title={type}>
            <ul className="space-y-2">
              {events.map((e) => {
                const isToday = e.date === TODAY
                return (
                  <li
                    key={e.id}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                      isToday
                        ? 'border-[#FF5E14]/20 bg-[#FFF0E6]/40'
                        : 'border-slate-100 bg-slate-50'
                    }`}
                  >
                    <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${cfg.bg} ${cfg.color}`}>
                      <Icon size={14} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-slate-800">{e.title}</p>
                        {isToday ? <StatusBadge status="current" /> : null}
                      </div>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                        <CalendarDays size={11} />
                        {formatDate(e.date)} · {e.time}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </Panel>
        )
      })}
    </section>
  )
}
