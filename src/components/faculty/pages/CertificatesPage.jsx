import { useMemo, useState } from 'react'
import { Award, Download, Eye, Plus } from 'lucide-react'
import { certificates, dashboardStats } from '../../../data/facultyData.js'
import {
  Panel,
  PrimaryButton,
  SearchInput,
  SecondaryButton,
  StatCard,
  StatusBadge,
} from '../shared/FacultyUI.jsx'

export default function CertificatesPage() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return certificates.filter(
      (c) =>
        !query ||
        c.student.toLowerCase().includes(query.toLowerCase()) ||
        c.course.toLowerCase().includes(query.toLowerCase())
    )
  }, [query])

  const issued = certificates.filter((c) => c.status === 'Issued')
  const pending = certificates.filter((c) => c.status === 'Pending')

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <PrimaryButton>
          <Plus size={14} />
          Generate Certificate
        </PrimaryButton>
        <SecondaryButton>Bulk Generate</SecondaryButton>
        <div className="min-w-[200px] flex-1">
          <SearchInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search student or course…"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Total Issued" value={dashboardStats.certificatesIssued} icon={Award} />
        <StatCard label="This Batch — Issued" value={issued.length} />
        <StatCard label="Pending Approval" value={pending.length} />
      </div>

      <Panel title="Issued Certificates">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => (
            <article
              key={c.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.08)]"
            >
              <div className="flex h-36 flex-col items-center justify-center bg-gradient-to-br from-[#06151C] via-[#0a2530] to-[#005F6B] p-4 text-center text-white">
                <Award className="mb-2 text-[#FFB380]" size={28} />
                <p className="text-sm font-semibold">{c.course}</p>
                <p className="mt-1 text-[11px] text-slate-300">{c.student}</p>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-slate-500">Issued {c.issued}</p>
                  <StatusBadge status={c.status} />
                </div>
                <p className="mt-1 text-[11px] font-mono text-slate-400">{c.id}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <PrimaryButton>
                    <Download size={14} />
                    Download
                  </PrimaryButton>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-[#FF5E14]/40 hover:text-[#FF5E14]"
                  >
                    <Eye size={14} />
                    Preview
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">No certificates match your search.</p>
        ) : null}
      </Panel>

      <Panel title="Certificate Registry">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="px-3 py-3 font-medium">Certificate ID</th>
                <th className="px-3 py-3 font-medium">Student</th>
                <th className="px-3 py-3 font-medium">Course</th>
                <th className="px-3 py-3 font-medium">Issued Date</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-slate-100 transition hover:bg-slate-50/80">
                  <td className="px-3 py-3 font-mono text-xs text-slate-600">{c.id}</td>
                  <td className="px-3 py-3 font-medium text-slate-800">{c.student}</td>
                  <td className="px-3 py-3 text-slate-600">{c.course}</td>
                  <td className="px-3 py-3 text-slate-500">{c.issued}</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={c.status} />
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
      </Panel>
    </section>
  )
}
