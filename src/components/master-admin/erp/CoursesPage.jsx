import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BookOpen, Pencil, Plus, RefreshCw, ShieldCheck, Trash2, X } from 'lucide-react'
import {
  activateCourse,
  createCourse,
  deleteCourse,
  getCourses,
  updateCourse,
} from '../../../services/courseService.js'
import { getUniversities } from '../../../services/universityService.js'
import {
  DataTable,
  PageToolbar,
  Panel,
  PrimaryButton,
  SecondaryButton,
  StatCard,
  StatusBadge,
  useClientTable,
  downloadCsv,
} from '../shared/MasterAdminUI.jsx'

const columns = [
  { key: 'name', label: 'Course' },
  { key: 'code', label: 'Code' },
  { key: 'universityLabel', label: 'University / Institute' },
  { key: 'durationDisplay', label: 'Duration' },
  { key: 'semesterCount', label: 'Semesters' },
  { key: 'category', label: 'Category' },
  { key: 'status', label: 'Status' },
]

const emptySubject = () => ({
  name: '',
  code: '',
  theoryHours: 0,
  practicalHours: 0,
  credits: 0,
})

const emptySemester = (number = 1) => ({
  number,
  title: `Semester ${number}`,
  durationMonths: 6,
  description: '',
  subjects: [emptySubject()],
})

const emptyForm = {
  name: '',
  code: '',
  type: 'University',
  universityId: '',
  category: 'Diploma',
  durationMonths: 12,
  durationLabel: '',
  semesterCount: 2,
  semesters: [emptySemester(1), emptySemester(2)],
  fees: {
    total: '',
    registration: '',
    exam: '',
    installmentAllowed: true,
  },
  eligibility: '',
  mode: 'Offline',
  description: '',
  highlightsText: '',
  status: 'Active',
  remarks: '',
}

function mapFormToPayload(form) {
  const semesters = (Array.isArray(form.semesters) ? form.semesters : [])
    .map((sem, index) => ({
      number: Number(sem.number) || index + 1,
      title: String(sem.title || `Semester ${index + 1}`).trim(),
      durationMonths: Number(sem.durationMonths) || 0,
      description: String(sem.description || '').trim(),
      subjects: (Array.isArray(sem.subjects) ? sem.subjects : [])
        .map((sub) => ({
          name: String(sub.name || '').trim(),
          code: String(sub.code || '').trim(),
          theoryHours: Number(sub.theoryHours) || 0,
          practicalHours: Number(sub.practicalHours) || 0,
          credits: Number(sub.credits) || 0,
        }))
        .filter((sub) => sub.name),
    }))
    .filter((sem) => sem.number >= 1)

  return {
    name: form.name,
    code: form.code,
    type: form.type,
    universityId: form.type === 'University' ? form.universityId || null : null,
    category: form.category,
    durationMonths: Number(form.durationMonths) || 0,
    durationLabel: form.durationLabel,
    semesterCount: Number(form.semesterCount) || semesters.length,
    semesters,
    fees: {
      total: form.fees?.total || '',
      registration: form.fees?.registration || '',
      exam: form.fees?.exam || '',
      installmentAllowed: Boolean(form.fees?.installmentAllowed),
    },
    eligibility: form.eligibility,
    mode: form.mode,
    description: form.description,
    highlights: String(form.highlightsText || '')
      .split(/\n|,/)
      .map((s) => s.trim())
      .filter(Boolean),
    status: form.status,
    remarks: form.remarks,
  }
}

function mapRowToForm(row) {
  const semesters =
    Array.isArray(row.semesters) && row.semesters.length
      ? row.semesters.map((sem, index) => ({
          number: sem.number || index + 1,
          title: sem.title || `Semester ${sem.number || index + 1}`,
          durationMonths: sem.durationMonths || 0,
          description: sem.description || '',
          subjects:
            Array.isArray(sem.subjects) && sem.subjects.length
              ? sem.subjects.map((sub) => ({
                  name: sub.name || '',
                  code: sub.code || '',
                  theoryHours: sub.theoryHours || 0,
                  practicalHours: sub.practicalHours || 0,
                  credits: sub.credits || 0,
                }))
              : [emptySubject()],
        }))
      : [emptySemester(1), emptySemester(2)]

  return {
    name: row.name || '',
    code: row.code || '',
    type: row.type || 'University',
    universityId: row.universityId || '',
    category: row.category || 'Diploma',
    durationMonths: row.durationMonths ?? 12,
    durationLabel: row.durationLabel || '',
    semesterCount: row.semesterCount || semesters.length,
    semesters,
    fees: {
      total: row.fees?.total || '',
      registration: row.fees?.registration || '',
      exam: row.fees?.exam || '',
      installmentAllowed:
        typeof row.fees?.installmentAllowed === 'boolean' ? row.fees.installmentAllowed : true,
    },
    eligibility: row.eligibility || '',
    mode: row.mode || 'Offline',
    description: row.description || '',
    highlightsText: Array.isArray(row.highlights) ? row.highlights.join(', ') : '',
    status: row.status || 'Active',
    remarks: row.remarks || '',
  }
}

function Field({ label, children, className = '' }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
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

export default function CoursesPage() {
  const [rows, setRows] = useState([])
  const [stats, setStats] = useState({})
  const [universities, setUniversities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const formRef = useRef(null)

  const closeForm = () => {
    setFormOpen(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const openForm = (nextForm = emptyForm, id = null) => {
    setEditingId(id)
    setForm(nextForm)
    setFormOpen(true)
    window.setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      setError('')
      const [courseData, uniData] = await Promise.all([
        getCourses(),
        getUniversities().catch(() => ({ rows: [] })),
      ])
      setRows(courseData.rows)
      setStats(courseData.stats || {})
      setUniversities((uniData.rows || []).filter((u) => u.status !== 'Inactive'))
    } catch (err) {
      setError(err?.message || 'Unable to load courses')
      setRows([])
      setStats({})
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  useEffect(() => {
    if (!toast) return undefined
    const timer = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(timer)
  }, [toast])

  const table = useClientTable(rows, {
    searchKeys: ['name', 'code', 'universityLabel', 'category', 'durationDisplay'],
    pageSize: 8,
    filterKey: 'status',
  })

  const filterOptions = useMemo(() => ['Active', 'Inactive', 'Draft'], [])

  const updateSemester = (semIndex, key, value) => {
    setForm((prev) => {
      const semesters = [...(prev.semesters || [])]
      semesters[semIndex] = { ...semesters[semIndex], [key]: value }
      return {
        ...prev,
        semesters,
        semesterCount: semesters.length,
      }
    })
  }

  const updateSubject = (semIndex, subIndex, key, value) => {
    setForm((prev) => {
      const semesters = [...(prev.semesters || [])]
      const subjects = [...(semesters[semIndex]?.subjects || [])]
      subjects[subIndex] = { ...subjects[subIndex], [key]: value }
      semesters[semIndex] = { ...semesters[semIndex], subjects }
      return { ...prev, semesters }
    })
  }

  const addSemester = () => {
    setForm((prev) => {
      const nextNumber = (prev.semesters?.length || 0) + 1
      const semesters = [...(prev.semesters || []), emptySemester(nextNumber)]
      return { ...prev, semesters, semesterCount: semesters.length }
    })
  }

  const removeSemester = (semIndex) => {
    setForm((prev) => {
      const semesters = [...(prev.semesters || [])]
      if (semesters.length <= 1) return { ...prev, semesters: [emptySemester(1)], semesterCount: 1 }
      semesters.splice(semIndex, 1)
      const renumbered = semesters.map((sem, i) => ({
        ...sem,
        number: i + 1,
        title: sem.title?.match(/^Semester\s+\d+$/i) ? `Semester ${i + 1}` : sem.title,
      }))
      return { ...prev, semesters: renumbered, semesterCount: renumbered.length }
    })
  }

  const addSubject = (semIndex) => {
    setForm((prev) => {
      const semesters = [...(prev.semesters || [])]
      const subjects = [...(semesters[semIndex]?.subjects || []), emptySubject()]
      semesters[semIndex] = { ...semesters[semIndex], subjects }
      return { ...prev, semesters }
    })
  }

  const removeSubject = (semIndex, subIndex) => {
    setForm((prev) => {
      const semesters = [...(prev.semesters || [])]
      const subjects = [...(semesters[semIndex]?.subjects || [])]
      if (subjects.length <= 1) {
        semesters[semIndex] = { ...semesters[semIndex], subjects: [emptySubject()] }
      } else {
        subjects.splice(subIndex, 1)
        semesters[semIndex] = { ...semesters[semIndex], subjects }
      }
      return { ...prev, semesters }
    })
  }

  const applySemesterPreset = (count) => {
    const n = Math.max(1, Math.min(8, Number(count) || 2))
    setForm((prev) => {
      const monthsEach = prev.durationMonths ? Math.max(1, Math.round(prev.durationMonths / n)) : 6
      const semesters = Array.from({ length: n }, (_, i) => {
        const existing = prev.semesters?.[i]
        return existing
          ? { ...existing, number: i + 1, title: existing.title || `Semester ${i + 1}` }
          : { ...emptySemester(i + 1), durationMonths: monthsEach }
      })
      return {
        ...prev,
        semesterCount: n,
        semesters,
        durationLabel:
          prev.durationLabel ||
          (prev.durationMonths === 6
            ? '6 months'
            : prev.durationMonths === 12
              ? `1 year (${n} semesters)`
              : `${prev.durationMonths} months (${n} semesters)`),
      }
    })
  }

  const handleSave = async () => {
    setError('')
    if (!form.name.trim()) return setError('Course name is required')
    if (form.type === 'University' && !form.universityId) {
      return setError('Select a university for university-linked courses')
    }

    setSaving(true)
    try {
      const payload = mapFormToPayload(form)
      if (editingId) {
        await updateCourse(editingId, payload)
        setToast('Course updated')
      } else {
        await createCourse(payload)
        setToast('Course added')
      }
      closeForm()
      try {
        await reload()
      } catch (reloadErr) {
        // Save succeeded — don't show network errors from refresh as update failure
        setToast('Saved. Refresh the list if data looks stale.')
        console.warn('courses reload after save failed:', reloadErr)
      }
    } catch (err) {
      setError(err?.message || 'Unable to save course')
    } finally {
      setSaving(false)
    }
  }

  const tableColumns = [
    {
      key: 'name',
      label: 'Course',
      render: (row) => (
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => setExpandedId((id) => (id === row._id ? null : row._id))}
            className="truncate text-left font-semibold text-slate-900 hover:text-[#008C95]"
          >
            {row.name}
          </button>
          <p className="truncate text-xs text-slate-500">
            {row.code || 'Code pending'} · {row.mode} · {row.subjectCount || 0} subjects
          </p>
        </div>
      ),
    },
    { key: 'universityLabel', label: 'University / Institute' },
    {
      key: 'durationDisplay',
      label: 'Duration',
      render: (row) => (
        <span className="font-medium text-slate-700">
          {row.durationDisplay}
          {row.semesterCount ? (
            <span className="block text-xs font-normal text-slate-500">
              {row.semesterCount} semester{row.semesterCount === 1 ? '' : 's'}
            </span>
          ) : null}
        </span>
      ),
    },
    { key: 'category', label: 'Category' },
    {
      key: 'fees',
      label: 'Fees',
      render: (row) => <span className="text-slate-700">{row.fees?.total || '—'}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: '_actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex w-full flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => openForm(mapRowToForm(row), row._id)}
            className="inline-flex items-center gap-1 rounded-full border border-[#008C95]/30 bg-[#008C95]/10 px-2.5 py-1 text-xs font-semibold text-[#008C95] transition hover:bg-[#008C95]/15"
          >
            <Pencil size={12} /> Edit
          </button>
          {row.status === 'Inactive' ? (
            <button
              type="button"
              onClick={async () => {
                try {
                  await activateCourse(row._id)
                  setToast('Course activated')
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
                  `${row.name} ko Inactive karein?\n\nRecord database mein rahega. University mapping se bhi sync hoga.`,
                )
                if (!ok) return
                try {
                  await deleteCourse(row._id)
                  setToast('Course marked Inactive')
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

  const previewRows = useMemo(() => rows.filter((r) => r.status === 'Active').slice(0, 4), [rows])
  const expanded = useMemo(() => rows.find((r) => r._id === expandedId) || null, [rows, expandedId])

  return (
    <section className="w-full min-w-0 space-y-3 overflow-x-hidden">
      {toast ? (
        <div className="fixed right-3 top-3 z-[90] max-w-[calc(100vw-1.5rem)] rounded-lg bg-[#008C95] px-4 py-2 text-sm font-medium text-white shadow-lg sm:right-4 sm:top-4">
          {toast}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
        <StatCard label="Total Courses" value={loading ? '—' : String(stats.total ?? rows.length)} icon={BookOpen} />
        <StatCard label="University Linked" value={loading ? '—' : String(stats.university ?? 0)} hint="MCU / RDVV / IGNOU etc." />
        <StatCard label="GST Institute" value={loading ? '—' : String(stats.institute ?? 0)} hint="Grow Skills Tech training" />
        <StatCard label="Total Semesters" value={loading ? '—' : String(stats.semesters ?? 0)} hint="Across all courses" />
      </div>

      {error ? (
        <article className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900">
          {error}
        </article>
      ) : null}

      <PageToolbar
        search={table.search}
        onSearch={table.setSearch}
        searchPlaceholder="Search courses, codes, university…"
        filters={filterOptions}
        filterValue={table.filter}
        onFilter={table.setFilter}
        addLabel="Add Course"
        onAdd={() => openForm(emptyForm, null)}
        onExportCsv={() => downloadCsv('courses.csv', columns, table.filtered)}
        onExportExcel={() => downloadCsv('courses.xls', columns, table.filtered)}
        onExportPdf={() => window.print()}
      />

      {formOpen ? (
        <div ref={formRef}>
          <Panel title={editingId ? 'Edit Course Details' : 'Add Course Details'} className="p-3">
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Course Name">
                <input
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  className={inputClassName()}
                  placeholder="e.g. PGDCA / Full Stack Web Development"
                />
              </Field>
              <Field label="Course Code">
                <input
                  value={form.code}
                  onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  className={inputClassName()}
                  placeholder="MCU-PGDCA / GST-FSWD"
                />
              </Field>
              <Field label="Type">
                <select
                  value={form.type}
                  onChange={(e) => {
                    const type = e.target.value
                    setForm((prev) => ({
                      ...prev,
                      type,
                      universityId: type === 'Institute' ? '' : prev.universityId,
                      category: type === 'Institute' ? 'Training' : prev.category === 'Training' ? 'Diploma' : prev.category,
                      durationMonths: type === 'Institute' ? 6 : prev.durationMonths,
                      durationLabel: type === 'Institute' ? '6 months' : prev.durationLabel,
                    }))
                  }}
                  className={inputClassName()}
                >
                  <option value="University">University Linked</option>
                  <option value="Institute">Grow Skills Tech (Institute)</option>
                </select>
              </Field>

              {form.type === 'University' ? (
                <Field label="University">
                  <select
                    value={form.universityId}
                    onChange={(e) => setForm((prev) => ({ ...prev, universityId: e.target.value }))}
                    className={inputClassName()}
                  >
                    <option value="">Select university</option>
                    {universities.map((uni) => (
                      <option key={uni._id} value={uni._id}>
                        {uni.shortName} — {uni.name}
                      </option>
                    ))}
                  </select>
                </Field>
              ) : (
                <Field label="Institute">
                  <input value="Grow Skills Tech (GST)" disabled className={`${inputClassName()} bg-slate-50`} />
                </Field>
              )}

              <Field label="Category">
                <select
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className={inputClassName()}
                >
                  <option value="Diploma">Diploma</option>
                  <option value="PG Diploma">PG Diploma</option>
                  <option value="Certificate">Certificate</option>
                  <option value="Degree">Degree</option>
                  <option value="Training">Training</option>
                  <option value="Other">Other</option>
                </select>
              </Field>
              <Field label="Status">
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
              <Field label="Duration (months)">
                <input
                  type="number"
                  min={0}
                  value={form.durationMonths}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, durationMonths: Number(e.target.value) || 0 }))
                  }
                  className={inputClassName()}
                />
              </Field>
              <Field label="Duration Label">
                <input
                  value={form.durationLabel}
                  onChange={(e) => setForm((prev) => ({ ...prev, durationLabel: e.target.value }))}
                  className={inputClassName()}
                  placeholder="6 months / 1 year (2 semesters)"
                />
              </Field>
              <Field label="Mode">
                <select
                  value={form.mode}
                  onChange={(e) => setForm((prev) => ({ ...prev, mode: e.target.value }))}
                  className={inputClassName()}
                >
                  <option value="Offline">Offline</option>
                  <option value="Online">Online</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </Field>
              <Field label="Total Fees">
                <input
                  value={form.fees.total}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, fees: { ...prev.fees, total: e.target.value } }))
                  }
                  className={inputClassName()}
                  placeholder="₹18,000"
                />
              </Field>
              <Field label="Registration Fee">
                <input
                  value={form.fees.registration}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      fees: { ...prev.fees, registration: e.target.value },
                    }))
                  }
                  className={inputClassName()}
                  placeholder="₹1,500"
                />
              </Field>
              <Field label="Exam Fee">
                <input
                  value={form.fees.exam}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, fees: { ...prev.fees, exam: e.target.value } }))
                  }
                  className={inputClassName()}
                  placeholder="₹1,000"
                />
              </Field>
              <Field label="Eligibility" className="sm:col-span-2 lg:col-span-3">
                <input
                  value={form.eligibility}
                  onChange={(e) => setForm((prev) => ({ ...prev, eligibility: e.target.value }))}
                  className={inputClassName()}
                  placeholder="Graduate / 10+2 / …"
                />
              </Field>
              <Field label="Description" className="sm:col-span-2 lg:col-span-3">
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  className={inputClassName('textarea')}
                  placeholder="Full course overview…"
                />
              </Field>
              <Field label="Highlights (comma or new line)" className="sm:col-span-2">
                <textarea
                  value={form.highlightsText}
                  onChange={(e) => setForm((prev) => ({ ...prev, highlightsText: e.target.value }))}
                  className={inputClassName('textarea')}
                  placeholder="MCU affiliated, 2 semesters, Practical labs"
                />
              </Field>
              <Field label="Remarks">
                <textarea
                  value={form.remarks}
                  onChange={(e) => setForm((prev) => ({ ...prev, remarks: e.target.value }))}
                  className={inputClassName('textarea')}
                />
              </Field>
              <Field label="Installments">
                <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={Boolean(form.fees.installmentAllowed)}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        fees: { ...prev.fees, installmentAllowed: e.target.checked },
                      }))
                    }
                  />
                  Installment allowed
                </label>
              </Field>
            </div>

            <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Semester structure</h3>
                  <p className="text-xs text-slate-500">
                    PGDCA / DCA jaisa — har semester ke subjects, hours aur credits add karein.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 4, 6].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => applySemesterPreset(n)}
                      className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:border-[#008C95]/40 hover:text-[#008C95]"
                    >
                      {n} Sem
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={addSemester}
                    className="inline-flex items-center gap-1 rounded-full border border-[#008C95]/30 bg-[#008C95]/10 px-2.5 py-1 text-xs font-semibold text-[#008C95]"
                  >
                    <Plus size={12} /> Add Semester
                  </button>
                </div>
              </div>

              {(form.semesters || []).map((sem, semIndex) => (
                <div
                  key={`sem-${semIndex}`}
                  className="rounded-xl border border-slate-200 bg-slate-50/80 p-3"
                >
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">
                      Semester {sem.number || semIndex + 1}
                    </p>
                    {(form.semesters || []).length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeSemester(semIndex)}
                        className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-600"
                      >
                        <X size={12} /> Remove
                      </button>
                    ) : null}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <Field label="Title">
                      <input
                        value={sem.title || ''}
                        onChange={(e) => updateSemester(semIndex, 'title', e.target.value)}
                        className={inputClassName()}
                      />
                    </Field>
                    <Field label="Duration (months)">
                      <input
                        type="number"
                        min={0}
                        value={sem.durationMonths ?? 0}
                        onChange={(e) =>
                          updateSemester(semIndex, 'durationMonths', Number(e.target.value) || 0)
                        }
                        className={inputClassName()}
                      />
                    </Field>
                    <Field label="Description">
                      <input
                        value={sem.description || ''}
                        onChange={(e) => updateSemester(semIndex, 'description', e.target.value)}
                        className={inputClassName()}
                        placeholder="What this semester covers"
                      />
                    </Field>
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Subjects
                      </span>
                      <button
                        type="button"
                        onClick={() => addSubject(semIndex)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#008C95]"
                      >
                        <Plus size={12} /> Subject
                      </button>
                    </div>
                    {(sem.subjects || [emptySubject()]).map((sub, subIndex) => (
                      <div
                        key={`sub-${semIndex}-${subIndex}`}
                        className="grid gap-2 rounded-lg border border-slate-200 bg-white p-2 sm:grid-cols-[1.3fr_0.8fr_0.5fr_0.5fr_0.5fr_auto]"
                      >
                        <input
                          value={sub.name || ''}
                          onChange={(e) => updateSubject(semIndex, subIndex, 'name', e.target.value)}
                          className={inputClassName()}
                          placeholder="Subject name"
                        />
                        <input
                          value={sub.code || ''}
                          onChange={(e) =>
                            updateSubject(semIndex, subIndex, 'code', e.target.value.toUpperCase())
                          }
                          className={inputClassName()}
                          placeholder="Code"
                        />
                        <input
                          type="number"
                          value={sub.theoryHours ?? 0}
                          onChange={(e) =>
                            updateSubject(semIndex, subIndex, 'theoryHours', Number(e.target.value) || 0)
                          }
                          className={inputClassName()}
                          placeholder="Th"
                          title="Theory hours"
                        />
                        <input
                          type="number"
                          value={sub.practicalHours ?? 0}
                          onChange={(e) =>
                            updateSubject(
                              semIndex,
                              subIndex,
                              'practicalHours',
                              Number(e.target.value) || 0,
                            )
                          }
                          className={inputClassName()}
                          placeholder="Pr"
                          title="Practical hours"
                        />
                        <input
                          type="number"
                          value={sub.credits ?? 0}
                          onChange={(e) =>
                            updateSubject(semIndex, subIndex, 'credits', Number(e.target.value) || 0)
                          }
                          className={inputClassName()}
                          placeholder="Cr"
                          title="Credits"
                        />
                        <button
                          type="button"
                          onClick={() => removeSubject(semIndex, subIndex)}
                          className="inline-flex h-10 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600"
                          aria-label="Remove subject"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
              <SecondaryButton onClick={closeForm}>Cancel</SecondaryButton>
              <PrimaryButton disabled={saving} onClick={handleSave}>
                {saving ? 'Saving…' : editingId ? 'Update Course' : 'Save Course'}
              </PrimaryButton>
            </div>
          </Panel>
        </div>
      ) : null}

      <Panel title="Course Snapshot" className="p-3">
        <div className="grid gap-2 lg:grid-cols-2 xl:grid-cols-4">
          {previewRows.map((row) => (
            <article key={row._id} className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-slate-900">{row.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {row.universityLabel} · {row.code || '—'}
                  </p>
                </div>
                <StatusBadge status={row.status} />
              </div>
              <div className="mt-3 space-y-1.5 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-800">Duration:</span> {row.durationDisplay}
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Semesters:</span> {row.semesterCount || 0}
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Fees:</span> {row.fees?.total || '—'}
                </p>
              </div>
            </article>
          ))}
          {!loading && !previewRows.length ? (
            <p className="col-span-full py-6 text-center text-sm text-slate-500">
              No active courses yet. Click Add Course.
            </p>
          ) : null}
        </div>
      </Panel>

      {expanded ? (
        <Panel title={`${expanded.name} — Full Details`} className="p-3">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-slate-600">
              {expanded.universityLabel} · {expanded.durationDisplay} · {expanded.category} ·{' '}
              {expanded.mode}
            </p>
            <button
              type="button"
              onClick={() => setExpandedId(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Close
            </button>
          </div>
          {expanded.description ? (
            <p className="mb-3 text-sm text-slate-700">{expanded.description}</p>
          ) : null}
          <div className="grid gap-2 lg:grid-cols-2">
            {(expanded.semesters || []).map((sem) => (
              <article key={`view-${sem.number}`} className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="font-semibold text-slate-900">
                  {sem.title || `Semester ${sem.number}`}
                  {sem.durationMonths ? (
                    <span className="ml-2 text-xs font-normal text-slate-500">
                      {sem.durationMonths} months
                    </span>
                  ) : null}
                </p>
                {sem.description ? (
                  <p className="mt-1 text-xs text-slate-500">{sem.description}</p>
                ) : null}
                <ul className="mt-2 space-y-1 text-sm text-slate-700">
                  {(sem.subjects || []).map((sub, i) => (
                    <li key={`${sem.number}-${i}`} className="flex justify-between gap-2">
                      <span>
                        {sub.name}
                        {sub.code ? <span className="text-slate-400"> ({sub.code})</span> : null}
                      </span>
                      <span className="shrink-0 text-xs text-slate-500">
                        {sub.credits || 0} cr
                      </span>
                    </li>
                  ))}
                  {!(sem.subjects || []).length ? (
                    <li className="text-slate-400">No subjects listed</li>
                  ) : null}
                </ul>
              </article>
            ))}
          </div>
        </Panel>
      ) : null}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={reload}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-[#FF5E14]/40 hover:text-[#FF5E14]"
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <Panel title="Course Records" className="min-w-0 overflow-hidden p-3">
        {loading ? (
          <p className="py-8 text-center text-sm text-slate-500">Loading courses…</p>
        ) : (
          <>
            <DataTable
              columns={tableColumns}
              rows={table.pageRows}
              emptyTitle="No courses added"
              emptyDescription="University courses (PGDCA, DCA…) aur GST 6-month training courses yahan manage karein."
            />
            <div className="mt-3 text-xs text-slate-500">
              University-linked courses yahan manage hote hain aur university se <code>universityId</code> ke
              through link rehte hain. Course name pe click karke semester details dekhein.
            </div>
          </>
        )}
      </Panel>
    </section>
  )
}
