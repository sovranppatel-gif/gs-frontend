import { Play } from 'lucide-react'
import { recordedLectures } from '../../../data/studentData.js'
import { Panel, PrimaryButton, ProgressBar } from '../shared/StudentUI.jsx'

const gradients = [
  'from-[#FF5E14] to-[#FF8800]',
  'from-[#008C95] to-[#00A896]',
  'from-[#005F6B] to-[#008C95]',
  'from-[#FF7A00] to-[#008C95]',
  'from-[#0a2530] to-[#005F6B]',
]

export default function RecordedLecturesPage() {
  return (
    <section className="space-y-3">
      <Panel title="Recorded Lectures">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {recordedLectures.map((lec, i) => (
            <article
              key={lec.id}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
            >
              <div
                className={`relative flex h-32 items-center justify-center bg-gradient-to-br ${gradients[i % gradients.length]}`}
              >
                <button
                  type="button"
                  className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#FF5E14] shadow-lg transition hover:scale-105"
                >
                  <Play size={20} className="ml-0.5" />
                </button>
                <span className="absolute bottom-2 right-2 rounded-md bg-black/50 px-2 py-0.5 text-[11px] text-white">
                  {lec.duration}
                </span>
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-[#008C95]">{lec.subject}</p>
                <h3 className="mt-1 text-sm font-semibold text-slate-900">{lec.title}</h3>
                <div className="mt-3">
                  <ProgressBar value={lec.progress} label="Watch progress" color="teal" />
                </div>
                <div className="mt-3">
                  <PrimaryButton>
                    <Play size={14} />
                    {lec.progress > 0 && lec.progress < 100 ? 'Continue Watching' : lec.progress === 100 ? 'Rewatch' : 'Watch Now'}
                  </PrimaryButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </section>
  )
}
