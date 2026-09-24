import { useMemo, useState } from 'react'
import { Bookmark, Download, FileArchive, FileText, Pin, Plus, Presentation } from 'lucide-react'
import { notes } from '../../../data/facultyData.js'
import {
  Panel,
  PrimaryButton,
  SearchInput,
  SecondaryButton,
} from '../shared/FacultyUI.jsx'

const typeBadge = {
  PDF: 'bg-rose-100 text-rose-700',
  PPT: 'bg-orange-100 text-orange-700',
  DOC: 'bg-sky-100 text-sky-700',
  ZIP: 'bg-violet-100 text-violet-700',
}

const typeIcon = {
  PDF: FileText,
  PPT: Presentation,
  DOC: FileText,
  ZIP: FileArchive,
}

function TypeBadge({ type }) {
  const Icon = typeIcon[type] || FileText
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${typeBadge[type] || 'bg-slate-100 text-slate-600'}`}
    >
      <Icon size={11} />
      {type}
    </span>
  )
}

export default function NotesPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')

  const filtered = useMemo(() => {
    return notes.filter((n) => {
      const q =
        !query ||
        n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.subject.toLowerCase().includes(query.toLowerCase())
      const f =
        filter === 'All' ||
        (filter === 'Pinned' && n.pinned) ||
        (filter === 'Bookmarked' && n.bookmarked)
      return q && f
    })
  }, [query, filter])

  const pinned = notes.filter((n) => n.pinned)
  const bookmarked = notes.filter((n) => n.bookmarked)

  const subjects = [...new Set(notes.map((n) => n.subject))]

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <PrimaryButton>
          <Plus size={14} />
          Create Notes
        </PrimaryButton>
        <SecondaryButton>Upload File</SecondaryButton>
        <div className="min-w-[200px] flex-1">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes by title or subject…"
          />
        </div>
        {['All', 'Pinned', 'Bookmarked'].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              filter === f
                ? 'bg-gradient-to-r from-[#FF5E14] to-[#008C95] text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-[#FF5E14]/30'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-2xl font-semibold text-[#008C95]">{notes.length}</p>
          <p className="text-sm text-slate-500">Total Notes</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-2xl font-semibold text-[#FF5E14]">{pinned.length}</p>
          <p className="text-sm text-slate-500">Pinned</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-2xl font-semibold text-[#005F6B]">{bookmarked.length}</p>
          <p className="text-sm text-slate-500">Bookmarked</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-2xl font-semibold text-slate-800">{subjects.length}</p>
          <p className="text-sm text-slate-500">Subjects</p>
        </article>
      </div>

      {pinned.length > 0 ? (
        <Panel title="Pinned Notes">
          <div className="grid gap-3 sm:grid-cols-2">
            {pinned.map((n) => (
              <div
                key={n.id}
                className="rounded-xl border border-[#FF5E14]/20 bg-gradient-to-br from-[#FFF0E6] to-white p-4 transition hover:shadow-[0_8px_24px_rgba(255,94,20,0.12)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-semibold text-[#FF5E14]">{n.subject}</p>
                      <TypeBadge type={n.type} />
                    </div>
                    <h3 className="mt-1 text-sm font-semibold text-slate-900">{n.title}</h3>
                  </div>
                  <Pin size={14} className="shrink-0 text-[#FF5E14]" />
                </div>
                <p className="mt-2 text-[11px] text-slate-500">
                  {n.size} · Updated {n.updated}
                </p>
                <div className="mt-3 flex gap-2">
                  <PrimaryButton>
                    <Download size={14} />
                    Download
                  </PrimaryButton>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      ) : null}

      {bookmarked.length > 0 ? (
        <Panel title="Bookmarked Notes">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarked.map((n) => (
              <div
                key={n.id}
                className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 transition hover:border-[#008C95]/30 hover:bg-white"
              >
                <Bookmark size={16} className="mt-0.5 shrink-0 fill-[#FF5E14] text-[#FF5E14]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{n.title}</p>
                  <p className="text-xs text-slate-500">{n.subject}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <TypeBadge type={n.type} />
                    <span className="text-[11px] text-slate-400">{n.size}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      ) : null}

      <Panel
        title="All Notes"
        action={
          <SecondaryButton>
            <Download size={14} />
            Export List
          </SecondaryButton>
        }
      >
        <div className="mb-3 flex flex-wrap gap-2">
          {subjects.map((s) => (
            <span
              key={s}
              className="rounded-full bg-[#00A896]/10 px-3 py-1 text-xs font-semibold text-[#005F6B]"
            >
              {s}
            </span>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="px-3 py-3 font-medium">Title</th>
                <th className="px-3 py-3 font-medium">Subject</th>
                <th className="px-3 py-3 font-medium">Type</th>
                <th className="px-3 py-3 font-medium">Size</th>
                <th className="px-3 py-3 font-medium">Updated</th>
                <th className="px-3 py-3 font-medium">Flags</th>
                <th className="px-3 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((n) => (
                <tr key={n.id} className="border-b border-slate-100 transition hover:bg-slate-50/80">
                  <td className="px-3 py-3 font-medium text-slate-800">{n.title}</td>
                  <td className="px-3 py-3 text-slate-600">{n.subject}</td>
                  <td className="px-3 py-3">
                    <TypeBadge type={n.type} />
                  </td>
                  <td className="px-3 py-3 text-slate-600">{n.size}</td>
                  <td className="px-3 py-3 text-slate-500">{n.updated}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      {n.pinned ? <Pin size={14} className="text-[#FF5E14]" /> : null}
                      <Bookmark
                        size={14}
                        className={n.bookmarked ? 'fill-[#FF5E14] text-[#FF5E14]' : 'text-slate-300'}
                      />
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#008C95] hover:text-[#FF5E14]"
                    >
                      <Download size={12} />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">No notes match your search.</p>
        ) : null}
      </Panel>
    </section>
  )
}
