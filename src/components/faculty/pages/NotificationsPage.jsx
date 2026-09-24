import { useState } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { notifications as initialNotifications } from '../../../data/facultyData.js'
import { Panel, PrimaryButton } from '../shared/FacultyUI.jsx'

export default function NotificationsPage() {
  const [items, setItems] = useState(initialNotifications)
  const unread = items.filter((n) => !n.read)

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markRead = (id) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-[#FF5E14]">{unread.length}</span> unread notifications
        </p>
        <PrimaryButton onClick={markAllRead} disabled={unread.length === 0}>
          <CheckCheck size={14} />
          Mark All Read
        </PrimaryButton>
      </div>

      <Panel title="Unread Notifications">
        {unread.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">You&apos;re all caught up.</p>
        ) : (
          <ul className="space-y-2">
            {unread.map((n) => (
              <li
                key={n.id}
                className="flex gap-3 rounded-xl border border-[#FF5E14]/15 bg-[#FFF0E6]/40 px-3 py-3"
              >
                <Bell size={16} className="mt-0.5 shrink-0 text-[#FF5E14]" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800">{n.title}</p>
                  <p className="mt-0.5 text-xs text-slate-600">{n.detail}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{n.time}</p>
                </div>
                <button
                  type="button"
                  onClick={() => markRead(n.id)}
                  className="shrink-0 self-center text-[11px] font-semibold text-[#008C95] hover:text-[#FF5E14]"
                >
                  Mark read
                </button>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="All Notifications">
        <ul className="space-y-2">
          {items.map((n) => (
            <li
              key={n.id}
              className={`flex gap-3 rounded-xl border px-3 py-3 ${
                n.read ? 'border-slate-100 bg-slate-50' : 'border-[#00A896]/20 bg-white'
              }`}
            >
              <Bell size={16} className={`mt-0.5 shrink-0 ${n.read ? 'text-slate-300' : 'text-[#008C95]'}`} />
              <div className="min-w-0 flex-1">
                <p className={`text-sm ${n.read ? 'text-slate-600' : 'font-medium text-slate-800'}`}>
                  {n.title}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">{n.detail}</p>
                <p className="mt-1 text-[11px] text-slate-400">{n.time}</p>
              </div>
              {!n.read ? (
                <span className="inline-flex h-2 w-2 shrink-0 self-center rounded-full bg-[#FF5E14]" />
              ) : null}
            </li>
          ))}
        </ul>
      </Panel>
    </section>
  )
}
