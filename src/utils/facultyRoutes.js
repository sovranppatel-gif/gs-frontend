/** Map Faculty portal section labels ↔ URL slugs under /faculty/:slug */

function normalizeSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Reserved paths that are not portal sections */
export const FACULTY_RESERVED_SLUGS = new Set(['login', 'signup'])

/** Every navigable section label (sidebar) */
export const FACULTY_SECTIONS = [
  'Dashboard',
  'My Profile',
  'My Courses',
  'My Batches',
  'Students',
  'Attendance',
  'Assignments',
  'Homework',
  'Notes',
  'Study Materials',
  'Question Bank',
  'Live Classes',
  'Recorded Lectures',
  'Exams',
  'Marks & Results',
  'Certificates',
  'Performance Analytics',
  'Time Table',
  'Announcements',
  'Messages',
  'Notifications',
  'Leave Management',
  'Salary',
  'Tasks',
  'Calendar',
  'Support',
  'Settings',
]

const SECTION_BY_SLUG = new Map()
const SLUG_BY_SECTION = new Map()

for (const section of FACULTY_SECTIONS) {
  const slug = normalizeSlug(section)
  SLUG_BY_SECTION.set(section, slug)
  SECTION_BY_SLUG.set(slug, section)
}

SECTION_BY_SLUG.set('dashboard', 'Dashboard')
SECTION_BY_SLUG.set('home', 'Dashboard')
SECTION_BY_SLUG.set('profile', 'My Profile')
SECTION_BY_SLUG.set('courses', 'My Courses')
SECTION_BY_SLUG.set('batches', 'My Batches')
SLUG_BY_SECTION.set('Dashboard', 'dashboard')

export function sectionToSlug(section) {
  if (!section || section === 'Dashboard') return 'dashboard'
  return SLUG_BY_SECTION.get(section) || normalizeSlug(section)
}

export function slugToSection(slug) {
  if (!slug) return 'Dashboard'
  const key = normalizeSlug(slug)
  if (FACULTY_RESERVED_SLUGS.has(key)) return null
  return SECTION_BY_SLUG.get(key) || null
}

export function facultyDashboardPath(section = 'Dashboard') {
  const slug = sectionToSlug(section)
  return `/faculty/${slug}`
}
