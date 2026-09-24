import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  RefreshCw,
  Save,
  UserX,
  Users,
  Clock3,
} from 'lucide-react'
import { getUniversities } from '../../../services/universityService.js'
import { getCourses, getCourseById } from '../../../services/courseService.js'
import {
  getAttendance,
  getAttendanceOverview,
  markBulkAttendance,
  searchAttendance,
  updateAttendance,
} from '../../../services/attendanceService.js'
import {
  StatCard,
  Panel,
  PageToolbar,
  DataTable,
  Pagination,
  StatusBadge,
  useClientTable,
  downloadCsv,
} from '../shared/MasterAdminUI.jsx'
import { card, primaryBtn, secondaryBtn } from '../../../utils/masterAdminTheme.js'

const STATUS_OPTIONS = ['Present', 'Absent', 'Late', 'Leave']

function todayInputValue() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function semesterOptionsFromCourse(course) {
  if (!course) return []
  const fromList = Array.isArray(course.semesters)
    ? course.semesters
        .map((s) => ({
          number: Number(s.number),
          title: s.title || `Semester ${s.number}`,
        }))
        .filter((s) => Number.isFinite(s.number) && s.number > 0)
    : []

  if (fromList.length) {
    return fromList.sort((a, b) => a.number - b.number)
  }

  const count = Number(course.semesterCount) || 0
  if (count > 0) {
    return Array.from({ length: count }, (_, i) => ({
      number: i + 1,
      title: `Semester ${i + 1}`,
    }))
  }

  return [{ number: 1, title: 'Semester 1' }]
}

function rowKey(row) {
  return String(row.admissionMongoId || row.id || row.admissionId || '')
}

export default function AttendancePage() {
  const [universities, setUniversities] = useState([])
  const [courses, setCourses] = useState([])
  const [semesters, setSemesters] = useState([])

  const [universityId, setUniversityId] = useState('')
  const [courseId, setCourseId] = useState('')
  const [semester, setSemester] = useState('')
  const [date, setDate] = useState(todayInputValue())

  const [rows, setRows] = useState([])
  const [stats, setStats] = useState({})
  const [overviewStats, setOverviewStats] = useState({})
  const [meta, setMeta] = useState(null)

  const [uniLoading, setUniLoading] = useState(true)
  const [coursesLoading, setCoursesLoading] = useState(false)
  const [semLoading, setSemLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState('')
  const [draftStatus, setDraftStatus] = useState({})
  const [globalSearch, setGlobalSearch] = useState('')
  const [searchMode, setSearchMode] = useState(false)

  const filtersReady = Boolean(universityId && courseId && semester)

  const loadOverview = useCallback(async () => {
    try {
      const data = await getAttendanceOverview({ date })
      setOverviewStats(data.stats || {})
    } catch {
      /* keep last overview on soft failure */
    }
  }, [date])

  // Always load all-students overview for StatCards
  useEffect(() => {
    loadOverview()
  }, [loadOverview])

  // 1) Load universities only (lightweight first step)
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setUniLoading(true)
      try {
        const data = await getUniversities()
        if (cancelled) return
        setUniversities(
          (data.rows || []).filter((u) => String(u.status || '') !== 'Inactive'),
        )
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Unable to load universities')
      } finally {
        if (!cancelled) setUniLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // 2) When university changes → load courses for that university only
  useEffect(() => {
    let cancelled = false
    setCourseId('')
    setSemester('')
    setCourses([])
    setSemesters([])
    setRows([])
    setStats({})
    setMeta(null)
    setDraftStatus({})
    setSearchMode(false)

    if (!universityId) return undefined

    ;(async () => {
      setCoursesLoading(true)
      setError('')
      try {
        const data = await getCourses({
          universityId,
          status: 'Active',
        })
        if (cancelled) return
        setCourses(data.rows || [])
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || 'Unable to load courses')
          setCourses([])
        }
      } finally {
        if (!cancelled) setCoursesLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [universityId])

  // 3) When course changes → load semester options from that course only
  useEffect(() => {
    let cancelled = false
    setSemester('')
    setSemesters([])
    setRows([])
    setStats({})
    setMeta(null)
    setDraftStatus({})
    setSearchMode(false)

    if (!courseId) return undefined

    ;(async () => {
      setSemLoading(true)
      setError('')
      try {
        const entry = await getCourseById(courseId)
        if (cancelled) return
        setSemesters(semesterOptionsFromCourse(entry))
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || 'Unable to load semesters')
          setSemesters([])
        }
      } finally {
        if (!cancelled) setSemLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [courseId])

  const loadAttendance = useCallback(async () => {
    if (!universityId || !courseId || !semester) {
      setRows([])
      setStats({})
      setMeta({
        requiresFilters: true,
        message: 'Select university, course and semester to load attendance',
      })
      return
    }

    setLoading(true)
    setError('')
    setSearchMode(false)
    try {
      const data = await getAttendance({
        universityId,
        courseId,
        semester,
        date,
      })
      setRows(data.rows)
      setStats(data.stats || {})
      setMeta(data.meta || null)
      const nextDraft = {}
      for (const row of data.rows || []) {
        nextDraft[rowKey(row)] =
          row.status && row.status !== 'Unmarked' ? row.status : 'Present'
      }
      setDraftStatus(nextDraft)
      await loadOverview()
    } catch (err) {
      setError(err?.message || 'Unable to load attendance')
      setRows([])
      setStats({})
    } finally {
      setLoading(false)
    }
  }, [universityId, courseId, semester, date, loadOverview])

  // 4) When semester + date ready → fetch roster/attendance
  useEffect(() => {
    if (!filtersReady) return undefined
    loadAttendance()
    return undefined
  }, [filtersReady, loadAttendance])

  useEffect(() => {
    if (!toast) return undefined
    const t = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(t)
  }, [toast])

  const table = useClientTable(rows, {
    searchKeys: [
      'student',
      'name',
      'admissionId',
      'email',
      'phone',
      'course',
      'courseName',
      'courseCode',
      'semester',
      'semesterTitle',
      'universityName',
      'status',
      'method',
      'attendanceId',
    ],
    pageSize: 10,
    filterKey: 'status',
  })

  const filterOptions = useMemo(() => {
    const set = new Set(
      rows.map((r) => r.status).filter((s) => s && s !== 'Unmarked'),
    )
    if (rows.some((r) => !r.marked || r.status === 'Unmarked')) {
      set.add('Unmarked')
    }
    return [...STATUS_OPTIONS, ...[...set].filter((s) => !STATUS_OPTIONS.includes(s))]
  }, [rows])

  const columns = useMemo(
    () => [
      {
        key: 'admissionId',
        label: 'Admission ID',
        render: (row) => (
          <span className="font-medium text-slate-800">{row.admissionId || '—'}</span>
        ),
      },
      {
        key: 'student',
        label: 'Student',
        render: (row) => (
          <div>
            <p className="font-semibold text-slate-800">{row.student || row.name || '—'}</p>
            <p className="text-xs text-slate-500">{row.email || '—'}</p>
          </div>
        ),
      },
      {
        key: 'course',
        label: 'Course',
        render: (row) => (
          <div>
            <p className="text-slate-800">{row.courseName || row.course || '—'}</p>
            <p className="text-xs text-slate-500">{row.courseCode || ''}</p>
          </div>
        ),
      },
      {
        key: 'semester',
        label: 'Sem',
        render: (row) => (
          <span>
            {row.semesterTitle || (row.semester ? `Sem ${row.semester}` : '—')}
          </span>
        ),
      },
      {
        key: 'dateLabel',
        label: 'Date',
        render: (row) => row.dateLabel || '—',
      },
      {
        key: 'status',
        label: 'Status',
        render: (row) => {
          const key = rowKey(row)
          const value = draftStatus[key] || row.status || 'Present'
          return (
            <select
              value={value === 'Unmarked' ? 'Present' : value}
              onChange={(e) =>
                setDraftStatus((prev) => ({ ...prev, [key]: e.target.value }))
              }
              className="h-9 rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-700 outline-none focus:border-[#00A896]"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )
        },
      },
      {
        key: 'marked',
        label: 'Saved',
        render: (row) => (
          <StatusBadge
            status={row.marked ? row.status || 'Present' : 'Unmarked'}
          />
        ),
      },
      {
        key: '_actions',
        label: 'Action',
        render: (row) => (
          <button
            type="button"
            disabled={busy || !row.marked}
            onClick={async () => {
              const key = rowKey(row)
              const status = draftStatus[key] || row.status || 'Present'
              setBusy(true)
              setError('')
              try {
                await updateAttendance(row.id || row.attendanceId, {
                  status,
                  method: 'Manual',
                })
                setToast(`Updated ${row.student || row.admissionId}`)
                await loadAttendance()
              } catch (err) {
                setError(err?.message || 'Update failed')
              } finally {
                setBusy(false)
              }
            }}
            className={`${secondaryBtn} !px-3 !py-1.5 text-xs disabled:opacity-50`}
          >
            Save
          </button>
        ),
      },
    ],
    [busy, draftStatus, loadAttendance],
  )

  const markAll = async (status) => {
    if (!filtersReady || !rows.length) return
    setBusy(true)
    setError('')
    try {
      const data = await markBulkAttendance({
        universityId,
        courseId,
        semester: Number(semester),
        date,
        method: 'Manual',
        records: rows.map((row) => ({
          admissionMongoId: row.admissionMongoId,
          admissionId: row.admissionId,
          status,
        })),
      })
      setRows(data.rows)
      setStats(data.stats || {})
      setMeta(data.meta || null)
      const nextDraft = {}
      for (const row of data.rows || []) {
        nextDraft[rowKey(row)] = row.status || status
      }
      setDraftStatus(nextDraft)
      setToast(`Marked ${data.marked} student(s) as ${status}`)
      await loadOverview()
    } catch (err) {
      setError(err?.message || 'Failed to mark attendance')
    } finally {
      setBusy(false)
    }
  }

  const saveDrafts = async () => {
    if (!filtersReady || !rows.length) return
    setBusy(true)
    setError('')
    try {
      const data = await markBulkAttendance({
        universityId,
        courseId,
        semester: Number(semester),
        date,
        method: 'Manual',
        records: rows.map((row) => {
          const key = rowKey(row)
          return {
            admissionMongoId: row.admissionMongoId,
            admissionId: row.admissionId,
            status: draftStatus[key] || row.status || 'Present',
          }
        }),
      })
      setRows(data.rows)
      setStats(data.stats || {})
      setMeta(data.meta || null)
      setToast(`Saved attendance for ${data.marked} student(s)`)
      await loadOverview()
    } catch (err) {
      setError(err?.message || 'Failed to save attendance')
    } finally {
      setBusy(false)
    }
  }

  const runGlobalSearch = async () => {
    const q = globalSearch.trim()
    if (!q && !filtersReady) {
      setError('Select filters or type a search term (name, course, sem…)')
      return
    }

    setLoading(true)
    setError('')
    try {
      const data = await searchAttendance({
        universityId: universityId || undefined,
        courseId: courseId || undefined,
        semester: semester || undefined,
        date: date || undefined,
        search: q,
      })
      setRows(data.rows)
      setStats(data.stats || {})
      setMeta(data.meta || null)
      setSearchMode(Boolean(data.meta?.searchOnly) || Boolean(q))
      const nextDraft = {}
      for (const row of data.rows || []) {
        nextDraft[rowKey(row)] =
          row.status && row.status !== 'Unmarked' ? row.status : 'Present'
      }
      setDraftStatus(nextDraft)
      table.setSearch('')
      table.setFilter('')
      table.setPage(1)
    } catch (err) {
      setError(err?.message || 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  const emptyDescription = !filtersReady
    ? 'Pehle University → Course → Semester select karein. Isse server par sudden load nahi padega.'
    : loading
      ? 'Loading attendance…'
      : 'Is selection ke liye koi approved student nahi mila.'

  return (
    <section className="space-y-3">
      {toast ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {toast}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Students"
          value={overviewStats.total ?? 0}
          icon={Users}
          hint="All approved students"
        />
        <StatCard
          label="Present"
          value={overviewStats.present ?? 0}
          icon={CheckCircle2}
          hint={`Marked today · ${date}`}
        />
        <StatCard
          label="Absent"
          value={overviewStats.absent ?? 0}
          icon={UserX}
        />
        <StatCard
          label="Late / Leave"
          value={(overviewStats.late || 0) + (overviewStats.leave || 0)}
          icon={Clock3}
        />
        <StatCard
          label="Attendance %"
          value={`${overviewStats.percent ?? 0}%`}
          icon={CalendarDays}
          hint={`${overviewStats.marked ?? 0} marked of ${overviewStats.total ?? 0}`}
        />
      </div>

      {/* Cascading filters — load step by step */}
      <div className={`${card} p-3`}>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-slate-800">Filter by scope</p>
            <p className="text-xs text-slate-500">
              University → Course → Semester → Date. Data tabhi load hota hai jab teenon select ho.
            </p>
          </div>
          <button
            type="button"
            onClick={loadAttendance}
            disabled={!filtersReady || loading || busy}
            className={`${secondaryBtn} !px-3 !py-1.5 text-xs disabled:opacity-50`}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block text-xs font-medium text-slate-600">
            University
            <select
              value={universityId}
              disabled={uniLoading}
              onChange={(e) => setUniversityId(e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-[#00A896]"
            >
              <option value="">
                {uniLoading ? 'Loading…' : 'Select university'}
              </option>
              {universities.map((u) => (
                <option key={u._id || u.id} value={u._id || u.id}>
                  {u.shortName ? `${u.shortName} — ${u.name}` : u.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-xs font-medium text-slate-600">
            Course
            <select
              value={courseId}
              disabled={!universityId || coursesLoading}
              onChange={(e) => setCourseId(e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-[#00A896] disabled:bg-slate-50 disabled:text-slate-400"
            >
              <option value="">
                {!universityId
                  ? 'Select university first'
                  : coursesLoading
                    ? 'Loading courses…'
                    : courses.length
                      ? 'Select course'
                      : 'No courses found'}
              </option>
              {courses.map((c) => (
                <option key={c._id || c.id} value={c._id || c.id}>
                  {c.code ? `${c.code} — ${c.name}` : c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-xs font-medium text-slate-600">
            Semester
            <select
              value={semester}
              disabled={!courseId || semLoading}
              onChange={(e) => setSemester(e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-[#00A896] disabled:bg-slate-50 disabled:text-slate-400"
            >
              <option value="">
                {!courseId
                  ? 'Select course first'
                  : semLoading
                    ? 'Loading semesters…'
                    : 'Select semester'}
              </option>
              {semesters.map((s) => (
                <option key={s.number} value={String(s.number)}>
                  {s.title || `Semester ${s.number}`}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-xs font-medium text-slate-600">
            Date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none focus:border-[#00A896]"
            />
          </label>
        </div>

        {/* Search: name, course, sem, admission id, etc. */}
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500">
            <ClipboardCheck size={15} className="shrink-0 text-[#FF5E14]" />
            <input
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  runGlobalSearch()
                }
              }}
              placeholder="Search by name, admission ID, course, sem, email…"
              className="w-full min-w-0 bg-transparent text-slate-800 outline-none placeholder:text-slate-400"
            />
          </label>
          <button
            type="button"
            onClick={runGlobalSearch}
            disabled={loading || busy}
            className={`${primaryBtn} !px-4 !py-2 text-sm disabled:opacity-60`}
          >
            Search
          </button>
          {searchMode ? (
            <button
              type="button"
              onClick={() => {
                setGlobalSearch('')
                setSearchMode(false)
                if (filtersReady) loadAttendance()
                else {
                  setRows([])
                  setStats({})
                }
              }}
              className={`${secondaryBtn} !px-3 !py-2 text-sm`}
            >
              Clear search
            </button>
          ) : null}
        </div>
      </div>

      <PageToolbar
        search={table.search}
        onSearch={table.setSearch}
        searchPlaceholder="Filter loaded rows (name, course, sem…)"
        filters={filterOptions}
        filterValue={table.filter}
        onFilter={table.setFilter}
        onExportCsv={() =>
          downloadCsv(
            `attendance-${date || 'export'}.csv`,
            [
              { key: 'admissionId', label: 'Admission ID' },
              { key: 'student', label: 'Student' },
              { key: 'email', label: 'Email' },
              { key: 'courseName', label: 'Course' },
              { key: 'semester', label: 'Semester' },
              { key: 'dateLabel', label: 'Date' },
              { key: 'status', label: 'Status' },
              { key: 'method', label: 'Method' },
            ],
            table.filtered,
          )
        }
        extraActions={
          <>
            <button
              type="button"
              disabled={!filtersReady || !rows.length || busy}
              onClick={() => markAll('Present')}
              className={`${secondaryBtn} !px-3 !py-1.5 text-xs disabled:opacity-50`}
            >
              <CheckCircle2 size={14} /> All Present
            </button>
            <button
              type="button"
              disabled={!filtersReady || !rows.length || busy}
              onClick={() => markAll('Absent')}
              className={`${secondaryBtn} !px-3 !py-1.5 text-xs disabled:opacity-50`}
            >
              <UserX size={14} /> All Absent
            </button>
            <button
              type="button"
              disabled={!filtersReady || !rows.length || busy}
              onClick={saveDrafts}
              className={`${primaryBtn} !px-3 !py-1.5 text-xs disabled:opacity-50`}
            >
              <Save size={14} /> Save All
            </button>
          </>
        }
      />

      <Panel
        title={
          meta?.courseName
            ? `${meta.courseName} · ${meta.semesterTitle || `Sem ${meta.semester}`} · ${meta.dateLabel || date}`
            : searchMode
              ? 'Search results'
              : meta?.requiresFilters
                ? 'Select filters to load roster'
                : 'Attendance roster'
        }
        action={
          meta?.universityName ? (
            <span className="text-xs font-medium text-slate-500">{meta.universityName}</span>
          ) : null
        }
      >
        {loading ? (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-8 text-center text-sm text-slate-500">
            Loading attendance…
          </div>
        ) : (
          <DataTable
            columns={columns}
            rows={table.pageRows}
            wrap
            emptyTitle={!filtersReady && !searchMode ? 'Select filters first' : 'No students found'}
            emptyDescription={emptyDescription}
          />
        )}
        <Pagination
          page={table.page}
          pageSize={table.pageSize}
          total={table.total}
          onPageChange={table.setPage}
        />
      </Panel>
    </section>
  )
}
