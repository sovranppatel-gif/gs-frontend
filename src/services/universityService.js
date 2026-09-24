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
  return `${API_URL}/api/universities${path}`
}

async function parseJson(response) {
  return response.json().catch(() => ({}))
}

function isAbortError(err) {
  if (!err) return false
  if (err.name === 'AbortError') return true
  if (err.code === 20) return true // DOMException ABORT_ERR
  return /aborted|abort/i.test(String(err.message || ''))
}

function networkErrorMessage(err) {
  if (isAbortError(err)) {
    return 'Universities request timed out. Check MongoDB / server connection and retry.'
  }
  const detail = err?.message ? ` (${err.message})` : ''
  return `Could not reach the server on port 3000${detail}. Confirm backend is running, then retry.`
}

async function request(path = '', options = {}) {
  let response
  const timeoutMs = Number(options.timeoutMs) || 12000
  const { timeoutMs: _ignored, ...fetchOptions } = options
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeoutMs)
  try {
    response = await fetch(buildUrl(path), {
      ...fetchOptions,
      signal: options.signal || controller.signal,
      headers: {
        ...authHeaders(),
        ...(fetchOptions.headers || {}),
      },
    })
  } catch (err) {
    throw new Error(networkErrorMessage(err))
  } finally {
    window.clearTimeout(timer)
  }

  const data = await parseJson(response)
  if (!response.ok || !data.success) {
    // Distinct statuses (401/403/404/409/422/500) all land here with whatever
    // human-readable message the backend attached — a 409 duplicate, a 400
    // validation error and a 500 all read as their own specific sentence
    // rather than the page falling back to one generic failure message.
    throw new Error(data.message || `University request failed (${response.status})`)
  }
  return data
}

function buildQuery(params = {}) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') qs.set(key, String(value))
  })
  const query = qs.toString()
  return query ? `?${query}` : ''
}

/**
 * Called two ways across the app: with no args (every University dropdown —
 * Faculty, Courses, Batches, Admissions — wants the complete active list) or
 * with { page, limit } from the Universities screen itself for a real
 * server-side page. Omitting page/limit here is what tells the backend to
 * return everything in one shot, so the dropdown contract never changes.
 */
export async function getUniversities(params = {}) {
  const data = await request(buildQuery(params))
  return {
    rows: Array.isArray(data.rows) ? data.rows : [],
    stats: data.stats || {},
    pagination: data.pagination || { page: 1, limit: data.rows?.length || 0, total: data.rows?.length || 0, totalPages: 1 },
  }
}

export async function getUniversityById(id) {
  const data = await request(`/${encodeURIComponent(id)}`)
  return data.entry
}

export async function createUniversity(payload) {
  const data = await request('', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return data.entry
}

export async function updateUniversity(id, payload) {
  const data = await request(`/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  return data.entry
}

export async function deleteUniversity(id) {
  const data = await request(`/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
  return data.entry
}

export async function activateUniversity(id) {
  const data = await request(`/${encodeURIComponent(id)}/activate`, {
    method: 'PATCH',
  })
  return data.entry
}
