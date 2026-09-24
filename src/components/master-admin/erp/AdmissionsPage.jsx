import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Archive,
  CheckCircle2,
  ClipboardCheck,
  Globe2,
  GraduationCap,
  Pencil,
  Printer,
  RefreshCw,
  RotateCcw,
  XCircle,
} from 'lucide-react'
import {
  archiveAdmission,
  getAdmissionById,
  getAdmissions,
  restoreAdmission,
  updateAdmission,
} from '../../../services/admissionService.js'
import { masterAdminDashboardPath } from '../../../utils/masterAdminRoutes.js'
import { printAdmissionForm } from '../../../utils/printAdmissionForm.js'
import { printAdmissionReport } from '../../../utils/printAdmissionReport.js'
import {
  StatCard,
  Panel,
  PageToolbar,
  DataTable,
  Pagination,
  StatusBadge,
  Modal,
  downloadCsv,
} from '../shared/MasterAdminUI.jsx'
import { SkeletonBlock } from '../../students/shared/StudentUI.jsx'
import { primaryBtn, secondaryBtn } from '../../../utils/masterAdminTheme.js'

const columns = [
  { key: 'admissionId', label: 'ID' },
  { key: 'applicant', label: 'Applicant' },
  { key: 'course', label: 'Course' },
  { key: 'mode', label: 'Mode' },
  { key: 'counsellor', label: 'Counsellor' },
  { key: 'fee', label: 'Fee' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status' },
]

// Broader field set for exports than what's on screen (matches the
// University/Faculty export column pattern) — pulls a few fields out of the
// nested `details` blob rather than exporting it wholesale.
const exportColumns = [
  { key: 'admissionId', label: 'Admission Number' },
  { key: 'registrationNo', label: 'Registration Number' },
  { key: 'applicant', label: 'Student Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'college', label: 'University' },
  { key: 'course', label: 'Course' },
  { key: 'session', label: 'Session' },
  { key: 'date', label: 'Admission Date' },
  { key: 'status', label: 'Status' },
  { key: 'createdAt', label: 'Created Date' },
]

function toExportRow(row) {
  const d = row.details && typeof row.details === 'object' ? row.details : {}
  return { ...row, registrationNo: d.registrationNo || '', session: d.session || '' }
}

const STATUS_OPTIONS = ['Pending', 'Verification', 'Approved', 'Rejected']

function statusSelectClass(status) {
  const key = String(status || '').toLowerCase()
  if (key === 'approved') {
    return 'border-[#00A896]/40 bg-[#00A896]/15 text-[#005F6B]'
  }
  if (key === 'pending') {
    return 'border-amber-200 bg-amber-50 text-amber-800'
  }
  if (key === 'rejected') {
    return 'border-rose-200 bg-rose-50 text-rose-700'
  }
  if (key === 'verification') {
    return 'border-sky-200 bg-sky-50 text-sky-800'
  }
  return 'border-slate-200 bg-slate-50 text-slate-700'
}

function buildUpdatePayload(row, status) {
  return {
    applicant: row.applicant,
    email: row.email,
    phone: row.phone,
    course: row.course || row.program,
    mode: row.mode || 'Online',
    counsellor: row.counsellor === '—' ? '' : row.counsellor || '',
    fee: row.fee || '₹5,000',
    status,
    city: row.city || '',
    state: row.state || '',
    college: row.college || '',
    studentStatus: row.studentStatus || '',
    notes: row.notes || '',
    // Do not send slim/list details — preserves photo & documents on server
    admissionDate: row.admissionDate,
  }
}

export default function AdmissionsPage() {
  const navigate = useNavigate()
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

  const [showOnlineRequests, setShowOnlineRequests] = useState(false)
  const [onlineRequestRows, setOnlineRequestRows] = useState([])
  const [onlineLoading, setOnlineLoading] = useState(false)

  const [showArchived, setShowArchived] = useState(false)
  const [archivedRows, setArchivedRows] = useState([])
  const [archivedLoading, setArchivedLoading] = useState(false)

  const [actionBusyId, setActionBusyId] = useState('')
  const [statusConfirm, setStatusConfirm] = useState(null)

  // 300ms debounce — same as Universities/Faculty search boxes.
  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(search), 300)
    return () => window.clearTimeout(t)
  }, [search])

  const requestId = useRef(0)
  // reload() with no page argument means "reload whatever page we're on" —
  // a ref (not a `pagination.page` default param) so it can't close over a
  // stale page number between renders.
  const pageRef = useRef(1)

  const reload = useCallback(
    async (page) => {
      const targetPage = page ?? pageRef.current
      const thisRequest = ++requestId.current
      setLoading(true)
      try {
        setError('')
        const data = await getAdmissions({ page: targetPage, limit: pagination.limit, search: debouncedSearch, status })
        if (thisRequest !== requestId.current) return // a newer request already landed
        pageRef.current = data.pagination?.page || targetPage
        setRows(data.rows)
        setStats(data.stats || {})
        setPagination(data.pagination)
      } catch (err) {
        if (thisRequest !== requestId.current) return
        setError(err?.message || 'Unable to load admissions')
        setRows([])
      } finally {
        if (thisRequest === requestId.current) setLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedSearch, status, pagination.limit],
  )

  useEffect(() => {
    reload(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, status])

  useEffect(() => {
    if (!toast) return undefined
    const t = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(t)
  }, [toast])

  const loadOnlineRequests = useCallback(async () => {
    setOnlineLoading(true)
    try {
      // A dedicated, capped fetch — not derived from the (now paginated)
      // main `rows` — so this panel still sees every online request, not
      // just whichever ones happen to be on the current table page.
      const data = await getAdmissions({ mode: 'Online', limit: 100 })
      setOnlineRequestRows(
        data.rows.filter((r) => {
          const source = r.details?.source
          if (source === 'student-online') return true
          return r.status === 'Pending' || r.status === 'Verification'
        }),
      )
    } catch (err) {
      setError(err?.message || 'Unable to load online requests')
    } finally {
      setOnlineLoading(false)
    }
  }, [])

  useEffect(() => {
    if (showOnlineRequests) loadOnlineRequests()
  }, [showOnlineRequests, loadOnlineRequests])

  const loadArchived = useCallback(async () => {
    setArchivedLoading(true)
    try {
      const data = await getAdmissions({ archived: true, limit: 100 })
      setArchivedRows(data.rows)
    } catch (err) {
      setError(err?.message || 'Unable to load archived admissions')
    } finally {
      setArchivedLoading(false)
    }
  }, [])

  useEffect(() => {
    if (showArchived) loadArchived()
  }, [showArchived, loadArchived])

  const openCreate = () => {
    navigate(masterAdminDashboardPath('New Admission'))
  }

  const openEdit = (row) => {
    if (!row?._id) return
    navigate(masterAdminDashboardPath('New Admission'), {
      state: { editingId: row._id },
    })
  }

  const handleArchive = async (row) => {
    if (!row?._id) return
    const ok = window.confirm(
      `Archive admission ${row.admissionId || row.id}?\n\nThis admission will be archived and removed from the active list. Historical records — fee history and documents — will be preserved.`,
    )
    if (!ok) return
    try {
      await archiveAdmission(row._id)
      setToast('Admission archived')
      await reload()
    } catch (err) {
      setError(err?.message || 'Archive failed')
    }
  }

  const handleRestore = async (row) => {
    if (!row?._id) return
    setActionBusyId(row._id)
    try {
      await restoreAdmission(row._id)
      setToast('Admission restored')
      setArchivedRows((prev) => prev.filter((r) => r._id !== row._id))
      await reload()
    } catch (err) {
      setError(err?.message || 'Restore failed')
    } finally {
      setActionBusyId('')
    }
  }

  const handlePrint = async (row) => {
    if (!row?._id) return
    try {
      setError('')
      setActionBusyId(row._id)
      const full = await getAdmissionById(row._id)
      printAdmissionForm(full)
      setToast('Opening print dialog…')
    } catch (err) {
      setError(err?.message || 'Unable to print form')
    } finally {
      setActionBusyId('')
    }
  }

  const handleStatusChange = async (row, nextStatus) => {
    if (!row?._id) return
    setActionBusyId(row._id)
    try {
      await updateAdmission(row._id, buildUpdatePayload(row, nextStatus))
      setRows((prev) => prev.map((r) => (r._id === row._id ? { ...r, status: nextStatus } : r)))
      setToast(
        nextStatus === 'Approved'
          ? `Admission ${row.admissionId} approved`
          : nextStatus === 'Rejected'
            ? `Admission ${row.admissionId} rejected`
            : `Status updated to ${nextStatus}`,
      )
      setStatusConfirm(null)
      // Stat tiles are server-computed and status-independent of the current
      // page, so they need a real refetch rather than a local increment.
      reload()
    } catch (err) {
      setError(err?.message || 'Unable to update status')
    } finally {
      setActionBusyId('')
    }
  }

  const requestStatusChange = (row, nextStatus) => {
    if (!row || !nextStatus || nextStatus === row.status) return
    setStatusConfirm({ row, nextStatus })
  }

  const hasActiveFilters = Boolean(search || status)
  const clearFilters = () => {
    setSearch('')
    setStatus('')
  }

  // Export pulls the complete filtered set from the backend (no page/limit),
  // not just the rows on screen — matches the current search/status filter,
  // not one page of it.
  const fetchAllFiltered = async () => {
    const data = await getAdmissions({ search: debouncedSearch, status })
    return data.rows.map(toExportRow)
  }

  const handleExportCsv = async () => {
    setExporting(true)
    try {
      const allRows = await fetchAllFiltered()
      downloadCsv('admissions.csv', exportColumns, allRows)
      setToast('Admissions CSV downloaded')
    } catch (err) {
      setError(err?.message || 'Unable to export admissions')
    } finally {
      setExporting(false)
    }
  }

  const handleExportPdf = async () => {
    setExporting(true)
    try {
      const allRows = await fetchAllFiltered()
      printAdmissionReport(allRows)
    } catch (err) {
      setError(err?.message || 'Unable to prepare the PDF export')
    } finally {
      setExporting(false)
    }
  }

  const actionBtn =
    'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition'

  const tableColumns = [
    ...columns.map((c) =>
      c.key === 'status'
        ? {
            ...c,
            render: (row) => (
              <select
                value={row.status || 'Pending'}
                disabled={actionBusyId === row._id}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => {
                  e.stopPropagation()
                  const next = e.target.value
                  // Reset select visual to current until user confirms
                  e.target.value = row.status || 'Pending'
                  requestStatusChange(row, next)
                }}
                className={`h-8 min-w-[7.5rem] cursor-pointer rounded-full border px-2.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-[#FF5E14]/25 disabled:cursor-not-allowed disabled:opacity-60 ${statusSelectClass(row.status)}`}
                title="Change status"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            ),
          }
        : c.key === 'course'
          ? {
              ...c,
              render: (row) => (
                <span className="block break-words text-slate-800">
                  {row.course || row.program || '—'}
                </span>
              ),
            }
          : c.key === 'applicant'
            ? {
                ...c,
                render: (row) => (
                  <div className="min-w-0">
                    <p className="break-words font-semibold text-slate-800">
                      {row.applicant || '—'}
                    </p>
                    <p className="break-all text-xs text-slate-500">{row.email || ''}</p>
                    <p className="break-all text-xs text-slate-500">{row.phone || ''}</p>
                  </div>
                ),
              }
            : c.key === 'counsellor'
              ? {
                  ...c,
                  render: (row) => (
                    <span className="break-words">{row.counsellor || '—'}</span>
                  ),
                }
              : c,
    ),
    {
      key: '_actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex w-full flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            disabled={actionBusyId === row._id}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handlePrint(row)
            }}
            className={`${actionBtn} border-[#FF5E14]/30 bg-[#FF5E14]/10 text-[#FF5E14] hover:bg-[#FF5E14]/15 disabled:opacity-60`}
            title="Print application form"
          >
            <Printer size={12} /> Print
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              openEdit(row)
            }}
            className={`${actionBtn} border-[#008C95]/30 bg-[#008C95]/10 text-[#008C95] hover:bg-[#008C95]/15`}
          >
            <Pencil size={12} /> Edit
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleArchive(row)
            }}
            className={`${actionBtn} border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100`}
          >
            <Archive size={12} /> Archive
          </button>
        </div>
      ),
    },
  ]

  return (
    <section className="w-full min-w-0 space-y-3 overflow-x-hidden">
      {toast ? (
        <div className="fixed right-3 top-3 z-[90] max-w-[calc(100vw-1.5rem)] rounded-lg bg-[#008C95] px-4 py-2 text-sm font-medium text-white shadow-lg sm:right-4 sm:top-4">
          {toast}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
        <StatCard label="Total Admissions" value={loading ? '—' : String(stats.total ?? 0)} icon={GraduationCap} />
        <StatCard label="Pending" value={loading ? '—' : String(stats.pending ?? 0)} icon={ClipboardCheck} hint="Awaiting review" />
        <StatCard label="Approved" value={loading ? '—' : String(stats.approved ?? 0)} hint="This institute DB" />
        <StatCard
          label="Online Requests"
          value={loading ? '—' : String(stats.onlinePending ?? 0)}
          icon={Globe2}
          hint="Student portal"
        />
      </div>

      <PageToolbar
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search applicant, ID, registration no…"
        filters={STATUS_OPTIONS}
        filterValue={status}
        onFilter={setStatus}
        addLabel="Add New Admission"
        onAdd={openCreate}
        onExportCsv={handleExportCsv}
        onExportPdf={handleExportPdf}
        extraActions={
          <>
            <button
              type="button"
              onClick={() => setShowOnlineRequests((v) => !v)}
              className={`${secondaryBtn} flex-1 sm:flex-none ${
                showOnlineRequests
                  ? '!border-[#008C95] !bg-[#008C95]/10 !text-[#005F6B]'
                  : ''
              }`}
            >
              <Globe2 size={14} />
              Online Requests
              {(stats.onlinePending || 0) > 0 ? (
                <span className="ml-1 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-[#FF5E14] px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {stats.onlinePending}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              onClick={() => setShowArchived((v) => !v)}
              className={`${secondaryBtn} flex-1 sm:flex-none ${
                showArchived ? '!border-slate-500 !bg-slate-100 !text-slate-800' : ''
              }`}
            >
              <Archive size={14} /> Archived
            </button>
          </>
        }
      />
      {exporting ? <p className="text-xs text-slate-500">Preparing export…</p> : null}

      {showOnlineRequests ? (
        <Panel
          title="Online Admission Requests"
          className="min-w-0 overflow-hidden p-3"
          action={
            <button
              type="button"
              onClick={() => setShowOnlineRequests(false)}
              className="text-xs font-semibold text-slate-500 hover:text-[#FF5E14]"
            >
              Hide
            </button>
          }
        >
          <p className="mb-3 text-xs text-slate-500">
            Applications submitted from the student Online Admission form. Review details, then
            approve or reject.
          </p>
          {onlineLoading ? (
            <p className="py-6 text-center text-sm text-slate-500">Loading online requests…</p>
          ) : onlineRequestRows.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-8 text-center">
              <p className="text-sm font-semibold text-slate-800">No online requests yet</p>
              <p className="mt-1 text-xs text-slate-500">
                When students submit the online admission form, requests will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {onlineRequestRows.map((row) => (
                <article
                  key={row._id || row.admissionId}
                  className="rounded-lg border border-slate-200 bg-slate-50/80 p-3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-slate-900">{row.applicant}</p>
                        <StatusBadge status={row.status} />
                        <span className="rounded-full bg-[#00A896]/15 px-2 py-0.5 text-[10px] font-semibold text-[#005F6B]">
                          Online
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {row.admissionId} · {row.email} · {row.phone}
                      </p>
                      <p className="mt-1 break-words text-sm text-slate-700">
                        {row.course || row.program}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {row.college || row.details?.universityName || '—'} · Fee {row.fee} ·{' '}
                        {row.date}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {(row.status === 'Pending' || row.status === 'Verification') && (
                        <>
                          <button
                            type="button"
                            disabled={actionBusyId === row._id}
                            onClick={async () => {
                              await handleStatusChange(row, 'Approved')
                              loadOnlineRequests()
                            }}
                            className={`${actionBtn} border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-60`}
                          >
                            <CheckCircle2 size={12} />
                            {actionBusyId === row._id ? '…' : 'Approve'}
                          </button>
                          <button
                            type="button"
                            disabled={actionBusyId === row._id}
                            onClick={async () => {
                              await handleStatusChange(row, 'Rejected')
                              loadOnlineRequests()
                            }}
                            className={`${actionBtn} border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 disabled:opacity-60`}
                          >
                            <XCircle size={12} /> Reject
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        className={`${actionBtn} border-[#008C95]/30 bg-[#008C95]/10 text-[#008C95] hover:bg-[#008C95]/15`}
                      >
                        <Pencil size={12} /> Review
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePrint(row)}
                        className={`${actionBtn} border-[#FF5E14]/30 bg-[#FF5E14]/10 text-[#FF5E14] hover:bg-[#FF5E14]/15`}
                      >
                        <Printer size={12} /> Print
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </Panel>
      ) : null}

      {showArchived ? (
        <Panel
          title="Archived Admissions"
          className="min-w-0 overflow-hidden p-3"
          action={
            <button
              type="button"
              onClick={() => setShowArchived(false)}
              className="text-xs font-semibold text-slate-500 hover:text-[#FF5E14]"
            >
              Hide
            </button>
          }
        >
          <p className="mb-3 text-xs text-slate-500">
            Archived admissions are hidden from the active list but kept in the database — fee
            history and documents are preserved. Restore to bring one back.
          </p>
          {archivedLoading ? (
            <p className="py-6 text-center text-sm text-slate-500">Loading archived admissions…</p>
          ) : archivedRows.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-8 text-center">
              <p className="text-sm font-semibold text-slate-800">No archived admissions</p>
            </div>
          ) : (
            <div className="space-y-2">
              {archivedRows.map((row) => (
                <article
                  key={row._id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/80 p-3"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{row.applicant}</p>
                    <p className="text-xs text-slate-500">
                      {row.admissionId} · {row.course || row.program} · {row.date}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={actionBusyId === row._id}
                    onClick={() => handleRestore(row)}
                    className={`${actionBtn} border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 disabled:opacity-60`}
                  >
                    <RotateCcw size={12} /> {actionBusyId === row._id ? 'Restoring…' : 'Restore'}
                  </button>
                </article>
              ))}
            </div>
          )}
        </Panel>
      ) : null}

      {error ? (
        <article className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
          {error}
        </article>
      ) : null}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => reload()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-[#FF5E14]/40 hover:text-[#FF5E14] disabled:opacity-50"
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <Panel title="Admissions" className="min-w-0 overflow-hidden p-3">
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
              wrap
              emptyTitle={hasActiveFilters ? 'No admissions match your current search or filters' : 'No admissions yet'}
              emptyDescription={
                hasActiveFilters
                  ? 'Try a different name, ID or registration number.'
                  : 'Click Add New Admission to open the official admission form.'
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
          </>
        )}
      </Panel>

      <Modal
        open={Boolean(statusConfirm)}
        title="Update status?"
        onClose={() => {
          if (actionBusyId) return
          setStatusConfirm(null)
        }}
        footer={
          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              disabled={Boolean(actionBusyId)}
              onClick={() => setStatusConfirm(null)}
              className={`${secondaryBtn} disabled:opacity-60`}
            >
              No
            </button>
            <button
              type="button"
              disabled={Boolean(actionBusyId)}
              onClick={() => {
                if (!statusConfirm?.row || !statusConfirm?.nextStatus) return
                handleStatusChange(statusConfirm.row, statusConfirm.nextStatus)
              }}
              className={`${primaryBtn} disabled:opacity-60`}
            >
              {actionBusyId ? 'Updating…' : 'Yes'}
            </button>
          </div>
        }
      >
        {statusConfirm ? (
          <div className="space-y-3 text-sm text-slate-700">
            <p>
              Do you want to change status of{' '}
              <strong>{statusConfirm.row.applicant || statusConfirm.row.admissionId}</strong> from{' '}
              <StatusBadge status={statusConfirm.row.status} /> to{' '}
              <StatusBadge status={statusConfirm.nextStatus} />?
            </p>
            <p className="text-xs text-slate-500">
              ID: {statusConfirm.row.admissionId || '—'} · Course:{' '}
              {statusConfirm.row.course || statusConfirm.row.program || '—'}
            </p>
          </div>
        ) : null}
      </Modal>
    </section>
  )
}
