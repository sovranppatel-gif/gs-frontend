/** Map Master Admin section labels ↔ URL slugs under /master-admin/:slug */

function normalizeSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** Reserved paths that are not portal sections */
export const MASTER_ADMIN_RESERVED_SLUGS = new Set(['landing-page', 'login'])

/** Every navigable section label (sidebar + CMS children) */
export const MASTER_ADMIN_SECTIONS = [
  'Dashboard',
  'Hero left CMS',
  'About CMS',
  'Expertise CMS',
  'Process CMS',
  'Services CMS',
  'Case study CMS',
  'FAQ CMS',
  'Enquiry Management',
  'Institute Overview',
  'CCTV Cameras',
  'Admissions',
  'New Admission',
  'Universities',
  'Leads',
  'Enquiry Management',
  'Students',
  'ID Card Generate',
  'Faculty',
  'Staff',
  'Parents',
  'Departments',
  'Courses',
  'Programs',
  'Batches',
  'Subjects',
  'Classes',
  'Attendance',
  'Time Table',
  'Assignments',
  'Homework',
  'Study Materials',
  'Notes',
  'Question Bank',
  'Exams',
  'Results',
  'Certificates',
  'Fees',
  'Accounting',
  'Expenses',
  'Income',
  'Salary Management',
  'Payroll',
  'Payments',
  'Library',
  'Hostel',
  'Transport',
  'Inventory',
  'Assets',
  'Placement Cell',
  'Training Management',
  'Internships',
  'Events',
  'Calendar',
  'Announcements',
  'Messages',
  'Notifications',
  'Help Desk',
  'Support Tickets',
  'Reports',
  'Analytics',
  'Downloads',
  'Backup',
  'Audit Logs',
  'Roles & Permissions',
  'Branches',
  'Users',
  'System Settings',
  'Website CMS',
  'Email Templates',
  'SMS Templates',
  'WhatsApp Templates',
  'API Management',
  'Integrations',
  'Security',
  'Settings',
  'Profile',
  'Workshop Registrations',
]

const SECTION_BY_SLUG = new Map()
const SLUG_BY_SECTION = new Map()

for (const section of MASTER_ADMIN_SECTIONS) {
  const slug = normalizeSlug(section)
  SLUG_BY_SECTION.set(section, slug)
  SECTION_BY_SLUG.set(slug, section)
}

/** Dashboard home uses slug "dashboard" (or optional "home") */
SECTION_BY_SLUG.set('dashboard', 'Dashboard')
SECTION_BY_SLUG.set('home', 'Dashboard')
SLUG_BY_SECTION.set('Dashboard', 'dashboard')

export function sectionToSlug(section) {
  if (!section || section === 'Dashboard') return 'dashboard'
  return SLUG_BY_SECTION.get(section) || normalizeSlug(section)
}

export function slugToSection(slug) {
  if (!slug) return 'Dashboard'
  const key = normalizeSlug(slug)
  if (MASTER_ADMIN_RESERVED_SLUGS.has(key)) return null
  // Legacy URL → Enquiry Management
  if (key === 'community-applications' || key === 'community-join') {
    return 'Enquiry Management'
  }
  return SECTION_BY_SLUG.get(key) || null
}

export function masterAdminDashboardPath(section = 'Dashboard') {
  const slug = sectionToSlug(section)
  return `/master-admin/${slug}`
}

export function masterAdminPath(section = 'Dashboard') {
  if (section === 'Add Faculty') return '/master-admin/faculty/new'
  if (section === 'Faculty Assignments') return '/master-admin/faculty/assignments'
  return masterAdminDashboardPath(section)
}
