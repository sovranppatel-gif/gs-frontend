import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Building2, Pencil, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react'
import {
  activateUniversity,
  createUniversity,
  deleteUniversity,
  getUniversities,
  updateUniversity,
} from '../../../services/universityService.js'
import { printUniversityDirectory } from '../../../utils/printUniversityDirectory.js'
import {
  DataTable,
  Pagination,
  PageToolbar,
  Panel,
  PrimaryButton,
  SecondaryButton,
  StatCard,
  StatusBadge,
  downloadCsv,
} from '../shared/MasterAdminUI.jsx'
import { SkeletonBlock } from '../../students/shared/StudentUI.jsx'

const columns = [
  { key: 'name', label: 'University' },
  { key: 'shortName', label: 'Short Name' },
  { key: 'registrationNumber', label: 'Registration No.' },
  { key: 'affiliationNumber', label: 'Affiliation No.' },
  { key: 'city', label: 'City' },
  { key: 'status', label: 'Status' },
]

// Broader field set for exports than what's on screen — matches the pattern
// FacultyPage.jsx uses (separate exportColumns), and covers what Phase 20 of
// the audit asked for without dumping internal bookkeeping fields.
const exportColumns = [
  { key: 'name', label: 'University Name' },
  { key: 'shortName', label: 'Short Name' },
  { key: 'registrationNumber', label: 'Registration Number' },
  { key: 'affiliationNumber', label: 'Affiliation Number' },
  { key: 'contactEmail', label: 'Contact Email' },
  { key: 'contactPhone', label: 'Phone' },
  { key: 'website', label: 'Website' },
  { key: 'city', label: 'City' },
  { key: 'state', label: 'State' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Created Date' },
]

const emptyForm = {
  name: '',
  shortName: '',
  universityCode: '',
  registrationNumber: '',
  affiliationNumber: '',
  city: '',
  state: '',
  contactPerson: '',
  contactPhone: '',
  contactEmail: '',
  website: '',
  status: 'Active',
  remarks: '',
}

function mapFormToPayload(form) {
  return { ...form }
}

function mapRowToForm(row) {
  return {
    name: row.name || '',
    shortName: row.shortName || '',
    universityCode: row.universityCode || '',
    registrationNumber: row.registrationNumber || '',
    affiliationNumber: row.affiliationNumber || '',
    city: row.city || '',
    state: row.state || '',
    contactPerson: row.contactPerson || '',
    contactPhone: row.contactPhone || '',
    contactEmail: row.contactEmail || '',
    website: row.website || '',
    status: row.status || 'Active',
    remarks: row.remarks || '',
  }
}

function Field({ label, required, children }) {
  return (
    <div className="space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
        {required ? <span className="ml-0.5 text-rose-500">*</span> : null}
      </span>
      {children}
    </div>
  )
}

function inputClassName(type = 'input') {
  const base =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#00A896] focus:ring-2 focus:ring-[#00A896]/15'
  if (type === 'textarea') return `${base} min-h-24 resize-y`
  return base
}

export default function UniversitiesPage() {
  const [rows, setRows] = useState([])
  const [stats, setStats] = useState({})
  const [pagination, setPagination] = useState({ page: 1, limit: 8, total: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState('')
  const [exporting, setExporting] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const formRef = useRef(null)

  // 300ms debounce — typing "RDVV" fires one request, not four (Phase 31).
  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(search), 300)
    return () => window.clearTimeout(t)
  }, [search])

  const closeForm = () => {
    setFormOpen(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const openForm = (nextForm = emptyForm, id = null) => {
    setEditingId(id)
    setForm(nextForm)
    setError('')
    setFormOpen(true)
    window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  // requestId guards against a slow, stale response (e.g. an earlier search
  // keystroke) overwriting the rows/pagination a newer request already
  // resolved — the classic race a debounced search can otherwise hit.
  const requestId = useRef(0)

  // reload() with no page argument should mean "reload whatever page we're
  // currently on" (used after edit/activate/deactivate/refresh). A default
  // parameter of `pagination.page` would close over a stale value whenever
  // reload isn't recreated on every page change — this ref is always current.
  const pageRef = useRef(1)

  const reload = useCallback(
    async (page) => {
      const targetPage = page ?? pageRef.current
      const thisRequest = ++requestId.current
      setLoading(true)
      try {
        setError('')
        const data = await getUniversities({ page: targetPage, limit: pagination.limit, search: debouncedSearch, status })
        if (thisRequest !== requestId.current) return // a newer request already landed
        pageRef.current = data.pagination?.page || targetPage
        setRows(data.rows)
        setStats(data.stats || {})
        setPagination(data.pagination)
      } catch (err) {
        if (thisRequest !== requestId.current) return
        setError(err?.message || 'Unable to load universities')
        setRows([])
        setStats({})
      } finally {
        if (thisRequest === requestId.current) setLoading(false)
      }
    },
    // pagination.page deliberately excluded — see pageRef above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedSearch, status, pagination.limit],
  )

  useEffect(() => {
    reload(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, status])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(timer)
  }, [toast])

  const filterOptions = useMemo(() => ['Active', 'Inactive', 'Draft'], [])
  const hasActiveFilters = Boolean(search || status)

  const clearFilters = () => {
    setSearch('')
    setStatus('')
  }

  const tableColumns = [
    {
      key: 'name',
      label: 'University',
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">{row.name}</p>
          <p className="truncate text-xs text-slate-500">
            {row.universityCode || 'Code pending'} · {row.city}, {row.state}
          </p>
        </div>
      ),
    },
    ...columns.slice(1).map((col) =>
      col.key === 'status' ? { ...col, render: (row) => <StatusBadge status={row.status} /> } : col,
    ),
    {
      key: '_actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex w-full flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => {
              openForm(mapRowToForm(row), row._id)
            }}
            className="inline-flex items-center gap-1 rounded-full border border-[#008C95]/30 bg-[#008C95]/10 px-2.5 py-1 text-xs font-semibold text-[#008C95] transition hover:bg-[#008C95]/15"
          >
            <Pencil size={12} /> Edit
          </button>
          {row.status === 'Inactive' ? (
            <button
              type="button"
              onClick={async () => {
                try {
                  await activateUniversity(row._id)
                  setToast('University activated')
                  await reload()
                } catch (err) {
                  setError(err?.message || 'Activate failed')
                }
              }}
              className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
            >
              <ShieldCheck size={12} /> Activate
            </button>
          ) : (
            <button
              type="button"
              onClick={async () => {
                const ok = window.confirm(
                  `${row.shortName || row.name} ko Inactive karein?\n\nYeh database me rahegi — purane students ke data ke liye. Status Inactive dikhega.`,
                )
                if (!ok) return
                try {
                  await deleteUniversity(row._id)
                  setToast('University marked Inactive (saved in database)')
                  await reload()
                } catch (err) {
                  setError(err?.message || 'Deactivate failed')
                }
              }}
              className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-100"
            >
              <Trash2 size={12} /> Deactivate
            </button>
          )}
        </div>
      ),
    },
  ]

  const topUniversities = useMemo(() => rows.slice(0, 3), [rows])

  const handleAdd = () => {
    openForm(emptyForm, null)
  }

  const handleSave = async () => {
    setError('')
    if (!form.name.trim()) return setError('University name is required')
    if (!form.shortName.trim()) return setError('Short name is required')
    if (!form.registrationNumber.trim()) return setError('Registration number is required')

    setSaving(true)
    try {
      const payload = mapFormToPayload(form)
      if (editingId) {
        await updateUniversity(editingId, payload)
        setToast('University updated')
      } else {
        await createUniversity(payload)
        setToast('University added')
      }
      setFormOpen(false)
      setEditingId(null)
      setForm(emptyForm)
      await reload()
    } catch (err) {
      // Backend already returns a specific sentence for 409 (duplicate short
      // name / registration number), 400 (validation) etc. — surfaced as-is
      // rather than a blanket "save failed".
      setError(err?.message || 'Unable to save university')
    } finally {
      setSaving(false)
    }
  }

  // Export pulls the complete filtered set from the backend (no page/limit —
  // see universityService.getUniversities), not just the rows on screen, so
  // the file matches what the search/filter says exists, not one page of it.
  const fetchAllFiltered = async () => {
    const data = await getUniversities({ search: debouncedSearch, status })
    return data.rows
  }

  const handleExportCsv = async () => {
    setExporting(true)
    try {
      const allRows = await fetchAllFiltered()
      downloadCsv('universities.csv', exportColumns, allRows)
      setToast('Universities CSV downloaded')
    } catch (err) {
      setError(err?.message || 'Unable to export universities')
    } finally {
      setExporting(false)
    }
  }

  const handleExportPdf = async () => {
    setExporting(true)
    try {
      const allRows = await fetchAllFiltered()
      printUniversityDirectory(allRows)
    } catch (err) {
      setError(err?.message || 'Unable to prepare the PDF export')
    } finally {
      setExporting(false)
    }
  }

  return (
    <section className="w-full min-w-0 space-y-3 overflow-x-hidden">
      {toast ? (
        <div className="fixed right-3 top-3 z-[90] max-w-[calc(100vw-1.5rem)] rounded-lg bg-[#008C95] px-4 py-2 text-sm font-medium text-white shadow-lg sm:right-4 sm:top-4">
          {toast}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
        <StatCard label="Total Universities" value={loading ? '—' : String(stats.total ?? 0)} icon={Building2} />
        <StatCard label="Active" value={loading ? '—' : String(stats.active ?? 0)} icon={ShieldCheck} hint="Currently in use" />
        <StatCard label="Inactive" value={loading ? '—' : String(stats.inactive ?? 0)} hint="Hidden but kept in DB" />
        <StatCard label="Draft" value={loading ? '—' : String(stats.draft ?? 0)} hint="Not published yet" />
      </div>

      {error ? (
        <article className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
          {error}
        </article>
      ) : null}

      <PageToolbar
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search universities…"
        filters={filterOptions}
        filterValue={status}
        onFilter={setStatus}
        addLabel="Add University"
        onAdd={handleAdd}
        onExportCsv={handleExportCsv}
        onExportPdf={handleExportPdf}
        extraActions={
          <button
            type="button"
            onClick={() => reload()}
            disabled={loading}
            className="inline-flex h-10 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 hover:border-[#FF5E14]/40 hover:text-[#FF5E14] disabled:opacity-50"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        }
      />
      {exporting ? <p className="text-xs text-slate-500">Preparing export…</p> : null}

      {formOpen ? (
        <div ref={formRef}>
          <Panel title={editingId ? 'Edit University' : 'Add University'} className="p-3">
            <div className="grid gap-2 sm:grid-cols-2">
              <Field label="University Name" required>
                <input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className={inputClassName()}
                  placeholder="Full university name"
                />
              </Field>
              <Field label="Short Name" required>
                <input
                  value={form.shortName}
                  onChange={(e) => setForm((prev) => ({ ...prev, shortName: e.target.value.toUpperCase() }))}
                  className={inputClassName()}
                  placeholder="MCU / RDVV / IGNOU"
                />
              </Field>
              <Field label="University Code">
                <input
                  value={form.universityCode}
                  onChange={(e) => setForm((prev) => ({ ...prev, universityCode: e.target.value.toUpperCase() }))}
                  className={inputClassName()}
                  placeholder="Internal or official code"
                />
              </Field>
              <Field label="Registration Number" required>
                <input
                  value={form.registrationNumber}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, registrationNumber: e.target.value.toUpperCase() }))
                  }
                  className={inputClassName()}
                  placeholder="Registration no."
                />
              </Field>
              <Field label="Affiliation Number">
                <input
                  value={form.affiliationNumber}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, affiliationNumber: e.target.value.toUpperCase() }))
                  }
                  className={inputClassName()}
                  placeholder="Affiliation / approval no."
                />
              </Field>
              <Field label="Status" required>
                <select
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                  className={inputClassName()}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Draft">Draft</option>
                </select>
              </Field>
              <Field label="City">
                <input
                  value={form.city}
                  onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                  className={inputClassName()}
                />
              </Field>
              <Field label="State">
                <input
                  value={form.state}
                  onChange={(e) => setForm((prev) => ({ ...prev, state: e.target.value }))}
                  className={inputClassName()}
                />
              </Field>
              <Field label="Contact Person">
                <input
                  value={form.contactPerson}
                  onChange={(e) => setForm((prev) => ({ ...prev, contactPerson: e.target.value }))}
                  className={inputClassName()}
                />
              </Field>
              <Field label="Contact Phone">
                <input
                  value={form.contactPhone}
                  onChange={(e) => setForm((prev) => ({ ...prev, contactPhone: e.target.value }))}
                  className={inputClassName()}
                  placeholder="STD-code landline or mobile"
                />
              </Field>
              <Field label="Contact Email">
                <input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => setForm((prev) => ({ ...prev, contactEmail: e.target.value }))}
                  className={inputClassName()}
                />
              </Field>
              <Field label="Website">
                <input
                  value={form.website}
                  onChange={(e) => setForm((prev) => ({ ...prev, website: e.target.value }))}
                  className={inputClassName()}
                  placeholder="https://..."
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Remarks">
                  <textarea
                    value={form.remarks}
                    onChange={(e) => setForm((prev) => ({ ...prev, remarks: e.target.value }))}
                    className={inputClassName('textarea')}
                    placeholder="Any internal note, admission rule or document detail"
                  />
                </Field>
              </div>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
              <SecondaryButton onClick={closeForm} disabled={saving}>Cancel</SecondaryButton>
              <PrimaryButton disabled={saving} onClick={handleSave}>
                {saving ? 'Saving…' : editingId ? 'Update University' : 'Save University'}
              </PrimaryButton>
            </div>
          </Panel>
        </div>
      ) : null}

      <Panel title="Configured Universities" className="p-3">
        <div className="grid gap-2 lg:grid-cols-3">
          {topUniversities.map((row) => (
            <article key={row._id} className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-slate-900">{row.shortName}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">{row.name}</p>
                </div>
                <StatusBadge status={row.status} />
              </div>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-800">Registration:</span> {row.registrationNumber || '—'}
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Affiliation:</span> {row.affiliationNumber || '—'}
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Location:</span>{' '}
                  {[row.city, row.state].filter(Boolean).join(', ') || '—'}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Panel>

      <Panel title="University Records" className="min-w-0 overflow-hidden p-3">
        {loading ? (
          <div className="space-y-2 py-2">
            <SkeletonBlock className="h-10" />
            <SkeletonBlock className="h-10" />
            <SkeletonBlock className="h-10" />
            <SkeletonBlock className="h-10" />
          </div>
        ) : (
          <>
            <DataTable
              columns={tableColumns}
              rows={rows}
              emptyTitle={hasActiveFilters ? 'No universities match your current search or filters' : 'No universities added'}
              emptyDescription={
                hasActiveFilters
                  ? 'Try a different name, short name or registration number.'
                  : 'Click Add University to create your first university profile.'
              }
            />
            {hasActiveFilters && rows.length === 0 ? (
              <div className="mt-3 flex justify-center">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-[#FF5E14]/40 hover:text-[#FF5E14]"
                >
                  Clear filters
                </button>
              </div>
            ) : null}
            <Pagination page={pagination.page} pageSize={pagination.limit} total={pagination.total} onPageChange={(p) => reload(p)} />
            <div className="mt-3 text-xs text-slate-500">
              Deactivate marks status Inactive but keeps the university in the database for student history. Use Activate to make it Active again.
            </div>
          </>
        )}
      </Panel>
    </section>
  )
}
