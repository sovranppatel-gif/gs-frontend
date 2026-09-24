import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  GraduationCap,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
} from 'lucide-react'
import {
  Panel,
  DataTable,
  Pagination,
  StatusBadge,
  StatCard,
  SkeletonBlock,
  EmptyState,
} from '../shared/MasterAdminUI.jsx'
import { getUniversities } from '../../../services/universityService.js'
import { getCourses } from '../../../services/courseService.js'
import { getBatches } from '../../../services/batchService.js'
import { getStudents, getStudentsStats } from '../../../services/masterAdminStudentsService.js'

function useDebouncedValue(value, ms = 350) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return v
}

export default function StudentsPage() {
  const [page, setPage] = useState(1)
  const [limit] = useState(25)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 350)
  const [filterStatus, setFilterStatus] = useState('Approved')
  const [courseId, setCourseId] = useState('')
  const [universityId, setUniversityId] = useState('')
  const [batchId, setBatchId] = useState('')
  const [session, setSession] = useState('')
  const [term, setTerm] = useState('')
  const [gender, setGender] = useState('')
  const [category, setCategory] = useState('')

  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)

  const [universities, setUniversities] = useState([])
  const [courses, setCourses] = useState([])
  const [batches, setBatches] = useState([])

  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  const abortRef = useRef(null)

  useEffect(() => {
    // load cached metadata once
    getUniversities().then((d) => setUniversities(d.rows)).catch(() => {})
    getCourses().then((d) => setCourses(d.rows)).catch(() => {})
    getBatches({}).then((d) => setBatches(d.rows)).catch(() => {})
    getStudentsStats()
      .then((s) => setStats(s))
      .catch(async (error) => {
        console.error('Unable to load student stats:', error)
        try {
          const fallback = await getStudents({ page: 1, limit: 100 })
          const byStatus = Object.entries(
            fallback.items.reduce((counts, item) => {
              const status = item.status || 'Unknown'
              counts[status] = (counts[status] || 0) + 1
              return counts
            }, {}),
          ).map(([status, count]) => ({ status, count }))
          setStats({ total: fallback.total, byStatus })
        } catch (fallbackError) {
          console.error('Unable to load fallback student stats:', fallbackError)
        }
      })
  }, [])

  useEffect(() => {
    setLoading(true)
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller
    const params = {
      page,
      limit,
      search: debouncedSearch || undefined,
      status: filterStatus || undefined,
      courseId: courseId || undefined,
      universityId: universityId || undefined,
      batchId: batchId || undefined,
      session: session || undefined,
      term: term || undefined,
      gender: gender || undefined,
      category: category || undefined,
    }
    getStudents(params, { signal: controller.signal })
      .then((res) => {
        setItems(res.items)
        setTotal(res.total)
      })
      .catch((err) => {
        if (!/timed out|abort/i.test(String(err.message || ''))) console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
    return () => {
      try {
        controller.abort()
      } catch {}
    }
  }, [page, limit, debouncedSearch, filterStatus, courseId, universityId, batchId, session, term, gender, category])

  const cols = useMemo(() => {
    const Avatar = ({ row }) => {
      const name = row.name || 'N/A'
      const photo = row.photo || row.photoUrl || row.profileImage || row.image
      const initials = name.split(' ').map(s => s[0]).slice(0,2).join('').toUpperCase()
      return (
        photo
          ? <img src={photo} alt="" className="inline-flex h-8 w-8 rounded-md object-cover" />
          : <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 text-[10px] font-semibold text-slate-700">{initials}</div>
      )
    }

    return [
      { key: 'photo', label: 'Photo', widthClass: 'w-16', render: (r) => <Avatar row={r} /> },
      { key: 'name', label: 'Name', render: (r) => (
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <div className="truncate text-xs font-bold uppercase text-slate-800">{r.name || '—'}</div>
            <div className="truncate text-[10px] text-slate-500">{r.studentId || r.admissionId || '—'}</div>
            <div className="truncate text-[10px] text-slate-400">Admission: {r.admissionId || '—'}</div>
          </div>
        </div>
      ) },
      { key: 'studentId', label: 'Student ID', widthClass: 'w-28', render: (r) => r.studentId || r.admissionId || '—' },
      { key: 'course', label: 'Course', widthClass: 'w-32', render: (r) => <div className="truncate text-xs font-medium">{r.course || '—'}<span className="block text-[10px] font-normal text-slate-400">{r.courseCode || r.details?.courseCode || ''}</span></div> },
      { key: 'batch', label: 'Batch', widthClass: 'w-32', render: (r) => r.details?.batchId || r.details?.seedBatchId || r.batch || '—' },
      { key: 'term', label: 'Current Term', widthClass: 'w-28', render: (r) => r.details?.term || r.details?.semester || r.term || '—' },
      { key: 'mobile', label: 'Mobile', widthClass: 'w-28', render: (r) => r.mobile || r.phone || '—' },
      { key: 'status', label: 'Status', widthClass: 'w-20', render: (r) => <StatusBadge status={r.status || 'Active'} /> },
      { key: '_actions', label: 'Actions', render: (r) => (
        <div className="flex flex-wrap items-center gap-1">
          <button type="button" title="View student" className="inline-flex items-center gap-1 rounded-full border border-[#00A896]/30 px-2 py-1 text-[10px] font-semibold text-[#008C95] hover:bg-[#00A896]/10" onClick={() => onOpenProfile(r)}><Eye size={11} /> View</button>
          <button type="button" title="Edit student" className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-600 hover:border-[#FF5E14]/40 hover:text-[#FF5E14]" onClick={() => onOpenProfile(r)}><Pencil size={11} /> Edit</button>
          <button type="button" className="rounded-full border border-orange-200 px-2 py-1 text-[10px] font-semibold text-orange-600 hover:bg-orange-50" onClick={(e) => e.stopPropagation()}>Assign Batch</button>
        </div>
      ) },
    ]
  }, [navigate])

  const onOpenProfile = (row) => {
    // navigate to full-page student detail
    navigate(`/master-admin/students/${row.id}`)
  }

  const statusCount = (names) => {
    const accepted = new Set(names.map((name) => name.toLowerCase()))
    return (stats?.byStatus || []).reduce(
      (sum, item) => sum + (accepted.has(String(item.status || '').toLowerCase()) ? Number(item.count || 0) : 0),
      0,
    )
  }

  // profile is now a full page route; details are loaded in StudentDetailPage

  return (
    <section className="space-y-2">
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Students" value={stats ? stats.total : '—'} icon={Users} hint="All registered students" />
        <StatCard label="Active Students" value={stats ? statusCount(['active', 'approved']) : '—'} icon={UserCheck} hint="Currently enrolled" />
        <StatCard label="New Admissions" value={stats ? (stats.newAdmissions || 0) : 0} icon={UserPlus} hint="This month" />
        <StatCard label="Completed" value={stats ? (stats.completed || statusCount(['completed'])) : 0} icon={GraduationCap} hint="Course completed" />
        <StatCard label="Inactive" value={stats ? (stats.inactive || statusCount(['inactive', 'rejected', 'cancelled'])) : 0} icon={UserMinus} hint="Dropped / cancelled" />
      </div>

      <Panel className="p-2">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <label className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs text-slate-500">
            <Search size={14} className="shrink-0 text-[#FF5E14]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search ID, admission, name, mobile, email" className="w-full bg-transparent outline-none placeholder:text-slate-400" />
          </label>
          <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1) }} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none"><option value="">All statuses</option><option>Active</option><option>Pending</option><option>Approved</option><option>Rejected</option></select>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <button type="button" onClick={() => window.location.reload()} className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:border-[#00A896] hover:text-[#008C95]"><RefreshCw size={13} /> Refresh</button>
          <button type="button" className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#00A896]/40 bg-[#00A896]/5 px-3 text-xs font-semibold text-[#008C95]"><RefreshCw size={13} /> Sync from Admissions</button>
          <button type="button" className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600"><Download size={13} /> CSV</button>
          <button type="button" className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600"><FileSpreadsheet size={13} /> Excel</button>
          <button type="button" className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600"><FileText size={13} /> PDF</button>
          <button type="button" onClick={() => navigate('/master-admin/new-admission')} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#d7193f] px-4 text-xs font-bold text-white shadow-sm hover:bg-[#b91435]"><Plus size={14} /> Add Student</button>
        </div>
      </Panel>

      <div className="grid gap-1.5 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-7">
        {[
          ['All universities', universityId, setUniversityId, universities.map((item) => ({ value: item.id || item._id, label: item.name }))],
          ['All courses', courseId, setCourseId, courses.map((item) => ({ value: item.id || item._id, label: item.name || item.title }))],
          ['All sessions', session, setSession, [{ value: '2025-26', label: '2025-26' }, { value: '2026-27', label: '2026-27' }]],
          ['All batches', batchId, setBatchId, batches.map((item) => ({ value: item.id || item._id, label: item.name || item.batchName }))],
          ['All terms', term, setTerm, [{ value: '1', label: 'Term 1' }, { value: '2', label: 'Term 2' }]],
          ['All genders', gender, setGender, [{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }]],
          ['All categories', category, setCategory, [{ value: 'General', label: 'General' }, { value: 'OBC', label: 'OBC' }, { value: 'SC', label: 'SC' }]],
        ].map(([label, value, setter, options]) => (
          <select key={label} value={value} onChange={(e) => { setter(e.target.value); setPage(1) }} className="h-9 min-w-0 rounded-lg border border-slate-200 bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-[#00A896]">
            <option value="">{label}</option>
            {options.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        ))}
      </div>

      <Panel className="overflow-hidden p-0">
        <div className="border-b border-slate-100 px-3 py-2 text-xs text-slate-500">Showing <span className="font-semibold text-slate-700">{total || 0}</span> students</div>
        {loading ? (
          <div className="space-y-3">
            <SkeletonBlock className="h-12" />
            <SkeletonBlock className="h-48" />
          </div>
        ) : items.length ? (
          <>
            <DataTable columns={cols} rows={items} onRowClick={onOpenProfile} selectedRowId={selected?.id} wrap />
            <Pagination page={page} pageSize={limit} total={total} onPageChange={(p) => setPage(p)} />
          </>
        ) : (
          <EmptyState title="No students found" description="Try adjusting search or filters." />
        )}
      </Panel>

      {/* Profile now opens as a full page at /master-admin/students/:id */}
    </section>
  )
}
