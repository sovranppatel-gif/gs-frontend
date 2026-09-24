import { CalendarDays, Clock, MapPin, Users } from 'lucide-react'
import { timetableWeek, todaysSchedule } from '../../../data/facultyData.js'
import { Panel, StatusBadge } from '../shared/FacultyUI.jsx'

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function TimeTablePage() {
  return (
    <section className="space-y-4">
      <Panel title="Today's Schedule">
        <div className="space-y-3">
          {todaysSchedule.map((slot) => (
            <div
              key={slot.time + slot.subject}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#FF5E14]/15 bg-gradient-to-br from-[#FFF0E6]/60 to-white px-4 py-3"
            >
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold text-[#FF5E14]">
                  <Clock size={12} />
                  {slot.time}
                </p>
                <p className="text-sm font-semibold text-slate-900">{slot.subject}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Users size={12} />
                    {slot.batch}
                  </span>
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
        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {weekDays.map((day) => {
            const slots = timetableWeek[day] || []
            return (
              <div key={day} className="rounded-xl border border-slate-100 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <CalendarDays size={14} className="text-[#008C95]" />
                  <h3 className="text-sm font-semibold text-slate-900">{day}</h3>
                  <span className="ml-auto text-[10px] text-slate-400">
                    {slots.length} {slots.length === 1 ? 'class' : 'classes'}
                  </span>
                </div>
                {slots.length === 0 ? (
                  <p className="rounded-lg bg-slate-50 px-3 py-4 text-center text-xs text-slate-400">No classes</p>
                ) : (
                  <ul className="space-y-2">
                    {slots.map((s) => (
                      <li
                        key={s.time + s.subject}
                        className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-800">{s.subject}</p>
                          <StatusBadge status={s.status} />
                        </div>
                        <p className="mt-1 text-[11px] text-[#FF5E14]">{s.time}</p>
                        <p className="mt-0.5 text-[11px] text-slate-500">
                          {s.batch} · {s.room}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </Panel>
    </section>
  )
}
