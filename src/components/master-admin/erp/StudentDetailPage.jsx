import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BadgeCheck, FileText, IdCard, Link2, Pencil, Save, UserRound, X } from 'lucide-react'
import { Panel, StatusBadge, EmptyState, SkeletonBlock } from '../shared/MasterAdminUI.jsx'
import { getStudentById } from '../../../services/masterAdminStudentsService.js'
import { updateAdmission } from '../../../services/admissionService.js'
import { printAdmissionForm } from '../../../utils/printAdmissionForm.js'
import AdmissionFormPage from './AdmissionFormPage.jsx'

const displayValue = (value) => {
  if (value === 0) return '0'
  if (value === false) return 'No'
  return value || '—'
}

function InfoCard({ title, children, className = '' }) {
  return (
    <article className={`rounded-lg border border-slate-200 bg-white p-3 shadow-sm ${className}`}>
      <h2 className="mb-3 border-b border-slate-100 pb-2 text-sm font-semibold text-slate-900">{title}</h2>
      {children}
    </article>
  )
}

function InfoGrid({ fields }) {
  return (
    <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
      {fields.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <dt className="text-[9px] font-medium uppercase tracking-wide text-slate-400">{label}</dt>
          <dd className="mt-0.5 truncate text-[11px] font-medium text-slate-700">{displayValue(value)}</dd>
        </div>
      ))}
    </dl>
  )
}

function EditGrid({ fields, values, onChange }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {fields.map(([label, key, type = 'text']) => (
        <label key={key} className="min-w-0">
          <span className="text-[9px] font-medium uppercase tracking-wide text-slate-400">{label}</span>
          <input
            type={type}
            value={values[key] || ''}
            onChange={(event) => onChange(key, event.target.value)}
            className="mt-1 h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-[11px] text-slate-700 outline-none focus:border-[#00A896] focus:ring-1 focus:ring-[#00A896]/20"
          />
        </label>
      ))}
    </div>
  )
}

export default function StudentDetailPage({ studentId }) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [entry, setEntry] = useState(null)
  const [activeTab, setActiveTab] = useState('Overview')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [showFullEditForm, setShowFullEditForm] = useState(false)

  useEffect(() => {
    if (!studentId) return
    setLoading(true)
    getStudentById(studentId)
      .then((d) => setEntry(d))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false))
  }, [studentId])

  if (loading) {
    return (
      <section className="space-y-4">
        <SkeletonBlock className="h-8" />
        <SkeletonBlock className="h-40" />
      </section>
    )
  }

  if (!entry) {
    return <EmptyState title="No student found" description="Student may have been removed or the id is invalid." />
  }

  if (showFullEditForm) {
    return (
      <AdmissionFormPage
        editingId={entry.id || studentId}
        embedded
        hideGuardian
        onCancel={() => setShowFullEditForm(false)}
      />
    )
  }

  const details = entry.details || {}
  const get = (...keys) => {
    for (const key of keys) {
      const value = details[key] ?? entry[key]
      if (value !== undefined && value !== null && value !== '') return value
    }
    return '—'
  }
  const photo = details.photoPreview || details.photo || details.photoUrl
  const tabs = ['Overview', 'Academic', 'Attendance', 'Fees', 'Results', 'Documents', 'History']
  const studentKey = encodeURIComponent(String(entry.admissionId || entry.id || studentId))
  const academicFields = [
    ['Course', 'course'],
    ['Course Code', 'courseCode'],
    ['Session', 'session'],
    ['Batch', 'batchId'],
    ['Current Term', 'term'],
    ['University', 'universityName'],
  ]
  const attendanceFields = [
    ['Attendance Percentage', 'attendancePercentage'],
    ['Attendance Status', 'attendanceStatus'],
    ['Last Attendance Date', 'lastAttendanceDate', 'date'],
    ['Attendance Note', 'attendanceNote'],
  ]
  const feeFields = [
    ['Total Fee', 'totalFee'],
    ['Registration Fee', 'registrationFee'],
    ['Paid Fee', 'paidFee'],
    ['Due Fee', 'dueFee'],
    ['Fee Status', 'feeStatus'],
    ['Next Due Date', 'nextFeeDueDate', 'date'],
  ]
  const documentFields = [
    ['Photo URL', 'photoPreview'],
    ['Aadhaar Document', 'aadhaarDocumentUrl'],
    ['Transfer Certificate', 'transferCertificateUrl'],
    ['Other Document', 'otherDocumentUrl'],
  ]

  const editFields = {
    personal: [
      ['Student ID', 'studentId'],
      ['Admission Number', 'admissionId'],
      ['Name English', 'nameEnglish'],
      ['Name Hindi', 'nameHindi'],
      ['Date of Birth', 'dateOfBirth', 'date'],
      ['Gender', 'gender'],
      ['Category', 'category'],
      ['Samagra ID', 'samagraId'],
      ['Caste Certificate No.', 'casteCertificateNo'],
      ['Marital Status', 'maritalStatus'],
    ],
    guardian: [
      ['Father Name', 'fatherName'],
      ['Mother Name', 'motherName'],
      ['Guardian Name', 'guardianName'],
      ['Relation', 'relation'],
      ['Guardian Mobile', 'guardianMobile'],
      ['Guardian Address', 'guardianAddress'],
    ],
    contact: [
      ['Student Mobile', 'studentMobile'],
      ['Alternate Mobile', 'alternateMobile'],
      ['Email', 'email'],
      ['Office Registration No.', 'officeRegistrationNo'],
    ],
    address: [
      ['Permanent Address', 'permanentAddress'],
      ['Correspondence Address', 'correspondenceAddress'],
      ['Village', 'village'],
      ['Post', 'post'],
      ['Tehsil', 'tehsil'],
      ['District', 'district'],
      ['State', 'state'],
      ['Pin Code', 'pinCode'],
    ],
  }

  const beginEdit = () => {
    setShowFullEditForm(true)
  }

  const updateDraft = (key, value) => {
    setDraft((current) => ({
      ...current,
      details: { ...current.details, [key]: value },
      ...(key === 'nameEnglish' ? { applicant: value } : {}),
      ...(key === 'email' ? { email: value } : {}),
      ...(key === 'studentMobile' || key === 'alternateMobile' ? { phone: value } : {}),
    }))
  }

  const cancelEdit = () => {
    setEditing(false)
    setDraft(null)
    setSaveError('')
  }

  const saveEdit = async () => {
    if (!draft) return
    if (!draft.applicant.trim() || !draft.email.trim() || !draft.phone.trim()) {
      setSaveError('Name, email and mobile are required.')
      return
    }
    setSaving(true)
    setSaveError('')
    try {
      const updated = await updateAdmission(entry.id || studentId, {
        applicant: draft.applicant.trim(),
        email: draft.email.trim(),
        phone: draft.phone.trim(),
        course: draft.details.course || entry.course || '',
        mode: entry.mode || 'Online',
        counsellor: entry.counsellor || '',
        fee: entry.fee || '₹5,000',
        status: entry.status || 'Approved',
        city: entry.city || draft.details.village || '',
        state: entry.state || draft.details.state || '',
        college: entry.college || draft.details.universityName || '',
        studentStatus: entry.studentStatus || '',
        notes: entry.notes || '',
        details: draft.details,
      })
      setEntry({
        ...entry,
        id: entry.id,
        name: updated.applicant,
        email: updated.email,
        mobile: updated.phone,
        phone: updated.phone,
        course: updated.course || entry.course,
        status: updated.status || entry.status,
        details: updated.details || draft.details,
      })
      setEditing(false)
      setDraft(null)
    } catch (error) {
      setSaveError(error?.message || 'Unable to save student details.')
    } finally {
      setSaving(false)
    }
  }

  const openBatches = () => {
    navigate('/master-admin/batches', {
      state: {
        assignStudent: {
          id: entry.id || studentId,
          admissionId: entry.admissionId,
          name: entry.name,
        },
      },
    })
  }

  const printProfile = () => {
    try {
      printAdmissionForm({
        ...entry,
        applicant: entry.name,
        phone: entry.mobile || entry.phone,
      })
    } catch (error) {
      console.error('Unable to print student profile:', error)
    }
  }

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <button type="button" onClick={() => navigate('/master-admin/students')} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600 hover:border-[#00A896] hover:text-[#008C95]"><ArrowLeft size={12} /> Back to list</button>
        <span className="text-[10px] text-slate-400">Student profile</span>
      </div>

      <Panel className="relative overflow-hidden p-3">
        <div className="absolute right-3 top-3"><StatusBadge status={entry.status || 'Active'} /></div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          {photo ? <img src={photo} alt="" className="h-12 w-12 rounded-md object-cover" /> : <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-slate-100 text-slate-400"><UserRound size={22} /></div>}
          <div className="min-w-0 flex-1">
            <h1 className="text-base font-bold uppercase text-slate-900">{entry.name || 'Student'}</h1>
            <p className="text-[10px] text-slate-500">{entry.admissionId || '—'}</p>
            <p className="text-[10px] text-slate-400">Admission: {get('admissionId')}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-4">
              {[
                ['University', get('institutionName', 'universityName', 'universityId', 'college')],
                ['Course', get('course')],
                ['Batch', get('batchId', 'seedBatchId')],
                ['Current Term', get('currentSemester', 'semester', 'term')],
              ].map(([label, value]) => <div key={label}><p className="text-[9px] uppercase text-slate-400">{label}</p><p className="truncate text-[11px] font-medium text-slate-700">{displayValue(value)}</p></div>)}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {!editing ? (
                <button type="button" onClick={beginEdit} className="inline-flex items-center gap-1 rounded-full bg-[#d7193f] px-3 py-1.5 text-[10px] font-bold text-white hover:bg-[#b91435]"><Pencil size={11} /> Edit</button>
              ) : (
                <>
                  <button type="button" onClick={saveEdit} disabled={saving} className="inline-flex items-center gap-1 rounded-full bg-[#008C95] px-3 py-1.5 text-[10px] font-bold text-white hover:bg-[#007680] disabled:cursor-not-allowed disabled:opacity-60"><Save size={11} /> {saving ? 'Saving...' : 'Save'}</button>
                  <button type="button" onClick={cancelEdit} disabled={saving} className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-60"><X size={11} /> Cancel</button>
                </>
              )}
              <button type="button" onClick={openBatches} className="inline-flex items-center gap-1 rounded-full border border-orange-200 px-3 py-1.5 text-[10px] font-semibold text-orange-600"><Link2 size={11} /> Assign Batch</button>
              <button type="button" onClick={printProfile} className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-[10px] font-semibold text-slate-600"><IdCard size={11} /> Print Profile</button>
              <button type="button" onClick={() => navigate(`/master-admin/id-card-generate/${studentKey}`)} className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-[10px] font-semibold text-slate-600"><BadgeCheck size={11} /> Generate ID Card</button>
            </div>
          </div>
        </div>
      </Panel>

      {saveError ? <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{saveError}</p> : null}

      <div className="flex gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
        {tabs.map((tab) => <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`shrink-0 rounded-md px-3 py-1.5 text-[10px] font-semibold transition ${activeTab === tab ? 'bg-[#FF5E14] text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>{tab}</button>)}
      </div>

      {activeTab === 'Overview' ? (
        <div className="grid gap-2 lg:grid-cols-2">
          <InfoCard title="Personal Information">
            {editing && draft ? <EditGrid fields={editFields.personal} values={draft.details} onChange={updateDraft} /> : <InfoGrid fields={[
              ['Student ID', get('studentId', 'registrationNo', 'admissionId')],
              ['Admission Number', get('admissionId')],
              ['Name English', get('nameEnglish', 'applicant', 'name')],
              ['Name Hindi', get('nameHindi')],
              ['Date of Birth', get('dateOfBirth')],
              ['Gender', get('gender')],
              ['Category', get('category')],
              ['Samagra ID', get('samagraId')],
              ['Caste Certificate No.', get('casteCertificateNo')],
              ['Marital Status', get('maritalStatus')],
            ]} />}
          </InfoCard>
          <InfoCard title="Parent / Guardian">
            {editing && draft ? <EditGrid fields={editFields.guardian} values={draft.details} onChange={updateDraft} /> : <InfoGrid fields={[
              ['Father Name', get('fatherName')],
              ['Mother Name', get('motherName')],
              ['Guardian Name', get('guardianName', 'fatherName')],
              ['Relation', get('relation')],
              ['Guardian Mobile', get('guardianMobile')],
              ['Guardian Address', get('guardianAddress', 'permanentAddress')],
            ]} />}
          </InfoCard>
          <InfoCard title="Contact">
            {editing && draft ? <EditGrid fields={editFields.contact} values={{ ...draft.details, email: draft.email }} onChange={(key, value) => key === 'email' ? setDraft((current) => ({ ...current, email: value, details: { ...current.details, email: value } })) : updateDraft(key, value)} /> : <InfoGrid fields={[
              ['Student Mobile', get('studentMobile', 'mobile', 'phone')],
              ['Alternate Mobile', get('alternateMobile', 'contactNo')],
              ['Email', get('email')],
              ['Office Registration No.', get('officeRegistrationNo')],
            ]} />}
            <p className="mt-3 rounded-md border border-[#00A896]/20 bg-[#00A896]/5 p-2 text-[10px] leading-relaxed text-slate-500">Student portal login uses this email or mobile. There is no default password. Ask the student to open Student Sign In and use Forgot password.</p>
          </InfoCard>
          <InfoCard title="Address">
            {editing && draft ? <EditGrid fields={editFields.address} values={draft.details} onChange={updateDraft} /> : <InfoGrid fields={[
              ['Permanent Address', get('permanentAddress', 'homeAddress')],
              ['Correspondence Address', get('correspondenceAddress', 'homeAddress')],
              ['Village', get('village')],
              ['Post', get('post')],
              ['Tehsil', get('tehsil')],
              ['District', get('district')],
              ['State', get('state')],
              ['Pin Code', get('pinCode')],
            ]} />}
          </InfoCard>
        </div>
      ) : activeTab === 'Academic' ? (
        <div className="grid gap-2 lg:grid-cols-2">
          <InfoCard title="Academic Information">
            {editing && draft ? <EditGrid fields={academicFields} values={{ ...draft.details, course: draft.details.course || entry.course }} onChange={updateDraft} /> : <InfoGrid fields={[
              ['Course', get('course')],
              ['Course Code', get('courseCode')],
              ['Session', get('session')],
              ['Batch', get('batchId', 'seedBatchId')],
              ['Current Term', get('currentSemester', 'semester', 'term')],
              ['University', get('institutionName', 'universityName', 'universityId', 'college')],
            ]} />}
          </InfoCard>
          <InfoCard title="Educational Qualification">
            {Array.isArray((editing ? draft?.details : details)?.education) && (editing ? draft.details : details).education.length ? (
              <div className="space-y-3">
                {(editing ? draft.details : details).education.map((row, index) => (
                  <div key={index} className="rounded-md border border-slate-100 p-2">
                    {editing && draft ? <EditGrid fields={[
                      ['Class / Degree', 'className'],
                      ['Board / University', 'board'],
                      ['Year', 'year'],
                      ['Roll No.', 'rollNo'],
                      ['Percentage', 'percentage'],
                      ['Division', 'division'],
                    ]} values={row} onChange={(key, value) => setDraft((current) => ({
                      ...current,
                      details: {
                        ...current.details,
                        education: current.details.education.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item),
                      },
                    }))} /> : <InfoGrid fields={[
                      ['Class / Degree', row.className],
                      ['Board / University', row.board],
                      ['Year', row.year],
                      ['Roll No.', row.rollNo],
                      ['Percentage', row.percentage],
                      ['Division', row.division],
                    ]} />}
                  </div>
                ))}
              </div>
            ) : <p className="text-xs text-slate-500">No academic records available.</p>}
          </InfoCard>
        </div>
      ) : activeTab === 'Attendance' ? (
        <InfoCard title="Attendance Information">
          {editing && draft ? <EditGrid fields={attendanceFields} values={draft.details} onChange={updateDraft} /> : <InfoGrid fields={attendanceFields.map(([label, key]) => [label, get(key)])} />}
        </InfoCard>
      ) : activeTab === 'Fees' ? (
        <InfoCard title="Fee Information">
          {editing && draft ? <EditGrid fields={feeFields} values={draft.details} onChange={updateDraft} /> : <InfoGrid fields={feeFields.map(([label, key]) => [label, get(key)])} />}
        </InfoCard>
      ) : activeTab === 'Documents' ? (
        <InfoCard title="Student Documents">
          {editing && draft ? <EditGrid fields={documentFields} values={draft.details} onChange={updateDraft} /> : <InfoGrid fields={documentFields.map(([label, key]) => [label, get(key)])} />}
          {details.education?.some((row) => row.documentUrl) ? <div className="mt-3 space-y-1 border-t border-slate-100 pt-3">{details.education.filter((row) => row.documentUrl).map((row, index) => <a key={index} href={row.documentUrl} target="_blank" rel="noreferrer" className="block text-xs font-medium text-[#008C95] hover:underline">{row.documentName || row.className || `Education document ${index + 1}`}</a>)}</div> : null}
        </InfoCard>
      ) : (
        <Panel className="p-4"><div className="flex items-center gap-2 text-sm font-semibold text-slate-700"><FileText size={16} className="text-[#FF5E14]" /> {activeTab}</div><p className="mt-2 text-xs text-slate-500">{editing ? 'This section has no editable profile fields yet.' : `${activeTab} records will load on demand.`}</p></Panel>
      )}
    </section>
  )
}
