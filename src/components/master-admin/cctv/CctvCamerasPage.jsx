import { useEffect, useMemo, useState } from 'react'
import {
  Cctv,
  Maximize2,
  RefreshCw,
  Signal,
  SignalZero,
  MapPin,
  Circle,
} from 'lucide-react'
import {
  useMasterAdminTheme,
} from '../MasterAdminTheme.jsx'

const DUMMY_CAMERAS = [
  {
    id: 'CAM-01',
    name: 'Main Reception',
    location: 'Ground Floor · Lobby',
    status: 'online',
    recording: true,
  },
  {
    id: 'CAM-02',
    name: 'Lab 201 — Full Stack',
    location: '2nd Floor · Lab Block',
    status: 'online',
    recording: true,
  },
  {
    id: 'CAM-03',
    name: 'Lab 305 — Data Science',
    location: '3rd Floor · Lab Block',
    status: 'online',
    recording: true,
  },
  {
    id: 'CAM-04',
    name: 'Corridor A',
    location: '1st Floor · Academic Wing',
    status: 'online',
    recording: false,
  },
  {
    id: 'CAM-05',
    name: 'Parking Gate',
    location: 'Outdoor · Entry',
    status: 'offline',
    recording: false,
  },
  {
    id: 'CAM-06',
    name: 'Server Room',
    location: 'Basement · IT',
    status: 'online',
    recording: true,
  },
  {
    id: 'CAM-07',
    name: 'Library Desk',
    location: '1st Floor · Library',
    status: 'online',
    recording: true,
  },
  {
    id: 'CAM-08',
    name: 'Cafeteria',
    location: 'Ground Floor · Canteen',
    status: 'offline',
    recording: false,
  },
]

function formatClock(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

function CameraFeed({ camera, selected, onSelect, isDark }) {
  const [now, setNow] = useState(() => new Date())
  const online = camera.status === 'online'

  useEffect(() => {
    if (!online) return undefined
    const t = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(t)
  }, [online])

  return (
    <button
      type="button"
      onClick={() => onSelect(camera)}
      className={`group relative overflow-hidden rounded-xl border text-left !text-white transition ${
        selected
          ? 'border-[#FF5E14] ring-2 ring-[#FF5E14]/30'
          : isDark
            ? 'border-[#00A896]/25 hover:border-[#00A896]/55'
            : 'border-slate-200 hover:border-[#00A896]/50'
      } bg-[#0b1a20]`}
    >
      <div className="relative aspect-video w-full overflow-hidden">
        {online ? (
          <>
            <div
              className="absolute inset-0 opacity-90"
              style={{
                backgroundImage: `
                  radial-gradient(ellipse at 30% 40%, rgba(0,168,150,0.35), transparent 55%),
                  radial-gradient(ellipse at 70% 60%, rgba(255,94,20,0.22), transparent 50%),
                  linear-gradient(160deg, #0a1620 0%, #132a33 45%, #0d1c24 100%)
                `,
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.12]"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.35) 3px)',
              }}
            />
            <div className="cctv-scan pointer-events-none absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-[#00E5CC]/15 to-transparent" />
            <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              <Circle size={8} className="fill-red-500 text-red-500 animate-pulse" />
              {camera.recording ? 'REC' : 'LIVE'}
            </div>
            <div className="absolute right-2 top-2 rounded bg-black/55 px-1.5 py-0.5 font-mono text-[10px] text-[#00E5CC]">
              {formatClock(now)}
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-2 left-2 right-2 z-[1] flex items-end justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold !text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                  {camera.name}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[10px] !text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                  <MapPin size={10} className="shrink-0 !text-white/90" />
                  <span className="truncate">{camera.location}</span>
                </p>
              </div>
              <Maximize2
                size={14}
                className="mb-0.5 shrink-0 !text-white/80 opacity-0 transition group-hover:opacity-100"
              />
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 bg-[#121212] px-4 text-center">
            <SignalZero size={28} className="!text-slate-400" />
            <p className="text-xs font-semibold !text-slate-200">No signal</p>
            <p className="text-[10px] !text-slate-400">{camera.name}</p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-white/10 bg-[#06151C] px-3 py-2">
        <span className="font-mono text-[11px] font-semibold !text-[#00E5CC]">
          {camera.id}
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            online
              ? 'bg-emerald-500/20 !text-emerald-300'
              : 'bg-slate-500/25 !text-slate-300'
          }`}
        >
          {online ? <Signal size={11} className="!text-emerald-300" /> : <SignalZero size={11} className="!text-slate-300" />}
          {online ? 'Online' : 'Offline'}
        </span>
      </div>
    </button>
  )
}

export default function CctvCamerasPage() {
  const { isDark } = useMasterAdminTheme()
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(DUMMY_CAMERAS[0])
  const [tick, setTick] = useState(0)

  const panel = isDark
    ? 'rounded-lg border border-[#00A896]/30 bg-[#0b1f27]/90'
    : 'rounded-lg border border-slate-200 bg-white'
  const panelTitle = isDark ? 'text-white' : 'text-slate-900'
  const panelMuted = isDark ? 'text-slate-400' : 'text-slate-500'
  const statCard = isDark
    ? 'rounded-lg border border-[#00A896]/20 bg-white/5 px-3 py-2'
    : 'rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2'
  const secondaryBtn = isDark
    ? 'inline-flex items-center gap-2 self-start rounded-full border border-[#00A896]/35 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 hover:border-[#FF5E14]/50 hover:text-[#FF5E14]'
    : 'inline-flex items-center gap-2 self-start rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-white'
  const filterIdle = isDark
    ? 'border border-[#00A896]/30 bg-white/5 text-slate-300 hover:bg-white/10'
    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
  const emptyState = isDark
    ? 'rounded-lg border border-dashed border-[#00A896]/35 bg-[#0b1f27]/60 p-4 text-center text-sm text-slate-400'
    : 'rounded-lg border border-dashed border-[#c5ddd9] bg-white/80 p-4 text-center text-sm text-slate-600'
  const focusShell = isDark
    ? 'overflow-hidden rounded-lg border border-[#00A896]/30 bg-[#06151C]'
    : 'overflow-hidden rounded-lg border border-slate-200 bg-[#06151C] shadow-sm'

  const cameras = useMemo(() => {
    if (filter === 'online') return DUMMY_CAMERAS.filter((c) => c.status === 'online')
    if (filter === 'offline') return DUMMY_CAMERAS.filter((c) => c.status === 'offline')
    return DUMMY_CAMERAS
  }, [filter])

  const stats = useMemo(() => {
    const online = DUMMY_CAMERAS.filter((c) => c.status === 'online').length
    return {
      total: DUMMY_CAMERAS.length,
      online,
      offline: DUMMY_CAMERAS.length - online,
      recording: DUMMY_CAMERAS.filter((c) => c.recording).length,
    }
  }, [])

  return (
    <section className="space-y-3">
      <style>{`
        @keyframes cctv-scan-move {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        .cctv-scan {
          animation: cctv-scan-move 3.2s linear infinite;
        }
      `}</style>

      <div className={`${panel} px-3 py-2.5`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-2">
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                isDark ? 'bg-[#00A896]/15 text-[#00E5CC]' : 'bg-[#00A896]/10 text-[#008C95]'
              }`}
            >
              <Cctv size={18} />
            </span>
            <div className="min-w-0">
              <p className={`text-sm font-semibold ${panelTitle}`}>CCTV Cameras</p>
              <p className={`text-xs ${panelMuted}`}>
                Demo multi-camera view — frontend only. Live streams can be wired later.
              </p>
            </div>
          </div>
          <button type="button" onClick={() => setTick((n) => n + 1)} className={secondaryBtn}>
            <RefreshCw size={14} />
            Refresh feeds
          </button>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total cameras', value: stats.total },
            { label: 'Online', value: stats.online },
            { label: 'Offline', value: stats.offline },
            { label: 'Recording', value: stats.recording },
          ].map((card) => (
            <div key={card.label} className={statCard}>
              <p className={`text-[11px] font-semibold uppercase tracking-wide ${panelMuted}`}>
                {card.label}
              </p>
              <p className={`mt-0.5 text-lg font-semibold ${panelTitle}`}>{card.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'online', label: 'Online' },
            { id: 'offline', label: 'Offline' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                filter === tab.id
                  ? 'bg-gradient-to-r from-[#FF5E14] to-[#008C95] text-white'
                  : filterIdle
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {selected ? (
        <div className={focusShell}>
          <div
            className={`flex flex-wrap items-center justify-between gap-2 border-b px-3 py-2 ${
              isDark ? 'border-white/10' : 'border-white/10'
            }`}
          >
            <div>
              <p className="text-sm font-semibold text-white">{selected.name}</p>
              <p className="text-[11px] text-slate-400">
                {selected.id} · {selected.location}
              </p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                selected.status === 'online'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : 'bg-slate-500/30 text-slate-300'
              }`}
            >
              Focus view · {selected.status}
            </span>
          </div>
          <div className="p-2 sm:p-3" key={`${selected.id}-${tick}`}>
            <CameraFeed
              camera={selected}
              selected
              onSelect={setSelected}
              isDark={isDark}
            />
          </div>
        </div>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {cameras.map((cam) => (
          <CameraFeed
            key={`${cam.id}-${tick}`}
            camera={cam}
            selected={selected?.id === cam.id}
            onSelect={setSelected}
            isDark={isDark}
          />
        ))}
      </div>

      {cameras.length === 0 ? (
        <article className={emptyState}>No cameras match this filter.</article>
      ) : null}
    </section>
  )
}
