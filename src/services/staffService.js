import { API_URL } from '../utils/api.js'
import { getMasterAdminToken } from '../utils/masterAdminAuth.js'

function authHeaders() {
  const token = getMasterAdminToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

function staffUrl(path = '') {
  return `${API_URL}/api/staff${path}`
}

function staffQuery(params = {}) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') qs.set(key, String(value))
  })
  const query = qs.toString()
  return query ? `?${query}` : ''
}

async function parseJson(response) {
  return response.json().catch(() => ({}))
}

async function staffRequest(path = '', options = {}) {
  let response
  const isWrite = Boolean(options.method && options.method !== 'GET')
  const timeoutMs = Number(options.timeoutMs) || (isWrite ? 30000 : 15000)
  const { timeoutMs: _ignored, ...fetchOptions } = options
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeoutMs)
  try {
    response = await fetch(staffUrl(path), {
      ...fetchOptions,
      signal: fetchOptions.signal || controller.signal,
      headers: { ...authHeaders(), ...(fetchOptions.headers || {}) },
    })
  } catch (err) {
    if (err?.name === 'AbortError') throw new Error('Staff request timed out. Check the server connection and retry.')
    throw new Error('Could not reach the server. Make sure the backend is running on port 3000.')
  } finally {
    window.clearTimeout(timer)
  }
  const data = await parseJson(response)
  if (!response.ok || !data.success) {
    throw new Error(data.message || `Staff request failed (${response.status})`)
  }
  return data
}

// ---------------------------------------------------------------------------
// Staff CRUD
// ---------------------------------------------------------------------------

export async function getStaff(params = {}) {
  const data = await staffRequest(staffQuery(params))
  return {
    rows: Array.isArray(data.rows) ? data.rows : [],
    pagination: data.pagination || { page: 1, limit: data.rows?.length || 0, total: data.rows?.length || 0, totalPages: 1 },
  }
}

export async function getStaffStats() {
  const data = await staffRequest('/stats')
  return data.stats || {}
}

export async function getStaffMeta() {
  const data = await staffRequest('/meta')
  return {
    departments: data.departments || [],
    designations: data.designations || [],
    employmentTypes: data.employmentTypes || [],
    workModes: data.workModes || [],
    statuses: data.statuses || [],
  }
}

export async function getStaffById(id) {
  const data = await staffRequest(`/${encodeURIComponent(id)}`)
  return data.entry
}

export async function createStaff(payload) {
  const data = await staffRequest('', { method: 'POST', body: JSON.stringify(payload) })
  return data.entry
}

export async function updateStaff(id, payload) {
  const data = await staffRequest(`/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(payload) })
  return data.entry
}

export async function updateStaffStatus(id, status) {
  const data = await staffRequest(`/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
  return data.entry
}

/** Soft-archives the staff member — kept in the database, just hidden from
 * the active list (see staff.routes.js). */
export async function archiveStaff(id) {
  const data = await staffRequest(`/${encodeURIComponent(id)}`, { method: 'DELETE' })
  return data.entry
}

export async function restoreStaff(id) {
  const data = await staffRequest(`/${encodeURIComponent(id)}/restore`, { method: 'PATCH' })
  return data.entry
}

export async function uploadStaffPhoto(file) {
  const formData = new FormData()
  formData.append('file', file)
  const token = getMasterAdminToken()
  const response = await fetch(staffUrl('/upload-photo'), {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })
  const data = await parseJson(response)
  if (!response.ok || !data.success) throw new Error(data.message || 'Unable to upload photo')
  return data.data
}

// ---------------------------------------------------------------------------
// Departments
// ---------------------------------------------------------------------------

export async function getStaffDepartments(params = {}) {
  const data = await staffRequest(`/departments${staffQuery(params)}`)
  return data.rows || []
}

export async function createStaffDepartment(payload) {
  const data = await staffRequest('/departments', { method: 'POST', body: JSON.stringify(payload) })
  return data.entry
}

export async function updateStaffDepartment(id, payload) {
  const data = await staffRequest(`/departments/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(payload) })
  return data.entry
}

export async function setStaffDepartmentStatus(id, status) {
  const data = await staffRequest(`/departments/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
  return data.entry
}

export async function archiveStaffDepartment(id) {
  const data = await staffRequest(`/departments/${encodeURIComponent(id)}`, { method: 'DELETE' })
  return data.entry
}

// ---------------------------------------------------------------------------
// Designations
// ---------------------------------------------------------------------------

export async function getStaffDesignations(params = {}) {
  const data = await staffRequest(`/designations${staffQuery(params)}`)
  return data.rows || []
}

export async function createStaffDesignation(payload) {
  const data = await staffRequest('/designations', { method: 'POST', body: JSON.stringify(payload) })
  return data.entry
}

export async function updateStaffDesignation(id, payload) {
  const data = await staffRequest(`/designations/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(payload) })
  return data.entry
}

export async function setStaffDesignationStatus(id, status) {
  const data = await staffRequest(`/designations/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
  return data.entry
}

export async function archiveStaffDesignation(id) {
  const data = await staffRequest(`/designations/${encodeURIComponent(id)}`, { method: 'DELETE' })
  return data.entry
}
