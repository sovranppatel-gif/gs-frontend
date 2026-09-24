import { useMemo, useState } from 'react'
import { Download, ExternalLink, FileArchive, FileText, Film, Link2, Presentation } from 'lucide-react'
import { studyMaterials } from '../../../data/studentData.js'
import { Panel, PrimaryButton, SearchInput } from '../shared/StudentUI.jsx'

const typeIcon = {
  PDF: FileText,
  Video: Film,
  PPT: Presentation,
  ZIP: FileArchive,
  Link: Link2,
}

export default function StudyMaterialsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const categories = ['All', 'Notes', 'Video', 'Slides', 'Resources', 'Link']

  const filtered = useMemo(() => {
    return studyMaterials.filter((m) => {
      const q =
        !query ||
        m.title.toLowerCase().includes(query.toLowerCase()) ||
        m.subject.toLowerCase().includes(query.toLowerCase())
      const c = category === 'All' || m.category === category
      return q && c
    })
  }, [query, category])

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="min-w-[200px] flex-1">
          <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search materials…" />
        </div>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              category === c
                ? 'bg-gradient-to-r from-[#FF5E14] to-[#008C95] text-white'
                : 'border border-slate-200 bg-white text-slate-600'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <Panel title="Recently Added">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((m) => {
            const Icon = typeIcon[m.type] || FileText
            return (
              <div
                key={m.id}
                className="flex flex-col rounded-lg border border-slate-100 bg-slate-50 p-3 transition hover:border-[#FF5E14]/30 hover:bg-white"
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#00A896]/10 text-[#008C95]">
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{m.title}</p>
                    <p className="text-xs text-slate-500">
                      {m.subject} · {m.type} · {m.size}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">Added {m.added}</p>
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
    </section>
  )
}
