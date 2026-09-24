import { useState } from 'react'
import { Send } from 'lucide-react'
import { chatThread, messages } from '../../../data/studentData.js'
import { Panel } from '../shared/StudentUI.jsx'

export default function MessagesPage() {
  const [activeId, setActiveId] = useState(messages[0].id)
  const [draft, setDraft] = useState('')
  const active = messages.find((m) => m.id === activeId) || messages[0]

  return (
    <section className="space-y-3">
      <div className="grid gap-3 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Panel title="Inbox">
          <ul className="space-y-1">
            {messages.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(m.id)}
                  className={`w-full rounded-lg px-3 py-2.5 text-left transition ${
                    activeId === m.id
                      ? 'bg-gradient-to-r from-[#FF5E14]/10 to-[#00A896]/10 border border-[#00A896]/25'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">{m.from}</p>
                    {m.unread ? <span className="h-2 w-2 rounded-full bg-[#FF5E14]" /> : null}
                  </div>
                  <p className="text-[11px] text-slate-400">{m.role}</p>
                  <p className="mt-1 truncate text-xs text-slate-500">{m.preview}</p>
                  <p className="mt-1 text-[10px] text-slate-400">{m.time}</p>
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title={`Chat with ${active.from}`}>
          <p className="mb-3 text-xs text-slate-500">Trainer chat UI (demo only — messages are not sent).</p>
          <div className="flex h-[360px] flex-col rounded-lg border border-slate-100 bg-slate-50">
            <div className="flex-1 space-y-3 overflow-y-auto p-3">
              {chatThread.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.from === 'student' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      msg.from === 'student'
                        ? 'bg-gradient-to-r from-[#FF5E14] to-[#008C95] text-white'
                        : 'bg-white text-slate-700 shadow-sm'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className={`mt-1 text-[10px] ${msg.from === 'student' ? 'text-white/70' : 'text-slate-400'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 border-t border-slate-200 bg-white p-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-[#00A896] focus:ring-2 focus:ring-[#FF5E14]/20"
              />
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#FF5E14] to-[#008C95] text-white"
                onClick={() => setDraft('')}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </Panel>
      </div>
    </section>
  )
}
