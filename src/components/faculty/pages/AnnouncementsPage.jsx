import { useState } from 'react'
import { Megaphone, Pin, Pencil, Plus, Trash2 } from 'lucide-react'
import { announcements as initialAnnouncements } from '../../../data/facultyData.js'
import { Panel, PrimaryButton, SecondaryButton, StatusBadge } from '../shared/FacultyUI.jsx'

function AudienceBadge({ audience }) {
  const isStudent = audience === 'Student'
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
        isStudent ? 'bg-sky-100 text-sky-700' : 'bg-[#00A896]/15 text-[#005F6B]'
      }`}
    >
      {audience}
    </span>
  )
}

export default function AnnouncementsPage() {
  const [items, setItems] = useState(initialAnnouncements)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', audience: 'Student' })
  const [actionMsg, setActionMsg] = useState('')

  const pinned = items.filter((a) => a.pinned)
  const unpinned = items.filter((a) => !a.pinned)

  const handleCreate = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.body.trim()) return
    const newItem = {
      id: `A${Date.now()}`,
      title: form.title.trim(),
      body: form.body.trim(),
      audience: form.audience,
      pinned: false,
      date: 'Jul 14, 2026',
    }
    setItems((prev) => [newItem, ...prev])
    setForm({ title: '', body: '', audience: 'Student' })
    setShowForm(false)
    setActionMsg('Announcement created (demo).')
  }

  const handleEdit = (id) => {
    setActionMsg(`Edit announcement ${id} (demo).`)
  }

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((a) => a.id !== id))
    setActionMsg('Announcement removed (demo).')
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-800">{items.length}</span> announcements ·{' '}
          <span className="font-semibold text-[#FF5E14]">{pinned.length}</span> pinned
        </p>
        <PrimaryButton onClick={() => setShowForm((v) => !v)}>
          <Plus size={14} />
          Create Announcement
        </PrimaryButton>
      </div>

      {actionMsg ? (
        <p className="rounded-xl border border-[#00A896]/20 bg-[#00A896]/5 px-4 py-2 text-xs font-medium text-[#005F6B]">
          {actionMsg}
        </p>
      ) : null}

      {showForm ? (
        <Panel title="New Announcement">
          <form onSubmit={handleCreate} className="space-y-3">
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Title"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#00A896] focus:ring-2 focus:ring-[#FF5E14]/20"
            />
            <textarea
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              placeholder="Announcement body…"
              required
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#00A896] focus:ring-2 focus:ring-[#FF5E14]/20"
            />
            <select
              value={form.audience}
              onChange={(e) => setForm((f) => ({ ...f, audience: e.target.value }))}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm outline-none focus:border-[#00A896]"
            >
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
            </select>
            <div className="flex flex-wrap gap-2">
              <PrimaryButton type="submit">
                <Megaphone size={14} />
                Publish
              </PrimaryButton>
              <SecondaryButton type="button" onClick={() => setShowForm(false)}>
                Cancel
              </SecondaryButton>
            </div>
          </form>
        </Panel>
      ) : null}

      {pinned.length > 0 ? (
        <Panel title="Pinned Announcements">
          <div className="space-y-3">
            {pinned.map((a) => (
              <article
                key={a.id}
                className="rounded-xl border border-[#FF5E14]/25 bg-gradient-to-br from-[#FFF0E6] to-white p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex min-w-0 flex-1 items-start gap-2">
                    <Pin size={14} className="mt-1 shrink-0 text-[#FF5E14]" />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-slate-900">{a.title}</h3>
                        <AudienceBadge audience={a.audience} />
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{a.body}</p>
                      <p className="mt-2 text-[11px] text-slate-400">{a.date}</p>
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => handleEdit(a.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-[#00A896] hover:text-[#008C95]"
                      aria-label="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(a.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-rose-300 hover:text-rose-600"
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Panel>
      ) : null}

      <Panel title="All Announcements">
        <div className="space-y-3">
          {[...pinned, ...unpinned].map((a) => (
            <article
              key={a.id}
              className={`flex gap-3 rounded-xl border p-4 ${
                a.pinned ? 'border-[#FF5E14]/20 bg-[#FFF0E6]/30' : 'border-slate-100 bg-slate-50'
              }`}
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#00A896]/10 text-[#008C95]">
                <Megaphone size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">{a.title}</h3>
                    {a.pinned ? <Pin size={12} className="text-[#FF5E14]" /> : null}
                    <AudienceBadge audience={a.audience} />
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleEdit(a.id)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-[#008C95]"
                      aria-label="Edit"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(a.id)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-rose-600"
                      aria-label="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <p className="mt-1 text-sm text-slate-600">{a.body}</p>
                <p className="mt-2 text-[11px] text-slate-400">{a.date}</p>
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </section>
  )
}
