import { API_URL } from '../utils/api.js'
import { getMasterAdminToken } from '../utils/masterAdminAuth.js'

function authHeaders() {
  const token = getMasterAdminToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

function buildUrl(path = '') {
  return `${API_URL}/api/admissions${path}`
}

async function parseJson(response) {
  return response.json().catch(() => ({}))
}

export async function getAdmissionsMeta() {
  const response = await fetch(buildUrl('/meta'), { headers: authHeaders() })
  const data = await parseJson(response)
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Unable to load admission options')
  }
  return {
    courses: Array.isArray(data.courses) ? data.courses : [],
    modes: Array.isArray(data.modes) ? data.modes : [],
    statuses: Array.isArray(data.statuses) ? data.statuses : [],
  }
}

function buildAdmissionsQuery(params = {}) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') qs.set(key, String(value))
  })
  const query = qs.toString()
  return query ? `?${query}` : ''
}

/**
 * Called two ways: with no args (masterAdminNotifications.js and
 * IdCardGeneratePage.jsx both want the complete list back in `rows`) or with
 * { page, limit, ... } from the Admissions screen for a real server-side
 * page. Omitting page/limit is what tells the backend to return everything
 * in one shot, so those two call sites' contract never changes.
 */
export async function getAdmissions(params = {}) {
  let response
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), 20000)
  try {
    response = await fetch(buildUrl(buildAdmissionsQuery(params)), {
      headers: authHeaders(),
      signal: controller.signal,
    })
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new Error('Admissions request timed out. Please retry.')
    }
    throw new Error('Could not reach the server. Make sure the backend is running on port 3000.')
  } finally {
    window.clearTimeout(timer)
  }
  const data = await parseJson(response)
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Unable to load admissions')
  }
  return {
    rows: Array.isArray(data.rows) ? data.rows : [],
    stats: data.stats || {},
    pagination: data.pagination || { page: 1, limit: data.rows?.length || 0, total: data.rows?.length || 0, totalPages: 1 },
  }
}

export async function getAdmissionById(id) {
  const response = await fetch(buildUrl(`/${encodeURIComponent(id)}`), {
    headers: authHeaders(),
  })
  const data = await parseJson(response)
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Unable to load admission')
  }
  return data.entry
}

export async function createAdmission(payload, idempotencyKey = '') {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), 20000)
  let response
  try {
    response = await fetch(buildUrl(), {
      method: 'POST',
      headers: {
        ...authHeaders(),
        ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
  } catch (err) {
    if (err?.name === 'AbortError') throw Object.assign(new Error('Request timed out. Please retry.'), { status: 408 })
    throw new Error('Could not reach the server. Make sure the backend is running on port 3000.')
  } finally {
    window.clearTimeout(timer)
  }

  const data = await parseJson(response)
  if (!response.ok || !data.success) {
    const e = new Error(data.message || 'Unable to create admission')
    e.status = response.status
    e.errors = data.errors || null
    throw e
  }
  return data.entry
}

export async function updateAdmission(id, payload) {
  const response = await fetch(buildUrl(`/${encodeURIComponent(id)}`), {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })
  const data = await parseJson(response)
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Unable to update admission')
  }
  return data.entry
}

/** Soft-archives the admission — it stays in the database (see admissions.routes.js),
 * just hidden from the default list. Kept as `deleteAdmission` was previously
 * named; renamed to match what it now actually does. */
export async function archiveAdmission(id) {
  const response = await fetch(buildUrl(`/${encodeURIComponent(id)}`), {
    method: 'DELETE',
    headers: authHeaders(),
  })
  const data = await parseJson(response)
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Unable to archive admission')
  }
  return data.entry
}

export async function restoreAdmission(id) {
  const response = await fetch(buildUrl(`/${encodeURIComponent(id)}/restore`), {
    method: 'PATCH',
    headers: authHeaders(),
  })
  const data = await parseJson(response)
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Unable to restore admission')
  }
  return data.entry
}

/**
 * Upload education marksheet/document (PDF or image, max 400 KB).
 * Accepts student or master-admin Bearer token.
 */
export async function uploadEducationDocument(file, token) {
  if (!file) throw new Error('No file selected')
  if (file.size > 400 * 1024) {
    throw new Error('Document must be 400 KB or smaller')
  }

  const formData = new FormData()
  formData.append('file', file)

  let response
  try {
    response = await fetch(buildUrl('/upload-education-document'), {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })
  } catch {
    throw new Error(
      'Could not reach the server. Make sure the backend is running on port 3000.'
    )
  }

  const data = await parseJson(response)
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Unable to upload document')
  }
  return data.data
}

/**
 * Public catalog — universities + courses for student online admission.
 */
export async function getAdmissionCatalog() {
  let response
  try {
    response = await fetch(buildUrl('/catalog'), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    throw new Error(
      'Could not reach the server. Make sure the backend is running on port 3000.'
    )
  }
  const data = await parseJson(response)
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Unable to load universities and courses')
  }
  return {
    universities: Array.isArray(data.universities) ? data.universities : [],
    totalCourses: data.totalCourses || 0,
  }
}

/**
 * Student portal — submit online admission application.
 */
export async function createOnlineAdmission(payload, token, idempotencyKey = '') {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), 20000)
  let response
  try {
    response = await fetch(buildUrl('/online'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {}),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
  } catch (err) {
    if (err?.name === 'AbortError') throw Object.assign(new Error('Request timed out. Please retry.'), { status: 408 })
    throw new Error(
      'Could not reach the server. Make sure the backend is running on port 3000.'
    )
  } finally {
    window.clearTimeout(timer)
  }
  const data = await parseJson(response)
  if (!response.ok || !data.success) {
    const err = new Error(data.message || 'Unable to submit online admission')
    err.status = response.status
    if (data.entry) err.entry = data.entry
    err.errors = data.errors || null
    throw err
  }
  return data.entry
}

/**
 * Student portal — load own latest online admission application.
 */
export async function getMyOnlineAdmission(token) {
  let response
  try {
    response = await fetch(buildUrl('/online/mine'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
  } catch {
    throw new Error(
      'Could not reach the server. Make sure the backend is running on port 3000.'
    )
  }
  const data = await parseJson(response)
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Unable to load online admission')
  }
  return data.entry || null
}

/**
 * Student portal — approved admissions (enrolled courses).
 */
export async function getMyApprovedCourses(token) {
  let response
  try {
    response = await fetch(buildUrl('/online/approved'), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
  } catch {
    throw new Error(
      'Could not reach the server. Make sure the backend is running on port 3000.'
    )
  }
  const data = await parseJson(response)
  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Unable to load approved courses')
  }
  return {
    rows: Array.isArray(data.rows) ? data.rows : [],
    total: data.total || 0,
  }
}
