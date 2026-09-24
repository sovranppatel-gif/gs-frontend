import { useCallback, useEffect, useState } from 'react'
import { Layers, Pencil, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react'
import {
  archiveStaffDesignation,
  createStaffDesignation,
  getStaffDepartments,
  getStaffDesignations,
  setStaffDesignationStatus,
  updateStaffDesignation,
} from '../../../services/staffService.js'
import { DataTable, Panel, PrimaryButton, SecondaryButton, StatCard, StatusBadge } from '../shared/MasterAdminUI.jsx'
import { inputClass } from './staffFormUtils.js'

const emptyForm = { name: '', code: '', departmentId: '', description: '', level: 0, status: 'Active' }

export default function StaffDesignationsPage() {
  const [rows, setRows] = useState([])
  const [departments, setDepartments] = useState([])
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
      const [designations, depts] = await Promise.all([getStaffDesignations(), getStaffDepartments()])
      setRows(designations)
      setDepartments(depts)
    } catch (err) {
      setError(err?.message || 'Unable to load designations')
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
    setForm({ name: row.name, code: row.code, departmentId: row.departmentId, description: row.description, level: row.level, status: row.status })
    setFormOpen(true)
  }

  const save = async () => {
    if (!form.name.trim()) return setError('Designation name is required')
    setSaving(true)
    setError('')
    try {
      if (editingId) await updateStaffDesignation(editingId, form)
      else await createStaffDesignation(form)
      setToast(editingId ? 'Designation updated' : 'Designation created')
      setFormOpen(false)
      await reload()
    } catch (err) {
      setError(err?.message || 'Unable to save designation')
    } finally {
      setSaving(false)
    }
  }

  const toggleStatus = async (row) => {
    try {
      await setStaffDesignationStatus(row._id, row.status === 'Active' ? 'Inactive' : 'Active')
      setToast(`Designation ${row.status === 'Active' ? 'deactivated' : 'activated'}`)
      await reload()
    } catch (err) {
      setError(err?.message || 'Unable to update status')
    }
  }

  const handleArchive = async (row) => {
    const ok = window.confirm(`Archive ${row.name}?\n\nOnly possible when no staff currently hold this designation.`)
    if (!ok) return
    try {
      await archiveStaffDesignation(row._id)
      setToast('Designation archived')
      await reload()
    } catch (err) {
      setError(err?.message || 'Archive failed')
    }
  }

  const columns = [
    { key: 'name', label: 'Designation', render: (row) => (
      <div>
        <p className="font-semibold text-slate-900">{row.name}</p>
        <p className="text-xs text-slate-500">Level {row.level ?? 0}{row.code ? ` · ${row.code}` : ''}</p>
      </div>
    ) },
    { key: 'departmentName', label: 'Department', render: (row) => row.departmentName || '—' },
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
        <StatCard label="Total Designations" value={loading ? '—' : String(rows.length)} icon={Layers} />
        <StatCard label="Active" value={loading ? '—' : String(rows.filter((r) => r.status === 'Active').length)} icon={ShieldCheck} />
      </div>

      {error ? <article className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">{error}</article> : null}

      <div className="flex justify-end gap-2">
        <button type="button" onClick={reload} className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
          <RefreshCw size={13} /> Refresh
        </button>
        <PrimaryButton onClick={openCreate}>Add Designation</PrimaryButton>
      </div>

      {formOpen ? (
        <Panel title={editingId ? 'Edit designation' : 'Add designation'} className="p-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Name *</span>
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className={inputClass} />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Department</span>
              <select value={form.departmentId} onChange={(e) => setForm((p) => ({ ...p, departmentId: e.target.value }))} className={inputClass}>
                <option value="">No department</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Code</span>
              <input value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))} className={inputClass} />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Level</span>
              <input type="number" min="0" value={form.level} onChange={(e) => setForm((p) => ({ ...p, level: Number(e.target.value) || 0 }))} className={inputClass} />
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

      <Panel title="Designations" className="p-3">
        {loading ? (
          <p className="py-8 text-center text-sm text-slate-500">Loading designations…</p>
        ) : (
          <DataTable columns={columns} rows={rows} emptyTitle="No designations added" emptyDescription="Click Add Designation to create the first one." />
        )}
      </Panel>
    </section>
  )
}
