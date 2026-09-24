import { useCallback, useEffect, useState } from 'react'
import { Building2, Pencil, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react'
import {
  archiveStaffDepartment,
  createStaffDepartment,
  getStaffDepartments,
  setStaffDepartmentStatus,
  updateStaffDepartment,
} from '../../../services/staffService.js'
import { DataTable, Panel, PrimaryButton, SecondaryButton, StatCard, StatusBadge } from '../shared/MasterAdminUI.jsx'
import { inputClass } from './staffFormUtils.js'

const emptyForm = { name: '', code: '', headName: '', description: '', status: 'Active' }

export default function StaffDepartmentsPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      setError('')
      setRows(await getStaffDepartments())
    } catch (err) {
      setError(err?.message || 'Unable to load departments')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { reload() }, [reload])
  useEffect(() => {
    if (!toast) return undefined
    const t = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(t)
  }, [toast])

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setFormOpen(true) }
  const openEdit = (row) => {
    setEditingId(row._id)
    setForm({ name: row.name, code: row.code, headName: row.headName, description: row.description, status: row.status })
    setFormOpen(true)
  }

  const save = async () => {
    if (!form.name.trim()) return setError('Department name is required')
    setSaving(true)
    setError('')
    try {
      if (editingId) await updateStaffDepartment(editingId, form)
      else await createStaffDepartment(form)
      setToast(editingId ? 'Department updated' : 'Department created')
      setFormOpen(false)
      await reload()
    } catch (err) {
      setError(err?.message || 'Unable to save department')
    } finally {
      setSaving(false)
    }
  }

  const toggleStatus = async (row) => {
    try {
      await setStaffDepartmentStatus(row._id, row.status === 'Active' ? 'Inactive' : 'Active')
      setToast(`Department ${row.status === 'Active' ? 'deactivated' : 'activated'}`)
      await reload()
    } catch (err) {
      setError(err?.message || 'Unable to update status')
    }
  }

  const handleArchive = async (row) => {
    const ok = window.confirm(`Archive ${row.name}?\n\nThis will permanently remove the department record — only possible when no staff are assigned to it.`)
    if (!ok) return
    try {
      await archiveStaffDepartment(row._id)
      setToast('Department archived')
      await reload()
    } catch (err) {
      setError(err?.message || 'Archive failed')
    }
  }

  const columns = [
    { key: 'name', label: 'Department', render: (row) => (
      <div>
        <p className="font-semibold text-slate-900">{row.name}</p>
        <p className="text-xs text-slate-500">{row.code || '—'}{row.headName ? ` · Head: ${row.headName}` : ''}</p>
      </div>
    ) },
    { key: 'totalStaff', label: 'Total Staff' },
    { key: 'activeStaff', label: 'Active Staff' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: '_actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={() => openEdit(row)} className="inline-flex items-center gap-1 rounded-full border border-[#008C95]/30 bg-[#008C95]/10 px-2.5 py-1 text-xs font-semibold text-[#008C95]">
            <Pencil size={12} /> Edit
          </button>
          <button type="button" onClick={() => toggleStatus(row)} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700">
            <ShieldCheck size={12} /> {row.status === 'Active' ? 'Deactivate' : 'Activate'}
          </button>
          <button type="button" onClick={() => handleArchive(row)} className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-600">
            <Trash2 size={12} /> Archive
          </button>
        </div>
      ),
    },
  ]

  return (
    <section className="space-y-3">
      {toast ? <div className="fixed right-3 top-3 z-[90] rounded-lg bg-[#008C95] px-4 py-2 text-sm font-medium text-white shadow-lg">{toast}</div> : null}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <StatCard label="Total Departments" value={loading ? '—' : String(rows.length)} icon={Building2} />
        <StatCard label="Active" value={loading ? '—' : String(rows.filter((r) => r.status === 'Active').length)} icon={ShieldCheck} />
        <StatCard label="Total Staff Assigned" value={loading ? '—' : String(rows.reduce((s, r) => s + r.totalStaff, 0))} />
      </div>

      {error ? <article className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">{error}</article> : null}

      <div className="flex justify-end gap-2">
        <button type="button" onClick={reload} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
          <RefreshCw size={13} /> Refresh
        </button>
        <PrimaryButton onClick={openCreate}>Add Department</PrimaryButton>
      </div>

      {formOpen ? (
        <Panel title={editingId ? 'Edit department' : 'Add department'} className="p-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Name *</span>
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className={inputClass} />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Code</span>
              <input value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} className={inputClass} />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Department head</span>
              <input value={form.headName} onChange={(e) => setForm((p) => ({ ...p, headName: e.target.value }))} className={inputClass} />
            </label>
            <label className="space-y-1.5 sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Description</span>
              <input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className={inputClass} />
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-4">
            <SecondaryButton onClick={() => setFormOpen(false)} disabled={saving}>Cancel</SecondaryButton>
            <PrimaryButton disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save'}</PrimaryButton>
          </div>
        </Panel>
      ) : null}

      <Panel title="Departments" className="p-3">
        {loading ? (
          <p className="py-8 text-center text-sm text-slate-500">Loading departments…</p>
        ) : (
          <DataTable columns={columns} rows={rows} emptyTitle="No departments added" emptyDescription="Click Add Department to create the first one." />
        )}
      </Panel>
    </section>
  )
}
