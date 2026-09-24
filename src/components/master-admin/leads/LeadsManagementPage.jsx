import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Users,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'
import {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
} from '../../../services/leadService.js'
import { useLiveSectionRefresh } from '../../../hooks/useLiveSectionRefresh.js'

const PAGE_SIZE = 10

export const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost']

export const LEAD_SOURCES = [
  'Website',
  'WhatsApp',
  'Phone',
  'Email',
  'Walk-in',
  'Instagram',
  'Facebook',
  'YouTube',
  'Friend / Family',
  'College / University',
  'Advertisement',
  'Partner / Counsellor',
  'Others',
]

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

function formatDateOnly(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' })
  } catch {
    return iso
  }
}

function rowId(row) {
  return row?._id != null ? String(row._id) : row?.id != null ? String(row.id) : ''
}

function toDateInputValue(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function formatSource(row) {
  if (!row?.source) return '—'
  if (row.source === 'Others' && row.sourceOther) {
    return `Others — ${row.sourceOther}`
  }
  return row.source
}

function statusBadgeClass(status) {
  switch (status) {
    case 'New':
      return 'bg-sky-50 text-sky-800'
    case 'Contacted':
      return 'bg-amber-50 text-amber-800'
    case 'Qualified':
      return 'bg-violet-50 text-violet-800'
    case 'Converted':
      return 'bg-emerald-50 text-emerald-800'
    case 'Lost':
      return 'bg-slate-100 text-slate-600'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

const emptyForm = () => ({
  name: '',
  phone: '',
  email: '',
  source: 'Website',
  sourceOther: '',
  interest: '',
  counsellor: 'Unassigned',
  followUp: '',
  status: 'New',
  notes: '',
})

function rowToForm(row) {
  return {
    name: row.name || '',
    phone: row.phone || '',
    email: row.email || '',
    source: row.source || 'Website',
    sourceOther: row.sourceOther || '',
    interest: row.interest || '',
    counsellor: row.counsellor || 'Unassigned',
    followUp: toDateInputValue(row.followUp),
    status: row.status || 'New',
    notes: row.notes || '',
  }
}

function buildPayload(form) {
  return {
    name: form.name.trim(),
    phone: form.phone.trim(),
    email: form.email.trim(),
    source: form.source,
    sourceOther: form.source === 'Others' ? form.sourceOther.trim() : '',
    interest: form.interest.trim(),
    counsellor: form.counsellor.trim() || 'Unassigned',
    followUp: form.followUp ? form.followUp : null,
    status: form.status,
    notes: form.notes.trim(),
  }
}

function LeadFormModal({ open, mode, initialForm, onClose, onSaved }) {
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
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Name and mobile number are required.')
      return
    }
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, '').slice(-10))) {
      setError('Enter a valid 10-digit mobile number.')
      return
    }
    if (form.source === 'Others' && !form.sourceOther.trim()) {
      setError('Please specify the source when Others is selected.')
      return
    }

    const payload = buildPayload(form)
    try {
      setSaving(true)
      if (mode === 'create') {
        await createLead(payload)
      } else {
        const id = String(initialForm._id || '').trim()
        if (!id) {
          setError('Missing lead id.')
          setSaving(false)
          return
        }
        await updateLead(id, payload)
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
            {mode === 'create' ? 'New lead' : 'Edit lead'}
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

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Full name</label>
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => setField('name', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Mobile</label>
                <input
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) =>
                    setField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))
                  }
                  inputMode="numeric"
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  className={inputClass}
                  value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Interest / course</label>
                <input
                  className={inputClass}
                  value={form.interest}
                  onChange={(e) => setField('interest', e.target.value)}
                  placeholder="e.g. Full Stack"
                />
              </div>
              <div>
                <label className={labelClass}>Source</label>
                <select
                  className={inputClass}
                  value={form.source}
                  onChange={(e) => {
                    const value = e.target.value
                    setForm((f) => ({
                      ...f,
                      source: value,
                      sourceOther: value === 'Others' ? f.sourceOther : '',
                    }))
                  }}
                >
                  {LEAD_SOURCES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              {form.source === 'Others' ? (
                <div>
                  <label className={labelClass}>Specify source</label>
                  <input
                    className={inputClass}
                    value={form.sourceOther}
                    onChange={(e) => setField('sourceOther', e.target.value.slice(0, 200))}
                    required
                  />
                </div>
              ) : (
                <div>
                  <label className={labelClass}>Counsellor</label>
                  <input
                    className={inputClass}
                    value={form.counsellor}
                    onChange={(e) => setField('counsellor', e.target.value)}
                  />
                </div>
              )}
              {form.source === 'Others' ? (
                <div>
                  <label className={labelClass}>Counsellor</label>
                  <input
                    className={inputClass}
                    value={form.counsellor}
                    onChange={(e) => setField('counsellor', e.target.value)}
                  />
                </div>
              ) : null}
              <div>
                <label className={labelClass}>Status</label>
                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(e) => setField('status', e.target.value)}
                >
                  {LEAD_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Follow-up date</label>
                <input
                  type="date"
                  className={inputClass}
                  value={form.followUp}
                  onChange={(e) => setField('followUp', e.target.value)}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Notes</label>
                <textarea
                  className={`${inputClass} min-h-[80px]`}
                  value={form.notes}
                  onChange={(e) => setField('notes', e.target.value)}
                  rows={3}
                />
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
              {saving ? 'Saving…' : mode === 'create' ? 'Create lead' : 'Update lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function LeadsManagementPage() {
  const [rows, setRows] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdatedAt, setLastUpdatedAt] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [editPayload, setEditPayload] = useState(() => ({ ...emptyForm(), _id: '' }))

  const reload = useCallback(async () => {
    try {
      setError('')
      const data = await getLeads()
      setRows(data.rows)
      setStats(data.stats)
      setLastUpdatedAt(new Date().toISOString())
    } catch (err) {
      setError(err?.message || 'Unable to load leads')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  useLiveSectionRefresh('leads', reload)

  useEffect(() => {
    setPage(1)
  }, [searchQuery, statusFilter])

  const filteredRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return rows.filter((row) => {
      if (statusFilter && row.status !== statusFilter) return false
      if (!q) return true
      const blob = [
        row.name,
        row.phone,
        row.email,
        row.source,
        row.sourceOther,
        formatSource(row),
        row.interest,
        row.counsellor,
        row.status,
        row.notes,
        rowId(row),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return blob.includes(q)
    })
  }, [rows, searchQuery, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
  const paginatedRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const openCreate = () => {
    setModalMode('create')
    setEditPayload({ ...emptyForm(), _id: '' })
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
    if (!window.confirm(`Delete lead “${row.name || id}”?`)) return
    try {
      await deleteLead(id)
      await reload()
    } catch (err) {
      setError(err?.message || 'Delete failed')
    }
  }

  const rangeLabel =
    filteredRows.length === 0
      ? '0 entries'
      : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filteredRows.length)} of ${filteredRows.length}`

  const statCards = [
    { label: 'New', value: stats?.newLeads ?? '—' },
    { label: 'Qualified', value: stats?.qualified ?? '—' },
    { label: 'Converted', value: stats?.converted ?? '—' },
    { label: 'Conversion', value: stats?.conversionRate ?? '—' },
  ]

  return (
    <section className="space-y-3">
      <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#00A896]/10 text-[#008C95]">
              <Users size={18} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">Leads</p>
              <p className="text-xs text-slate-500">
                Counsellor pipeline — source, follow-up, status and conversion tracking.
                New website enquiries auto-appear here as leads.
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
              New lead
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                {card.label}
              </p>
              <p className="mt-0.5 text-lg font-semibold text-slate-900">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, phone, source, interest, counsellor…"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#00A896] focus:outline-none focus:ring-2 focus:ring-[#FF5E14]/25/20"
              autoComplete="off"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-[#00A896] focus:outline-none focus:ring-2 focus:ring-[#FF5E14]/25"
          >
            <option value="">All statuses</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <article className="rounded-lg border border-dashed border-[#c5ddd9] bg-white/80 p-4 text-center text-sm text-slate-600">
          Loading leads...
        </article>
      ) : error ? (
        <article className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-900">
          {error}
        </article>
      ) : filteredRows.length === 0 ? (
        <article className="rounded-lg border border-dashed border-[#c5ddd9] bg-white/80 p-4 text-center text-sm text-slate-600">
          {rows.length === 0
            ? 'No leads yet. Use New lead to add the first prospect.'
            : 'No leads match your filters. Try a different search or status.'}
        </article>
      ) : (
        <>
          <div className="space-y-3">
            {paginatedRows.map((row) => (
              <article
                key={rowId(row)}
                className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-semibold text-slate-900">{row.name || '—'}</p>
                    <p className="text-sm text-[#008C95]">{row.phone || '—'}</p>
                    {row.email ? <p className="mt-0.5 text-xs text-slate-500">{row.email}</p> : null}
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <div className="text-right text-xs text-slate-500 sm:mr-2">
                      <p>{formatWhen(row.createdAt)}</p>
                      <p className="mt-1 flex flex-wrap justify-end gap-1">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                          {formatSource(row)}
                        </span>
                        <span
                          className={`rounded-full px-2 py-0.5 font-medium ${statusBadgeClass(row.status)}`}
                        >
                          {row.status || '—'}
                        </span>
                        {row.enquiryId ? (
                          <span className="rounded-full bg-[#00A896]/15 px-2 py-0.5 font-medium text-[#008C95]">
                            From enquiry
                          </span>
                        ) : null}
                      </p>
                    </div>
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

                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    ['Interest', row.interest],
                    ['Counsellor', row.counsellor],
                    ['Follow-up', formatDateOnly(row.followUp)],
                    ['Status', row.status],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        {label}
                      </dt>
                      <dd className="mt-0.5 text-slate-800">{value || '—'}</dd>
                    </div>
                  ))}
                </dl>

                {row.notes ? (
                  <div className="mt-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Notes
                    </p>
                    <p className="mt-1 text-sm whitespace-pre-wrap text-slate-700">{row.notes}</p>
                  </div>
                ) : null}
              </article>
            ))}
          </div>

          <div className="flex flex-col items-stretch justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 sm:flex-row sm:items-center">
            <p className="text-sm text-slate-600">
              Showing <span className="font-semibold text-slate-900">{rangeLabel}</span>
              {searchQuery.trim() || statusFilter ? (
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

      <LeadFormModal
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
