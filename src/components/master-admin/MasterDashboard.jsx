import {
  Activity,
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  Bus,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  Database,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Library,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  MonitorCog,
  Search,
  Settings,
  Shield,
  Ticket,
  Users,
  User,
  UserCog,
  Wallet,
  BadgeIndianRupee,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Layers,
  HardDrive,
  KeyRound,
  Plug,
  Globe,
  IdCard,
  Moon,
  Sun,
  X,
  Cctv,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { masterAdminDashboardPath, masterAdminPath, slugToSection } from '../../utils/masterAdminRoutes.js'
import logo from '../../assets/logo.png'
import EnquiryManagementPage from './enquiry/EnquiryManagementPage.jsx'
import LeadsManagementPage from './leads/LeadsManagementPage.jsx'
import CctvCamerasPage from './cctv/CctvCamerasPage.jsx'
import PaymentsPage from './payments/PaymentsPage'
import ReportsPage from './reports/ReportsPage'
import SettingsPage from './settings/SettingsPage'
import AuditLogsPage from './AuditLogsPage.jsx'
import AboutCmsPage from '../../pages/admin/about/AboutCmsPage.jsx'
import ExpertiseCmsPage from '../../pages/admin/expertise/ExpertiseCmsPage.jsx'
import ProcessCmsPage from '../../pages/admin/process/ProcessCmsPage.jsx'
import ServicesCmsPage from '../../pages/admin/services/ServicesCmsPage.jsx'
import CaseStudyCmsPage from '../../pages/admin/caseStudy/CaseStudyCmsPage.jsx'
import FaqCmsPage from '../../pages/admin/faq/FaqCmsPage.jsx'
import HeroLeftCmsPage from '../../pages/admin/heroLeft/HeroLeftCmsPage.jsx'
import { clearMasterAdminSession } from '../../utils/masterAdminAuth.js'
import { logoGlow, logoBox, navActive } from '../../utils/masterAdminTheme.js'
import { useMasterAdminTheme, getMasterAdminShell } from './MasterAdminTheme.jsx'
import InstituteDashboard from './erp/InstituteDashboard.jsx'
import AnalyticsPage from './erp/AnalyticsPage.jsx'
import AdmissionsPage from './erp/AdmissionsPage.jsx'
import AdmissionFormPage from './erp/AdmissionFormPage.jsx'
import UniversitiesPage from './erp/UniversitiesPage.jsx'
import CoursesPage from './erp/CoursesPage.jsx'
import FeesPage from './erp/FeesPage.jsx'
import AttendancePage from './erp/AttendancePage.jsx'
import BatchesPage from './erp/BatchesPage.jsx'
import FacultyPage from './faculty/FacultyPage.jsx'
import FacultyFormPage from './faculty/FacultyFormPage.jsx'
import FacultyProfilePage from './faculty/FacultyProfilePage.jsx'
import FacultyAssignmentsPage from './faculty/FacultyAssignmentsPage.jsx'
import FacultyTimetablePage from './faculty/FacultyTimetablePage.jsx'
import StaffPage from './staff/StaffPage.jsx'
import StaffFormPage from './staff/StaffFormPage.jsx'
import StaffProfilePage from './staff/StaffProfilePage.jsx'
import StaffDepartmentsPage from './staff/StaffDepartmentsPage.jsx'
import StaffDesignationsPage from './staff/StaffDesignationsPage.jsx'
import IdCardGeneratePage from './erp/IdCardGeneratePage.jsx'
import ErpModulePage from './erp/ErpModulePage.jsx'
import StudentsPage from './erp/StudentsPage.jsx'
import StudentDetailPage from './erp/StudentDetailPage.jsx'
import { getErpModule } from './erp/modulesRegistry.js'
import WorkshopRegistrationsPage from './workshop/WorkshopRegistrationsPage.jsx'
import {
  fetchMasterAdminNotifications,
  markAllMasterAdminNotificationsSeen,
  markMasterAdminNotificationsSeen,
} from '../../utils/masterAdminNotifications.js'
import { subscribeSectionUpdates } from '../../utils/socket.js'

const LANDING_CMS_SECTIONS = [
  'Hero left CMS',
  'About CMS',
  'Expertise CMS',
  'Process CMS',
  'Services CMS',
  'Case study CMS',
  'FAQ CMS',
]

const sideMenu = [
  {
    group: 'MAIN MENU',
    items: [
      'Dashboard',
      {
        label: 'Manage Landing Page',
        children: LANDING_CMS_SECTIONS,
      },
      {
        label: 'Enquiry Management',
        children: ['Enquiry Management', 'Leads'],
        displayLabels: {
          'Enquiry Management': 'Enquiry',
        },
      },
      'CCTV Cameras',
      'Institute Overview',
    ],
  },
  {
    group: 'ADMISSIONS & PEOPLE',
    items: [
      'Admissions',
      'Universities',
      'Students',
      'ID Card Generate',
      {
        label: 'Faculty Management',
        children: ['Faculty', 'Add Faculty', 'Faculty Assignments', 'Time Table'],
        displayLabels: {
          Faculty: 'Faculty',
          'Add Faculty': 'Add Faculty',
          'Faculty Assignments': 'Assignments',
          'Time Table': 'Timetable',
        },
      },
      {
        label: 'Staff Management',
        children: ['Staff', 'Add Staff', 'Staff Departments', 'Staff Designations'],
        displayLabels: {
          Staff: 'Staff',
          'Add Staff': 'Add Staff',
          'Staff Departments': 'Departments',
          'Staff Designations': 'Designations',
        },
      },
      'Parents',
    ],
  },
  {
    group: 'ACADEMICS',
    items: [
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
    ],
  },
  {
    group: 'FINANCE & HR',
    items: [
      'Fees',
      'Accounting',
      'Expenses',
      'Income',
      'Salary Management',
      'Payroll',
      'Payments',
    ],
  },
  {
    group: 'FACILITIES',
    items: ['Library', 'Hostel', 'Transport', 'Inventory', 'Assets'],
  },
  {
    group: 'CAREER & EVENTS',
    items: [
      'Placement Cell',
      'Training Management',
      'Internships',
      'Events',
      'Calendar',
    ],
  },
  {
    group: 'COMMUNICATION',
    items: [
      'Announcements',
      'Messages',
      'Notifications',
      'Help Desk',
      'Support Tickets',
    ],
  },
  {
    group: 'INSIGHTS',
    items: ['Reports', 'Analytics', 'Downloads', 'Backup', 'Audit Logs'],
  },
  {
    group: 'WORKSHOP',
    items: ['Workshop Registrations'],
  },
  {
    group: 'ADMINISTRATION',
    items: [
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
    ],
  },
]

const itemIcon = {
  Dashboard: LayoutDashboard,
  'Manage Landing Page': MonitorCog,
  'Hero left CMS': ClipboardList,
  'About CMS': ClipboardList,
  'Expertise CMS': ClipboardList,
  'Process CMS': ClipboardList,
  'Services CMS': ClipboardList,
  'Case study CMS': ClipboardList,
  'FAQ CMS': ClipboardList,
  'Enquiry Management': MessageSquare,
  'CCTV Cameras': Cctv,
  'Institute Overview': Building2,
  Admissions: GraduationCap,
  Universities: Building2,
  Leads: Users,
  Students: Users,
  'ID Card Generate': IdCard,
  Faculty: GraduationCap,
  'Staff Management': UserCog,
  Staff: UserCog,
  'Add Staff': UserCog,
  'Staff Departments': Building2,
  'Staff Designations': Layers,
  Parents: Users,
  Departments: Building2,
  Courses: BookOpen,
  Programs: Layers,
  Batches: Layers,
  Subjects: BookOpen,
  Classes: Building2,
  Attendance: ClipboardCheck,
  'Time Table': CalendarDays,
  Assignments: FileText,
  Homework: FileText,
  'Study Materials': BookOpen,
  Notes: FileText,
  'Question Bank': ClipboardList,
  Exams: ClipboardCheck,
  Results: FileText,
  Certificates: FileText,
  Fees: Wallet,
  Accounting: BadgeIndianRupee,
  Expenses: Wallet,
  Income: Wallet,
  'Salary Management': Wallet,
  Payroll: Wallet,
  Payments: BadgeIndianRupee,
  Library: Library,
  Hostel: Building2,
  Transport: Bus,
  Inventory: Database,
  Assets: HardDrive,
  'Placement Cell': Briefcase,
  'Training Management': GraduationCap,
  Internships: Briefcase,
  Events: CalendarDays,
  Calendar: CalendarDays,
  Announcements: Bell,
  Messages: Mail,
  Notifications: Bell,
  'Help Desk': Ticket,
  'Support Tickets': Ticket,
  Reports: Activity,
  Analytics: Activity,
  Downloads: HardDrive,
  Backup: Database,
  'Audit Logs': Shield,
  'Roles & Permissions': KeyRound,
  Branches: Building2,
  Users: Users,
  'System Settings': Settings,
  'Website CMS': Globe,
  'Email Templates': Mail,
  'SMS Templates': MessageSquare,
  'WhatsApp Templates': MessageSquare,
  'API Management': KeyRound,
  Integrations: Plug,
  Security: Shield,
  Settings: Settings,
  Profile: UserCog,
  'Workshop Registrations': ClipboardList,
}

const EXISTING_SECTION_SET = new Set([
  'Dashboard',
  ...LANDING_CMS_SECTIONS,
  'Enquiry Management',
  'Leads',
  'CCTV Cameras',
  'Admissions',
  'New Admission',
  'Universities',
  'Courses',
  'Fees',
  'Attendance',
  'Batches',
  'ID Card Generate',
  'Staff',
  'Payments',
  'Reports',
  'Settings',
  'Analytics',
  'Audit Logs',
  'Workshop Registrations',
  'Logout',
])

function ThemeToggleButton({ isDark, onToggle, className = '' }) {
  return (
    <button
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      onClick={onToggle}
      className={className}
    >
      {isDark ? <Sun size={16} className="text-[#FF5E14]" /> : <Moon size={16} className="text-[#008C95]" />}
    </button>
  )
}

export default function MasterDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const { sectionSlug, legacySlug, studentId, feeStudentSlug, facultyId, staffId } = useParams()
  const { isDark, toggleTheme } = useMasterAdminTheme()
  const shell = getMasterAdminShell(isDark)
  const facultyRoute = location.pathname.replace('/master-admin/faculty', '').replace(/^\//, '')
  const isFacultyRoute = location.pathname.startsWith('/master-admin/faculty')
  const staffRoute = location.pathname.replace('/master-admin/staff', '').replace(/^\//, '')
  const isStaffRoute = location.pathname.startsWith('/master-admin/staff')

  // Nested /id-card-generate/:studentId and /fees/:feeStudentSlug have no :sectionSlug
  const routeSlug =
    legacySlug ||
    sectionSlug ||
    (feeStudentSlug != null ? 'fees' : undefined) ||
    (studentId != null ? 'id-card-generate' : undefined)

  const activeSection = useMemo(() => {
    if (isFacultyRoute) return 'Faculty'
    if (isStaffRoute) return 'Staff'
    const fromUrl = slugToSection(routeSlug)
    if (routeSlug && !fromUrl) return 'Dashboard'
    return fromUrl || 'Dashboard'
  }, [isFacultyRoute, isStaffRoute, routeSlug])

  const [adminEmail, setAdminEmail] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('__ma_sidebar_collapsed__') === '1'
    } catch {
      return false
    }
  })
  const [openSubmenus, setOpenSubmenus] = useState(() => new Set())
  const [navQuery, setNavQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [openGroups, setOpenGroups] = useState(() => new Set(['MAIN MENU', 'ADMISSIONS & PEOPLE', 'ACADEMICS']))
  const [notifications, setNotifications] = useState([])

  const toggleSubmenu = (label) => {
    setOpenSubmenus((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  const openSubmenu = (label) => {
    setOpenSubmenus((prev) => {
      if (prev.has(label)) return prev
      const next = new Set(prev)
      next.add(label)
      return next
    })
  }

  const unreadCount = notifications.filter((n) => n.status === 'Unread').length
  const displayName = adminEmail ? adminEmail.split('@')[0] : 'Master Admin'

  const refreshNotifications = useCallback(async () => {
    try {
      const items = await fetchMasterAdminNotifications()
      setNotifications(items)
    } catch {
      /* keep previous list if offline */
    }
  }, [])

  useEffect(() => {
    refreshNotifications()
    const timer = window.setInterval(refreshNotifications, 45000)
    const unsubEnquiry = subscribeSectionUpdates('enquiries', refreshNotifications)
    const unsubAdmissions = subscribeSectionUpdates('admissions', refreshNotifications)
    const unsubLeads = subscribeSectionUpdates('leads', refreshNotifications)
    return () => {
      window.clearInterval(timer)
      unsubEnquiry()
      unsubAdmissions()
      unsubLeads()
    }
  }, [refreshNotifications])

  useEffect(() => {
    try {
      localStorage.setItem('__ma_sidebar_collapsed__', sidebarCollapsed ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [sidebarCollapsed])

  // Old /master-admin/dashboard/:slug → /master-admin/:slug
  useEffect(() => {
    if (legacySlug) {
      const section = slugToSection(legacySlug)
      navigate(masterAdminDashboardPath(section || 'Dashboard'), { replace: true })
    }
  }, [legacySlug, navigate])

  // Legacy community-applications URL → enquiry-management
  useEffect(() => {
    const key = String(routeSlug || '').toLowerCase()
    if (key === 'community-applications' || key === 'community-join') {
      navigate('/master-admin/enquiry-management', { replace: true })
    }
  }, [routeSlug, navigate])

  useEffect(() => {
    if (!legacySlug && routeSlug && !slugToSection(routeSlug)) {
      navigate('/master-admin/dashboard', { replace: true })
    }
  }, [legacySlug, routeSlug, navigate])

  useEffect(() => {
    try {
      const adminData = localStorage.getItem('__master_admin__')
      if (adminData) {
        const parsed = JSON.parse(adminData)
        setAdminEmail(parsed.email || '')
      }
    } catch {
      setAdminEmail('')
    }
  }, [])

  useEffect(() => {
    setSidebarOpen(false)
    setNotifOpen(false)
    setProfileOpen(false)
  }, [activeSection])

  useEffect(() => {
    if (LANDING_CMS_SECTIONS.includes(activeSection)) {
      setOpenSubmenus((prev) => {
        if (prev.has('Manage Landing Page')) return prev
        const next = new Set(prev)
        next.add('Manage Landing Page')
        return next
      })
      setOpenGroups((prev) => new Set([...prev, 'MAIN MENU']))
    }
    if (activeSection === 'Enquiry Management' || activeSection === 'Leads') {
      setOpenSubmenus((prev) => {
        if (prev.has('Enquiry Management')) return prev
        const next = new Set(prev)
        next.add('Enquiry Management')
        return next
      })
      setOpenGroups((prev) => new Set([...prev, 'MAIN MENU']))
    }
  }, [activeSection])

  const handleSignOut = () => {
    clearMasterAdminSession()
    navigate('/master-admin', { replace: true })
  }

  const handleNavigate = (section) => {
    if (section === 'Logout') {
      handleSignOut()
      return
    }
    navigate(masterAdminPath(section))
  }

  const handleChildNavigate = (child, parentLabel) => {
    if (parentLabel === 'Faculty Management') {
      if (child === 'Faculty') return navigate('/master-admin/faculty')
      if (child === 'Add Faculty') return navigate('/master-admin/faculty/new')
      if (child === 'Faculty Assignments') return navigate('/master-admin/faculty/assignments')
      if (child === 'Time Table') return navigate('/master-admin/faculty/timetable')
    }
    if (parentLabel === 'Staff Management') {
      if (child === 'Staff') return navigate('/master-admin/staff')
      if (child === 'Add Staff') return navigate('/master-admin/staff/new')
      if (child === 'Staff Departments') return navigate('/master-admin/staff/departments')
      if (child === 'Staff Designations') return navigate('/master-admin/staff/designations')
    }
    handleNavigate(child)
  }

  const isChildActive = (child, parentLabel) => {
    if (parentLabel === 'Faculty Management') {
      if (!isFacultyRoute) return false
      if (child === 'Faculty') return !facultyRoute || Boolean(facultyId)
      if (child === 'Add Faculty') return facultyRoute === 'new'
      if (child === 'Faculty Assignments') return facultyRoute === 'assignments'
      if (child === 'Time Table') return facultyRoute === 'timetable'
      return false
    }
    if (parentLabel === 'Staff Management') {
      if (!isStaffRoute) return false
      if (child === 'Staff') return !staffRoute || Boolean(staffId)
      if (child === 'Add Staff') return staffRoute === 'new'
      if (child === 'Staff Departments') return staffRoute === 'departments'
      if (child === 'Staff Designations') return staffRoute === 'designations'
      return false
    }
    return child === activeSection
  }

  const filteredMenu = useMemo(() => {
    const q = navQuery.trim().toLowerCase()
    if (!q) return sideMenu
    return sideMenu
      .map((menu) => {
        const items = menu.items
          .map((item) => {
            if (typeof item === 'string') {
              return item.toLowerCase().includes(q) ? item : null
            }
            const children = item.children.filter((c) => {
              const display = item.displayLabels?.[c] || c
              return c.toLowerCase().includes(q) || display.toLowerCase().includes(q)
            })
            if (item.label.toLowerCase().includes(q) || children.length) {
              return { ...item, children: children.length ? children : item.children }
            }
            return null
          })
          .filter(Boolean)
        return items.length ? { ...menu, items } : null
      })
      .filter(Boolean)
  }, [navQuery])

  const sectionHeading = useMemo(() => {
    if (activeSection === 'Dashboard') {
      return 'Premium institute command center — health score, KPIs, quick actions, and live widgets.'
    }
    if (activeSection === 'Enquiry Management') {
      return 'Landing page enquiries from Connect With Grow Skills Tech — client & student submissions.'
    }
    if (activeSection === 'Leads') {
      return 'Sales pipeline — assign counsellors, track follow-ups, and convert prospects (live server + sockets).'
    }
    if (activeSection === 'CCTV Cameras') {
      return 'Campus camera wall — demo feeds for reception, labs, corridors and gates (frontend only).'
    }
    if (LANDING_CMS_SECTIONS.includes(activeSection)) {
      return `Control ${activeSection.replace(' CMS', '')} content, status and visibility.`
    }
    if (activeSection === 'Admissions') {
      return 'Create and manage admissions for Grow Skills Tech IT training courses (same list as Connect With Grow Skills Tech).'
    }
    if (activeSection === 'Universities') {
      return 'Add and manage partner universities, registration numbers, affiliation IDs and contact details.'
    }
    if (activeSection === 'Courses') {
      return 'Full course catalog — university programs (PGDCA, DCA with semesters) and Grow Skills Tech institute training (duration, fees, subjects).'
    }
    if (activeSection === 'Fees') {
      return feeStudentSlug
        ? 'Student fee details — installments, payments and receipts.'
        : 'Fee ledgers synced from admissions — record payments and print receipts.'
    }
    if (activeSection === 'Attendance') {
      return 'Cascaded attendance — select university, course and semester first, then mark and search students.'
    }
    if (activeSection === 'Batches') {
      return 'Live course batches (start 1 Aug 2026) — sync enrolled students and last-7-day attendance.'
    }
    if (activeSection === 'ID Card Generate') {
      return studentId
        ? 'Preview all advanced ID card labels for this student, then print the selected design.'
        : 'Click a student to open all advanced ID card label designs and print.'
    }
    if (activeSection === 'New Admission') {
      return 'Official admission form and शपथ पत्र — fill, save, and print.'
    }
    if (activeSection === 'Analytics') {
      return 'Recharts-powered admissions, revenue, attendance, placement and faculty analytics.'
    }
    if (activeSection === 'Audit Logs') {
      return 'Live Socket.IO activity trail for every CMS and ERP section.'
    }
    if (activeSection === 'Staff') {
      if (isStaffRoute && staffRoute === 'departments') return 'Non-teaching staff departments — HR, Sales, Operations, IT and more.'
      if (isStaffRoute && staffRoute === 'designations') return 'Designations, grouped by department and seniority level.'
      if (isStaffRoute && staffId) return 'Employee profile — employment history, activity and (as they’re built) attendance, leave, payroll and documents.'
      return 'Non-teaching staff — HR, Sales, Operations, IT and more. Faculty stays in its own module.'
    }
    if (activeSection === 'Payments') {
      return 'Payment ledger and settlement overview.'
    }
    if (activeSection === 'Settings') {
      return 'Landing footer, social and site settings.'
    }
    if (activeSection === 'Workshop Registrations') {
      return 'Leads captured from the public Skills Enhance Workshop registration page — filterable by referral source, college, course and semester/year.'
    }
    const mod = getErpModule(activeSection)
    if (mod) return `${mod.title} — search, filter, export and manage with demo institute data.`
    return `${activeSection} management with realistic demo data.`
  }, [activeSection, studentId, feeStudentSlug, isStaffRoute, staffRoute, staffId])

  const sectionContent = useMemo(() => {
    if (isFacultyRoute && facultyRoute === 'new') return <FacultyFormPage />
    if (isFacultyRoute && facultyRoute === 'assignments') return <FacultyAssignmentsPage />
    if (isFacultyRoute && facultyRoute === 'timetable') return <FacultyTimetablePage />
    if (isFacultyRoute && facultyId) return <FacultyProfilePage facultyId={facultyId} />
    if (isStaffRoute && staffRoute === 'new') return <StaffFormPage />
    if (isStaffRoute && staffRoute === 'departments') return <StaffDepartmentsPage />
    if (isStaffRoute && staffRoute === 'designations') return <StaffDesignationsPage />
    if (isStaffRoute && staffId) return <StaffProfilePage staffId={staffId} />
    if (activeSection === 'Staff') return <StaffPage />
    if (activeSection === 'Dashboard') return <InstituteDashboard onNavigate={handleNavigate} />
    if (activeSection === 'Hero left CMS') return <HeroLeftCmsPage />
    if (activeSection === 'About CMS') return <AboutCmsPage />
    if (activeSection === 'Expertise CMS') return <ExpertiseCmsPage />
    if (activeSection === 'Process CMS') return <ProcessCmsPage />
    if (activeSection === 'Services CMS') return <ServicesCmsPage />
    if (activeSection === 'Case study CMS') return <CaseStudyCmsPage />
    if (activeSection === 'FAQ CMS') return <FaqCmsPage />
    if (activeSection === 'Enquiry Management') return <EnquiryManagementPage />
    if (activeSection === 'Leads') return <LeadsManagementPage />
    if (activeSection === 'CCTV Cameras') return <CctvCamerasPage />
    if (activeSection === 'Admissions') return <AdmissionsPage />
    if (activeSection === 'Universities') return <UniversitiesPage />
    if (activeSection === 'Courses') return <CoursesPage />
    if (activeSection === 'Students') return studentId ? <StudentDetailPage studentId={studentId} /> : <StudentsPage />
    if (activeSection === 'Fees') return <FeesPage />
    if (activeSection === 'Attendance') return <AttendancePage />
    if (activeSection === 'Batches') return <BatchesPage />
    if (activeSection === 'Faculty') return <FacultyPage />
    if (activeSection === 'ID Card Generate') return <IdCardGeneratePage studentId={studentId} />
    if (activeSection === 'New Admission') return <AdmissionFormPage />
    if (activeSection === 'Payments') return <PaymentsPage />
    if (activeSection === 'Settings') return <SettingsPage />
    if (activeSection === 'Analytics') return <AnalyticsPage />
    if (activeSection === 'Audit Logs') return <AuditLogsPage />
    if (activeSection === 'Workshop Registrations') return <WorkshopRegistrationsPage />
    if (activeSection === 'Reports') {
      const erp = getErpModule('Reports')
      return erp ? <ErpModulePage config={erp} onNavigate={handleNavigate} /> : <ReportsPage />
    }

    const erp = getErpModule(activeSection)
    if (erp) return <ErpModulePage config={erp} onNavigate={handleNavigate} />

    return (
      <article className="rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-600">
        Module <strong>{activeSection}</strong> is registered in the sidebar. Connect live APIs when ready.
      </article>
    )
  }, [activeSection, facultyId, facultyRoute, feeStudentSlug, isFacultyRoute, studentId, isStaffRoute, staffRoute, staffId])

  const toggleGroup = (group) => {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      if (next.has(group)) next.delete(group)
      else next.add(group)
      return next
    })
  }

  return (
    <section className="relative min-h-screen w-full">
      <div
        className={`relative grid min-h-screen w-full grid-cols-1 lg:h-screen ${
          sidebarCollapsed
            ? 'lg:grid-cols-[4.75rem_minmax(0,1fr)]'
            : 'lg:grid-cols-[18rem_minmax(0,1fr)]'
        }`}
      >
        {sidebarOpen ? (
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setSidebarOpen(false)}
            className={`fixed inset-0 z-40 backdrop-blur-sm lg:hidden ${shell.overlay}`}
          />
        ) : null}

        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[82%] max-w-[320px] flex-col overflow-hidden border-r transition-[width,transform] duration-300 lg:sticky lg:top-0 lg:h-screen lg:min-h-0 lg:max-w-none lg:shrink-0 lg:translate-x-0 ${shell.sidebar} ${
            sidebarCollapsed ? 'lg:w-[4.75rem]' : 'lg:w-72'
          } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        >
          <div
            className={`relative flex shrink-0 items-start gap-2 border-b border-[#00A896]/20 pb-3 pt-4 ${
              sidebarCollapsed ? 'justify-center px-2 lg:px-2 lg:pb-4 lg:pt-5' : 'px-4 lg:px-5 lg:pt-5'
            }`}
          >
            <div className={`flex min-w-0 items-start ${sidebarCollapsed ? '' : 'flex-1 gap-2.5'}`}>
              <div className="relative shrink-0">
                <div className={`${logoGlow} opacity-70`} />
                <div className={logoBox}>
                  <img src={logo} alt="Grow Skills Tech" className="h-6 w-6 object-contain" />
                </div>
              </div>
              <div className={`min-w-0 flex-1 pt-0.5 ${sidebarCollapsed ? 'hidden' : ''}`}>
                <p className={`truncate text-[15px] font-bold uppercase leading-snug tracking-[0.06em] ${shell.brandTitle}`}>
                  Grow Skills Tech
                </p>
                <p className={`mt-0.5 truncate text-[11px] font-medium uppercase leading-tight tracking-[0.12em] ${shell.brandSub}`}>
                  Master Admin
                </p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={() => setSidebarOpen(false)}
              className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border lg:hidden ${shell.iconBtn}`}
            >
              <X size={16} />
            </button>
            <button
              type="button"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              onClick={() => setSidebarCollapsed((v) => !v)}
              className={`hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition lg:inline-flex ${shell.iconBtn} ${
                sidebarCollapsed ? 'absolute right-1.5 top-1.5 h-7 w-7' : ''
              }`}
            >
              {sidebarCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          <div
            className={`min-h-0 flex-1 space-y-3 overflow-y-auto overflow-x-hidden py-4 [scrollbar-width:thin] [scrollbar-color:rgba(255,94,20,0.35)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#FF5E14]/25 hover:[&::-webkit-scrollbar-thumb]:bg-[#FF5E14]/45 ${
              sidebarCollapsed ? 'px-2 lg:px-2' : 'px-4 lg:px-5 lg:pb-5'
            }`}
          >
            {filteredMenu.map((menu) => {
              const isOpen = sidebarCollapsed || navQuery.trim() ? true : openGroups.has(menu.group)
              return (
                <div key={menu.group}>
                  {!sidebarCollapsed ? (
                    <button
                      type="button"
                      onClick={() => toggleGroup(menu.group)}
                      className={`mb-2 flex w-full items-center justify-between text-[11px] font-semibold uppercase tracking-[0.12em] ${shell.groupLabel}`}
                    >
                      <span>{menu.group}</span>
                      <ChevronDown size={12} className={`transition ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <div className={`mb-2 hidden h-px lg:block ${shell.divider}`} aria-hidden />
                  )}
                  {isOpen ? (
                    <div className={`space-y-1 ${sidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
                      {menu.items.map((item) => {
                        if (typeof item === 'string') {
                          const Icon = itemIcon[item] || LayoutDashboard
                          const active =
                            item === activeSection ||
                            (item === 'Admissions' && activeSection === 'New Admission')
                          return (
                            <button
                              key={item}
                              type="button"
                              title={item}
                              onClick={() => handleNavigate(item)}
                              className={`flex items-center gap-2 rounded-lg text-left text-sm font-medium transition ${
                                sidebarCollapsed
                                  ? `h-10 w-10 justify-center px-0 ${active ? navActive : shell.navInactive}`
                                  : `w-full min-w-0 px-3 py-2 ${active ? navActive : shell.navInactive}`
                              }`}
                            >
                              <Icon size={15} className="shrink-0" />
                              {!sidebarCollapsed ? <span className="min-w-0 truncate">{item}</span> : null}
                            </button>
                          )
                        }

                        const parentActive = item.children.includes(activeSection)
                        const ParentIcon = itemIcon[item.label] || LayoutDashboard
                        const submenuOpen = Boolean(navQuery.trim()) || openSubmenus.has(item.label)
                        return (
                          <div key={item.label} className={sidebarCollapsed ? 'flex w-full flex-col items-center' : ''}>
                            <button
                              type="button"
                              title={item.label}
                              onClick={() => {
                                if (sidebarCollapsed) {
                                  setSidebarCollapsed(false)
                                  openSubmenu(item.label)
                                  return
                                }
                                toggleSubmenu(item.label)
                              }}
                              className={`flex items-center gap-2 rounded-lg text-left text-sm font-medium transition ${
                                sidebarCollapsed
                                  ? `h-10 w-10 justify-center px-0 ${parentActive ? navActive : shell.navInactive}`
                                  : `w-full min-w-0 justify-between px-3 py-2 ${parentActive ? navActive : shell.navInactive}`
                              }`}
                            >
                              <span className="flex min-w-0 items-center gap-2">
                                <ParentIcon size={15} className="shrink-0" />
                                {!sidebarCollapsed ? <span className="min-w-0 truncate">{item.label}</span> : null}
                              </span>
                              {!sidebarCollapsed ? (
                                <ChevronDown
                                  size={14}
                                  className={`shrink-0 opacity-90 transition-transform ${submenuOpen ? 'rotate-180' : ''}`}
                                />
                              ) : null}
                            </button>
                            {submenuOpen && !sidebarCollapsed ? (
                              <div className="mt-1 ml-3 space-y-1">
                                {item.children.map((child) => {
                                  const childActive = isChildActive(child, item.label)
                                  const ChildIcon = itemIcon[child] || ClipboardList
                                  const childLabel = item.displayLabels?.[child] || child
                                  return (
                                    <button
                                      key={child}
                                      type="button"
                                      onClick={() => handleChildNavigate(child, item.label)}
                                      className={`flex w-full min-w-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition ${
                                        childActive ? shell.navChildActive : shell.navChildInactive
                                      }`}
                                    >
                                      <ChildIcon size={13} className="shrink-0" />
                                      <span className="min-w-0 truncate">{childLabel}</span>
                                    </button>
                                  )
                                })}
                              </div>
                            ) : null}
                            {sidebarCollapsed && parentActive ? (
                              <div className="mt-1 flex flex-col items-center space-y-1">
                                {item.children.map((child) => {
                                  const childActive = isChildActive(child, item.label)
                                  const ChildIcon = itemIcon[child] || ClipboardList
                                  const childLabel = item.displayLabels?.[child] || child
                                  return (
                                    <button
                                      key={child}
                                      type="button"
                                      title={childLabel}
                                      onClick={() => handleChildNavigate(child, item.label)}
                                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs transition ${
                                        childActive ? shell.navChildActive : shell.navChildInactive
                                      }`}
                                    >
                                      <ChildIcon size={13} />
                                    </button>
                                  )
                                })}
                              </div>
                            ) : null}
                          </div>
                        )
                      })}
                    </div>
                  ) : null}
                </div>
              )
            })}

            <button
              type="button"
              title="Logout"
              onClick={handleSignOut}
              className={`flex items-center gap-2 rounded-lg text-left text-sm font-medium transition ${shell.navInactive} ${
                sidebarCollapsed ? 'mx-auto h-10 w-10 justify-center px-0' : 'w-full min-w-0 px-3 py-2'
              }`}
            >
              <LogOut size={15} className="shrink-0" />
              {!sidebarCollapsed ? <span>Logout</span> : null}
            </button>
          </div>
        </aside>

        <main className="min-h-screen w-full min-w-0 px-2 pb-2 pt-0 sm:px-3 sm:pb-3 lg:h-screen lg:overflow-y-auto lg:px-3 lg:pb-3">
          <div
            className={`sticky top-0 z-30 -mx-2 mb-3 flex items-center gap-2 border-b px-2 py-2 backdrop-blur-xl sm:-mx-3 sm:gap-2 sm:px-3 sm:py-2.5 lg:-mx-3 lg:px-3 ${shell.mobileBar}`}
          >
            <button
              type="button"
              aria-label="Open sidebar"
              onClick={() => setSidebarOpen(true)}
              className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border lg:hidden ${shell.iconBtn}`}
            >
              <Menu size={18} />
            </button>

            <div className={`flex min-w-0 flex-1 items-center gap-2 rounded-full border px-2.5 py-1.5 text-sm sm:px-3 sm:py-2 ${shell.search}`}>
              <Search size={16} className="shrink-0 text-[#FF5E14]" />
              <input
                value={navQuery}
                onChange={(e) => setNavQuery(e.target.value)}
                placeholder="Search modules…"
                className={`w-full min-w-0 bg-transparent text-sm outline-none ${shell.searchInput}`}
              />
            </div>

            <div className="relative flex shrink-0 items-center gap-1 sm:gap-1.5">
              <ThemeToggleButton
                isDark={isDark}
                onToggle={toggleTheme}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition sm:h-10 sm:w-10 sm:rounded-full ${shell.iconBtn}`}
              />

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setNotifOpen((v) => !v)
                    setProfileOpen(false)
                  }}
                  className={`relative inline-flex h-9 w-9 items-center justify-center rounded-lg border sm:h-10 sm:w-10 sm:rounded-full ${shell.iconBtn}`}
                >
                  <Bell size={16} />
                  {unreadCount > 0 ? (
                    <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FF5E14] px-1 text-[10px] font-bold text-white">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  ) : null}
                </button>
                {notifOpen ? (
                  <div className={`absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-lg border p-3 ${shell.dropdown}`}>
                    <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${shell.dropdownMuted}`}>
                      Notifications
                    </p>
                    <ul className="max-h-72 space-y-2 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <li className={`rounded-lg border px-3 py-3 text-center text-xs ${shell.dropdownMuted}`}>
                          No landing enquiries or online admissions yet.
                        </li>
                      ) : (
                        notifications.slice(0, 8).map((n) => (
                          <li key={n.id}>
                            <button
                              type="button"
                              onClick={() => {
                                markMasterAdminNotificationsSeen([n.id])
                                setNotifications((prev) =>
                                  prev.map((item) =>
                                    item.id === n.id ? { ...item, status: 'Read' } : item,
                                  ),
                                )
                                setNotifOpen(false)
                                handleNavigate(n.section || 'Enquiry Management')
                              }}
                              className={`w-full rounded-lg border px-3 py-2 text-left transition ${shell.dropdownItem} ${
                                n.status === 'Unread' ? 'border-[#FF5E14]/35 bg-[#FF5E14]/5' : ''
                              }`}
                            >
                              <p className={`text-xs font-medium ${shell.dropdownText}`}>{n.title}</p>
                              {n.detail ? (
                                <p className={`mt-0.5 text-[10px] ${shell.dropdownMeta}`}>{n.detail}</p>
                              ) : null}
                              <p className={`mt-0.5 text-[10px] ${shell.dropdownMeta}`}>
                                {n.type} · {n.time}
                              </p>
                            </button>
                          </li>
                        ))
                      )}
                    </ul>
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          markAllMasterAdminNotificationsSeen(notifications)
                          setNotifications((prev) => prev.map((n) => ({ ...n, status: 'Read' })))
                          setNotifOpen(false)
                          handleNavigate('Enquiry Management')
                        }}
                        className="flex-1 text-center text-xs font-semibold text-[#00E5CC] hover:text-[#FF5E14]"
                      >
                        Enquiries
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setNotifOpen(false)
                          handleNavigate('Admissions')
                        }}
                        className="flex-1 text-center text-xs font-semibold text-[#00E5CC] hover:text-[#FF5E14]"
                      >
                        Admissions
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen((v) => !v)
                    setNotifOpen(false)
                  }}
                  className={`flex items-center gap-2 rounded-lg border p-1 text-sm sm:rounded-full sm:p-1.5 lg:py-1.5 lg:pl-1.5 lg:pr-3 ${shell.iconBtn}`}
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[#FF5E14] to-[#008C95] text-[11px] font-bold text-white">
                    {(displayName[0] || 'M').toUpperCase()}
                  </span>
                  <span className="hidden max-w-[140px] truncate lg:inline">{adminEmail || 'master-admin'}</span>
                </button>
                {profileOpen ? (
                  <div className={`absolute right-0 z-50 mt-2 w-56 rounded-lg border p-2 ${shell.dropdown}`}>
                    <p className={`px-2 py-1.5 text-[11px] ${shell.dropdownMuted}`}>{adminEmail || 'master-admin'}</p>
                    <button
                      type="button"
                      onClick={() => handleNavigate('Profile')}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${shell.menuItem}`}
                    >
                      <User size={14} /> Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNavigate('Settings')}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${shell.menuItem}`}
                    >
                      <Settings size={14} /> Settings
                    </button>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm ${shell.menuItem}`}
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <h1 className={`text-xl font-semibold sm:text-2xl ${shell.pageTitle}`}>
                {activeSection === 'New Admission' ? 'Admission Form' : activeSection}
              </h1>
              <p className={`mt-0.5 text-xs sm:text-sm ${shell.pageDesc}`}>{sectionHeading}</p>
            </div>
            {!EXISTING_SECTION_SET.has(activeSection) && getErpModule(activeSection) ? (
              <span className="hidden rounded-full border border-[#00A896]/35 bg-[#00A896]/10 px-3 py-1 text-[11px] font-semibold text-[#00E5CC] sm:inline">
                ERP Module · Demo Data
              </span>
            ) : null}
          </div>

          {sectionContent}
        </main>
      </div>
    </section>
  )
}
