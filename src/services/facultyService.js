/** Frontend-only dummy faculty APIs (replace with real backend later) */
import * as data from '../data/facultyData.js'

const delay = (ms = 200) => new Promise((r) => setTimeout(r, ms))

export async function fetchFacultyProfile() {
  await delay()
  return { ok: true, data: data.facultyProfile }
}

export async function fetchDashboardStats() {
  await delay()
  return { ok: true, data: data.dashboardStats }
}

export async function fetchCourses() {
  await delay()
  return { ok: true, data: data.courses }
}

export async function fetchBatches() {
  await delay()
  return { ok: true, data: data.batches }
}

export async function fetchStudents(query = '') {
  await delay()
  const q = String(query).trim().toLowerCase()
  const list = !q
    ? data.students
    : data.students.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          s.batch.toLowerCase().includes(q)
      )
  return { ok: true, data: list }
}

export async function fetchAssignments() {
  await delay()
  return { ok: true, data: data.assignments }
}

export async function fetchNotifications() {
  await delay()
  return { ok: true, data: data.notifications }
}

export async function fetchSalary() {
  await delay()
  return { ok: true, data: data.salary }
}

export async function fetchLeaves() {
  await delay()
  return { ok: true, data: data.leaves, balance: data.leaveBalance }
}

import { API_URL } from '../utils/api.js'
import { getMasterAdminToken } from '../utils/masterAdminAuth.js'

function facultyAuthHeaders() {
  const token = getMasterAdminToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

function facultyUrl(path = '') {
  return `${API_URL}/api/faculties${path}`
}

function facultyQuery(params = {}) {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, String(value))
  })
  const value = query.toString()
  return value ? `?${value}` : ''
}

async function facultyRequest(path = '', options = {}) {
  const { timeoutMs = 20000, ...fetchOptions } = options
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), timeoutMs)
  let response
  try {
    response = await fetch(facultyUrl(path), {
      ...fetchOptions,
      signal: fetchOptions.signal || controller.signal,
      headers: { ...facultyAuthHeaders(), ...(fetchOptions.headers || {}) },
    })
  } catch (err) {
    if (err?.name === 'AbortError') throw new Error('Faculty request timed out. Check the server connection and retry.')
    throw new Error('Could not reach the server. Make sure the backend is running on port 3001.')
  } finally {
    window.clearTimeout(timer)
  }
  const result = await response.json().catch(() => ({}))
  if (!response.ok || result.success === false) {
    throw new Error(result.message || `Faculty request failed (${response.status})`)
  }
  return result
}

export async function getFaculties(params = {}) {
  const result = await facultyRequest(facultyQuery(params))
  return { rows: Array.isArray(result.rows) ? result.rows : [], stats: result.stats || {}, pagination: result.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 } }
}

export async function getFacultyStats() {
  const result = await facultyRequest('/stats/overview')
  return result.stats || {}
}

export async function getFacultyMeta() {
  const result = await facultyRequest('/meta')
  return { designations: result.designations || [], departments: result.departments || [], permissions: result.permissions || [] }
}

export async function getFacultyById(id) {
  const result = await facultyRequest(`/${encodeURIComponent(id)}`)
  return result.entry
}

export async function createFaculty(payload) {
  const result = await facultyRequest('', { method: 'POST', body: JSON.stringify(payload) })
  return result.entry
}

export async function updateFaculty(id, payload) {
  const result = await facultyRequest(`/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(payload) })
  return result.entry
}

export async function updateFacultyStatus(id, status) {
  const result = await facultyRequest(`/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
  return result.entry
}

export async function deleteFaculty(id) {
  const result = await facultyRequest(`/${encodeURIComponent(id)}`, { method: 'DELETE' })
  return result.entry
}

export async function uploadFacultyPhoto(file) {
  if (!file) throw new Error('No file selected')
  if (file.size > 400 * 1024) throw new Error('Photo must be 400 KB or smaller')
  const formData = new FormData()
  formData.append('file', file)
  const token = getMasterAdminToken()
  const response = await fetch(facultyUrl('/upload-photo'), { method: 'POST', headers: token ? { Authorization: `Bearer ${token}` } : {}, body: formData })
  const result = await response.json().catch(() => ({}))
  if (!response.ok || !result.success) throw new Error(result.message || 'Unable to upload photo')
  return result.data
}

export async function getFacultyAssignments(facultyId) {
  const result = await facultyRequest(`/${encodeURIComponent(facultyId)}/assignments`)
  return { rows: result.rows || [], facultyId: result.facultyId }
}

export async function getAllFacultyAssignments(params = {}) {
  const result = await facultyRequest(`/assignments${facultyQuery(params)}`)
  return { rows: result.rows || [], pagination: result.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 } }
}

export async function createFacultyAssignment(facultyId, payload) {
  const result = await facultyRequest(`/${encodeURIComponent(facultyId)}/assignments`, { method: 'POST', body: JSON.stringify(payload) })
  return result.entry
}

export async function updateFacultyAssignment(facultyId, assignmentId, payload) {
  const result = await facultyRequest(`/${encodeURIComponent(facultyId)}/assignments/${encodeURIComponent(assignmentId)}`, { method: 'PUT', body: JSON.stringify(payload) })
  return result.entry
}

export async function updateFacultyAssignmentStatus(facultyId, assignmentId, status) {
  const result = await facultyRequest(`/${encodeURIComponent(facultyId)}/assignments/${encodeURIComponent(assignmentId)}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
  return result.entry
}

export async function deleteFacultyAssignment(facultyId, assignmentId) {
  const result = await facultyRequest(`/${encodeURIComponent(facultyId)}/assignments/${encodeURIComponent(assignmentId)}`, { method: 'DELETE' })
  return result.entry
}

export async function getFacultyStudents(facultyId) {
  const result = await facultyRequest(`/${encodeURIComponent(facultyId)}/students`)
  return { rows: result.rows || [], total: result.total || 0 }
}

export async function getFacultyExams(facultyId) {
  const result = await facultyRequest(`/${encodeURIComponent(facultyId)}/exams`)
  return { rows: result.rows || [], total: result.total || 0 }
}

export async function getFacultyTimetable(facultyId) {
  const result = await facultyRequest(`/${encodeURIComponent(facultyId)}/timetable`)
  return { rows: result.rows || [], facultyId: result.facultyId }
}

export async function getTimetable(params = {}) {
  const result = await facultyRequest(`/timetable${facultyQuery(params)}`)
  return { rows: result.rows || [] }
}

export async function createFacultyTimetable(facultyId, payload) {
  const result = await facultyRequest(`/${encodeURIComponent(facultyId)}/timetable`, { method: 'POST', body: JSON.stringify(payload) })
  return result.entry
}

export async function updateFacultyTimetable(facultyId, entryId, payload) {
  const result = await facultyRequest(`/${encodeURIComponent(facultyId)}/timetable/${encodeURIComponent(entryId)}`, { method: 'PUT', body: JSON.stringify(payload) })
  return result.entry
}

export async function deleteFacultyTimetable(facultyId, entryId) {
  const result = await facultyRequest(`/${encodeURIComponent(facultyId)}/timetable/${encodeURIComponent(entryId)}`, { method: 'DELETE' })
  return result.entry
}

export async function getFacultyAttendance(facultyId, params = {}) {
  const result = await facultyRequest(`/${encodeURIComponent(facultyId)}/attendance${facultyQuery(params)}`)
  return { today: result.today || null, rows: result.rows || [], stats: result.stats || {}, month: result.month || '' }
}

export async function saveFacultyAttendance(facultyId, payload) {
  const result = await facultyRequest(`/${encodeURIComponent(facultyId)}/attendance`, { method: 'POST', body: JSON.stringify(payload) })
  return result.entry
}
