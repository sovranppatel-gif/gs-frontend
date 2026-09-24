import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Archive, ArrowLeft, Building2, Mail, Phone, Wallet } from 'lucide-react'
import { API_URL } from '../../../utils/api.js'
import { getMasterAdminToken } from '../../../utils/masterAdminAuth.js'
import { archiveStaff, getStaffById } from '../../../services/staffService.js'
import { StatusBadge, Tabs } from '../shared/MasterAdminUI.jsx'
import { photoSrc, staffInitials } from './staffFormUtils.js'

const TABS = [
  'Overview',
  'Employment',
  'Attendance',
  'Leave',
  'Payroll',
  'Documents',
  'Tasks',
  'Performance',
  'Assets',
  'Activity',
  'Access & Permissions',
]

// These tabs need their own sub-module (Attendance/Leave/Documents/Tasks/
// Performance/Assets/RBAC) that this pass of Staff Management doesn't build
// yet — see the module's report. Listed here so the profile's structure is
// real and navigable now; each says so honestly rather than showing empty
// fabricated tables.
const NOT_YET_BUILT = new Set(['Attendance', 'Leave', 'Payroll', 'Documents', 'Tasks', 'Performance', 'Assets', 'Access & Permissions'])

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm text-slate-800">{value || '—'}</p>
    </div>
  )
}

function dateLabel(value) {
  if (!value) return '—'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function ActivityTab({ staffId }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const token = getMasterAdminToken()
        const qs = new URLSearchParams({ section: 'Staff', resourceId: staffId, limit: '30' })
        const res = await fetch(`${API_URL}/api/activity-logs?${qs.toString()}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok || !data.success) throw new Error(data.message || 'Unable to load activity')
        if (!cancelled) setRows(data.data?.rows || [])
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Unable to load activity')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [staffId])

  if (loading) return <p className="py-6 text-center text-sm text-slate-500">Loading activity…</p>
  if (error) return <p className="py-6 text-center text-sm text-amber-700">{error}</p>
  if (!rows.length) return <p className="py-6 text-center text-sm text-slate-500">No activity recorded yet.</p>

  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r._id} className="rounded-lg border border-slate-200 bg-slate-50/80 p-3 text-sm">
          <p className="font-medium text-slate-800">{r.message}</p>
          <p className="mt-0.5 text-xs text-slate-500">
            {new Date(r.createdAt).toLocaleString('en-IN')} · {r.actor}
          </p>
        </li>
      ))}
    </ul>
  )
}

function ComingSoon({ tab }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-10 text-center">
      <p className="text-sm font-semibold text-slate-800">{tab} isn't built yet</p>
      <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
        This tab is wired into the profile so it's navigable, but the {tab.toLowerCase()} sub-module
        (its own data model and API) is a separate, later piece of Staff Management.
      </p>
    </div>
  )
}

export default function StaffProfilePage({ staffId }) {
  const navigate = useNavigate()
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('Overview')

  useEffect(() => {
    let cancelled = false
    setTab('Overview')
    setLoading(true)
    getStaffById(staffId)
      .then((data) => { if (!cancelled) setEntry(data) })
      .catch((err) => { if (!cancelled) setError(err?.message || 'Unable to load staff member') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [staffId])

  const handleArchive = async () => {
    if (!entry) return
    const ok = window.confirm(
      `Archive ${entry.personalDetails?.fullName}?\n\nThis staff member will be removed from the active staff list, but attendance, leave, payroll, documents and historical records will be preserved.`,
    )
    if (!ok) return
    try {
      await archiveStaff(entry._id)
      navigate('/master-admin/staff')
    } catch (err) {
      setError(err?.message || 'Archive failed')
    }
  }

  if (loading) return <p className="py-10 text-center text-sm text-slate-500">Loading profile…</p>
  if (error) return <article className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">{error}</article>
  if (!entry) return null

  const personal = entry.personalDetails || {}
  const employment = entry.employmentDetails || {}
  const emergency = entry.emergencyContact || {}
  const src = photoSrc(personal.profilePhoto, API_URL)

  return (
    <section className="space-y-3">
      <button type="button" onClick={() => navigate('/master-admin/staff')} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#FF5E14]">
        <ArrowLeft size={14} /> Back to staff
      </button>

      <div className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex min-w-0 items-center gap-3">
          {src ? (
            <img src={src} alt="" className="h-16 w-16 rounded-lg object-cover" />
          ) : (
            <div className="grid h-16 w-16 place-items-center rounded-lg bg-slate-800 text-lg font-bold text-white">
              {staffInitials(personal.fullName)}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-lg font-semibold text-slate-900">{personal.fullName}</h2>
              <StatusBadge status={entry.status} />
            </div>
            <p className="text-sm text-slate-500">{entry.employeeId} · {employment.designationName || '—'} · {employment.departmentName || '—'}</p>
            <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1"><Mail size={12} /> {personal.officialEmail}</span>
              <span className="inline-flex items-center gap-1"><Phone size={12} /> {personal.personalMobile}</span>
              {employment.branch ? <span className="inline-flex items-center gap-1"><Building2 size={12} /> {employment.branch}</span> : null}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={handleArchive} className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-100">
            <Archive size={13} /> Archive
          </button>
        </div>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      <div className="rounded-lg border border-slate-200 bg-white p-4">
        {tab === 'Overview' ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Employee ID" value={entry.employeeId} />
            <Field label="Joining date" value={dateLabel(employment.joiningDate)} />
            <Field label="Department" value={employment.departmentName} />
            <Field label="Designation" value={employment.designationName} />
            <Field label="Reporting manager" value={employment.reportingManagerName} />
            <Field label="Employment type" value={employment.employmentType} />
            <Field label="Work mode" value={employment.workMode} />
            <Field label="Branch" value={employment.branch} />
            <Field label="Status" value={entry.status} />
            <Field label="Personal email" value={personal.personalEmail} />
            <Field label="WhatsApp" value={personal.whatsapp} />
            <Field label="Gender" value={personal.gender} />
            <Field label="Date of birth" value={dateLabel(personal.dateOfBirth)} />
            <Field label="Blood group" value={personal.bloodGroup} />
            <Field label="Address" value={[personal.address, personal.city, personal.state, personal.pincode].filter(Boolean).join(', ')} />
            <Field label="Emergency contact" value={emergency.name ? `${emergency.name} (${emergency.relationship || '—'}) · ${emergency.phone || '—'}` : ''} />
          </div>
        ) : null}

        {tab === 'Employment' ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Probation period" value={employment.probationPeriodMonths ? `${employment.probationPeriodMonths} months` : ''} />
              <Field label="Probation end date" value={dateLabel(employment.probationEndDate)} />
              <Field label="Confirmation date" value={dateLabel(employment.confirmationDate)} />
              <Field label="Shift" value={employment.shift} />
              <Field label="Weekly working days" value={employment.weeklyWorkingDays} />
              <Field label="Login enabled" value={entry.accountDetails?.loginEnabled ? 'Yes' : 'No'} />
            </div>
            {entry.salaryDetails ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <Wallet size={13} /> Salary (restricted)
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Monthly salary" value={`₹${Number(entry.salaryDetails.monthlySalary || 0).toLocaleString('en-IN')}`} />
                  <Field label="Basic" value={`₹${Number(entry.salaryDetails.basic || 0).toLocaleString('en-IN')}`} />
                  <Field label="HRA" value={`₹${Number(entry.salaryDetails.hra || 0).toLocaleString('en-IN')}`} />
                </div>
              </div>
            ) : null}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Employment history</p>
              {(entry.employmentHistory || []).length === 0 ? (
                <p className="text-sm text-slate-500">No history recorded.</p>
              ) : (
                <ol className="space-y-3 border-l border-slate-200 pl-4">
                  {[...entry.employmentHistory].reverse().map((h, idx) => (
                    <li key={idx} className="relative">
                      <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-[#008C95]" />
                      <p className="text-xs font-semibold text-slate-500">{dateLabel(h.date)}</p>
                      <p className="text-sm text-slate-800">{h.description}</p>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        ) : null}

        {tab === 'Activity' ? <ActivityTab staffId={entry._id} /> : null}

        {NOT_YET_BUILT.has(tab) ? <ComingSoon tab={tab} /> : null}
      </div>
    </section>
  )
}
