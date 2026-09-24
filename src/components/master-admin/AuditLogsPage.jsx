import { useCallback, useEffect, useMemo, useState } from 'react'
import { Radio, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { fetchActivityLogs } from '../../services/activityLogService.js'
import { getSocket, subscribeActivityLogs } from '../../utils/socket.js'
import {
  DataTable,
  PageToolbar,
  Panel,
  StatCard,
  StatusBadge,
  downloadCsv,
} from './shared/MasterAdminUI.jsx'
import { card } from '../../utils/masterAdminTheme.js'

function formatTime(value) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString()
  } catch {
    return String(value)
  }
}

function matchesFilters(row, { search, section, action }) {
  if (section && row.section !== section) return false
  if (action && row.action !== action) return false
  if (!search) return true
  const q = search.toLowerCase()
  return [row.message, row.actor, row.section, row.action, row.path, row.resourceId, row.ip]
    .filter(Boolean)
    .some((v) => String(v).toLowerCase().includes(q))
}

export default function AuditLogsPage() {
  const [rows, setRows] = useState([])
  const [stats, setStats] = useState({ total: 0, today: 0, sections: 0, uniqueActions: 0 })
  const [sections, setSections] = useState([])
  const [actions, setActions] = useState([])
  const [search, setSearch] = useState('')
  const [section, setSection] = useState('')
  const [action, setAction] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [liveCount, setLiveCount] = useState(0)
  const [connected, setConnected] = useState(false)

  const loadLogs = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchActivityLogs({ page: 1, limit: 100, section, action, search })
      setRows(Array.isArray(data.rows) ? data.rows : [])
      setStats(data.stats || { total: 0, today: 0, sections: 0, uniqueActions: 0 })
      setSections(data.filters?.sections || [])
      setActions(data.filters?.actions || [])
    } catch (err) {
      setError(err.message || 'Failed to load logs')
    } finally {
      setLoading(false)
    }
  }, [section, action, search])

  useEffect(() => {
    loadLogs()
  }, [loadLogs])

  useEffect(() => {
    const socket = getSocket()
    const onConnect = () => setConnected(true)
    const onDisconnect = () => setConnected(false)
    setConnected(socket.connected)
    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    const unsubscribe = subscribeActivityLogs((log) => {
      if (!log) return
      setLiveCount((n) => n + 1)
      setRows((prev) => {
        if (!matchesFilters(log, { search, section, action })) return prev
        const next = [log, ...prev.filter((r) => String(r._id) !== String(log._id))]
        return next.slice(0, 200)
      })
      setStats((prev) => ({
        ...prev,
        total: (prev.total || 0) + 1,
        today: (prev.today || 0) + 1,
      }))
      setSections((prev) => (prev.includes(log.section) ? prev : [...prev, log.section].sort()))
      setActions((prev) => (prev.includes(log.action) ? prev : [...prev, log.action].sort()))
    })

    return () => {
      unsubscribe()
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
    }
  }, [search, section, action])

  const columns = useMemo(
    () => [
      {
        key: 'createdAt',
        label: 'Time',
        render: (row) => <span className="whitespace-nowrap text-xs text-slate-600">{formatTime(row.createdAt)}</span>,
      },
      {
        key: 'section',
        label: 'Section',
        render: (row) => (
          <span className="rounded-md bg-[#005F6B]/10 px-2 py-0.5 text-xs font-semibold text-[#005F6B]">
            {row.section}
          </span>
        ),
      },
      {
        key: 'action',
        label: 'Action',
        render: (row) => <StatusBadge status={row.action} />,
      },
      {
        key: 'actor',
        label: 'Actor',
        render: (row) => <span className="text-sm text-slate-800">{row.actor || '—'}</span>,
      },
      {
        key: 'message',
        label: 'Message',
        render: (row) => <span className="text-sm text-slate-700">{row.message || '—'}</span>,
      },
      {
        key: 'ip',
        label: 'IP',
        render: (row) => <span className="font-mono text-xs text-slate-500">{row.ip || '—'}</span>,
      },
    ],
    []
  )

  return (
    <section className="space-y-3">
      <div className={`${card} flex flex-wrap items-center justify-between gap-2 p-3`}>
        <div className="flex items-center gap-2 text-sm">
          {connected ? (
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#00A896]">
              <Wifi size={15} /> Live socket connected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 font-semibold text-rose-600">
              <WifiOff size={15} /> Socket disconnected
            </span>
          )}
          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
            <Radio size={13} className="text-[#FF5E14]" />
            {liveCount} live event{liveCount === 1 ? '' : 's'} this session
          </span>
        </div>
        <button
          type="button"
          onClick={loadLogs}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total logs" value={String(stats.total || 0)} />
        <StatCard label="Today" value={String(stats.today || 0)} />
        <StatCard label="Sections" value={String(stats.sections || sections.length || 0)} />
        <StatCard label="Actions" value={String(stats.uniqueActions || actions.length || 0)} />
      </div>

      <PageToolbar
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search actor, message, section…"
        filters={sections}
        filterValue={section}
        onFilter={setSection}
        onExportCsv={() =>
          downloadCsv(
            'activity-logs.csv',
            [
              { key: 'time', label: 'Time' },
              { key: 'section', label: 'Section' },
              { key: 'action', label: 'Action' },
              { key: 'actor', label: 'Actor' },
              { key: 'message', label: 'Message' },
              { key: 'ip', label: 'IP' },
              { key: 'path', label: 'Path' },
            ],
            rows.map((r) => ({
              time: formatTime(r.createdAt),
              section: r.section,
              action: r.action,
              actor: r.actor,
              message: r.message,
              ip: r.ip,
              path: r.path,
            }))
          )
        }
      />

      <div className="flex flex-wrap gap-2">
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#00A896]"
        >
          <option value="">All actions</option>
          {actions.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <Panel title="Error">
          <p className="text-sm text-rose-600">{error}</p>
        </Panel>
      ) : null}

      <Panel title="All section activity (live)">
        {loading ? (
          <p className="p-4 text-sm text-slate-500">Loading logs…</p>
        ) : (
          <DataTable
            columns={columns}
            rows={rows}
            emptyTitle="No activity yet"
            emptyDescription="Create, update, publish or delete any section — logs appear here instantly via Socket.IO."
          />
        )}
      </Panel>
    </section>
  )
}
