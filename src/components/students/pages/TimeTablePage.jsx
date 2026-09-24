import { CalendarDays, MapPin } from 'lucide-react'
import { holidays, timetable, todaysSchedule } from '../../../data/studentData.js'
import { Panel, StatusBadge } from '../shared/StudentUI.jsx'

export default function TimeTablePage() {
  return (
    <section className="space-y-3">
      <Panel title="Today's Schedule">
        <div className="space-y-3">
          {todaysSchedule.map((slot) => (
            <div
              key={slot.time + slot.subject}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5"
            >
              <div>
                <p className="text-xs font-semibold text-[#FF5E14]">{slot.time}</p>
                <p className="text-sm font-semibold text-slate-900">{slot.subject}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span>{slot.faculty}</span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={12} />
                    {slot.room}
                  </span>
                </p>
              </div>
              <StatusBadge status={slot.status} />
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Weekly Time Table">
        <div className="grid gap-3 lg:grid-cols-2">
          {timetable.map((day) => (
            <div key={day.day} className="rounded-lg border border-slate-100 p-3">
              <div className="mb-2 flex items-center gap-2">
                <CalendarDays size={14} className="text-[#008C95]" />
                <h3 className="text-sm font-semibold text-slate-900">{day.day}</h3>
              </div>
              {day.slots.length === 0 ? (
                <p className="text-xs text-slate-400">No classes</p>
              ) : (
                <ul className="space-y-2">
                  {day.slots.map((s) => (
                    <li key={s.time + s.subject} className="rounded-lg bg-slate-50 px-3 py-2 text-xs">
                      <p className="font-semibold text-slate-800">{s.subject}</p>
                      <p className="text-slate-500">
                        {s.time} · {s.faculty} · {s.room}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Upcoming Holidays">
        <ul className="space-y-2">
          {holidays.map((h) => (
            <li key={h.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2.5 text-sm">
              <span className="font-medium text-slate-800">{h.title}</span>
              <span className="text-xs text-slate-500">{h.date}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </section>
  )
}
