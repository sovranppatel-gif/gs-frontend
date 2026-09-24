import { getEnquiries } from '../services/enquiryService.js'
import { getAdmissions } from '../services/admissionService.js'

const SEEN_KEY = '__ma_notif_seen__'
const BOOTSTRAP_KEY = '__ma_notif_bootstrapped__'
const MAX_ITEMS = 20

function readSeen() {
  try {
    const raw = localStorage.getItem(SEEN_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return new Set(Array.isArray(parsed) ? parsed.map(String) : [])
  } catch {
    return new Set()
  }
}

function writeSeen(ids) {
  try {
    const list = [...ids].slice(-200)
    localStorage.setItem(SEEN_KEY, JSON.stringify(list))
  } catch {
    /* ignore */
  }
}

function hasBootstrapped() {
  try {
    return localStorage.getItem(BOOTSTRAP_KEY) === '1'
  } catch {
    return false
  }
}

function markBootstrapped() {
  try {
    localStorage.setItem(BOOTSTRAP_KEY, '1')
  } catch {
    /* ignore */
  }
}

export function markMasterAdminNotificationsSeen(ids = []) {
  const seen = readSeen()
  for (const id of ids) {
    if (id) seen.add(String(id))
  }
  writeSeen(seen)
  markBootstrapped()
}

export function markAllMasterAdminNotificationsSeen(notifications = []) {
  markMasterAdminNotificationsSeen(notifications.map((n) => n.id))
}

function formatRelative(iso) {
  if (!iso) return ''
  const ts = new Date(iso).getTime()
  if (Number.isNaN(ts)) return ''
  const diff = Math.max(0, Date.now() - ts)
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  try {
    return new Date(iso).toLocaleDateString()
  } catch {
    return ''
  }
}

function isOnlineAdmission(row) {
  const source = String(row?.details?.source || '').toLowerCase()
  if (source === 'student-online') return true
  return String(row?.mode || '').toLowerCase() === 'online'
}

/**
 * Live master-admin notifications from landing enquiries + online admissions.
 * First load marks current rows as seen so only new submissions show unread.
 */
export async function fetchMasterAdminNotifications() {
  const seen = readSeen()
  const firstVisit = !hasBootstrapped()

  const [enquiriesResult, admissionsResult] = await Promise.allSettled([
    getEnquiries(),
    getAdmissions(),
  ])

  const enquiries =
    enquiriesResult.status === 'fulfilled' && Array.isArray(enquiriesResult.value)
      ? enquiriesResult.value
      : []
  const admissions =
    admissionsResult.status === 'fulfilled' && Array.isArray(admissionsResult.value?.rows)
      ? admissionsResult.value.rows
      : []

  const enquiryNotifs = enquiries.map((row) => {
    const id = `enquiry-${row._id || row.id}`
    const kind = row.enquiryType === 'student' ? 'Student training' : 'Client service'
    const who = row.fullName || row.name || row.workEmail || row.email || 'Someone'
    const when = row.submittedAt || row.createdAt
    const interest = row.courseRequested || row.serviceRequested
    const email = String(row.workEmail || row.email || '')
      .trim()
      .toLowerCase()
    const phone = String(row.mobile || row.phone || '')
      .replace(/\D/g, '')
      .slice(-10)
    return {
      id,
      dedupeKey: `enquiry:${email || phone || id}`,
      title: `New landing enquiry — ${who}`,
      detail: `${kind}${row.city ? ` · ${row.city}` : ''}${interest ? ` · ${interest}` : ''}`,
      type: 'Enquiry',
      section: 'Enquiry Management',
      time: formatRelative(when),
      submittedAt: when,
    }
  })

  const admissionNotifs = admissions
    .filter(isOnlineAdmission)
    .map((row) => {
      const id = `admission-${row._id || row.id}`
      const who =
        row.applicant ||
        row.studentName ||
        row.name ||
        row.details?.studentName ||
        row.details?.fullName ||
        row.email ||
        row.phone ||
        'Applicant'
      const when = row.admissionDate || row.createdAt || row.submittedAt
      const status = row.status || 'Pending'
      const course = row.course || row.details?.course || 'Course pending'
      const email = String(row.email || row.details?.email || '')
        .trim()
        .toLowerCase()
      const phone = String(row.phone || row.details?.phone || '')
        .replace(/\D/g, '')
        .slice(-10)
      return {
        id,
        dedupeKey: `admission:${email || phone || id}`,
        title: `Online admission — ${who}`,
        detail: `${course} · ${status}`,
        type: 'Admission',
        section: 'Admissions',
        time: formatRelative(when),
        submittedAt: when,
      }
    })

  const merged = [...enquiryNotifs, ...admissionNotifs]
    .sort((a, b) => {
      const ta = new Date(a.submittedAt || 0).getTime()
      const tb = new Date(b.submittedAt || 0).getTime()
      return tb - ta
    })

  // One bell item per person+type (keeps newest) — hides accidental double-submits
  const seenKeys = new Set()
  const unique = []
  for (const item of merged) {
    const key = item.dedupeKey || item.id
    if (seenKeys.has(key)) continue
    seenKeys.add(key)
    unique.push(item)
  }

  const sliced = unique.slice(0, MAX_ITEMS)

  if (firstVisit) {
    markMasterAdminNotificationsSeen(sliced.map((n) => n.id))
    return sliced.map((n) => ({ ...n, status: 'Read' }))
  }

  return sliced.map((n) => ({
    ...n,
    status: seen.has(n.id) ? 'Read' : 'Unread',
  }))
}
