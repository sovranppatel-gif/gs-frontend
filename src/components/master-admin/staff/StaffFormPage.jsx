import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createStaff, getStaffMeta } from '../../../services/staffService.js'
import { PrimaryButton, SecondaryButton } from '../shared/MasterAdminUI.jsx'
import StaffForm from './StaffForm.jsx'
import { emptyStaffForm, formToPayload } from './staffFormUtils.js'

export default function StaffFormPage() {
  const navigate = useNavigate()
  const [meta, setMeta] = useState({ departments: [], designations: [], employmentTypes: [], workModes: [], statuses: [] })
  const [form, setForm] = useState(() => emptyStaffForm())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getStaffMeta().then(setMeta).catch(() => {})
  }, [])

  const save = async () => {
    if (!String(form.firstName || '').trim()) return setError('First name is required')
    if (!String(form.personalMobile || '').trim()) return setError('Personal mobile is required')
    if (!String(form.officialEmail || '').trim()) return setError('Official email is required')
    if (!form.departmentId) return setError('Department is required')
    if (!form.designationId) return setError('Designation is required')
    setSaving(true)
    setError('')
    try {
      const entry = await createStaff(formToPayload(form))
      navigate(`/master-admin/staff/${entry._id}`)
    } catch (err) {
      setError(err?.message || 'Unable to create staff member')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="space-y-3">
      {error ? <article className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">{error}</article> : null}
      <StaffForm form={form} setForm={setForm} meta={meta} isCreate onUploadError={setError} />
      <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
        <SecondaryButton onClick={() => navigate('/master-admin/staff')} disabled={saving}>Cancel</SecondaryButton>
        <PrimaryButton disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save staff member'}</PrimaryButton>
      </div>
    </section>
  )
}
