import { useEffect, useMemo, useState } from 'react'
import { Calendar, Check, Copy, Download, Edit3, Link2, Plus, RefreshCw, Search, Trash2, Users, X } from 'lucide-react'
import {
  StatCard,
  DataTable,
  EmptyState,
  SkeletonBlock,
  downloadCsv,
} from '../shared/MasterAdminUI.jsx'
import {
  getWorkshopRegistrations,
  updateWorkshopRegistrationStatus,
  createReferralLink,
  updateReferralLink,
  getReferralLinks,
  deleteReferralLink,
} from '../../../services/workshopService.js'

const ALL = ''
const NO_REFERRAL_LABEL = 'Direct (No Referral)'

/** Live preview only — backend re-derives/validates the real code on save. */
function suggestReferralCode(collegeName) {
  return String(collegeName || '')
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 40)
}

function formatDate(value) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return '—'
  }
}

function formatDateInput(value) {
  if (!value) return ''
  const [year, month, day] = value.split('-')
  return year && month && day ? `${day}-${month}-${year}` : value
}

function parseDateInput(value) {
  const match = String(value || '').match(/^(\d{2})-(\d{2})-(\d{4})$/)
  if (!match) return value
  const [, day, month, year] = match
  const date = new Date(`${year}-${month}-${day}T00:00:00`)
  if (date.getFullYear() !== Number(year) || date.getMonth() + 1 !== Number(month) || date.getDate() !== Number(day)) {
    return value
  }
  return `${year}-${month}-${day}`
}

function formatTypedDate(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 2) return digits
  if (digits.length <= 4) return `${digits.slice(0, 2)}-${digits.slice(2)}`
  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`
}

function DateField({ value, onChange }) {
  const [displayValue, setDisplayValue] = useState(formatDateInput(value))

  useEffect(() => {
    setDisplayValue(formatDateInput(value))
  }, [value])

  const handleTextChange = (nextValue) => {
    const formatted = formatTypedDate(nextValue)
    setDisplayValue(formatted)
    const parsed = parseDateInput(formatted)
    if (/^\d{2}-\d{2}-\d{4}$/.test(formatted) && parsed !== formatted) return
    if (parsed === '' || parsed !== formatted) onChange(parsed)
  }

  const handleBlur = () => {
    if (!displayValue) {
      onChange('')
      return
    }
    const parsed = parseDateInput(displayValue)
    if (parsed !== displayValue) {
      setDisplayValue(formatDateInput(value))
      return
    }
    onChange(parsed)
  }

  return (
    <div className="relative">
      <input
        type="text"
        inputMode="numeric"
        placeholder="dd-mm-yyyy"
        value={displayValue}
        onChange={(e) => handleTextChange(e.target.value)}
        onBlur={handleBlur}
        maxLength={10}
        className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm outline-none focus:border-[#00A896]"
      />
      <Calendar size={16} className="pointer-events-none absolute right-3 top-3 text-slate-500" />
      <input
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Open calendar"
        className="absolute right-2 top-2 h-6 w-6 cursor-pointer opacity-0"
      />
    </div>
  )
}

const selectClass =
  'h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#00A896] sm:w-auto'

export default function WorkshopRegistrationsPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')

  const [search, setSearch] = useState('')
  const [referralFilter, setReferralFilter] = useState(ALL)
  const [collegeFilter, setCollegeFilter] = useState(ALL)
  const [courseFilter, setCourseFilter] = useState(ALL)
  const [semesterFilter, setSemesterFilter] = useState(ALL)
  const [statusFilter, setStatusFilter] = useState(ALL)

  const [links, setLinks] = useState([])
  const [linksLoading, setLinksLoading] = useState(true)
  const [showLinkForm, setShowLinkForm] = useState(false)
  const [linkCollegeName, setLinkCollegeName] = useState('')
  const [linkCode, setLinkCode] = useState('')
  const [linkWorkshopName, setLinkWorkshopName] = useState('Skills Enhance Workshop')
  const [linkWorkshopPlace, setLinkWorkshopPlace] = useState('')
  const [linkWorkshopStartDate, setLinkWorkshopStartDate] = useState('')
  const [linkWorkshopEndDate, setLinkWorkshopEndDate] = useState('')
  const [linkStartTime, setLinkStartTime] = useState('')
  const [linkEndTime, setLinkEndTime] = useState('')
  const [editingLinkId, setEditingLinkId] = useState('')
  const [codeTouched, setCodeTouched] = useState(false)
  const [creatingLink, setCreatingLink] = useState(false)
  const [linkError, setLinkError] = useState('')
  const [copiedCode, setCopiedCode] = useState('')

  const load = async ({ silent = false } = {}) => {
    if (!silent) setLoading(true)
    setError('')
    try {
      const data = await getWorkshopRegistrations()
      setRows(data)
    } catch (err) {
      setError(err?.message || 'Unable to load workshop registrations')
    } finally {
      setLoading(false)
    }
  }

  const loadLinks = async ({ silent = false } = {}) => {
    if (!silent) setLinksLoading(true)
    try {
      const data = await getReferralLinks()
      setLinks(data)
    } catch (err) {
      setError(err?.message || 'Unable to load referral links')
    } finally {
      setLinksLoading(false)
    }
  }

  useEffect(() => {
    load()
    loadLinks()
  }, [])

  useEffect(() => {
    const refreshInBackground = () => {
      if (document.visibilityState !== 'hidden') {
        load({ silent: true })
        loadLinks({ silent: true })
      }
    }

    const intervalId = window.setInterval(refreshInBackground, 5000)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') refreshInBackground()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2500)
    return () => clearTimeout(t)
  }, [toast])

  const referralOptions = useMemo(() => {
    const set = new Set()
    rows.forEach((r) => set.add(r.referralCode || NO_REFERRAL_LABEL))
    return Array.from(set).sort()
  }, [rows])

  const collegeOptions = useMemo(() => {
    const set = new Set()
    rows.forEach((r) => {
      const name = r.collegeName || ''
      if (name) set.add(name)
    })
    return Array.from(set).sort()
  }, [rows])

  const courseOptions = useMemo(() => {
    const set = new Set()
    rows.forEach((r) => r.course && set.add(r.course))
    return Array.from(set).sort()
  }, [rows])

  const semesterOptions = useMemo(() => {
    const set = new Set()
    rows.forEach((r) => r.semesterYear && set.add(r.semesterYear))
    return Array.from(set).sort()
  }, [rows])

  const referralSummary = useMemo(() => {
    const counts = new Map()
    rows.forEach((r) => {
      const key = r.referralCode || NO_REFERRAL_LABEL
      counts.set(key, (counts.get(key) || 0) + 1)
    })
    return Array.from(counts.entries())
      .map(([code, count]) => ({ code, count }))
      .sort((a, b) => b.count - a.count)
  }, [rows])

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter((r) => {
      if (referralFilter && (r.referralCode || NO_REFERRAL_LABEL) !== referralFilter) return false
      if (collegeFilter && r.collegeName !== collegeFilter) return false
      if (courseFilter && r.course !== courseFilter) return false
      if (semesterFilter && r.semesterYear !== semesterFilter) return false
      if (statusFilter && r.status !== statusFilter) return false
      if (q) {
        const hay = `${r.fullName} ${r.email} ${r.mobile} ${r.registrationId}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [rows, search, referralFilter, collegeFilter, courseFilter, semesterFilter, statusFilter])

  const handleStatusChange = async (row, status) => {
    try {
      await updateWorkshopRegistrationStatus(row._id, status)
      setRows((prev) => prev.map((r) => (r._id === row._id ? { ...r, status } : r)))
      setToast(`${row.registrationId} marked ${status}`)
    } catch (err) {
      setError(err?.message || 'Unable to update status')
    }
  }

  const handleExportCsv = () => {
    downloadCsv(
      'workshop-registrations.csv',
      [
        { key: 'registrationId', label: 'Registration ID' },
        { key: 'fullName', label: 'Student Name' },
        { key: 'mobile', label: 'Mobile' },
        { key: 'email', label: 'Email' },
        { key: 'collegeName', label: 'College' },
        { key: 'course', label: 'Course' },
        { key: 'semesterYear', label: 'Semester/Year' },
        { key: 'referralCode', label: 'Referral Code' },
        { key: 'status', label: 'Status' },
        { key: 'createdAtLabel', label: 'Registration Date' },
      ],
      filteredRows.map((r) => ({ ...r, createdAtLabel: formatDate(r.createdAt) }))
    )
    setToast('Workshop registrations CSV downloaded')
  }

  const buildWorkshopUrl = (code) => `${window.location.origin}/workshop?ref=${encodeURIComponent(code)}`

  const handleCollegeNameChange = (value) => {
    setLinkCollegeName(value)
    if (!codeTouched) {
      setLinkCode(suggestReferralCode(value))
    }
  }

  const handleCodeChange = (value) => {
    setCodeTouched(true)
    setLinkCode(value.toUpperCase())
  }

  const resetLinkForm = () => {
    setLinkCollegeName('')
    setLinkCode('')
    setLinkWorkshopName('Skills Enhance Workshop')
    setLinkWorkshopPlace('')
    setLinkWorkshopStartDate('')
    setLinkWorkshopEndDate('')
    setLinkStartTime('')
    setLinkEndTime('')
    setEditingLinkId('')
    setCodeTouched(false)
    setLinkError('')
    setShowLinkForm(false)
  }

  const handleCreateLink = async (e) => {
    e.preventDefault()
    if (creatingLink) return
    if (!linkCollegeName.trim() || !linkWorkshopName.trim()) {
      setLinkError('Please enter the college name.')
      return
    }
    setLinkError('')
    setCreatingLink(true)
    const isEditing = Boolean(editingLinkId)
    try {
      const payload = {
        collegeName: linkCollegeName.trim(),
        referralCode: linkCode.trim() || undefined,
        workshopName: linkWorkshopName.trim(),
        workshopPlace: linkWorkshopPlace.trim(),
        workshopStartDate: linkWorkshopStartDate,
        workshopEndDate: linkWorkshopEndDate,
        startTime: linkStartTime,
        endTime: linkEndTime,
      }
      const entry = editingLinkId
        ? await updateReferralLink(editingLinkId, payload)
        : await createReferralLink(payload)
      setLinks((prev) => editingLinkId
        ? prev.map((link) => (link._id === editingLinkId ? { ...link, ...entry } : link))
        : [{ ...entry, registrationCount: 0 }, ...prev])
      resetLinkForm()
      setToast(isEditing ? 'Workshop details updated' : `Referral link created for ${entry.collegeName}`)
      if (!isEditing) handleCopyLink(entry.referralCode)
    } catch (err) {
      setLinkError(err?.message || 'Unable to create referral link')
    } finally {
      setCreatingLink(false)
    }
  }

  const startEditingLink = (link) => {
    setEditingLinkId(link._id)
    setLinkCollegeName(link.collegeName || '')
    setLinkCode(link.referralCode || '')
    setLinkWorkshopName(link.workshopName || 'Skills Enhance Workshop')
    setLinkWorkshopPlace(link.workshopPlace || '')
    setLinkWorkshopStartDate(link.workshopStartDate || link.workshopDate || '')
    setLinkWorkshopEndDate(link.workshopEndDate || link.workshopDate || '')
    setLinkStartTime(link.startTime || '')
    setLinkEndTime(link.endTime || '')
    setCodeTouched(true)
    setLinkError('')
    setShowLinkForm(true)
  }

  const handleCopyLink = async (code) => {
    const url = buildWorkshopUrl(code)
    try {
      await navigator.clipboard.writeText(url)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(''), 2000)
    } catch {
      setLinkError('Could not copy automatically — please copy the link manually.')
    }
  }

  const handleDeleteLink = async (link) => {
    if (!window.confirm(`Delete referral link "${link.referralCode}" for ${link.collegeName}? Existing registrations already using this code are kept.`)) {
      return
    }
    try {
      await deleteReferralLink(link._id)
      setLinks((prev) => prev.filter((l) => l._id !== link._id))
      setToast('Referral link deleted')
    } catch (err) {
      setError(err?.message || 'Unable to delete referral link')
    }
  }

  const columns = [
    { key: 'registrationId', label: 'Reg. ID' },
    { key: 'fullName', label: 'Name' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'email', label: 'Email' },
    { key: 'collegeName', label: 'College' },
    { key: 'course', label: 'Course' },
    { key: 'semesterYear', label: 'Sem/Year' },
    {
      key: 'referralCode',
      label: 'Referral',
      render: (row) => (
        <span className="inline-flex rounded-full bg-[#FF5E14]/10 px-2 py-0.5 text-[11px] font-semibold text-[#FF5E14]">
          {row.referralCode || NO_REFERRAL_LABEL}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row, e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 outline-none focus:border-[#00A896]"
        >
          {['Registered', 'Verified', 'Approved', 'Rejected'].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      ),
    },
    {
      key: 'createdAt',
      label: 'Registered On',
      render: (row) => <span className="text-xs text-slate-500">{formatDate(row.createdAt)}</span>,
    },
  ]

  return (
    <section className="w-full min-w-0 space-y-4 overflow-x-hidden">
      {toast ? (
        <div className="fixed right-3 top-3 z-[90] max-w-[calc(100vw-1.5rem)] rounded-lg bg-[#008C95] px-4 py-2 text-sm font-medium text-white shadow-lg sm:right-4 sm:top-4">
          {toast}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {/* Referral Links */}
      <div className="rounded-lg border border-slate-200 bg-white p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#00A896]/10 text-[#008C95]">
              <Link2 size={15} />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">College Referral Links</h3>
              <p className="text-xs text-slate-500">Generate a shareable /workshop link for each college.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowLinkForm((s) => !s)}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#FF5E14] px-3 text-sm font-semibold text-white hover:bg-[#ff7a2d] transition"
          >
            {showLinkForm ? <X size={14} /> : <Plus size={14} />}
            {showLinkForm ? 'Cancel' : 'Create Referral Link'}
          </button>
        </div>

        {showLinkForm ? (
          <form onSubmit={handleCreateLink} className="mt-3 grid gap-2 rounded-lg border border-slate-100 bg-slate-50/60 p-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500">
                College Name
              </label>
              <input
                autoFocus
                value={linkCollegeName}
                onChange={(e) => handleCollegeNameChange(e.target.value)}
                placeholder="e.g. Swami Vivekanand Govt. PG College"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#00A896]"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500">Workshop Name</label>
              <input value={linkWorkshopName} onChange={(e) => setLinkWorkshopName(e.target.value)} placeholder="e.g. AI Career Workshop" className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#00A896]" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500">Place</label>
              <input value={linkWorkshopPlace} onChange={(e) => setLinkWorkshopPlace(e.target.value)} placeholder="e.g. MIMT NSP Campus" className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#00A896]" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500">Workshop Start Date</label>
              <DateField value={linkWorkshopStartDate} onChange={setLinkWorkshopStartDate} />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500">Workshop End Date</label>
              <DateField value={linkWorkshopEndDate} onChange={setLinkWorkshopEndDate} />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500">Start Time</label>
              <input type="time" value={linkStartTime} onChange={(e) => setLinkStartTime(e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#00A896]" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500">End Time</label>
              <input type="time" value={linkEndTime} onChange={(e) => setLinkEndTime(e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#00A896]" />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500">
                Referral Code (auto-suggested, editable)
              </label>
              <input
                value={linkCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="e.g. SVPGC2026"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-mono outline-none focus:border-[#00A896]"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={creatingLink}
                className="h-10 w-full rounded-lg bg-[#06151C] px-4 text-sm font-semibold text-white hover:bg-[#0a1f2e] disabled:opacity-60 sm:w-auto"
              >
                {creatingLink ? (editingLinkId ? 'Saving…' : 'Creating…') : (editingLinkId ? 'Save Changes' : 'Generate Link')}
              </button>
            </div>
            {linkError ? (
              <p className="sm:col-span-2 lg:col-span-4 text-xs text-rose-600">{linkError}</p>
            ) : null}
          </form>
        ) : null}

        <div className="mt-3">
          {linksLoading ? (
            <SkeletonBlock className="h-16" />
          ) : links.length === 0 ? (
            <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50/60 px-3 py-4 text-center text-xs text-slate-500">
              No referral links yet — create one above to get a shareable /workshop?ref=... URL for a college.
            </p>
          ) : (
            <div className="space-y-2">
              {links.map((link) => (
                <div
                  key={link._id}
                  className="flex flex-col gap-2 rounded-lg border border-slate-100 bg-slate-50/50 p-2.5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-slate-800">{link.collegeName}</span>
                      <span className="inline-flex rounded-full bg-[#FF5E14]/10 px-2 py-0.5 text-[11px] font-semibold text-[#FF5E14]">
                        {link.referralCode}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {link.registrationCount} registration{link.registrationCount === 1 ? '' : 's'}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs font-medium text-slate-700">{link.workshopName || 'Skills Enhance Workshop'}</p>
                    {link.workshopPlace ? <p className="text-[11px] text-slate-500">Place: {link.workshopPlace}</p> : null}
                    {(link.workshopStartDate || link.workshopEndDate || link.startTime || link.endTime) ? (
                      <p className="text-[11px] text-slate-500">
                        {link.workshopStartDate || 'Date not set'}{link.workshopEndDate ? ` - ${link.workshopEndDate}` : ''}{link.startTime ? ` • ${link.startTime}` : ''}{link.endTime ? ` - ${link.endTime}` : ''}
                      </p>
                    ) : null}
                    <p className="mt-0.5 truncate text-xs text-slate-500">{buildWorkshopUrl(link.referralCode)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEditingLink(link)}
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-600 hover:border-[#00A896]/40 hover:text-[#00A896]"
                    >
                      <Edit3 size={13} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyLink(link.referralCode)}
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-600 hover:border-[#00A896]/40 hover:text-[#00A896]"
                    >
                      {copiedCode === link.referralCode ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                      {copiedCode === link.referralCode ? 'Copied' : 'Copy Link'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLink(link)}
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-500 hover:border-rose-300 hover:text-rose-600"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Referral Summary */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBlock key={i} className="h-20" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total Registrations" value={rows.length} icon={Users} />
          {referralSummary.slice(0, 7).map((item) => (
            <StatCard key={item.code} label={item.code} value={item.count} icon={Users} />
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-2.5 sm:flex-row sm:flex-wrap sm:items-center">
        <label className="flex h-10 w-full min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 sm:max-w-xs">
          <Search size={15} className="shrink-0 text-[#FF5E14]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, mobile, email, reg. id..."
            className="w-full min-w-0 bg-transparent text-slate-800 outline-none placeholder:text-slate-400"
          />
        </label>

        <select value={referralFilter} onChange={(e) => setReferralFilter(e.target.value)} className={selectClass}>
          <option value={ALL}>All Referrals</option>
          {referralOptions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select value={collegeFilter} onChange={(e) => setCollegeFilter(e.target.value)} className={selectClass}>
          <option value={ALL}>All Colleges</option>
          {collegeOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className={selectClass}>
          <option value={ALL}>All Courses</option>
          {courseOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)} className={selectClass}>
          <option value={ALL}>All Semesters/Years</option>
          {semesterOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
          <option value={ALL}>All Status</option>
          {['Registered', 'Verified', 'Approved', 'Rejected'].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <div className="flex w-full gap-2 sm:w-auto">
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex h-10 flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 hover:border-[#00A896]/40 hover:text-[#00A896] disabled:opacity-50 sm:flex-none"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={!filteredRows.length}
            className="inline-flex h-10 flex-1 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 hover:border-[#FF5E14]/40 hover:text-[#FF5E14] disabled:opacity-50 sm:flex-none"
          >
            <Download size={14} /> CSV
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <SkeletonBlock className="h-64" />
      ) : filteredRows.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No workshop registrations found"
          description="Try adjusting search or filters, or share the public /workshop link to start collecting registrations."
        />
      ) : (
        <DataTable columns={columns} rows={filteredRows} />
      )}
    </section>
  )
}
