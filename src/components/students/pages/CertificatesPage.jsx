import { Award, Download, Eye } from 'lucide-react'
import { certificates } from '../../../data/studentData.js'
import { Panel, PrimaryButton } from '../shared/StudentUI.jsx'

export default function CertificatesPage() {
  return (
    <section className="space-y-3">
      <Panel title="Completed Certificates">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {certificates.map((c) => (
            <article
              key={c.id}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
            >
              <div className="flex h-36 flex-col items-center justify-center bg-gradient-to-br from-[#06151C] via-[#0a2530] to-[#005F6B] p-3 text-center text-white">
                <Award className="mb-2 text-[#FFB380]" size={28} />
                <p className="text-sm font-semibold">{c.title}</p>
                <p className="mt-1 text-[11px] text-slate-300">{c.issuer}</p>
              </div>
              <div className="p-3">
                <p className="text-xs text-slate-500">Issued {c.issueDate}</p>
                <p className="mt-1 text-[11px] font-mono text-slate-400">{c.credentialId}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <PrimaryButton>
                    <Download size={14} />
                    Download
                  </PrimaryButton>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-[#FF5E14]/40 hover:text-[#FF5E14]"
                  >
                    <Eye size={14} />
                    Preview
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </section>
  )
}
