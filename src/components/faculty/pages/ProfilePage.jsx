import { Award, Download, FileText, Mail, MapPin, Pencil, Phone, Star } from 'lucide-react'
import { facultyProfile } from '../../../data/facultyData.js'
import { Panel, PrimaryButton, SecondaryButton } from '../shared/FacultyUI.jsx'

export default function ProfilePage() {
  const p = facultyProfile

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-[#00A896]/30 bg-gradient-to-br from-[#06151C] via-[#0a2530] to-[#005F6B] p-5 text-white shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={p.avatar}
              alt={p.name}
              className="h-20 w-20 rounded-2xl border-2 border-[#FF5E14]/50 object-cover"
            />
            <div>
              <h2 className="text-xl font-bold">{p.name}</h2>
              <p className="text-sm text-slate-300">{p.empId}</p>
              <p className="mt-1 text-xs text-[#00E5CC]">
                {p.designation} · {p.department}
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-[#FFB380]">
                <Star size={12} className="fill-[#FFB380]" />
                {p.rating} faculty rating
              </p>
            </div>
          </div>
          <PrimaryButton>
            <Pencil size={14} />
            Edit Profile
          </PrimaryButton>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Personal Details">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            {[
              ['Email', p.email],
              ['Phone', p.phone],
              ['DOB', p.dob],
              ['Gender', p.gender],
              ['Blood Group', p.bloodGroup],
              ['Employee ID', p.empId],
              ['Faculty ID', p.id],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">{k}</dt>
                <dd className="mt-0.5 font-medium text-slate-800">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel title="Professional Details">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            {[
              ['Department', p.department],
              ['Designation', p.designation],
              ['Joining Date', p.joiningDate],
              ['Experience', p.experience],
              ['Teaching Progress', `${p.teachingProgress}%`],
              ['Weekly Progress', `${p.weeklyProgress}%`],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">{k}</dt>
                <dd className="mt-0.5 font-medium text-slate-800">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel title="Qualification & Experience">
          <div className="space-y-3 text-sm">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase text-slate-400">Qualification</p>
              <p className="mt-1 font-semibold text-slate-900">{p.qualification}</p>
            </div>
            <div className="rounded-xl bg-[#00A896]/10 p-3">
              <p className="text-xs font-semibold uppercase text-[#005F6B]">Total Experience</p>
              <p className="mt-1 font-semibold text-slate-900">{p.experience}</p>
              <p className="mt-1 text-xs text-slate-500">
                With Grow Skills Tech since {new Date(p.joiningDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </Panel>

        <Panel title="Skills">
          <div className="flex flex-wrap gap-2">
            {p.skills.map((s) => (
              <span key={s} className="rounded-full bg-[#00A896]/10 px-3 py-1 text-xs font-semibold text-[#005F6B]">
                {s}
              </span>
            ))}
          </div>
        </Panel>

        <Panel title="Expertise">
          <div className="flex flex-wrap gap-2">
            {p.expertise.map((e) => (
              <span key={e} className="rounded-full bg-[#FF5E14]/10 px-3 py-1 text-xs font-semibold text-[#FF5E14]">
                {e}
              </span>
            ))}
          </div>
        </Panel>

        <Panel title="Languages">
          <div className="flex flex-wrap gap-2">
            {p.languages.map((l) => (
              <span key={l} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                {l}
              </span>
            ))}
          </div>
        </Panel>

        <Panel title="Bank Details">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            {[
              ['Account Name', p.bank.accountName],
              ['Bank Name', p.bank.bankName],
              ['Account No', p.bank.accountNo],
              ['IFSC', p.bank.ifsc],
              ['PAN', p.bank.pan],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">{k}</dt>
                <dd className="mt-0.5 font-medium text-slate-800">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel title="Emergency Contact">
          <div className="rounded-xl bg-rose-50 p-3 text-sm">
            <p className="text-xs font-semibold uppercase text-rose-400">Emergency</p>
            <p className="mt-1 font-semibold text-slate-900">{p.emergency.name}</p>
            <p className="text-xs text-slate-500">{p.emergency.relation}</p>
            <p className="mt-2 flex items-center gap-1.5 text-slate-600">
              <Phone size={12} /> {p.emergency.phone}
            </p>
          </div>
        </Panel>

        <Panel title="Address" className="lg:col-span-2">
          <p className="flex items-start gap-2 text-sm text-slate-700">
            <MapPin size={16} className="mt-0.5 shrink-0 text-[#FF5E14]" />
            <span>
              {p.address.line1}, {p.address.line2}
              <br />
              {p.address.city}, {p.address.state} — {p.address.pincode}
            </span>
          </p>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
            <Mail size={12} /> {p.email}
            <span className="mx-1">·</span>
            <Phone size={12} /> {p.phone}
          </p>
        </Panel>

        <Panel title="Documents">
          <ul className="space-y-2">
            {p.documents.map((doc) => (
              <li
                key={doc.name}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-100 px-3 py-2.5 text-sm"
              >
                <div className="flex items-center gap-2">
                  <FileText size={16} className="shrink-0 text-[#008C95]" />
                  <div>
                    <p className="font-medium text-slate-800">{doc.name}</p>
                    <p className="text-xs text-slate-500">
                      {doc.type} · {doc.size}
                    </p>
                  </div>
                </div>
                <SecondaryButton className="!px-3 !py-1.5 text-xs">
                  <Download size={12} />
                  Download
                </SecondaryButton>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Certificates">
          <ul className="space-y-2">
            {p.certificates.map((cert) => (
              <li key={cert.title} className="rounded-xl border border-slate-100 px-3 py-2.5 text-sm">
                <p className="font-semibold text-slate-900">{cert.title}</p>
                <p className="text-xs text-slate-500">Issued {cert.year}</p>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Achievements">
          <ul className="space-y-2">
            {p.achievements.map((a) => (
              <li key={a} className="flex items-center gap-2 text-sm text-slate-700">
                <Award size={14} className="shrink-0 text-[#FF5E14]" />
                {a}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Awards">
          <ul className="space-y-2">
            {p.awards.map((a) => (
              <li key={a} className="flex items-center gap-2 rounded-xl bg-[#FF5E14]/5 px-3 py-2 text-sm font-medium text-slate-800">
                <Award size={14} className="shrink-0 text-[#FF5E14]" />
                {a}
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </section>
  )
}
