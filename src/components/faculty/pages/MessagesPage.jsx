import { useMemo, useState } from 'react'
import { Send, Shield, User } from 'lucide-react'
import { messages as initialMessages } from '../../../data/facultyData.js'
import { Panel, SearchInput } from '../shared/FacultyUI.jsx'

const demoThreads = {
  M1: [
    { id: 1, from: 'student', text: "Ma'am, can I get an extension for ASN-014?", time: '10:20 AM' },
    { id: 2, from: 'faculty', text: 'Hi Aarav — share your progress so far and I can consider a 24h extension.', time: '10:22 AM' },
    { id: 3, from: 'student', text: "I've completed 70% — GitHub link shared in submission.", time: '10:24 AM' },
  ],
  M2: [
    { id: 1, from: 'admin', text: 'Please submit July attendance report by Friday.', time: 'Yesterday, 4:10 PM' },
    { id: 2, from: 'faculty', text: 'Noted. I will submit FS-2025-A and FS-2025-B reports by Thursday.', time: 'Yesterday, 5:02 PM' },
  ],
  M3: [
    { id: 1, from: 'student', text: 'Shared my project GitHub link in the portal.', time: 'Jul 12, 11:30 AM' },
    { id: 2, from: 'faculty', text: 'Reviewed — good use of custom hooks. Add error boundary before demo.', time: 'Jul 12, 2:15 PM' },
  ],
  M4: [
    { id: 1, from: 'student', text: 'Doubt on aggregation pipeline — $lookup vs $graphLookup?', time: 'Jul 11, 9:00 AM' },
    { id: 2, from: 'faculty', text: 'Use $lookup for simple joins; $graphLookup for recursive relationships.', time: 'Jul 11, 9:45 AM' },
  ],
}

export default function MessagesPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [activeId, setActiveId] = useState(messages[0]?.id)
  const [draft, setDraft] = useState('')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return messages
    return messages.filter(
      (m) =>
        m.from.toLowerCase().includes(q) ||
        m.preview.toLowerCase().includes(q) ||
        m.type.toLowerCase().includes(q)
    )
  }, [messages, search])

  const active = messages.find((m) => m.id === activeId) || messages[0]
  const thread = active ? demoThreads[active.id] || [] : []
  const unreadCount = messages.filter((m) => m.unread).length

  const selectMessage = (id) => {
    setActiveId(id)
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, unread: false } : m)))
  }

  const handleSend = () => {
    if (!draft.trim()) return
    setDraft('')
  }

  return (
    <section className="space-y-4">
      <p className="text-sm text-slate-500">
        <span className="font-semibold text-[#FF5E14]">{unreadCount}</span> unread conversations
      </p>

      <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <Panel title="Inbox">
          <div className="mb-3">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search messages…"
            />
          </div>
          <ul className="max-h-[420px] space-y-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <li className="py-8 text-center text-xs text-slate-400">No messages match your search.</li>
            ) : (
              filtered.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => selectMessage(m.id)}
                    className={`w-full rounded-xl px-3 py-2.5 text-left transition ${
                      activeId === m.id
                        ? 'border border-[#00A896]/25 bg-gradient-to-r from-[#FF5E14]/10 to-[#00A896]/10'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-slate-900">{m.from}</p>
                      {m.unread ? (
                        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF5E14] px-1.5 text-[10px] font-bold text-white">
                          1
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-slate-400">
                      {m.type === 'Admin' ? <Shield size={10} /> : <User size={10} />}
                      {m.type}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">{m.preview}</p>
                    <p className="mt-1 text-[10px] text-slate-400">{m.time}</p>
                  </button>
                </li>
              ))
            )}
          </ul>
        </Panel>

        <Panel title={active ? `Chat with ${active.from}` : 'Select a conversation'}>
          {active ? (
            <>
              <p className="mb-3 text-xs text-slate-500">
                {active.type} conversation · demo only — messages are not sent.
              </p>
              <div className="flex h-[380px] flex-col rounded-xl border border-slate-100 bg-slate-50">
                <div className="flex-1 space-y-3 overflow-y-auto p-4">
                  {thread.map((msg) => {
                    const isFaculty = msg.from === 'faculty'
                    const isAdmin = msg.from === 'admin'
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isFaculty ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                            isFaculty
                              ? 'bg-gradient-to-r from-[#FF5E14] to-[#008C95] text-white'
                              : isAdmin
                                ? 'border border-[#00A896]/20 bg-white text-slate-700 shadow-sm'
                                : 'bg-white text-slate-700 shadow-sm'
                          }`}
                        >
                          {isAdmin ? (
                            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-[#008C95]">
                              Admin
                            </p>
                          ) : null}
                          <p>{msg.text}</p>
                          <p
                            className={`mt-1 text-[10px] ${
                              isFaculty ? 'text-white/70' : 'text-slate-400'
                            }`}
                          >
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex gap-2 border-t border-slate-200 bg-white p-3">
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type a reply…"
                    rows={2}
                    className="flex-1 resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#00A896] focus:ring-2 focus:ring-[#FF5E14]/20"
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center self-end rounded-full bg-gradient-to-r from-[#FF5E14] to-[#008C95] text-white"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="py-12 text-center text-sm text-slate-400">Select a message from the inbox.</p>
          )}
        </Panel>
      </div>
    </section>
  )
}
