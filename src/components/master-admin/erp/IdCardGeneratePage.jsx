import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle2, IdCard, Printer, RefreshCw } from 'lucide-react'
import { getAdmissions } from '../../../services/admissionService.js'
import logo from '../../../assets/logo.png'
import {
  Panel,
  PageToolbar,
  DataTable,
  Pagination,
  StatusBadge,
  useClientTable,
} from '../shared/MasterAdminUI.jsx'
import { card, primaryBtn, secondaryBtn } from '../../../utils/masterAdminTheme.js'
import { printStudentIdCard } from '../../../utils/printStudentIdCard.js'

const CARD_TYPES = [
  {
    id: 'classic',
    name: 'Prime Vertical',
    description: 'Portrait label with security strip',
  },
  {
    id: 'horizontal',
    name: 'Wallet Label',
    description: 'Landscape pass with accent rail',
  },
  {
    id: 'minimal',
    name: 'Clean Label',
    description: 'High-contrast minimal identity',
  },
  {
    id: 'dark',
    name: 'Night Pass',
    description: 'Dark advanced label with teal edge',
  },
  {
    id: 'campus',
    name: 'Spectrum Label',
    description: 'Brand mesh badge with round photo',
  },
]

function formatDob(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('en-GB')
}

function normalizeStudent(row) {
  const d = row?.details && typeof row.details === 'object' ? row.details : {}
  return {
    ...row,
    id: row._id || row.admissionId,
    name: d.nameEnglish || row.applicant || '—',
    fatherName: d.fatherName || '—',
    motherName: d.motherName || '—',
    dob: formatDob(d.dateOfBirth || row.dob),
    gender: d.gender || '—',
    bloodGroup: d.bloodGroup || '—',
    category: d.category || '—',
    course: row.course || d.course || '—',
    session: d.session || '—',
    mode: row.mode || '—',
    phone: d.studentMobile || d.contactNo || row.phone || '—',
    email: row.email || d.email || '—',
    address: d.permanentAddress || d.homeAddress || '—',
    city: row.city || d.village || '—',
    state: row.state || '—',
    rollNo: d.registrationNo || row.admissionId || '—',
    admissionId: row.admissionId || '—',
    photo: d.photoPreview || '',
    status: row.status || '—',
    college: row.college || 'Grow Skills Tech',
  }
}

function studentRouteKey(row) {
  const raw =
    row?.admissionId && row.admissionId !== '—'
      ? row.admissionId
      : row?.id || row?._id || ''
  return encodeURIComponent(String(raw))
}

function matchStudent(rows, studentId) {
  if (!studentId || !rows?.length) return null
  let key = String(studentId)
  try {
    key = decodeURIComponent(key)
  } catch {
    /* keep raw */
  }
  return (
    rows.find(
      (r) =>
        String(r.admissionId) === key ||
        String(r.id) === key ||
        String(r._id) === key
    ) || null
  )
}

function QrMark({ className = '', invert = false }) {
  const on = invert ? 'bg-slate-900' : 'bg-white'
  return (
    <div
      className={`grid h-11 w-11 shrink-0 grid-cols-5 gap-px rounded-md p-1 ${
        invert ? 'bg-white/90' : 'bg-slate-900'
      } ${className}`}
      aria-hidden
    >
      {Array.from({ length: 25 }).map((_, i) => (
        <span
          key={i}
          className={
            [0, 1, 2, 4, 5, 6, 10, 12, 14, 18, 19, 20, 22, 23, 24].includes(i) ? on : 'bg-transparent'
          }
        />
      ))}
    </div>
  )
}

function PhotoSlot({ src, size = 'md', className = '', rounded = 'rounded-xl' }) {
  const sizeClass =
    size === 'sm'
      ? 'h-14 w-14'
      : size === 'lg'
        ? 'h-[5.25rem] w-[4.5rem]'
        : size === 'xl'
          ? 'h-[6.25rem] w-[5.25rem]'
          : size === 'round'
            ? 'h-24 w-24'
            : 'h-20 w-[4.25rem]'

  return (
    <div
      className={`${sizeClass} ${rounded} shrink-0 overflow-hidden bg-slate-200/90 ring-2 ring-white shadow-[0_6px_16px_rgba(15,23,42,0.14)] ${className}`}
    >
      {src ? (
        <img src={src} alt="Student" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Photo
        </div>
      )}
    </div>
  )
}

function Field({ label, value, light = false, compact = false, full = false }) {
  return (
    <div className={full ? 'col-span-2 min-w-0' : 'min-w-0'}>
      <p
        className={`${compact ? 'text-[7px]' : 'text-[8px]'} font-bold uppercase tracking-[0.16em] ${
          light ? 'text-white/50' : 'text-slate-400'
        }`}
      >
        {label}
      </p>
      <p
        className={`break-words whitespace-normal font-bold leading-snug ${
          compact ? 'text-[10px]' : 'text-[11px]'
        } ${light ? 'text-white' : 'text-slate-900'}`}
      >
        {value || '—'}
      </p>
    </div>
  )
}

function Chip({ children, tone = 'teal' }) {
  const tones = {
    teal: 'bg-[#008C95]/12 text-[#008C95]',
    orange: 'bg-[#FF5E14]/12 text-[#FF5E14]',
    slate: 'bg-slate-100 text-slate-600',
    glass: 'bg-white/15 text-white backdrop-blur-sm',
  }
  return (
    <span
      className={`inline-block max-w-full break-words whitespace-normal rounded px-1.5 py-0.5 text-[8px] font-bold leading-snug tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

function SecurityStrip({ light = false }) {
  return (
    <div
      className={`flex h-1.5 w-full overflow-hidden ${light ? 'opacity-90' : ''}`}
      aria-hidden
    >
      <span className="w-[38%] bg-[#008C95]" />
      <span className="w-[24%] bg-[#FF5E14]" />
      <span className="w-[18%] bg-[#00A896]" />
      <span className="w-[20%] bg-slate-800" />
    </div>
  )
}

function IdCardPreview({ type, student, selected, onSelect }) {
  const s = student
  const meta = CARD_TYPES.find((c) => c.id === type)
  const isWide = type === 'horizontal'

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative w-full rounded-2xl border p-4 text-left transition duration-300 ${
        isWide ? 'md:col-span-2' : ''
      } ${
        selected
          ? 'border-[#FF5E14]/70 bg-gradient-to-br from-[#FF5E14]/8 to-[#008C95]/5 shadow-[0_12px_32px_rgba(255,94,20,0.12)] ring-2 ring-[#FF5E14]/25'
          : 'border-slate-200/80 bg-slate-50/40 hover:border-[#00A896]/40 hover:bg-white hover:shadow-md'
      }`}
    >
      {selected ? (
        <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-[#FF5E14] px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
          <CheckCircle2 size={12} /> Selected
        </span>
      ) : null}

      <div className="mb-4 pr-16">
        <p className="text-sm font-bold tracking-tight text-slate-800">{meta?.name}</p>
        <p className="mt-0.5 text-[11px] text-slate-500">{meta?.description}</p>
      </div>

      <div className={`flex py-1 ${isWide ? 'justify-start' : 'justify-center'}`}>
        {type === 'classic' ? <ClassicCard student={s} /> : null}
        {type === 'horizontal' ? <HorizontalCard student={s} /> : null}
        {type === 'minimal' ? <MinimalCard student={s} /> : null}
        {type === 'dark' ? <DarkCard student={s} /> : null}
        {type === 'campus' ? <CampusCard student={s} /> : null}
      </div>
    </button>
  )
}

function ClassicCard({ student: s }) {
  return (
    <div className="relative w-full max-w-[300px] overflow-hidden rounded-2xl bg-white shadow-[0_16px_36px_rgba(15,23,42,0.14)] ring-1 ring-slate-200/80">
      <SecurityStrip />
      <div className="relative bg-gradient-to-br from-[#0a6f76] via-[#008C95] to-[#00A896] px-3.5 pb-9 pt-3">
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/20" />
        <div className="relative z-10 flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-start gap-2">
            <img src={logo} alt="" className="h-8 w-8 shrink-0 rounded-lg bg-white object-contain p-1 shadow-sm" />
            <div className="min-w-0 pt-0.5">
              <p className="text-[10px] font-black leading-tight tracking-[0.08em] text-white">GROW SKILLS TECH</p>
              <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-white/75">Advanced ID Label</p>
            </div>
          </div>
          <span className="shrink-0 rounded bg-[#FF5E14] px-1.5 py-0.5 text-[7px] font-black tracking-wide text-white">
            VALID
          </span>
        </div>
      </div>

      <div className="relative px-3.5 pb-3 pt-1">
        <div className="-mt-8 mb-2.5 flex items-end gap-3">
          <PhotoSlot src={s.photo} size="lg" className="ring-[#00A896]/40" />
          <div className="min-w-0 flex-1 pb-0.5">
            <p className="break-words text-[12px] font-black uppercase leading-snug tracking-tight text-slate-900">
              {s.name}
            </p>
            <div className="mt-1">
              <Chip tone="teal">{s.course}</Chip>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-2 rounded-xl border border-slate-100 bg-slate-50/90 p-2.5">
          <Field label="Father" value={s.fatherName} compact full />
          <Field label="ID / Roll" value={s.rollNo} compact full />
          <Field label="DOB" value={s.dob} compact />
          <Field label="Blood" value={s.bloodGroup} compact />
          <Field label="Phone" value={s.phone} compact />
          <Field label="Session" value={s.session} compact />
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-dashed border-slate-200 pt-2">
          <span className="text-[8px] font-bold tracking-[0.12em] text-slate-400">IT TRAINING CENTER</span>
          <QrMark />
        </div>
      </div>
    </div>
  )
}

function HorizontalCard({ student: s }) {
  return (
    <div className="relative flex w-full max-w-[520px] overflow-hidden rounded-2xl bg-white shadow-[0_16px_36px_rgba(15,23,42,0.14)] ring-1 ring-slate-200/80">
      <div className="relative w-3 shrink-0 bg-gradient-to-b from-[#FF5E14] via-[#008C95] to-[#0B1C24]" />
      <div className="relative w-12 shrink-0 overflow-hidden bg-[#0B1C24] sm:w-14">
        <div className="relative z-10 flex h-full flex-col items-center justify-between px-1 py-3">
          <img src={logo} alt="" className="h-7 w-7 rounded-lg bg-white object-contain p-0.5 sm:h-8 sm:w-8" />
          <p className="rotate-180 text-[7px] font-bold tracking-[0.18em] text-white/85 [writing-mode:vertical-rl]">
            ADVANCED LABEL
          </p>
        </div>
      </div>

      <div className="relative flex min-w-0 flex-1 flex-col gap-2 p-3 sm:flex-row sm:gap-3">
        <PhotoSlot src={s.photo} size="xl" rounded="rounded-xl" />
        <div className="relative z-10 min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <Chip tone="orange">STUDENT PASS</Chip>
            <Chip tone="slate">{s.session}</Chip>
          </div>
          <p className="break-words text-[13px] font-black uppercase leading-snug tracking-tight text-slate-900">
            {s.name}
          </p>
          <p className="break-words text-[10px] font-semibold leading-snug text-[#008C95]">{s.course}</p>
          <div className="grid grid-cols-1 gap-y-1.5 border-t border-slate-100 pt-1.5 sm:grid-cols-2 sm:gap-x-3">
            <Field label="Father" value={s.fatherName} compact full />
            <Field label="ID" value={s.rollNo} compact full />
            <Field label="DOB" value={s.dob} compact />
            <Field label="Phone" value={s.phone} compact />
            <Field label="Blood" value={s.bloodGroup} compact />
            <Field label="Session" value={s.session} compact />
          </div>
        </div>
        <div className="absolute bottom-3 right-3 hidden sm:block">
          <QrMark />
        </div>
      </div>
    </div>
  )
}

function MinimalCard({ student: s }) {
  return (
    <div className="relative w-full max-w-[300px] overflow-hidden rounded-2xl bg-white shadow-[0_16px_36px_rgba(15,23,42,0.1)] ring-1 ring-slate-200">
      <SecurityStrip />
      <div className="relative px-3.5 pb-3.5 pt-3.5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <img src={logo} alt="" className="h-7 w-7 shrink-0 object-contain" />
            <div className="min-w-0">
              <p className="text-[9px] font-black tracking-[0.1em] text-slate-900">GROW SKILLS TECH</p>
              <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-slate-400">Clean Label</p>
            </div>
          </div>
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#008C95]/10 text-[#008C95]">
            <IdCard size={13} />
          </div>
        </div>

        <div className="flex items-start gap-3">
          <PhotoSlot src={s.photo} size="lg" rounded="rounded-xl" className="ring-slate-200" />
          <div className="min-w-0 flex-1">
            <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#FF5E14]">Member</p>
            <p className="mt-0.5 break-words text-[12px] font-black uppercase leading-snug text-slate-900">
              {s.name}
            </p>
            <p className="mt-1 break-words text-[10px] font-semibold leading-snug text-[#008C95]">{s.course}</p>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-slate-200 pt-3">
          <Field label="ID / Roll" value={s.rollNo} compact full />
          <Field label="Father" value={s.fatherName} compact full />
          <Field label="DOB" value={s.dob} compact />
          <Field label="Phone" value={s.phone} compact />
          <Field label="Blood" value={s.bloodGroup} compact />
          <Field label="Session" value={s.session} compact />
        </div>

        <div className="mt-2.5 flex justify-end">
          <QrMark />
        </div>
      </div>
    </div>
  )
}

function DarkCard({ student: s }) {
  return (
    <div className="relative w-full max-w-[300px] overflow-hidden rounded-2xl bg-[#07161c] text-white shadow-[0_16px_36px_rgba(7,22,28,0.45)] ring-1 ring-white/10">
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-[#00A896] via-[#008C95] to-[#FF5E14]" />
      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#00A896]/20 blur-2xl" />

      <div className="relative px-3.5 pb-3.5 pt-3.5 pl-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <img src={logo} alt="" className="h-8 w-8 shrink-0 rounded-lg bg-white object-contain p-1" />
            <div className="min-w-0">
              <p className="text-[9px] font-black tracking-[0.08em]">GROW SKILLS TECH</p>
              <p className="text-[8px] uppercase tracking-[0.12em] text-white/45">Night Pass Label</p>
            </div>
          </div>
          <Chip tone="glass">ACTIVE</Chip>
        </div>

        <div className="flex items-start gap-3 rounded-xl bg-white/[0.05] p-2.5 ring-1 ring-white/10">
          <PhotoSlot src={s.photo} size="lg" className="ring-[#00A896]/40" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <p className="break-words text-[12px] font-black uppercase leading-snug tracking-tight">{s.name}</p>
            <p className="break-words text-[10px] font-semibold leading-snug text-[#5fd4c8]">{s.course}</p>
          </div>
        </div>

        <div className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-2">
          <Field label="Father" value={s.fatherName} light compact full />
          <Field label="ID / Roll" value={s.rollNo} light compact full />
          <Field label="DOB" value={s.dob} light compact />
          <Field label="Blood" value={s.bloodGroup} light compact />
          <Field label="Phone" value={s.phone} light compact />
          <Field label="Session" value={s.session} light compact />
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-2">
          <p className="text-[8px] font-medium tracking-[0.16em] text-white/40">IT TRAINING CENTER</p>
          <QrMark invert />
        </div>
      </div>
    </div>
  )
}

function CampusCard({ student: s }) {
  return (
    <div className="relative w-full max-w-[300px] overflow-hidden rounded-2xl shadow-[0_16px_36px_rgba(0,140,149,0.22)]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a6f76] via-[#008C95] to-[#FF5E14]" />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,.35), transparent 40%), radial-gradient(circle at 80% 70%, rgba(0,0,0,.2), transparent 45%)',
        }}
      />

      <div className="relative px-3.5 pb-3.5 pt-3.5 text-white">
        <SecurityStrip light />
        <div className="mb-3 mt-2.5 flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <img src={logo} alt="" className="h-8 w-8 shrink-0 rounded-lg bg-white object-contain p-1 shadow" />
            <div className="min-w-0">
              <p className="text-[9px] font-black tracking-[0.06em]">GROW SKILLS TECH</p>
              <p className="text-[8px] uppercase tracking-[0.12em] text-white/75">Spectrum Label</p>
            </div>
          </div>
          <QrMark invert />
        </div>

        <div className="flex flex-col items-center rounded-xl bg-white/12 p-3 ring-1 ring-white/25 backdrop-blur-md">
          <PhotoSlot src={s.photo} size="round" rounded="rounded-full" className="ring-2 ring-white/80" />
          <p className="mt-2.5 w-full break-words text-center text-[12px] font-black uppercase leading-snug tracking-tight">
            {s.name}
          </p>
          <p className="mt-1 w-full break-words text-center text-[10px] font-semibold leading-snug text-white/90">
            {s.course}
          </p>
          <div className="mt-2.5 grid w-full grid-cols-2 gap-x-3 gap-y-2 text-left">
            <Field label="ID / Roll" value={s.rollNo} light compact full />
            <Field label="Father" value={s.fatherName} light compact full />
            <Field label="DOB" value={s.dob} light compact />
            <Field label="Phone" value={s.phone} light compact />
            <Field label="Blood" value={s.bloodGroup} light compact />
            <Field label="Session" value={s.session} light compact />
          </div>
        </div>
      </div>
    </div>
  )
}

function DesignsView({ student, loading, error, onBack, onReload }) {
  const [selectedCardType, setSelectedCardType] = useState('classic')
  const [toast, setToast] = useState('')
  const [localError, setLocalError] = useState('')

  useEffect(() => {
    if (!toast) return undefined
    const t = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(t)
  }, [toast])

  const handlePrint = () => {
    if (!student) {
      setLocalError('Student not found')
      return
    }
    try {
      setLocalError('')
      printStudentIdCard(student, selectedCardType)
      setToast(`Printing ${CARD_TYPES.find((c) => c.id === selectedCardType)?.name || 'ID card'}…`)
    } catch (err) {
      setLocalError(err?.message || 'Unable to print ID card')
    }
  }

  const displayError = localError || error

  if (loading) {
    return (
      <div className={`${card} px-4 py-10 text-center`}>
        <RefreshCw className="mx-auto mb-2 animate-spin text-[#008C95]" size={22} />
        <p className="text-sm font-semibold text-slate-800">Loading student…</p>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="space-y-3">
        <button type="button" onClick={onBack} className={secondaryBtn}>
          <ArrowLeft size={14} /> Back to students
        </button>
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {displayError || 'Student not found. Go back and pick another student.'}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {toast ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
          {toast}
        </div>
      ) : null}
      {displayError ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{displayError}</div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={onBack} className={secondaryBtn}>
          <ArrowLeft size={14} /> Back
        </button>
        <button type="button" onClick={onReload} className={secondaryBtn}>
          <RefreshCw size={14} /> Refresh
        </button>
        <button type="button" onClick={handlePrint} className={primaryBtn}>
          <Printer size={14} /> Print selected card
        </button>
      </div>

      <Panel
        title={`ID Cards — ${student.name}`}
        action={
          <span className="text-xs font-medium text-slate-500">{student.admissionId}</span>
        }
      >
        <div className={`${card} mb-4 space-y-2 p-3`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Student details</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Name', student.name],
              ['Father', student.fatherName],
              ['Mother', student.motherName],
              ['DOB', student.dob],
              ['Gender', student.gender],
              ['Blood Group', student.bloodGroup],
              ['Course', student.course],
              ['Session', student.session],
              ['Admission ID', student.admissionId],
              ['Phone', student.phone],
              ['Email', student.email],
              ['Address', student.address],
            ].map(([label, value]) => (
              <div key={label} className="min-w-0">
                <p className="text-[10px] font-medium uppercase text-slate-400">{label}</p>
                <p className="break-words text-sm font-semibold leading-snug text-slate-800" title={String(value)}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          {CARD_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setSelectedCardType(type.id)}
              className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                selectedCardType === type.id
                  ? 'border-[#FF5E14] bg-[#FF5E14] text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-[#00A896] hover:text-[#008C95]'
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {CARD_TYPES.map((type) => (
            <IdCardPreview
              key={type.id}
              type={type.id}
              student={student}
              selected={selectedCardType === type.id}
              onSelect={() => setSelectedCardType(type.id)}
            />
          ))}
        </div>
      </Panel>
    </div>
  )
}

export default function IdCardGeneratePage({ studentId }) {
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    try {
      setError('')
      setLoading(true)
      const data = await getAdmissions()
      const normalized = (data.rows || []).map(normalizeStudent)
      setRows(normalized)
    } catch (err) {
      setError(err?.message || 'Unable to load students')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const table = useClientTable(rows, {
    searchKeys: ['name', 'admissionId', 'rollNo', 'course', 'email', 'phone', 'fatherName'],
    pageSize: 8,
    filterKey: 'status',
  })

  const filterOptions = useMemo(() => {
    const set = new Set(rows.map((r) => r.status).filter(Boolean))
    return [...set]
  }, [rows])

  const openDesigns = useCallback(
    (row) => {
      const key = studentRouteKey(row)
      if (!key) return
      navigate(`/master-admin/id-card-generate/${key}`)
    },
    [navigate]
  )

  const selectedStudent = useMemo(() => matchStudent(rows, studentId), [rows, studentId])

  if (studentId) {
    return (
      <DesignsView
        student={selectedStudent}
        loading={loading}
        error={error}
        onBack={() => navigate('/master-admin/id-card-generate')}
        onReload={reload}
      />
    )
  }

  const columns = [
    { key: 'admissionId', label: 'Admission ID' },
    { key: 'name', label: 'Student Name' },
    { key: 'fatherName', label: 'Father' },
    {
      key: 'course',
      label: 'Course',
      render: (row) => (
        <span className="block max-w-[14rem] break-words whitespace-normal" title={row.course}>
          {row.course}
        </span>
      ),
    },
    { key: 'phone', label: 'Phone' },
    { key: 'session', label: 'Session' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: '_actions',
      label: 'Action',
      render: (row) => (
        <button
          type="button"
          onClick={() => openDesigns(row)}
          className={`${secondaryBtn} !px-2.5 !py-1 text-xs`}
        >
          <IdCard size={13} /> Generate
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
      ) : null}

      <PageToolbar
        search={table.search}
        onSearch={table.setSearch}
        searchPlaceholder="Search by name, ID, course, phone…"
        filters={filterOptions}
        filterValue={table.filter}
        onFilter={table.setFilter}
        extraActions={
          <button type="button" onClick={reload} className={secondaryBtn} disabled={loading}>
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        }
      />

      <Panel
        title="All Students"
        action={
          <span className="text-xs font-medium text-slate-500">
            {loading ? 'Loading…' : `${rows.length} students from admissions`}
          </span>
        }
      >
        <DataTable
          columns={columns}
          rows={loading ? [] : table.pageRows}
          emptyTitle={loading ? 'Loading students…' : 'No students found'}
          emptyDescription={loading ? 'Please wait' : 'Try a different search or filter.'}
          onRowClick={openDesigns}
        />
        {!loading && rows.length > 0 ? (
          <Pagination
            page={table.page}
            pageSize={table.pageSize}
            total={table.total}
            onPageChange={table.setPage}
          />
        ) : null}
      </Panel>

      <div className={`${card} px-4 py-8 text-center`}>
        <IdCard className="mx-auto mb-2 text-[#008C95]" size={28} />
        <p className="text-sm font-semibold text-slate-800">Click a student to open ID card designs</p>
        <p className="mt-1 text-xs text-slate-500">
          Row click or Generate opens a dedicated page with all advanced label templates.
        </p>
      </div>
    </div>
  )
}
