import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Archive,
  Briefcase,
  Building2,
  Eye,
  Pencil,
  RefreshCw,
  RotateCcw,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react'
import {
  archiveStaff,
  createStaff,
  getStaff,
  getStaffById,
  getStaffMeta,
  getStaffStats,
  restoreStaff,
  updateStaff,
} from '../../../services/staffService.js'
import { staffAddPath, staffProfilePath } from './staffFormUtils.js'
import { printStaffReport } from '../../../utils/printStaffReport.js'
import {
  DataTable,
  Modal,
  PageToolbar,
  Pagination,
  PrimaryButton,
  SecondaryButton,
  StatCard,
  StatusBadge,
  downloadCsv,
} from '../shared/MasterAdminUI.jsx'
import { SkeletonBlock } from '../../students/shared/StudentUI.jsx'
import StaffForm from './StaffForm.jsx'
import { emptyStaffForm, formToPayload, staffInitials, staffToForm, photoSrc } from './staffFormUtils.js'
import { API_URL } from '../../../utils/api.js'

const exportColumns = [
  { key: 'employeeId', label: 'Employee ID' },
  { key: 'fullName', label: 'Name' },
  { key: 'departmentName', label: 'Department' },
  { key: 'designationName', label: 'Designation' },
  { key: 'branch', label: 'Branch' },
  { key: 'employmentType', label: 'Employment Type' },
  { key: 'joiningDateLabel', label: 'Joining Date' },
  { key: 'status', label: 'Status' },
]

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest joined' },
  { value: 'oldest', label: 'Oldest joined' },
  { value: 'nameAsc', label: 'Name A–Z' },
  { value: 'nameDesc', label: 'Name Z–A' },
  { value: 'employeeId', label: 'Employee ID' },
]

const actionBtn = 'inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition'

function dateLabel(value) {
  if (!value) return '—'
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function StaffPage() {
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [stats, setStats] = useState({})
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [status, setStatus] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [designationId, setDesignationId] = useState('')
  const [employmentType, setEmploymentType] = useState('')
  const [workMode, setWorkMode] = useState('')
  const [sort, setSort] = useState('newest')
  const [meta, setMeta] = useState({ departments: [], designations: [], employmentTypes: [], workModes: [], statuses: [] })
  const [exporting, setExporting] = useState(false)

  const [showArchived, setShowArchived] = useState(false)
  const [archivedRows, setArchivedRows] = useState([])
  const [archivedLoading, setArchivedLoading] = useState(false)

  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState('')
  const [form, setForm] = useState(() => emptyStaffForm())
  const [existingAccountMask, setExistingAccountMask] = useState('')
  const [saving, setSaving] = useState(false)
  const [actionBusyId, setActionBusyId] = useState('')

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(search), 300)
    return () => window.clearTimeout(t)
  }, [search])

  const requestId = useRef(0)
  const pageRef = useRef(1)

  const reload = useCallback(
    async (page) => {
      const targetPage = page ?? pageRef.current
      const thisRequest = ++requestId.current
      setLoading(true)
      try {
        setError('')
        const [listData, statsData] = await Promise.all([
          getStaff({
            page: targetPage,
            limit: pagination.limit,
            search: debouncedSearch,
            status,
            departmentId,
            designationId,
            employmentType,
            workMode,
            sort,
          }),
          getStaffStats(),
        ])
        if (thisRequest !== requestId.current) return
        pageRef.current = listData.pagination?.page || targetPage
        setRows(listData.rows)
        setPagination(listData.pagination)
        setStats(statsData)
      } catch (err) {
        if (thisRequest !== requestId.current) return
        setError(err?.message || 'Unable to load staff')
        setRows([])
      } finally {
        if (thisRequest === requestId.current) setLoading(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedSearch, status, departmentId, designationId, employmentType, workMode, sort, pagination.limit],
  )

  useEffect(() => {
    reload(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, status, departmentId, designationId, employmentType, workMode, sort])

  useEffect(() => {
    getStaffMeta().then(setMeta).catch(() => {})
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    const t = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(t)
  }, [toast])

  const loadArchived = useCallback(async () => {
    setArchivedLoading(true)
    try {
      const data = await getStaff({ archived: true, limit: 100, sort: 'nameAsc' })
      setArchivedRows(data.rows)
    } catch (err) {
      setError(err?.message || 'Unable to load archived staff')
    } finally {
      setArchivedLoading(false)
    }
  }, [])

  useEffect(() => {
    if (showArchived) loadArchived()
  }, [showArchived, loadArchived])

  const openCreate = () => navigate(staffAddPath())

  const openEdit = async (row) => {
    try {
      const entry = await getStaffById(row._id)
      setEditingId(entry._id)
      setForm(staffToForm(entry))
      setExistingAccountMask(entry.bankDetails?.accountNumber || '')
      setFormOpen(true)
    } catch (err) {
      setError(err?.message || 'Unable to load staff member')
    }
  }

  const save = async () => {
    if (!String(form.firstName || '').trim()) return setError('First name is required')
    if (!String(form.personalMobile || '').trim()) return setError('Personal mobile is required')
    if (!String(form.officialEmail || '').trim()) return setError('Official email is required')
    if (!form.departmentId) return setError('Department is required')
    if (!form.designationId) return setError('Designation is required')
    setSaving(true)
    setError('')
    try {
      const payload = formToPayload(form)
      if (editingId) await updateStaff(editingId, payload)
      else await createStaff(payload)
      setToast(editingId ? 'Staff member updated' : 'Staff member added')
      setFormOpen(false)
      await reload()
    } catch (err) {
      setError(err?.message || 'Unable to save staff member')
    } finally {
      setSaving(false)
    }
  }

  const handleArchive = async (row) => {
    const ok = window.confirm(
      `Archive ${row.fullName}?\n\nThis staff member will be removed from the active staff list, but attendance, leave, payroll, documents and historical records will be preserved.`,
    )
    if (!ok) return
    setActionBusyId(row._id)
    try {
      await archiveStaff(row._id)
      setToast('Staff member archived')
      await reload()
    } catch (err) {
      setError(err?.message || 'Archive failed')
    } finally {
      setActionBusyId('')
    }
  }

  const handleRestore = async (row) => {
    setActionBusyId(row._id)
    try {
      await restoreStaff(row._id)
      setToast('Staff member restored')
      setArchivedRows((prev) => prev.filter((r) => r._id !== row._id))
      await reload()
    } catch (err) {
      setError(err?.message || 'Restore failed')
    } finally {
      setActionBusyId('')
    }
  }

  const hasActiveFilters = Boolean(search || status || departmentId || designationId || employmentType || workMode)
  const clearFilters = () => {
    setSearch('')
    setStatus('')
    setDepartmentId('')
    setDesignationId('')
    setEmploymentType('')
    setWorkMode('')
  }

  const fetchAllFiltered = async () => {
    const data = await getStaff({ search: debouncedSearch, status, departmentId, designationId, employmentType, workMode, sort })
    return data.rows.map((r) => ({ ...r, joiningDateLabel: dateLabel(r.joiningDate) }))
  }

  const handleExportCsv = async () => {
    setExporting(true)
    try {
      const allRows = await fetchAllFiltered()
      downloadCsv('staff.csv', exportColumns, allRows)
      setToast('Staff CSV downloaded')
    } catch (err) {
      setError(err?.message || 'Unable to export staff')
    } finally {
      setExporting(false)
    }
  }

  const handleExportPdf = async () => {
    setExporting(true)
    try {
      const allRows = await fetchAllFiltered()
      printStaffReport(allRows)
    } catch (err) {
      setError(err?.message || 'Unable to prepare the PDF export')
    } finally {
      setExporting(false)
    }
  }

  const columns = [
    {
      key: 'fullName',
      label: 'Staff',
      render: (row) => {
        const src = photoSrc(row.profilePhoto, API_URL)
        return (
          <div className="flex min-w-0 items-center gap-2">
            {src ? (
              <img src={src} alt="" className="h-10 w-10 rounded-lg object-cover" />
            ) : (
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-800 text-[10px] font-bold text-white">
                {staffInitials(row.fullName)}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">{row.fullName}</p>
              <p className="truncate text-xs text-slate-500">{row.employeeId}</p>
            </div>
          </div>
        )
      },
    },
    { key: 'departmentName', label: 'Department', render: (row) => row.departmentName || '—' },
    { key: 'designationName', label: 'Designation', render: (row) => row.designationName || '—' },
    { key: 'employmentType', label: 'Type' },
    { key: 'joiningDate', label: 'Joined', render: (row) => dateLabel(row.joiningDate) },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: '_actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex flex-wrap gap-1.5">
          <button type="button" className={`${actionBtn} border-[#008C95]/30 bg-[#008C95]/10 text-[#008C95]`} onClick={() => navigate(staffProfilePath(row._id))}>
            <Eye size={12} /> View
          </button>
          <button type="button" className={`${actionBtn} border-slate-200 bg-white text-slate-700`} onClick={() => openEdit(row)}>
            <Pencil size={12} /> Edit
          </button>
          <button
            type="button"
            disabled={actionBusyId === row._id}
            className={`${actionBtn} border-rose-200 bg-rose-50 text-rose-600 disabled:opacity-60`}
            onClick={() => handleArchive(row)}
          >
            <Archive size={12} /> Archive
          </button>
        </div>
      ),
    },
  ]

  return (
    <section className="space-y-3">
      {toast ? (
        <div className="fixed right-3 top-3 z-[90] rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg">{toast}</div>
      ) : null}

      <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
        <StatCard label="Total Staff" value={loading ? '—' : String(stats.total ?? 0)} icon={Users} />
        <StatCard label="Active Staff" value={loading ? '—' : String(stats.active ?? 0)} icon={UserCheck} />
        <StatCard label="On Probation" value={loading ? '—' : String(stats.onProbation ?? 0)} icon={Briefcase} />
        <StatCard label="New Joiners (this month)" value={loading ? '—' : String(stats.newJoiners ?? 0)} icon={UserPlus} />
      </div>

      {error ? <article className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">{error}</article> : null}

      <PageToolbar
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search name, employee ID, email, mobile…"
        filters={meta.statuses}
        filterValue={status}
        onFilter={setStatus}
        addLabel="Add Staff"
        onAdd={openCreate}
        onExportCsv={handleExportCsv}
        onExportPdf={handleExportPdf}
        extraActions={
          <>
            <button type="button" onClick={() => reload()} disabled={loading} className="inline-flex h-10 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm disabled:opacity-50">
              <RefreshCw size={14} /> Refresh
            </button>
            <button
              type="button"
              onClick={() => setShowArchived((v) => !v)}
              className={`inline-flex h-10 items-center gap-1 rounded-lg border px-3 text-sm ${showArchived ? 'border-slate-500 bg-slate-100 text-slate-800' : 'border-slate-200 bg-white text-slate-700'}`}
            >
              <Archive size={14} /> Archived
            </button>
          </>
        }
      />
      {exporting ? <p className="text-xs text-slate-500">Preparing export…</p> : null}

      <div className="grid gap-2 rounded-lg border border-slate-200 bg-white p-2.5 sm:grid-cols-2 lg:grid-cols-5">
        <select value={departmentId} onChange={(e) => { setDepartmentId(e.target.value); setDesignationId('') }} className="h-10 rounded-lg border border-slate-200 px-3 text-sm">
          <option value="">All departments</option>
          {meta.departments.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <select value={designationId} onChange={(e) => setDesignationId(e.target.value)} className="h-10 rounded-lg border border-slate-200 px-3 text-sm">
          <option value="">All designations</option>
          {meta.designations.filter((d) => !departmentId || d.departmentId === departmentId).map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <select value={employmentType} onChange={(e) => setEmploymentType(e.target.value)} className="h-10 rounded-lg border border-slate-200 px-3 text-sm">
          <option value="">All employment types</option>
          {meta.employmentTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select value={workMode} onChange={(e) => setWorkMode(e.target.value)} className="h-10 rounded-lg border border-slate-200 px-3 text-sm">
          <option value="">All work modes</option>
          {meta.workModes.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-10 rounded-lg border border-slate-200 px-3 text-sm">
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {showArchived ? (
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Archived staff</h3>
            <button type="button" onClick={() => setShowArchived(false)} className="text-xs font-semibold text-slate-500 hover:text-[#FF5E14]">Hide</button>
          </div>
          <p className="mb-3 text-xs text-slate-500">Kept in the database but hidden from the active list. Restore to bring one back.</p>
          {archivedLoading ? (
            <p className="py-4 text-center text-sm text-slate-500">Loading…</p>
          ) : archivedRows.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-500">No archived staff.</p>
          ) : (
            <div className="space-y-2">
              {archivedRows.map((row) => (
                <div key={row._id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50/80 p-2.5">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{row.fullName}</p>
                    <p className="text-xs text-slate-500">{row.employeeId} · {row.departmentName || '—'}</p>
                  </div>
                  <button
                    type="button"
                    disabled={actionBusyId === row._id}
                    onClick={() => handleRestore(row)}
                    className={`${actionBtn} border-emerald-200 bg-emerald-50 text-emerald-700 disabled:opacity-60`}
                  >
                    <RotateCcw size={12} /> {actionBusyId === row._id ? 'Restoring…' : 'Restore'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

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
            wrap
            columns={columns}
            rows={rows}
            emptyTitle={hasActiveFilters ? 'No staff match your current search or filters' : 'No staff added yet'}
            emptyDescription={hasActiveFilters ? 'Try a different name, department or designation.' : 'Add the first team member to get started.'}
          />
          {hasActiveFilters && rows.length === 0 ? (
            <div className="flex justify-center">
              <button type="button" onClick={clearFilters} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-[#FF5E14]/40 hover:text-[#FF5E14]">
                Clear filters
              </button>
            </div>
          ) : null}
          <Pagination page={pagination.page} pageSize={pagination.limit} total={pagination.total} onPageChange={(p) => reload(p)} />
        </>
      )}

      <Modal
        open={formOpen}
        title="Edit staff member"
        onClose={() => setFormOpen(false)}
        wide
        footer={
          <div className="flex justify-end gap-2">
            <SecondaryButton onClick={() => setFormOpen(false)} disabled={saving}>Cancel</SecondaryButton>
            <PrimaryButton disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save changes'}</PrimaryButton>
          </div>
        }
      >
        <StaffForm form={form} setForm={setForm} meta={meta} isCreate={false} onUploadError={setError} existingAccountNumberMask={existingAccountMask} />
      </Modal>
    </section>
  )
}
