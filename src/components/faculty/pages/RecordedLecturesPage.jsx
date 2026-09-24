import { useMemo, useState } from 'react'
import { Eye, Play, Upload } from 'lucide-react'
import { recordedLectures } from '../../../data/facultyData.js'
import { Panel, PrimaryButton, ProgressBar, SearchInput, SecondaryButton } from '../shared/FacultyUI.jsx'

const gradients = [
  'from-[#FF5E14] to-[#FF8800]',
  'from-[#008C95] to-[#00A896]',
  'from-[#005F6B] to-[#008C95]',
  'from-[#FF7A00] to-[#008C95]',
  'from-[#0a2530] to-[#005F6B]',
]

export default function RecordedLecturesPage() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return recordedLectures.filter(
      (lec) =>
        !query ||
        lec.title.toLowerCase().includes(query.toLowerCase()) ||
        lec.subject.toLowerCase().includes(query.toLowerCase()) ||
        lec.course.toLowerCase().includes(query.toLowerCase())
    )
  }, [query])

  const totalViews = recordedLectures.reduce((sum, lec) => sum + lec.views, 0)
  const avgProgress = Math.round(
    recordedLectures.reduce((sum, lec) => sum + lec.progress, 0) / recordedLectures.length
  )

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <PrimaryButton>
          <Upload size={14} />
          Upload Video
        </PrimaryButton>
        <SecondaryButton>Bulk Upload</SecondaryButton>
        <div className="min-w-[200px] flex-1">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lectures…"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-2xl font-semibold text-slate-900">{recordedLectures.length}</p>
          <p className="text-sm text-slate-500">Total Recordings</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-2xl font-semibold text-[#FF5E14]">{totalViews}</p>
          <p className="text-sm text-slate-500">Total Views</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-2xl font-semibold text-[#008C95]">{avgProgress}%</p>
          <p className="text-sm text-slate-500">Avg Watch Progress</p>
        </article>
      </div>

      <Panel title="Recorded Lecture Library">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((lec, i) => (
            <article
              key={lec.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
            >
              <div
                className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${gradients[i % gradients.length]}`}
              >
                <img
                  src={lec.thumbnail}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-30"
                />
                <button
                  type="button"
                  className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#FF5E14] shadow-lg transition hover:scale-105"
                >
                  <Play size={20} className="ml-0.5" />
                </button>
                <span className="absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white">
                  {lec.duration}
                </span>
              </div>
              <div className="p-4">
                <p className="text-xs font-semibold text-[#008C95]">{lec.subject}</p>
                <h3 className="mt-1 text-sm font-semibold text-slate-900">{lec.title}</h3>
                <p className="mt-0.5 text-xs text-slate-500">{lec.course}</p>
                <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
                  <Eye size={12} />
                  {lec.views} views
                </div>
                <div className="mt-3">
                  <ProgressBar value={lec.progress} label="Watch progress" color="teal" />
                </div>
                <div className="mt-3 flex gap-2">
                  <PrimaryButton className="flex-1 justify-center">
                    <Play size={14} />
                    {lec.progress > 0 && lec.progress < 100
                      ? 'Continue'
                      : lec.progress === 100
                        ? 'Rewatch'
                        : 'Watch'}
                  </PrimaryButton>
                  <SecondaryButton>Edit</SecondaryButton>
                </div>
              </div>
            </article>
          ))}
        </div>
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">No lectures match your search.</p>
        ) : null}
      </Panel>
    </section>
  )
}
