import { API_URL } from '../utils/api.js'
import { getMasterAdminToken } from '../utils/masterAdminAuth.js'

function authHeaders() {
  const token = getMasterAdminToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

async function parseJson(response) {
  return response.json().catch(() => ({}))
}

function toQuery(params = {}) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return
    qs.set(k, String(v))
  })
  const q = qs.toString()
  return q ? `?${q}` : ''
}

export async function getStudents(params = {}, options = {}) {
  const url = `${API_URL}/api/master-admin/students${toQuery(params)}`
  const controller = options.signal ? null : new AbortController()
  const signal = options.signal || (controller ? controller.signal : undefined)
  const timeoutMs = Number(options.timeoutMs) || 20000
  const timer = controller ? window.setTimeout(() => controller.abort(), timeoutMs) : null
  let response
  try {
    response = await fetch(url, { headers: authHeaders(), signal })
  } catch (err) {
    if (err?.name === 'AbortError') throw new Error('Students request timed out')
    throw new Error('Could not reach the server. Check backend and retry.')
  } finally {
    if (timer) window.clearTimeout(timer)
  }
  const data = await parseJson(response)
  if (!response.ok || !data.success) throw new Error(data.message || 'Failed to load students')
  return {
    items: Array.isArray(data.items) ? data.items : [],
    total: Number(data.total || 0),
    page: Number(data.page || params.page || 1),
    limit: Number(data.limit || params.limit || 25),
    totalPages: Number(data.totalPages || Math.ceil((data.total || 0) / (params.limit || 25))),
  }
}

export async function getStudentById(id) {
  if (!id) throw new Error('Missing id')
  const response = await fetch(`${API_URL}/api/master-admin/students/${encodeURIComponent(id)}`, { headers: authHeaders() })
  const data = await parseJson(response)
  if (!response.ok || !data.success) throw new Error(data.message || 'Failed to load student')
  return data.entry
}

export async function getStudentsStats() {
  const response = await fetch(`${API_URL}/api/master-admin/students/stats`, { headers: authHeaders() })
  const data = await parseJson(response)
  if (!response.ok || !data.success) throw new Error(data.message || 'Failed to load students stats')
  return data
}
