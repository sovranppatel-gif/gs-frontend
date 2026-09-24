import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ClipboardList,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  UserPlus,
} from 'lucide-react'
import {
  indianStates,
  serviceTypes,
  trainingCourses,
  projectBudgets,
  studentStatuses,
} from '../../enquiry/EnquiryForm.jsx'
import {
  getEnquiries,
  createEnquiryAdmin,
  updateEnquiry,
  deleteEnquiry,
  convertEnquiryToLead,
} from '../../../services/enquiryService.js'
import {
  HEARD_ABOUT_OPTIONS,
  formatHeardAbout,
} from '../../../utils/heardAboutOptions.js'

const PAGE_SIZE = 10

function formatWhen(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return iso
  }
}

function rowId(row) {
  return row?._id != null ? String(row._id) : row?.id != null ? String(row.id) : ''
}

function toDatetimeLocalValue(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function enquiryLabel(type) {
  if (type === 'student') return 'IT Training / Course'
  if (type === 'client') return 'Project / IT Service'
  return '—'
}

const emptyAdminForm = () => ({
  source: 'home',
  enquiryType: 'client',
  fullName: '',
  companyOrCollege: '',
  workEmail: '',
  mobile: '',
  city: '',
  state: '',
  serviceRequested: '',
  projectBudget: '',
  projectDetails: '',
  courseRequested: '',
  studentStatus: '',
  trainingGoals: '',
  allowUpdates: false,
  heardAbout: '',
  heardAboutOther: '',
  submittedAt: '',
})

function rowToForm(row) {
  return {
    source: row.source === 'building-creativity' ? 'building-creativity' : 'home',
    enquiryType: row.enquiryType === 'student' ? 'student' : 'client',
    fullName: row.fullName || '',
    companyOrCollege: row.companyOrCollege || '',
    workEmail: row.workEmail || '',
    mobile: row.mobile || '',
    city: row.city || '',
    state: row.state || '',
    serviceRequested: row.serviceRequested || '',
    projectBudget: row.projectBudget || '',
    projectDetails: row.projectDetails || '',
    courseRequested: row.courseRequested || '',
    studentStatus: row.studentStatus || '',
    trainingGoals: row.trainingGoals || '',
    allowUpdates: Boolean(row.allowUpdates),
    heardAbout: row.heardAbout || '',
    heardAboutOther: row.heardAboutOther || '',
    submittedAt: toDatetimeLocalValue(row.submittedAt || row.createdAt),
  }
}

function matchesSearch(row, q) {
  if (!q.trim()) return true
  const needle = q.trim().toLowerCase()
  const blob = [
    row.fullName,
    row.companyOrCollege,
    row.workEmail,
    row.mobile,
    row.city,
    row.state,
    row.enquiryType,
    enquiryLabel(row.enquiryType),
    row.serviceRequested,
    row.projectBudget,
    row.projectDetails,
    row.courseRequested,
    row.studentStatus,
    row.trainingGoals,
    row.source,
    row.heardAbout,
    row.heardAboutOther,
    formatHeardAbout(row.heardAbout, row.heardAboutOther),
    rowId(row),
    formatWhen(row.submittedAt),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return blob.includes(needle)
}

function buildPayloadFromForm(form) {
  const payload = {
    source: form.source,
    enquiryType: form.enquiryType === 'student' ? 'student' : 'client',
    fullName: form.fullName.trim(),
    companyOrCollege: form.companyOrCollege.trim(),
    workEmail: form.workEmail.trim(),
    mobile: form.mobile.trim(),
    city: form.city.trim(),
    state: form.state.trim(),
    serviceRequested: form.serviceRequested.trim(),
    projectBudget: form.projectBudget.trim(),
    projectDetails: form.projectDetails.trim(),
    courseRequested: form.courseRequested.trim(),
    studentStatus: form.studentStatus.trim(),
    trainingGoals: form.trainingGoals.trim(),
    allowUpdates: Boolean(form.allowUpdates),
    heardAbout: form.heardAbout.trim(),
    heardAboutOther:
      form.heardAbout === 'Others' ? form.heardAboutOther.trim() : '',
  }
  if (form.submittedAt && String(form.submittedAt).trim()) {
    const d = new Date(form.submittedAt)
    if (!Number.isNaN(d.getTime())) {
      payload.submittedAt = d.toISOString()
    }
  }
  return payload
}

function EntryFormModal({ open, mode, initialForm, onClose, onSaved }) {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) {
      setForm(initialForm)
      setError('')
      setSaving(false)
    }
  }, [open, initialForm, mode])

  if (!open) return null

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const inputClass =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5E14]/25 focus:border-[#00A896]'
  const labelClass = 'mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.fullName.trim() || !form.workEmail.trim() || !form.mobile.trim()) {
      setError('Full name, email, and mobile are required.')
      return
    }
    if (form.enquiryType === 'client' && !form.serviceRequested.trim()) {
      setError('Service required is mandatory for client enquiries.')
      return
    }
    if (form.enquiryType === 'student' && !form.courseRequested.trim()) {
      setError('Course / training program is mandatory for student enquiries.')
      return
    }
    if (!form.heardAbout.trim()) {
      setError('Please select how you heard about us.')
      return
    }
    if (form.heardAbout === 'Others' && !form.heardAboutOther.trim()) {
      setError('Please specify the source when Others is selected.')
      return
    }

    const payload = buildPayloadFromForm(form)
    try {
      setSaving(true)
      if (mode === 'create') {
        await createEnquiryAdmin(payload)
      } else {
        const id = String(initialForm._id || '').trim()
        if (!id) {
          setError('Missing entry id.')
          setSaving(false)
          return
        }
        await updateEnquiry(id, payload)
      }
      onSaved?.()
      onClose()
    } catch (err) {
      setError(err?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-slate-950/50"
        onClick={() => !saving && onClose()}
      />
      <div className="relative z-10 flex max-h-[min(92vh,720px)] w-full max-w-2xl flex-col rounded-t-lg border border-slate-200 bg-white shadow-xl sm:rounded-lg">
        <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-100 px-3 py-2.5 sm:px-5">
          <h3 className="text-base font-semibold text-slate-900">
            {mode === 'create' ? 'New enquiry' : 'Edit enquiry'}
          </h3>
          <button
            type="button"
            disabled={saving}
            onClick={() => onClose()}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
            {error ? (
              <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                {error}
              </p>
            ) : null}

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Source</label>
                <select
                  className={inputClass}
                  value={form.source}
                  onChange={(e) => setField('source', e.target.value)}
                >
                  <option value="home">Home page (hero form)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Enquiry type</label>
                <select
                  className={inputClass}
                  value={form.enquiryType}
                  onChange={(e) => setField('enquiryType', e.target.value)}
                >
                  <option value="client">Project / IT Service</option>
                  <option value="student">IT Training / Course</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Full name</label>
                <input
                  className={inputClass}
                  value={form.fullName}
                  onChange={(e) => setField('fullName', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>
                  {form.enquiryType === 'client' ? 'Company / startup' : 'College / university'}
                </label>
                <input
                  className={inputClass}
                  value={form.companyOrCollege}
                  onChange={(e) => setField('companyOrCollege', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  className={inputClass}
                  value={form.workEmail}
                  onChange={(e) => setField('workEmail', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Mobile / WhatsApp</label>
                <input
                  className={inputClass}
                  value={form.mobile}
                  onChange={(e) => setField('mobile', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Submitted at</label>
                <input
                  type="datetime-local"
                  className={inputClass}
                  value={form.submittedAt}
                  onChange={(e) => setField('submittedAt', e.target.value)}
                />
                <p className="mt-1 text-[11px] text-slate-400">Leave empty on new entry to use current time.</p>
              </div>
              <div>
                <label className={labelClass}>City</label>
                <input className={inputClass} value={form.city} onChange={(e) => setField('city', e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>State</label>
                <select
                  className={inputClass}
                  value={form.state}
                  onChange={(e) => setField('state', e.target.value)}
                >
                  <option value="">Select state</option>
                  {indianStates.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {form.enquiryType === 'client' ? (
                <>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Service required</label>
                    <select
                      className={inputClass}
                      value={form.serviceRequested}
                      onChange={(e) => setField('serviceRequested', e.target.value)}
                    >
                      <option value="">Select service</option>
                      {serviceTypes.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Estimated budget</label>
                    <select
                      className={inputClass}
                      value={form.projectBudget}
                      onChange={(e) => setField('projectBudget', e.target.value)}
                    >
                      <option value="">Select budget range</option>
                      {projectBudgets.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Project summary / requirements</label>
                    <textarea
                      className={`${inputClass} min-h-[80px]`}
                      value={form.projectDetails}
                      onChange={(e) => setField('projectDetails', e.target.value)}
                      rows={3}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Course / training program</label>
                    <select
                      className={inputClass}
                      value={form.courseRequested}
                      onChange={(e) => setField('courseRequested', e.target.value)}
                    >
                      <option value="">Select course</option>
                      {trainingCourses.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Current profile status</label>
                    <select
                      className={inputClass}
                      value={form.studentStatus}
                      onChange={(e) => setField('studentStatus', e.target.value)}
                    >
                      <option value="">Select status</option>
                      {studentStatuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Career goal / motivation</label>
                    <textarea
                      className={`${inputClass} min-h-[80px]`}
                      value={form.trainingGoals}
                      onChange={(e) => setField('trainingGoals', e.target.value)}
                      rows={3}
                    />
                  </div>
                </>
              )}

              <div>
                <label className={labelClass}>How did you hear about us?</label>
                <select
                  className={inputClass}
                  value={form.heardAbout}
                  onChange={(e) => {
                    const value = e.target.value
                    setForm((f) => ({
                      ...f,
                      heardAbout: value,
                      heardAboutOther: value === 'Others' ? f.heardAboutOther : '',
                    }))
                  }}
                  required
                >
                  <option value="">Select a source</option>
                  {HEARD_ABOUT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              {form.heardAbout === 'Others' ? (
                <div>
                  <label className={labelClass}>Please specify source</label>
                  <input
                    className={inputClass}
                    value={form.heardAboutOther}
                    onChange={(e) => setField('heardAboutOther', e.target.value.slice(0, 200))}
                    placeholder="Write your source"
                    required
                  />
                </div>
              ) : (
                <div className="hidden sm:block" aria-hidden />
              )}

              <div className="sm:col-span-2 flex flex-wrap gap-4 pt-1">
                <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={form.allowUpdates}
                    onChange={(e) => setField('allowUpdates', e.target.checked)}
                    className="rounded border-slate-300 text-[#008C95] focus:ring-[#FF5E14]/25"
                  />
                  WhatsApp / email updates consent
                </label>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-slate-100 bg-slate-50/80 px-3 py-2.5 sm:px-5">
            <button
              type="button"
              disabled={saving}
              onClick={() => onClose()}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-gradient-to-r from-[#FF5E14] via-[#FF7A00] to-[#008C95] px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
            >
              {saving ? 'Saving…' : mode === 'create' ? 'Create entry' : 'Update entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function EnquiryManagementPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdatedAt, setLastUpdatedAt] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [editPayload, setEditPayload] = useState(() => ({ ...emptyAdminForm(), _id: '' }))

  const reload = useCallback(async () => {
    try {
      setError('')
      const data = await getEnquiries()
      setRows(data)
      setLastUpdatedAt(new Date().toISOString())
    } catch (err) {
      setError(err?.message || 'Unable to load submissions')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  useEffect(() => {
    setPage(1)
  }, [searchQuery])

  const filteredRows = useMemo(
    () => rows.filter((row) => matchesSearch(row, searchQuery)),
    [rows, searchQuery]
  )

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))

  useEffect(() => {
    setPage((p) => Math.min(p, totalPages))
  }, [totalPages])

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredRows.slice(start, start + PAGE_SIZE)
  }, [filteredRows, page])

  const openCreate = () => {
    setModalMode('create')
    setEditPayload({ ...emptyAdminForm(), _id: '' })
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setModalMode('edit')
    setEditPayload({ ...rowToForm(row), _id: rowId(row) })
    setModalOpen(true)
  }

  const handleDelete = async (row) => {
    const id = rowId(row)
    if (!id) return
    const ok = window.confirm(
      `Delete application for “${row.fullName || row.workEmail || 'this entry'}”? This cannot be undone.`
    )
    if (!ok) return
    try {
      setLoading(true)
      await deleteEnquiry(id)
      await reload()
    } catch (err) {
      setError(err?.message || 'Delete failed')
      setLoading(false)
    }
  }

  const handleConvertToLead = async (row) => {
    const id = rowId(row)
    if (!id) return
    try {
      const result = await convertEnquiryToLead(id)
      await reload()
      if (result.created) {
        window.alert(`Lead created for “${row.fullName || 'enquiry'}”. Check the Leads section.`)
      } else {
        window.alert('This enquiry is already linked to a lead.')
      }
    } catch (err) {
      setError(err?.message || 'Convert to lead failed')
    }
  }

  const rangeLabel =
    filteredRows.length === 0
      ? '0 entries'
      : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filteredRows.length)} of ${filteredRows.length}`

  return (
    <section className="space-y-3">
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#00A896]/10 text-[#008C95]">
              <ClipboardList size={18} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">Enquiry Management</p>
              <p className="text-xs text-slate-500">
                Landing page enquiries from Connect With Grow Skills Tech (client &amp; student) appear here live.
                New enquiries auto-create a Lead for the counsellor pipeline.
              </p>
              {lastUpdatedAt ? (
                <p className="mt-1 text-[11px] text-slate-400">Last loaded: {formatWhen(lastUpdatedAt)}</p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2 sm:shrink-0">
            <button
              type="button"
              onClick={() => {
                setLoading(true)
                reload()
              }}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-white"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF5E14] via-[#FF7A00] to-[#008C95] px-3 py-2 text-xs font-medium text-white hover:opacity-90"
            >
              <Plus size={16} />
              New entry
            </button>
          </div>
        </div>

        <div className="relative mt-4">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email, phone, service, course, city, source, heard about…"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#00A896] focus:outline-none focus:ring-2 focus:ring-[#FF5E14]/25/20"
            autoComplete="off"
          />
        </div>
      </div>

      {loading ? (
        <article className="rounded-lg border border-dashed border-[#c5ddd9] bg-white/80 p-4 text-center text-sm text-slate-600">
          Loading submissions...
        </article>
      ) : error ? (
        <article className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-900">
          {error}
        </article>
      ) : filteredRows.length === 0 ? (
        <article className="rounded-lg border border-dashed border-[#c5ddd9] bg-white/80 p-4 text-center text-sm text-slate-600">
          {rows.length === 0
            ? 'No submissions yet. Use New entry or wait for public form submissions.'
            : 'No entries match your search. Try a different keyword.'}
        </article>
      ) : (
        <>
          <div className="space-y-3">
            {paginatedRows.map((row) => {
              const isClient = row.enquiryType !== 'student'
              return (
                <article
                  key={rowId(row)}
                  className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-semibold text-slate-900">{row.fullName || '—'}</p>
                      <p className="text-sm text-[#008C95]">{row.workEmail || '—'}</p>
                      {row.companyOrCollege ? (
                        <p className="mt-0.5 text-xs text-slate-500">{row.companyOrCollege}</p>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <div className="text-right text-xs text-slate-500 sm:mr-2">
                        <p>{formatWhen(row.submittedAt)}</p>
                        <p className="mt-1 flex flex-wrap justify-end gap-1">
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                            {row.source === 'building-creativity' ? 'Legacy page' : 'Home page'}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 font-medium ${
                              isClient
                                ? 'bg-orange-50 text-orange-800'
                                : 'bg-teal-50 text-teal-800'
                            }`}
                          >
                            {enquiryLabel(row.enquiryType)}
                          </span>
                          {row.leadId ? (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-800">
                              In Leads
                            </span>
                          ) : (
                            <span className="rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-800">
                              Not in Leads
                            </span>
                          )}
                        </p>
                      </div>
                      {!row.leadId ? (
                        <button
                          type="button"
                          onClick={() => handleConvertToLead(row)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#00A896]/40 bg-[#00A896]/10 px-3 py-1.5 text-xs font-medium text-[#008C95] hover:bg-[#00A896]/20"
                        >
                          <UserPlus size={14} />
                          Convert to Lead
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-[#008C95] hover:bg-[#00A896]/10"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(row)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>

                  <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                    {[
                      ['Mobile / WhatsApp', row.mobile],
                      ['City', row.city],
                      ['State', row.state],
                      [
                        'Heard about us',
                        formatHeardAbout(row.heardAbout, row.heardAboutOther) || '—',
                      ],
                      ['WhatsApp/Email updates', row.allowUpdates ? 'Yes' : 'No'],
                      ...(isClient
                        ? [
                            ['Service required', row.serviceRequested],
                            ['Budget range', row.projectBudget],
                          ]
                        : [
                            ['Course / training', row.courseRequested],
                            ['Profile status', row.studentStatus],
                          ]),
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
                        <dd className="mt-0.5 text-slate-800">{value || '—'}</dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {isClient ? 'Project summary / requirements' : 'Career goal / motivation'}
                    </p>
                    <p className="mt-1 text-sm whitespace-pre-wrap text-slate-700">
                      {(isClient ? row.projectDetails : row.trainingGoals) || '—'}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="flex flex-col items-stretch justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 sm:flex-row sm:items-center">
            <p className="text-sm text-slate-600">
              Showing <span className="font-semibold text-slate-900">{rangeLabel}</span>
              {searchQuery.trim() ? (
                <span className="text-slate-500"> (filtered from {rows.length} total)</span>
              ) : null}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <span className="px-2 text-sm text-slate-600">
                Page <span className="font-semibold text-slate-900">{page}</span> of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      <EntryFormModal
        key={modalOpen ? `${modalMode}-${editPayload._id || 'new'}` : 'closed'}
        open={modalOpen}
        mode={modalMode}
        initialForm={editPayload}
        onClose={() => setModalOpen(false)}
        onSaved={reload}
      />
    </section>
  )
}
