import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  Film,
  FolderOpen,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  MessageSquare,
  Moon,
  NotebookPen,
  Search,
  Settings,
  Sun,
  Users,
  User,
  Video,
  X,
  Layers,
  Calendar,
  ListTodo,
  Plane,
  Banknote,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import logo from '../../assets/logo.png'
import LoadingScreen from '../LoadingScreen.jsx'
import {
  clearFacultySession,
  getFacultySession,
} from '../../utils/facultyAuth.js'
import {
  logoGlow,
  logoBox,
  navActive,
} from '../../utils/masterAdminTheme.js'
import { notifications as notificationsData, facultyProfile } from '../../data/facultyData.js'
import { useFacultyTheme, getFacultyShell } from './FacultyTheme.jsx'
import { slugToSection, facultyDashboardPath } from '../../utils/facultyRoutes.js'

import DashboardHome from './pages/DashboardHome.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import CoursesPage from './pages/CoursesPage.jsx'
import BatchesPage from './pages/BatchesPage.jsx'
import StudentsPage from './pages/StudentsPage.jsx'
import AttendancePage from './pages/AttendancePage.jsx'
import AssignmentsPage from './pages/AssignmentsPage.jsx'
import HomeworkPage from './pages/HomeworkPage.jsx'
import NotesPage from './pages/NotesPage.jsx'
import StudyMaterialsPage from './pages/StudyMaterialsPage.jsx'
import QuestionBankPage from './pages/QuestionBankPage.jsx'
import LiveClassesPage from './pages/LiveClassesPage.jsx'
import RecordedLecturesPage from './pages/RecordedLecturesPage.jsx'
import ExamsPage from './pages/ExamsPage.jsx'
import MarksResultsPage from './pages/MarksResultsPage.jsx'
import CertificatesPage from './pages/CertificatesPage.jsx'
import PerformanceAnalyticsPage from './pages/PerformanceAnalyticsPage.jsx'
import TimeTablePage from './pages/TimeTablePage.jsx'
import AnnouncementsPage from './pages/AnnouncementsPage.jsx'
import MessagesPage from './pages/MessagesPage.jsx'
import LeaveManagementPage from './pages/LeaveManagementPage.jsx'
import SalaryPage from './pages/SalaryPage.jsx'
import TasksPage from './pages/TasksPage.jsx'
import CalendarPage from './pages/CalendarPage.jsx'
import SupportPage from './pages/SupportPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import NotificationsPage from './pages/NotificationsPage.jsx'

const sideMenu = [
  {
    group: 'MAIN',
    items: ['Dashboard', 'My Profile', 'My Courses', 'My Batches', 'Students'],
  },
  {
    group: 'TEACHING',
    items: [
      'Attendance',
      'Assignments',
      'Homework',
      'Notes',
      'Study Materials',
      'Question Bank',
      'Live Classes',
      'Recorded Lectures',
    ],
  },
  {
    group: 'ACADEMICS',
    items: [
      'Exams',
      'Marks & Results',
      'Certificates',
      'Performance Analytics',
      'Time Table',
    ],
  },
  {
    group: 'COMMUNICATION',
    items: ['Announcements', 'Messages', 'Notifications'],
  },
  {
    group: 'HR & WORK',
    items: ['Leave Management', 'Salary', 'Tasks', 'Calendar'],
  },
  {
    group: 'ACCOUNT',
    items: ['Support', 'Settings'],
  },
]

const itemIcon = {
  Dashboard: LayoutDashboard,
  'My Profile': User,
  'My Courses': BookOpen,
  'My Batches': Layers,
  Students: Users,
  Attendance: CheckCircle2,
  Assignments: ClipboardList,
  Homework: NotebookPen,
  Notes: FileText,
  'Study Materials': FolderOpen,
  'Question Bank': HelpCircle,
  'Live Classes': Video,
  'Recorded Lectures': Film,
  Exams: GraduationCap,
  'Marks & Results': BarChart3,
  Certificates: Award,
  'Performance Analytics': BarChart3,
  'Time Table': CalendarDays,
  Announcements: Megaphone,
  Messages: MessageSquare,
  Notifications: Bell,
  'Leave Management': Plane,
  Salary: Banknote,
  Tasks: ListTodo,
  Calendar: Calendar,
  Support: HelpCircle,
  Settings: Settings,
}

const sectionDescriptions = {
  Dashboard: 'Teaching overview — students, batches, classes, pending work and quick actions.',
  'My Profile': 'Personal, professional, bank and document details.',
  'My Courses': 'Courses you teach with progress, students and analytics.',
  'My Batches': 'Active batches with timing, attendance and performance.',
  Students: 'Student list with search, filters, progress and contact details.',
  Attendance: 'Mark daily/bulk attendance, reports and analytics.',
  Assignments: 'Create, check and grade assignments with submission tracking.',
  Homework: 'Assign homework, track submissions and remarks.',
  Notes: 'Upload, pin, bookmark and share teaching notes.',
  'Study Materials': 'Videos, PDFs, documents and external links.',
  'Question Bank': 'MCQ, theory and programming questions by topic.',
  'Live Classes': "Today's and upcoming live sessions with join links.",
  'Recorded Lectures': 'Upload and manage recorded lecture library.',
  Exams: 'Create, schedule and manage online/offline exams.',
  'Marks & Results': 'Enter marks, grades, ranks and generate marksheets.',
  Certificates: 'Generate and issue course completion certificates.',
  'Performance Analytics': 'Teaching hours, student growth and batch comparison.',
  'Time Table': "Weekly timetable and today's teaching schedule.",
  Announcements: 'Create pinned announcements for students and faculty.',
  Messages: 'Inbox with student and admin conversations.',
  Notifications: 'Unread alerts from LMS and ERP events.',
  'Leave Management': 'Apply leave, balance and approval history.',
  Salary: 'Salary slips, tax, bonus and payment history.',
  Tasks: "Today's, pending and completed faculty tasks.",
  Calendar: 'Meetings, exams, assignments and institute holidays.',
  Support: 'Raise tickets, FAQs and technical help.',
  Settings: 'Theme, language, notifications, security and privacy.',
}

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

export default function FacultyDashboard() {
  const navigate = useNavigate()
  const { sectionSlug, legacySlug } = useParams()
  const session = getFacultySession()
  const { isDark, toggleTheme } = useFacultyTheme()
  const shell = getFacultyShell(isDark)

  const routeSlug = legacySlug || sectionSlug

  const activeSection = useMemo(() => {
    const fromUrl = slugToSection(routeSlug)
    if (routeSlug && !fromUrl) return 'Dashboard'
    return fromUrl || 'Dashboard'
  }, [routeSlug])

  const [sectionLoading, setSectionLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [search, setSearch] = useState('')

  const displayName = session?.name || facultyProfile.name
  const displayEmail = session?.email || facultyProfile.email
  const unreadCount = notificationsData.filter((n) => !n.read).length

  useEffect(() => {
    if (legacySlug) {
      const section = slugToSection(legacySlug)
      navigate(facultyDashboardPath(section || 'Dashboard'), { replace: true })
    }
  }, [legacySlug, navigate])

  useEffect(() => {
    if (!legacySlug && routeSlug && !slugToSection(routeSlug)) {
      navigate('/faculty/dashboard', { replace: true })
    }
  }, [legacySlug, routeSlug, navigate])

  useEffect(() => {
    setSectionLoading(true)
    const timeout = window.setTimeout(() => setSectionLoading(false), 450)
    return () => window.clearTimeout(timeout)
  }, [activeSection])

  useEffect(() => {
    setSidebarOpen(false)
    setNotifOpen(false)
    setProfileOpen(false)
  }, [activeSection])

  const handleSignOut = () => {
    clearFacultySession()
    navigate('/faculty', { replace: true })
  }

  const goToSection = (section) => {
    navigate(facultyDashboardPath(section))
  }

  const filteredMenu = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return sideMenu
    return sideMenu
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.toLowerCase().includes(q)),
      }))
      .filter((group) => group.items.length > 0)
  }, [search])

  const sectionComponentMap = {
    Dashboard: <DashboardHome onNavigate={goToSection} />,
    'My Profile': <ProfilePage />,
    'My Courses': <CoursesPage />,
    'My Batches': <BatchesPage />,
    Students: <StudentsPage />,
    Attendance: <AttendancePage />,
    Assignments: <AssignmentsPage />,
    Homework: <HomeworkPage />,
    Notes: <NotesPage />,
    'Study Materials': <StudyMaterialsPage />,
    'Question Bank': <QuestionBankPage />,
    'Live Classes': <LiveClassesPage />,
    'Recorded Lectures': <RecordedLecturesPage />,
    Exams: <ExamsPage />,
    'Marks & Results': <MarksResultsPage />,
    Certificates: <CertificatesPage />,
    'Performance Analytics': <PerformanceAnalyticsPage />,
    'Time Table': <TimeTablePage />,
    Announcements: <AnnouncementsPage />,
    Messages: <MessagesPage />,
    Notifications: <NotificationsPage />,
    'Leave Management': <LeaveManagementPage />,
    Salary: <SalaryPage />,
    Tasks: <TasksPage />,
    Calendar: <CalendarPage />,
    Support: <SupportPage />,
    Settings: <SettingsPage />,
  }

  return (
    <section className="relative min-h-screen w-full">
      <div className="relative grid min-h-screen w-full grid-cols-1 lg:grid-cols-[18rem_minmax(0,1fr)] lg:h-screen">
        {sidebarOpen ? (
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setSidebarOpen(false)}
            className={`fixed inset-0 z-40 backdrop-blur-sm lg:hidden ${shell.overlay}`}
          />
        ) : null}

        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[82%] max-w-[320px] flex-col overflow-hidden border-r transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:min-h-0 lg:w-72 lg:max-w-none lg:shrink-0 lg:translate-x-0 ${shell.sidebar} ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="flex shrink-0 items-start gap-2 border-b border-[#00A896]/20 px-4 pb-3 pt-4 lg:px-5 lg:pt-5">
            <div className="flex min-w-0 flex-1 items-start gap-2.5">
              <div className="relative shrink-0">
                <div className={`${logoGlow} opacity-70`} />
                <div className={logoBox}>
                  <img src={logo} alt="Grow Skills Tech" className="h-6 w-6 object-contain" />
                </div>
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p className={`truncate text-[15px] font-bold uppercase leading-snug tracking-[0.06em] ${shell.brandTitle}`}>
                  Grow Skills Tech
                </p>
                <p className={`mt-0.5 truncate text-[11px] font-medium uppercase leading-tight tracking-[0.12em] ${shell.brandSub}`}>
                  Faculty Portal
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
          </div>

          <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overflow-x-hidden px-4 py-4 [scrollbar-width:thin] [scrollbar-color:rgba(255,94,20,0.35)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#FF5E14]/25 hover:[&::-webkit-scrollbar-thumb]:bg-[#FF5E14]/45 lg:px-5 lg:pb-5">
            {filteredMenu.map((menu) => (
              <div key={menu.group}>
                <p className={`mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] ${shell.groupLabel}`}>
                  {menu.group}
                </p>
                <div className="space-y-1.5">
                  {menu.items.map((item) => {
                    const Icon = itemIcon[item] || LayoutDashboard
                    const active = item === activeSection
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => goToSection(item)}
                        className={`flex w-full min-w-0 items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                          active ? navActive : shell.navInactive
                        }`}
                      >
                        <Icon size={16} className="shrink-0" />
                        <span className="min-w-0 truncate">{item}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleSignOut}
              className={`flex w-full min-w-0 items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium transition ${shell.navInactive}`}
            >
              <LogOut size={16} className="shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        <main className="min-h-screen w-full min-w-0 px-3 pb-3 pt-0 sm:px-5 sm:pb-5 lg:h-screen lg:overflow-y-auto lg:px-6 lg:pb-6">
          <div
            className={`sticky top-0 z-30 -mx-3 mb-5 flex items-center gap-2 border-b px-3 py-2.5 backdrop-blur-xl sm:-mx-5 sm:gap-2.5 sm:px-5 sm:py-3 lg:-mx-6 lg:px-6 ${shell.mobileBar}`}
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
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                      {unreadCount}
                    </span>
                  ) : null}
                </button>
                {notifOpen ? (
                  <div className={`absolute right-0 z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border p-3 ${shell.dropdown}`}>
                    <p className={`mb-2 text-xs font-semibold uppercase tracking-wide ${shell.dropdownMuted}`}>Notifications</p>
                    <ul className="max-h-64 space-y-2 overflow-y-auto">
                      {notificationsData.slice(0, 5).map((n) => (
                        <li key={n.id} className={`rounded-xl border px-3 py-2 ${shell.dropdownItem}`}>
                          <p className={`text-xs font-medium ${shell.dropdownText}`}>{n.title}</p>
                          <p className={`text-[10px] ${shell.dropdownMeta}`}>{n.time}</p>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={() => goToSection('Notifications')}
                      className="mt-2 w-full text-center text-xs font-semibold text-[#00E5CC] hover:text-[#FF5E14]"
                    >
                      View all
                    </button>
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
                  <img src={facultyProfile.avatar} alt="" className="h-7 w-7 rounded-full object-cover" />
                  <span className="hidden max-w-[120px] truncate lg:inline">{displayName}</span>
                </button>
                {profileOpen ? (
                  <div className={`absolute right-0 z-50 mt-2 w-56 rounded-2xl border p-2 ${shell.dropdown}`}>
                    <p className={`px-2 py-1.5 text-[11px] ${shell.dropdownMuted}`}>{displayEmail}</p>
                    <button
                      type="button"
                      onClick={() => goToSection('My Profile')}
                      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm ${shell.menuItem}`}
                    >
                      <User size={14} /> My Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => goToSection('Settings')}
                      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm ${shell.menuItem}`}
                    >
                      <Settings size={14} /> Settings
                    </button>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm ${shell.menuItem}`}
                    >
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h1 className={`text-xl font-semibold sm:text-2xl ${shell.pageTitle}`}>{activeSection}</h1>
              <p className={`mt-1 text-xs sm:text-sm ${shell.pageDesc}`}>
                {sectionDescriptions[activeSection] || `${activeSection} module`}
              </p>
            </div>
          </div>

          {sectionLoading ? <LoadingScreen /> : sectionComponentMap[activeSection]}
        </main>
      </div>
    </section>
  )
}
