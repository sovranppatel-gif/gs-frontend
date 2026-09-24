import { useMemo, useState } from 'react'
import {
  Download,
  ExternalLink,
  FileArchive,
  FileText,
  Film,
  Link2,
  Plus,
  Presentation,
  Upload,
} from 'lucide-react'
import { studyMaterials } from '../../../data/facultyData.js'
import { Panel, PrimaryButton, SearchInput, SecondaryButton } from '../shared/FacultyUI.jsx'

const typeIcon = {
  Video: Film,
  PDF: FileText,
  PPT: Presentation,
  Link: Link2,
  ZIP: FileArchive,
}

const typeAccent = {
  Video: 'bg-[#FF5E14]/10 text-[#FF5E14]',
  PDF: 'bg-rose-100 text-rose-700',
  PPT: 'bg-orange-100 text-orange-700',
  Link: 'bg-sky-100 text-sky-700',
  ZIP: 'bg-violet-100 text-violet-700',
}

export default function StudyMaterialsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const categories = ['All', ...new Set(studyMaterials.map((m) => m.category))]

  const filtered = useMemo(() => {
    return studyMaterials.filter((m) => {
      const q =
        !query ||
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.category.toLowerCase().includes(query.toLowerCase())
      const c = category === 'All' || m.category === category
      return q && c
    })
  }, [query, category])

  const recentlyUploaded = [...studyMaterials].sort(
    (a, b) => new Date(b.uploaded) - new Date(a.uploaded)
  )

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <PrimaryButton>
          <Upload size={14} />
          Upload Material
        </PrimaryButton>
        <SecondaryButton>
          <Plus size={14} />
          Add Link
        </SecondaryButton>
        <div className="min-w-[200px] flex-1">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search materials…"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              category === c
                ? 'bg-gradient-to-r from-[#FF5E14] to-[#008C95] text-white'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-[#FF5E14]/30'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {['Video', 'PDF', 'PPT', 'Link'].map((type) => {
          const count = studyMaterials.filter((m) => m.type === type).length
          const Icon = typeIcon[type] || FileText
          return (
            <article
              key={type}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${typeAccent[type]}`}>
                <Icon size={18} />
              </span>
              <div>
                <p className="text-xl font-semibold text-slate-900">{count}</p>
                <p className="text-xs text-slate-500">{type} files</p>
              </div>
            </article>
          )
        })}
      </div>

      <Panel title="Recently Uploaded">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {recentlyUploaded.slice(0, 4).map((m) => {
            const Icon = typeIcon[m.type] || FileText
            return (
              <div
                key={m.id}
                className="flex flex-col rounded-xl border border-slate-100 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-[#FF5E14]/30 hover:bg-white hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${typeAccent[m.type]}`}
                  >
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{m.title}</p>
                    <p className="text-xs text-slate-500">
                      {m.category} · {m.type}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {m.size} · {m.uploaded}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <PrimaryButton className="w-full justify-center">
                    {m.type === 'Link' ? <ExternalLink size={14} /> : <Download size={14} />}
                    {m.type === 'Link' ? 'Open Link' : 'Download'}
                  </PrimaryButton>
                </div>
              </div>
            )
          })}
        </div>
      </Panel>

      <Panel title="All Study Materials">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((m) => {
            const Icon = typeIcon[m.type] || FileText
            return (
              <div
                key={m.id}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${typeAccent[m.type]}`}
                  >
                    <Icon size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex rounded-full bg-[#00A896]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#005F6B]">
                      {m.category}
                    </span>
                    <p className="mt-1 truncate text-sm font-semibold text-slate-900">{m.title}</p>
                    <p className="text-xs text-slate-500">
                      {m.type} · {m.size}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">Uploaded {m.uploaded}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <PrimaryButton className="flex-1 justify-center">
                    {m.type === 'Link' ? <ExternalLink size={14} /> : <Download size={14} />}
                    {m.type === 'Link' ? 'Open' : 'Download'}
                  </PrimaryButton>
                  <SecondaryButton>Edit</SecondaryButton>
                </div>
              </div>
            )
          })}
        </div>
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">No materials found.</p>
        ) : null}
      </Panel>
    </section>
  )
}
