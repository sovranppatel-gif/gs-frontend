import { useMemo, useState } from 'react'
import { Camera } from 'lucide-react'
import { DateInput } from '../../shared/DateInput.jsx'
import { uploadStaffPhoto } from '../../../services/staffService.js'
import { API_URL } from '../../../utils/api.js'
import { STAFF_GENDERS, inputClass, photoSrc, staffInitials } from './staffFormUtils.js'

function Field({ label, required = false, children, className = '' }) {
  return (
    <label className={`block space-y-1.5 ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
        {required ? <span className="text-rose-500"> *</span> : null}
      </span>
      {children}
    </label>
  )
}

function Section({ title, hint, children }) {
  return (
    <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/80 p-3">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {hint ? <p className="mt-0.5 text-xs text-slate-500">{hint}</p> : null}
      </div>
      {children}
    </div>
  )
}

export default function StaffForm({ form, setForm, meta, isCreate, onUploadError, existingAccountNumberMask }) {
  const [uploading, setUploading] = useState(false)
  const src = photoSrc(form.profilePhoto, API_URL)
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const departmentDesignations = useMemo(
    () => (meta?.designations || []).filter((d) => !form.departmentId || d.departmentId === form.departmentId),
    [meta, form.departmentId],
  )

  const onPhoto = async (file) => {
    if (!file) return
    setUploading(true)
    try {
      const data = await uploadStaffPhoto(file)
      set('profilePhoto', data.url)
    } catch (err) {
      onUploadError?.(err?.message || 'Unable to upload photo')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <Section title="Personal information">
        <div className="flex flex-wrap items-start gap-3">
          <div className="relative">
            {src ? (
              <img src={src} alt="" className="h-20 w-20 rounded-lg border border-slate-200 object-cover" />
            ) : (
              <div className="grid h-20 w-20 place-items-center rounded-lg border border-slate-200 bg-white text-lg font-bold text-slate-700">
                {staffInitials(`${form.firstName} ${form.lastName}`)}
              </div>
            )}
            <label className="absolute -bottom-2 -right-2 grid h-8 w-8 cursor-pointer place-items-center rounded-full bg-slate-900 text-white">
              <Camera size={14} />
              <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => onPhoto(e.target.files?.[0])} />
            </label>
          </div>
          <p className="pt-2 text-xs text-slate-500">{uploading ? 'Uploading…' : 'JPG / PNG, max 400 KB'}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="First name" required>
            <input value={form.firstName} onChange={(e) => set('firstName', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Middle name">
            <input value={form.middleName} onChange={(e) => set('middleName', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Last name">
            <input value={form.lastName} onChange={(e) => set('lastName', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Father / mother name">
            <input value={form.parentName} onChange={(e) => set('parentName', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Date of birth">
            <DateInput value={form.dateOfBirth} onChange={(v) => set('dateOfBirth', v)} className={inputClass} />
          </Field>
          <Field label="Gender">
            <select value={form.gender} onChange={(e) => set('gender', e.target.value)} className={inputClass}>
              {STAFF_GENDERS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </Field>
          <Field label="Blood group">
            <input value={form.bloodGroup} onChange={(e) => set('bloodGroup', e.target.value)} className={inputClass} placeholder="O+" />
          </Field>
          <Field label="Personal mobile" required>
            <input value={form.personalMobile} onChange={(e) => set('personalMobile', e.target.value)} className={inputClass} placeholder="10-digit mobile" />
          </Field>
          <Field label="WhatsApp">
            <input value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Personal email">
            <input type="email" value={form.personalEmail} onChange={(e) => set('personalEmail', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Official email" required>
            <input type="email" value={form.officialEmail} onChange={(e) => set('officialEmail', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Alternate contact">
            <input value={form.alternateContact} onChange={(e) => set('alternateContact', e.target.value)} className={inputClass} />
          </Field>
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          <Field label="Address" className="sm:col-span-4">
            <input value={form.address} onChange={(e) => set('address', e.target.value)} className={inputClass} />
          </Field>
          <Field label="City">
            <input value={form.city} onChange={(e) => set('city', e.target.value)} className={inputClass} />
          </Field>
          <Field label="State">
            <input value={form.state} onChange={(e) => set('state', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Pincode">
            <input value={form.pincode} onChange={(e) => set('pincode', e.target.value)} className={inputClass} />
          </Field>
        </div>
      </Section>

      <Section title="Emergency contact">
        <div className="grid gap-3 sm:grid-cols-4">
          <Field label="Contact name">
            <input value={form.emergencyName} onChange={(e) => set('emergencyName', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Relationship">
            <input value={form.emergencyRelationship} onChange={(e) => set('emergencyRelationship', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Phone">
            <input value={form.emergencyPhone} onChange={(e) => set('emergencyPhone', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Alternate phone">
            <input value={form.emergencyAlternatePhone} onChange={(e) => set('emergencyAlternatePhone', e.target.value)} className={inputClass} />
          </Field>
        </div>
      </Section>

      <Section title="Employment information">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Department" required>
            <select
              value={form.departmentId}
              onChange={(e) => set('departmentId', e.target.value)}
              className={inputClass}
            >
              <option value="">Select department</option>
              {(meta?.departments || []).map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Designation" required>
            <select
              value={form.designationId}
              onChange={(e) => set('designationId', e.target.value)}
              className={inputClass}
              disabled={!form.departmentId}
            >
              <option value="">{form.departmentId ? 'Select designation' : 'Select department first'}</option>
              {departmentDesignations.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Branch / location">
            <input value={form.branch} onChange={(e) => set('branch', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Joining date" required>
            <DateInput value={form.joiningDate} onChange={(v) => set('joiningDate', v)} className={inputClass} />
          </Field>
          <Field label="Employment type">
            <select value={form.employmentType} onChange={(e) => set('employmentType', e.target.value)} className={inputClass}>
              {(meta?.employmentTypes || []).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Work mode">
            <select value={form.workMode} onChange={(e) => set('workMode', e.target.value)} className={inputClass}>
              {(meta?.workModes || []).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </Field>
          <Field label="Probation period (months)">
            <input type="number" min="0" value={form.probationPeriodMonths} onChange={(e) => set('probationPeriodMonths', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Probation end date">
            <DateInput value={form.probationEndDate} onChange={(v) => set('probationEndDate', v)} className={inputClass} />
          </Field>
          <Field label="Shift">
            <input value={form.shift} onChange={(e) => set('shift', e.target.value)} className={inputClass} placeholder="10 AM – 7 PM" />
          </Field>
          <Field label="Weekly working days">
            <input type="number" min="0" max="7" value={form.weeklyWorkingDays} onChange={(e) => set('weeklyWorkingDays', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inputClass}>
              {(meta?.statuses || []).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      <Section title="Salary information" hint="Not shown in the staff list or exports — profile view only.">
        <div className="grid gap-3 sm:grid-cols-4">
          {[
            ['monthlySalary', 'Monthly salary'],
            ['basic', 'Basic'],
            ['hra', 'HRA'],
            ['allowances', 'Allowances'],
            ['incentives', 'Incentives'],
            ['variablePay', 'Variable pay'],
            ['deductions', 'Deductions'],
          ].map(([key, label]) => (
            <Field key={key} label={label}>
              <input type="number" min="0" value={form[key]} onChange={(e) => set(key, e.target.value)} className={inputClass} />
            </Field>
          ))}
        </div>
      </Section>

      <Section title="Bank information" hint="Account number is masked once saved — retype it only to change it.">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Bank name">
            <input value={form.bankName} onChange={(e) => set('bankName', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Account holder name">
            <input value={form.accountHolderName} onChange={(e) => set('accountHolderName', e.target.value)} className={inputClass} />
          </Field>
          <Field label="Account number">
            <input
              value={form.accountNumber}
              onChange={(e) => set('accountNumber', e.target.value)}
              className={inputClass}
              placeholder={existingAccountNumberMask || 'Enter to set / change'}
            />
          </Field>
          <Field label="IFSC">
            <input value={form.ifsc} onChange={(e) => set('ifsc', e.target.value.toUpperCase())} className={inputClass} placeholder="HDFC0001234" />
          </Field>
          <Field label="Branch">
            <input value={form.bankBranch} onChange={(e) => set('bankBranch', e.target.value)} className={inputClass} />
          </Field>
        </div>
      </Section>

      <Section title="Account / login">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Login enabled">
            <label className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm">
              <input type="checkbox" checked={form.loginEnabled} onChange={(e) => set('loginEnabled', e.target.checked)} />
              Allow this staff member to log in
            </label>
          </Field>
          <Field label="Username / official email">
            <input value={form.username} onChange={(e) => set('username', e.target.value)} className={inputClass} placeholder={form.officialEmail} />
          </Field>
          <Field label={isCreate ? 'Password' : 'New password (optional)'} required={isCreate && form.loginEnabled}>
            <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} className={inputClass} placeholder={isCreate ? '' : 'Leave blank to keep current'} />
          </Field>
        </div>
      </Section>
    </div>
  )
}
