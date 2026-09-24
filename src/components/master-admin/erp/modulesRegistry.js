import {
  Users,
  GraduationCap,
  UserCog,
  Building2,
  BookOpen,
  Layers,
  CalendarDays,
  ClipboardCheck,
  Wallet,
  Library,
  Bus,
  Briefcase,
  Ticket,
  Bell,
} from 'lucide-react'
import * as D from '../../../data/master-admin/dummyData.js'

const money = (v) => v

function cols(...pairs) {
  return pairs.map(([key, label]) => ({ key, label }))
}

/** Section key → module config for ErpModulePage */
export const erpModules = {
  'Institute Overview': {
    title: 'Institute Overview',
    stats: [
      { label: 'Health Score', value: `${D.instituteProfile.healthScore}%`, hint: 'Ops + academics', icon: Building2 },
      { label: 'Active Students', value: '2,104', icon: Users },
      { label: 'Monthly Revenue', value: '₹62.4L', icon: Wallet },
      { label: 'Open Tickets', value: '17', icon: Ticket },
    ],
    features: ['Multi-branch snapshot', 'KPI health', 'Session overview', 'Capacity planning'],
    columns: cols(['id', 'ID'], ['name', 'Branch'], ['students', 'Students'], ['faculty', 'Faculty'], ['revenue', 'Revenue'], ['status', 'Status']),
    rows: D.branches,
    searchKeys: ['name', 'id'],
    related: ['Branches', 'Analytics', 'Reports'],
  },

  Admissions: {
    title: 'Admissions',
    stats: [
      { label: 'Pending', value: '42', icon: ClipboardCheck },
      { label: 'Approved (month)', value: '186', icon: GraduationCap },
      { label: 'Online', value: '128', hint: 'This month' },
      { label: 'Offline / Walk-in', value: '58' },
    ],
    features: [
      'Admission Form Builder',
      'Online / Offline Admission',
      'Document Upload',
      'Verification',
      'Approval / Rejection',
      'Student ID & Roll Generation',
      'Batch Allocation',
      'Fee Structure',
      'Admission Letter',
      'Student / Parent Login Creation',
    ],
    columns: cols(['id', 'ID'], ['applicant', 'Applicant'], ['program', 'Program'], ['mode', 'Mode'], ['counsellor', 'Counsellor'], ['fee', 'Fee'], ['date', 'Date'], ['status', 'Status']),
    rows: D.admissions,
    searchKeys: ['id', 'applicant', 'program', 'counsellor'],
    filterKey: 'status',
    addLabel: 'New Admission',
    related: ['Leads', 'Enquiry Management', 'Students', 'Fees'],
  },

  Leads: {
    title: 'Leads',
    stats: [
      { label: 'New Leads', value: '24', icon: Users },
      { label: 'Qualified', value: '18' },
      { label: 'Converted', value: '12' },
      { label: 'Conversion Rate', value: '28%' },
    ],
    features: ['Walk-in', 'Website', 'Phone', 'WhatsApp', 'Email', 'Lead Status', 'Source', 'Follow-up', 'Counsellor Assignment', 'Conversion Analytics'],
    columns: cols(['id', 'ID'], ['name', 'Name'], ['source', 'Source'], ['interest', 'Interest'], ['counsellor', 'Counsellor'], ['followUp', 'Follow-up'], ['phone', 'Phone'], ['status', 'Status']),
    rows: D.leads,
    searchKeys: ['id', 'name', 'source', 'interest'],
    filterKey: 'status',
    addLabel: 'Add Lead',
    related: ['Enquiry Management', 'Admissions'],
  },

  'Enquiry Management': {
    title: 'Enquiry Management',
    stats: [
      { label: 'Open', value: '31' },
      { label: 'Follow-up', value: '19' },
      { label: 'Closed', value: '84' },
      { label: 'Today', value: '7' },
    ],
    features: ['Multi-channel enquiries', 'Counsellor desk', 'Follow-up tracker', 'Conversion link'],
    columns: cols(['id', 'ID'], ['name', 'Name'], ['channel', 'Channel'], ['assigned', 'Assigned'], ['date', 'Date'], ['notes', 'Notes'], ['status', 'Status']),
    rows: D.enquiries,
    searchKeys: ['id', 'name', 'channel', 'assigned'],
    related: ['Leads', 'Admissions'],
  },

  Students: {
    title: 'Students',
    stats: [
      { label: 'Total', value: '2,486', icon: Users },
      { label: 'Active', value: '2,104' },
      { label: 'Suspended', value: '12' },
      { label: 'Fee Pending', value: '186' },
    ],
    features: [
      'Student List / Search / Filter',
      'Profile & Parent Details',
      'Documents',
      'Attendance / Fees / Results',
      'Transfer / Suspend / Promote',
      'Batch Transfer',
    ],
    columns: cols(['id', 'ID'], ['name', 'Name'], ['roll', 'Roll'], ['program', 'Program'], ['batch', 'Batch'], ['attendance', 'Attendance'], ['fees', 'Fees'], ['status', 'Status']),
    rows: D.students,
    searchKeys: ['id', 'name', 'roll', 'program', 'batch', 'email'],
    filterKey: 'status',
    addLabel: 'Register Student',
    related: ['Attendance', 'Fees', 'Results', 'Certificates', 'Parents'],
  },

  // Note: "Faculty" is intentionally not registered here — MasterDashboard
  // routes that section to the real, database-backed
  // components/master-admin/faculty/FacultyPage.jsx before this generic ERP
  // fallback is ever consulted. A dummy-data "Faculty" entry used to live
  // here (plus an unreachable erp/FacultyPage.jsx); both were dead code and
  // have been removed to avoid confusing a future edit into the wrong module.

  Staff: {
    title: 'Staff',
    stats: [
      { label: 'Total Staff', value: '64', icon: UserCog },
      { label: 'Present Today', value: '61' },
      { label: 'On Leave', value: '3' },
      { label: 'Departments', value: '8' },
    ],
    features: ['HR Records', 'Attendance', 'Salary', 'Leaves', 'Documents', 'Performance'],
    columns: cols(['id', 'ID'], ['name', 'Name'], ['role', 'Role'], ['department', 'Department'], ['attendance', 'Attendance'], ['salary', 'Salary'], ['status', 'Status']),
    rows: D.staff,
    searchKeys: ['id', 'name', 'role', 'department'],
    related: ['Salary Management', 'Payroll', 'Attendance'],
  },

  Parents: {
    title: 'Parents',
    stats: [
      { label: 'Linked Parents', value: '1,860', icon: Users },
      { label: 'Active Logins', value: '1,420' },
      { label: 'Messages Pending', value: '28' },
      { label: 'Fee Alerts Sent', value: '96' },
    ],
    features: ['Parent profiles', 'Ward linkage', 'Login creation', 'Fee / attendance alerts'],
    columns: cols(['id', 'ID'], ['name', 'Name'], ['student', 'Student'], ['relation', 'Relation'], ['phone', 'Phone'], ['email', 'Email'], ['status', 'Status']),
    rows: D.parents,
    searchKeys: ['id', 'name', 'student', 'phone'],
    related: ['Students', 'Messages', 'Fees'],
  },

  Departments: {
    title: 'Departments',
    stats: [
      { label: 'Departments', value: '12', icon: Building2 },
      { label: 'Programs', value: '18' },
      { label: 'Faculty', value: '128' },
      { label: 'Students', value: '2,104' },
    ],
    features: ['Department hierarchy', 'HOD assignment', 'Capacity view'],
    columns: cols(['id', 'ID'], ['name', 'Name'], ['head', 'Head'], ['programs', 'Programs'], ['faculty', 'Faculty'], ['students', 'Students'], ['status', 'Status']),
    rows: D.departments,
    searchKeys: ['id', 'name', 'head'],
    related: ['Programs', 'Courses', 'Faculty'],
  },

  Courses: {
    title: 'Courses',
    stats: [
      { label: 'Published', value: '86', icon: BookOpen },
      { label: 'Draft', value: '11' },
      { label: 'Categories', value: '8' },
      { label: 'Avg Price', value: '₹84k' },
    ],
    features: ['Create / Edit / Delete', 'Category', 'Duration', 'Modules', 'Pricing', 'Syllabus', 'Faculty Assignment'],
    columns: cols(['id', 'ID'], ['name', 'Course'], ['category', 'Category'], ['duration', 'Duration'], ['modules', 'Modules'], ['price', 'Price'], ['faculty', 'Faculty'], ['status', 'Status']),
    rows: D.courses,
    searchKeys: ['id', 'name', 'category', 'faculty'],
    filterKey: 'status',
    addLabel: 'Create Course',
    related: ['Programs', 'Batches', 'Study Materials'],
  },

  Programs: {
    title: 'Programs',
    stats: [
      { label: 'Programs', value: '18', icon: Layers },
      { label: 'Semesters Mapped', value: '42' },
      { label: 'Total Credits', value: '264' },
      { label: 'Active', value: '16' },
    ],
    features: ['Create Program', 'Semester', 'Credits', 'Course Mapping'],
    columns: cols(['id', 'ID'], ['name', 'Program'], ['semesters', 'Semesters'], ['credits', 'Credits'], ['courses', 'Courses'], ['status', 'Status']),
    rows: D.programs,
    searchKeys: ['id', 'name'],
    related: ['Courses', 'Batches', 'Subjects'],
  },

  Batches: {
    title: 'Batches',
    stats: [
      { label: 'Running', value: '54', icon: Layers },
      { label: 'Upcoming', value: '9' },
      { label: 'Avg Size', value: '32' },
      { label: 'Completion Avg', value: '48%' },
    ],
    features: ['Create Batch', 'Assign Faculty / Students', 'Schedule', 'Progress'],
    columns: cols(['id', 'ID'], ['name', 'Batch'], ['program', 'Program'], ['faculty', 'Faculty'], ['students', 'Students'], ['schedule', 'Schedule'], ['progress', 'Progress'], ['status', 'Status']),
    rows: D.batches,
    searchKeys: ['id', 'name', 'program', 'faculty'],
    related: ['Students', 'Faculty', 'Time Table'],
  },

  Subjects: {
    title: 'Subjects',
    stats: [
      { label: 'Subjects', value: '214', icon: BookOpen },
      { label: 'Mapped Batches', value: '54' },
      { label: 'Faculty Assigned', value: '118' },
      { label: 'Credits Total', value: '860' },
    ],
    features: ['Create Subject', 'Assign Faculty / Batch', 'Credits'],
    columns: cols(['id', 'ID'], ['code', 'Code'], ['name', 'Subject'], ['credits', 'Credits'], ['faculty', 'Faculty'], ['batch', 'Batch'], ['status', 'Status']),
    rows: D.subjects,
    searchKeys: ['id', 'code', 'name', 'faculty'],
    related: ['Faculty', 'Batches', 'Exams'],
  },

  Classes: {
    title: 'Classes',
    stats: [
      { label: 'Rooms', value: '48' },
      { label: 'Occupied Now', value: '22' },
      { label: 'Labs', value: '14' },
      { label: 'Available', value: '26' },
    ],
    features: ['Room allocation', 'Capacity', 'Live occupancy'],
    columns: cols(['id', 'ID'], ['name', 'Class'], ['room', 'Room'], ['capacity', 'Capacity'], ['batch', 'Batch'], ['faculty', 'Faculty'], ['status', 'Status']),
    rows: D.classes,
    searchKeys: ['id', 'name', 'room', 'batch'],
    related: ['Time Table', 'Attendance'],
  },

  Attendance: {
    title: 'Attendance',
    stats: [
      { label: "Today's Avg", value: '91%', icon: ClipboardCheck },
      { label: 'Students Present', value: '1,912' },
      { label: 'Faculty Present', value: '118' },
      { label: 'Staff Present', value: '61' },
    ],
    features: ['Student / Faculty / Staff', 'Biometric UI', 'QR Attendance', 'Bulk Marking', 'Reports', 'Analytics'],
    columns: cols(['id', 'ID'], ['name', 'Name'], ['role', 'Role'], ['batch', 'Batch'], ['date', 'Date'], ['method', 'Method'], ['status', 'Status']),
    rows: D.attendanceRows,
    searchKeys: ['id', 'name', 'batch', 'role'],
    filterKey: 'status',
    tabs: ['Student Attendance', 'Faculty Attendance', 'Staff Attendance', 'Biometric', 'QR'],
    related: ['Reports', 'Analytics', 'Students'],
  },

  'Time Table': {
    title: 'Time Table',
    stats: [
      { label: 'Slots Today', value: '86' },
      { label: 'Conflicts', value: '2' },
      { label: 'Labs Booked', value: '11' },
      { label: 'Free Rooms', value: '9' },
    ],
    features: ['Drag & Drop UI', 'Faculty / Student / Lab Schedule', 'Room Allocation', 'Conflict Detection'],
    columns: cols(['id', 'ID'], ['day', 'Day'], ['time', 'Time'], ['subject', 'Subject'], ['faculty', 'Faculty'], ['room', 'Room'], ['batch', 'Batch']),
    rows: D.timetableSlots,
    searchKeys: ['subject', 'faculty', 'room', 'batch', 'day'],
    filterKey: 'day',
    related: ['Classes', 'Faculty', 'Batches'],
  },

  Assignments: {
    title: 'Assignments',
    stats: [
      { label: 'Open', value: '48', icon: BookOpen },
      { label: 'Due This Week', value: '16' },
      { label: 'Awaiting Eval', value: '210' },
      { label: 'Avg Score', value: '78%' },
    ],
    features: ['Create', 'Assign Faculty / Students', 'Upload PDF', 'Deadline', 'Marks', 'Evaluation', 'Feedback'],
    columns: cols(['id', 'ID'], ['title', 'Title'], ['course', 'Course'], ['batch', 'Batch'], ['deadline', 'Deadline'], ['marks', 'Marks'], ['submissions', 'Submissions'], ['status', 'Status']),
    rows: D.assignments,
    searchKeys: ['id', 'title', 'course', 'batch'],
    related: ['Homework', 'Students', 'Faculty'],
  },

  Homework: {
    title: 'Homework',
    stats: [
      { label: 'Active', value: '34' },
      { label: 'Avg Completion', value: '82%' },
      { label: 'Overdue', value: '9' },
      { label: 'Completed Today', value: '126' },
    ],
    features: ['Create / Assign', 'Tracking', 'Completion Status'],
    columns: cols(['id', 'ID'], ['title', 'Title'], ['batch', 'Batch'], ['assigned', 'Assigned'], ['due', 'Due'], ['completion', 'Completion'], ['status', 'Status']),
    rows: D.homework,
    searchKeys: ['id', 'title', 'batch'],
    related: ['Assignments', 'Students'],
  },

  'Study Materials': {
    title: 'Study Materials',
    stats: [
      { label: 'Resources', value: '1,240' },
      { label: 'Videos', value: '320' },
      { label: 'PDFs', value: '680' },
      { label: 'Versions', value: '410' },
    ],
    features: ['PDF / Video / ZIP / PPT / DOC', 'External Links', 'Categories', 'Version Control'],
    columns: cols(['id', 'ID'], ['title', 'Title'], ['type', 'Type'], ['course', 'Course'], ['version', 'Version'], ['size', 'Size'], ['uploaded', 'Uploaded'], ['status', 'Status']),
    rows: D.studyMaterials,
    searchKeys: ['id', 'title', 'course', 'type'],
    filterKey: 'type',
    addLabel: 'Upload Material',
    related: ['Notes', 'Courses'],
  },

  Notes: {
    title: 'Notes',
    stats: [
      { label: 'Published Notes', value: '286' },
      { label: 'Authors', value: '64' },
      { label: 'Updated This Week', value: '22' },
      { label: 'Drafts', value: '18' },
    ],
    features: ['Faculty notes', 'Batch targeting', 'Publish workflow'],
    columns: cols(['id', 'ID'], ['title', 'Title'], ['subject', 'Subject'], ['author', 'Author'], ['batch', 'Batch'], ['updated', 'Updated'], ['status', 'Status']),
    rows: D.notes,
    searchKeys: ['id', 'title', 'subject', 'author'],
    related: ['Study Materials', 'Subjects'],
  },

  'Question Bank': {
    title: 'Question Bank',
    stats: [
      { label: 'Questions', value: '4,820' },
      { label: 'MCQ', value: '3,100' },
      { label: 'Programming', value: '860' },
      { label: 'Theory', value: '860' },
    ],
    features: ['MCQ / Programming / Theory', 'Difficulty', 'Topic', 'Import / Export'],
    columns: cols(['id', 'ID'], ['title', 'Question'], ['type', 'Type'], ['difficulty', 'Difficulty'], ['topic', 'Topic'], ['status', 'Status']),
    rows: D.questionBank,
    searchKeys: ['id', 'title', 'topic', 'type'],
    filterKey: 'difficulty',
    related: ['Exams', 'Results'],
  },

  Exams: {
    title: 'Exams',
    stats: [
      { label: 'Scheduled', value: '18' },
      { label: 'Live', value: '2' },
      { label: 'Online', value: '12' },
      { label: 'Offline', value: '16' },
    ],
    features: ['Creation', 'Schedule', 'Online / Offline', 'Question Papers', 'Invigilator', 'Hall Allocation', 'Analytics'],
    columns: cols(['id', 'ID'], ['name', 'Exam'], ['type', 'Type'], ['batch', 'Batch'], ['date', 'Date'], ['hall', 'Hall'], ['invigilator', 'Invigilator'], ['status', 'Status']),
    rows: D.exams,
    searchKeys: ['id', 'name', 'batch', 'hall'],
    related: ['Question Bank', 'Results', 'Certificates'],
  },

  Results: {
    title: 'Results',
    stats: [
      { label: 'Published', value: '1,104' },
      { label: 'Pending Entry', value: '86' },
      { label: 'Avg CGPA', value: '8.2' },
      { label: 'Merit Listed', value: '48' },
    ],
    features: ['Marks Entry', 'Bulk Upload', 'Grade / CGPA / SGPA', 'Marksheet', 'Rank', 'Merit List', 'PDF'],
    columns: cols(['id', 'ID'], ['student', 'Student'], ['exam', 'Exam'], ['marks', 'Marks'], ['grade', 'Grade'], ['cgpa', 'CGPA'], ['rank', 'Rank'], ['status', 'Status']),
    rows: D.results,
    searchKeys: ['id', 'student', 'exam'],
    related: ['Exams', 'Certificates', 'Downloads'],
  },

  Certificates: {
    title: 'Certificates',
    stats: [
      { label: 'Issued YTD', value: '1,842' },
      { label: 'Pending', value: '36' },
      { label: 'Templates', value: '12' },
      { label: 'QR Verified', value: '1,610' },
    ],
    features: [
      'Course / Internship / Training / Completion',
      'Achievement / Participation',
      'Experience / Bonafide',
      'Templates',
      'Digital Signature',
      'QR Verification',
      'PDF Download',
    ],
    columns: cols(['id', 'ID'], ['student', 'Student'], ['type', 'Type'], ['course', 'Course'], ['issued', 'Issued'], ['verify', 'Verify Code'], ['status', 'Status']),
    rows: D.certificates,
    searchKeys: ['id', 'student', 'type', 'verify'],
    addLabel: 'Generate Certificate',
    related: ['Students', 'Internships', 'Downloads'],
  },

  Fees: {
    title: 'Fees',
    stats: [
      { label: 'Collected (month)', value: '₹48.2L', icon: Wallet },
      { label: 'Pending', value: '₹12.6L' },
      { label: 'Overdue', value: '₹4.1L' },
      { label: 'Scholarships', value: '64' },
    ],
    features: [
      'Categories',
      'Installments',
      'Scholarships / Discount',
      'Late Fee',
      'Online / Offline Payment',
      'Invoices / Receipts',
      'Refund',
      'Fee Reports',
    ],
    columns: cols(['id', 'ID'], ['student', 'Student'], ['category', 'Category'], ['installment', 'Installment'], ['amount', 'Amount'], ['paid', 'Paid'], ['due', 'Due'], ['status', 'Status']),
    rows: D.fees,
    searchKeys: ['id', 'student', 'category'],
    filterKey: 'status',
    related: ['Accounting', 'Payments', 'Students'],
  },

  Accounting: {
    title: 'Accounting',
    stats: [
      { label: 'Bank Balance', value: '₹86.2L' },
      { label: 'GST Output', value: '₹4.8L' },
      { label: 'P&L (month)', value: '₹33.5L' },
      { label: 'Ledgers', value: '124' },
    ],
    features: ['Chart of Accounts', 'Income / Expenses', 'Cashbook / Bank Book', 'GST / Tax', 'P&L', 'Balance Sheet', 'Ledger'],
    columns: cols(['id', 'ID'], ['account', 'Account'], ['type', 'Type'], ['balance', 'Balance'], ['period', 'Period']),
    rows: D.accounting,
    searchKeys: ['id', 'account', 'type'],
    filterKey: 'type',
    related: ['Income', 'Expenses', 'Fees'],
  },

  Expenses: {
    title: 'Expenses',
    stats: [
      { label: 'This Month', value: '₹28.9L' },
      { label: 'Pending Approvals', value: '7' },
      { label: 'Utilities', value: '₹2.1L' },
      { label: 'Assets Capex', value: '₹6.4L' },
    ],
    features: ['Expense capture', 'Approvals', 'Vendor link', 'Category reports'],
    columns: cols(['id', 'ID'], ['title', 'Title'], ['category', 'Category'], ['amount', 'Amount'], ['vendor', 'Vendor'], ['date', 'Date'], ['status', 'Status']),
    rows: D.expenses,
    searchKeys: ['id', 'title', 'category', 'vendor'],
    related: ['Accounting', 'Inventory'],
  },

  Income: {
    title: 'Income',
    stats: [
      { label: 'This Month', value: '₹62.4L' },
      { label: 'Fees', value: '₹48.2L' },
      { label: 'Training', value: '₹6.5L' },
      { label: 'Other', value: '₹7.7L' },
    ],
    features: ['Income posting', 'Category split', 'Period close'],
    columns: cols(['id', 'ID'], ['title', 'Title'], ['category', 'Category'], ['amount', 'Amount'], ['date', 'Date'], ['status', 'Status']),
    rows: D.income,
    searchKeys: ['id', 'title', 'category'],
    related: ['Accounting', 'Fees'],
  },

  'Salary Management': {
    title: 'Salary Management',
    stats: [
      { label: 'Employees', value: '192' },
      { label: 'Processed', value: '188' },
      { label: 'Pending', value: '4' },
      { label: 'Net Payout', value: '₹1.26 Cr' },
    ],
    features: ['Salary Structure', 'Generate Salary', 'Payslip', 'Bonuses', 'PF / ESIC / TDS'],
    columns: cols(['id', 'ID'], ['employee', 'Employee'], ['role', 'Role'], ['basic', 'Basic'], ['allowances', 'Allowances'], ['deductions', 'Deductions'], ['net', 'Net'], ['status', 'Status']),
    rows: D.salary,
    searchKeys: ['id', 'employee', 'role'],
    related: ['Payroll', 'Faculty', 'Staff'],
  },

  Payroll: {
    title: 'Payroll',
    stats: [
      { label: 'Last Run', value: 'Jul 2026' },
      { label: 'Gross', value: '₹1.48 Cr' },
      { label: 'PF', value: '₹8.2L' },
      { label: 'TDS', value: '₹12.6L' },
    ],
    features: ['Payroll runs', 'Statutory reports', 'Payslip batch'],
    columns: cols(['id', 'ID'], ['period', 'Period'], ['employees', 'Employees'], ['gross', 'Gross'], ['pf', 'PF'], ['esic', 'ESIC'], ['tds', 'TDS'], ['status', 'Status']),
    rows: D.payroll,
    searchKeys: ['id', 'period'],
    related: ['Salary Management', 'Reports'],
  },

  Library: {
    title: 'Library',
    stats: [
      { label: 'Books', value: '18,420', icon: Library },
      { label: 'Issued', value: '1,240' },
      { label: 'Overdue', value: '86' },
      { label: 'Fines Due', value: '₹12,400' },
    ],
    features: ['Books', 'Issue / Return', 'Fine', 'Members', 'Barcode / QR'],
    columns: cols(['id', 'ID'], ['title', 'Title'], ['author', 'Author'], ['isbn', 'ISBN'], ['copies', 'Copies'], ['available', 'Available'], ['status', 'Status']),
    rows: D.libraryBooks,
    searchKeys: ['id', 'title', 'author', 'isbn'],
    tabs: ['Books', 'Issues', 'Members', 'Fines'],
    related: ['Students', 'Downloads'],
  },

  Hostel: {
    title: 'Hostel',
    stats: [
      { label: 'Students', value: '486' },
      { label: 'Rooms', value: '210' },
      { label: 'Available Beds', value: '38' },
      { label: 'Open Complaints', value: '9' },
    ],
    features: ['Rooms / Beds', 'Students', 'Fees', 'Mess', 'Complaints'],
    columns: cols(['id', 'ID'], ['room', 'Room'], ['type', 'Type'], ['beds', 'Beds'], ['occupied', 'Occupied'], ['students', 'Students'], ['fees', 'Fees'], ['status', 'Status']),
    rows: D.hostelRooms,
    searchKeys: ['id', 'room', 'students'],
    related: ['Students', 'Fees'],
  },

  Transport: {
    title: 'Transport',
    stats: [
      { label: 'Vehicles', value: '22', icon: Bus },
      { label: 'Routes', value: '14' },
      { label: 'Students', value: '640' },
      { label: 'In Maintenance', value: '2' },
    ],
    features: ['Vehicles', 'Routes', 'Drivers', 'Pickup Points', 'GPS UI', 'Fees'],
    columns: cols(['id', 'ID'], ['vehicle', 'Vehicle'], ['type', 'Type'], ['route', 'Route'], ['driver', 'Driver'], ['capacity', 'Capacity'], ['students', 'Students'], ['status', 'Status']),
    rows: D.transportVehicles,
    searchKeys: ['id', 'vehicle', 'route', 'driver'],
    related: ['Fees', 'Students'],
  },

  Inventory: {
    title: 'Inventory',
    stats: [
      { label: 'SKUs', value: '860' },
      { label: 'Low Stock', value: '24' },
      { label: 'Out of Stock', value: '7' },
      { label: 'Vendors', value: '42' },
    ],
    features: ['Stock', 'Purchase', 'Vendor', 'Maintenance', 'Barcode'],
    columns: cols(['id', 'ID'], ['item', 'Item'], ['category', 'Category'], ['stock', 'Stock'], ['vendor', 'Vendor'], ['status', 'Status']),
    rows: D.inventory,
    searchKeys: ['id', 'item', 'vendor'],
    related: ['Assets', 'Expenses'],
  },

  Assets: {
    title: 'Assets',
    stats: [
      { label: 'Assets', value: '312' },
      { label: 'Value', value: '₹4.8 Cr' },
      { label: 'Due Maintenance', value: '11' },
      { label: 'Locations', value: '18' },
    ],
    features: ['Asset register', 'Tagging', 'Maintenance calendar'],
    columns: cols(['id', 'ID'], ['name', 'Asset'], ['tag', 'Tag'], ['value', 'Value'], ['location', 'Location'], ['maintenance', 'Next Maintenance'], ['status', 'Status']),
    rows: D.assets,
    searchKeys: ['id', 'name', 'tag', 'location'],
    related: ['Inventory', 'Accounting'],
  },

  'Placement Cell': {
    title: 'Placement Cell',
    stats: [
      { label: 'Offers YTD', value: '312', icon: Briefcase },
      { label: 'Companies', value: '86' },
      { label: 'Drives Open', value: '5' },
      { label: 'Highest CTC', value: '₹18 LPA' },
    ],
    features: ['Companies', 'Drive Management', 'Eligible Students', 'Interviews', 'Offer Letters', 'Selection Reports'],
    columns: cols(['id', 'ID'], ['company', 'Company'], ['drive', 'Drive'], ['eligible', 'Eligible'], ['selected', 'Selected'], ['package', 'Package'], ['status', 'Status']),
    rows: D.placements,
    searchKeys: ['id', 'company', 'drive'],
    related: ['Internships', 'Students', 'Reports'],
  },

  'Training Management': {
    title: 'Training Management',
    stats: [
      { label: 'Programs', value: '24' },
      { label: 'Internal', value: '16' },
      { label: 'External', value: '8' },
      { label: 'In Progress', value: '9' },
    ],
    features: ['Internal / External', 'Trainer Allocation', 'Progress', 'Certificates'],
    columns: cols(['id', 'ID'], ['name', 'Program'], ['type', 'Type'], ['trainer', 'Trainer'], ['students', 'Students'], ['progress', 'Progress'], ['status', 'Status']),
    rows: D.trainings,
    searchKeys: ['id', 'name', 'trainer'],
    related: ['Certificates', 'Faculty'],
  },

  Internships: {
    title: 'Internships',
    stats: [
      { label: 'Active', value: '86' },
      { label: 'Completed', value: '112' },
      { label: 'Companies', value: '54' },
      { label: 'Avg Stipend', value: '₹12.5k' },
    ],
    features: ['Companies', 'Students', 'Mentors', 'Reports', 'Certificates'],
    columns: cols(['id', 'ID'], ['student', 'Student'], ['company', 'Company'], ['mentor', 'Mentor'], ['duration', 'Duration'], ['stipend', 'Stipend'], ['status', 'Status']),
    rows: D.internships,
    searchKeys: ['id', 'student', 'company', 'mentor'],
    related: ['Placement Cell', 'Certificates'],
  },

  Events: {
    title: 'Events',
    stats: [
      { label: 'Upcoming', value: '8' },
      { label: 'Registrations', value: '640' },
      { label: 'This Month', value: '5' },
      { label: 'Certificates Pending', value: '42' },
    ],
    features: ['Seminars', 'Workshops', 'Hackathons', 'Competitions', 'Registrations', 'Certificates'],
    columns: cols(['id', 'ID'], ['title', 'Event'], ['type', 'Type'], ['date', 'Date'], ['venue', 'Venue'], ['registrations', 'Registrations'], ['status', 'Status']),
    rows: D.events,
    searchKeys: ['id', 'title', 'type', 'venue'],
    related: ['Calendar', 'Certificates', 'Announcements'],
  },

  Calendar: {
    title: 'Calendar',
    stats: [
      { label: 'Events This Month', value: '22' },
      { label: 'Exams', value: '6' },
      { label: 'Holidays', value: '2' },
      { label: 'Deadlines', value: '9' },
    ],
    features: ['Academic calendar', 'Event sync', 'Deadline reminders'],
    columns: cols(['id', 'ID'], ['title', 'Title'], ['date', 'Date'], ['type', 'Type']),
    rows: D.calendarItems,
    searchKeys: ['id', 'title', 'type'],
    filterKey: 'type',
    related: ['Events', 'Exams', 'Time Table'],
  },

  Announcements: {
    title: 'Announcements',
    stats: [
      { label: 'Published', value: '48' },
      { label: 'Pinned', value: '6' },
      { label: 'Student Targets', value: '22' },
      { label: 'Faculty Targets', value: '14' },
    ],
    features: ['Create', 'Target Students / Faculty / Staff', 'Pinned'],
    columns: cols(['id', 'ID'], ['title', 'Title'], ['target', 'Target'], ['pinned', 'Pinned'], ['date', 'Date'], ['status', 'Status']),
    rows: D.announcements,
    searchKeys: ['id', 'title', 'target'],
    addLabel: 'Create Announcement',
    related: ['Messages', 'Notifications'],
  },

  Messages: {
    title: 'Messages',
    stats: [
      { label: 'Unread', value: '14' },
      { label: 'Broadcasts', value: '9' },
      { label: 'Email Queue', value: '120' },
      { label: 'WhatsApp Sent', value: '860' },
    ],
    features: ['Inbox', 'Broadcast', 'Email / SMS / WhatsApp', 'Internal Chat'],
    columns: cols(['id', 'ID'], ['from', 'From'], ['channel', 'Channel'], ['subject', 'Subject'], ['date', 'Date'], ['status', 'Status']),
    rows: D.messages,
    searchKeys: ['id', 'from', 'subject', 'channel'],
    related: ['Announcements', 'Email Templates', 'SMS Templates'],
  },

  Notifications: {
    title: 'Notifications',
    stats: [
      { label: 'Unread', value: '34', icon: Bell },
      { label: 'Today', value: '18' },
      { label: 'System', value: '22' },
      { label: 'Alerts', value: '12' },
    ],
    features: ['Admin notification center', 'Module alerts'],
    columns: cols(['id', 'ID'], ['title', 'Title'], ['type', 'Type'], ['time', 'Time'], ['status', 'Status']),
    rows: D.notifications,
    searchKeys: ['id', 'title', 'type'],
    related: ['Messages', 'Help Desk'],
  },

  'Help Desk': {
    title: 'Help Desk',
    stats: [
      { label: 'Open', value: '17', icon: Ticket },
      { label: 'In Progress', value: '9' },
      { label: 'Resolved (week)', value: '41' },
      { label: 'High Priority', value: '4' },
    ],
    features: ['Support Tickets', 'Assign', 'Resolve', 'Priority'],
    columns: cols(['id', 'ID'], ['subject', 'Subject'], ['priority', 'Priority'], ['assignee', 'Assignee'], ['raisedBy', 'Raised By'], ['date', 'Date'], ['status', 'Status']),
    rows: D.tickets,
    searchKeys: ['id', 'subject', 'assignee'],
    filterKey: 'priority',
    related: ['Support Tickets', 'Users'],
  },

  'Support Tickets': {
    title: 'Support Tickets',
    stats: [
      { label: 'Open', value: '17' },
      { label: 'SLA Breached', value: '2' },
      { label: 'Avg Resolve', value: '6.4h' },
      { label: 'CSAT', value: '4.5' },
    ],
    features: ['Ticket queue', 'SLA', 'Assignment', 'Resolution notes'],
    columns: cols(['id', 'ID'], ['subject', 'Subject'], ['priority', 'Priority'], ['assignee', 'Assignee'], ['raisedBy', 'Raised By'], ['date', 'Date'], ['status', 'Status']),
    rows: D.tickets,
    searchKeys: ['id', 'subject'],
    related: ['Help Desk'],
  },

  Reports: {
    title: 'ERP Reports',
    stats: [
      { label: 'Ready Reports', value: '48' },
      { label: 'Scheduled', value: '12' },
      { label: 'Custom', value: '9' },
      { label: 'Exports Today', value: '26' },
    ],
    features: [
      'Admission / Attendance / Fee / Exam',
      'Placement / Faculty / Payroll',
      'Inventory / Revenue / Expense',
      'Custom Reports',
    ],
    columns: cols(['id', 'ID'], ['name', 'Report'], ['category', 'Category'], ['generated', 'Generated'], ['format', 'Format'], ['status', 'Status']),
    rows: D.reportsList,
    searchKeys: ['id', 'name', 'category'],
    filterKey: 'category',
    related: ['Analytics', 'Downloads'],
  },

  Downloads: {
    title: 'Download Center',
    stats: [
      { label: 'Files', value: '186' },
      { label: 'Certificates Pack', value: '22' },
      { label: 'Marksheets', value: '14' },
      { label: 'Data Exports', value: '31' },
    ],
    features: ['Certificates', 'Reports', 'Marksheet', 'Invoices', 'Receipts', 'Student / Faculty Data'],
    columns: cols(['id', 'ID'], ['name', 'File'], ['type', 'Type'], ['size', 'Size'], ['date', 'Date']),
    rows: D.downloads,
    searchKeys: ['id', 'name', 'type'],
    filterKey: 'type',
    related: ['Certificates', 'Reports', 'Results'],
  },

  Backup: {
    title: 'Backup',
    stats: [
      { label: 'Last Backup', value: 'Today 02:00' },
      { label: 'Success Rate', value: '100%' },
      { label: 'Cloud Size', value: '2.4 GB' },
      { label: 'Retention', value: '30 days' },
    ],
    features: ['Automatic', 'Manual', 'Restore', 'Cloud Backup'],
    columns: cols(['id', 'ID'], ['type', 'Type'], ['location', 'Location'], ['size', 'Size'], ['date', 'Date'], ['status', 'Status']),
    rows: D.backups,
    searchKeys: ['id', 'type', 'location'],
    related: ['Security', 'System Settings'],
  },

  'Audit Logs': {
    title: 'Audit Logs',
    stats: [
      { label: 'Events Today', value: '412' },
      { label: 'Critical', value: '3' },
      { label: 'Unique Actors', value: '86' },
      { label: 'Retention', value: '365d' },
    ],
    features: ['Immutable audit trail', 'Actor / IP / Action', 'Export'],
    columns: cols(['id', 'ID'], ['actor', 'Actor'], ['action', 'Action'], ['ip', 'IP'], ['time', 'Time']),
    rows: D.auditLogs,
    searchKeys: ['id', 'actor', 'action', 'ip'],
    related: ['Security', 'Users'],
  },

  'Roles & Permissions': {
    title: 'Roles & Permissions',
    stats: [
      { label: 'Roles', value: '14' },
      { label: 'Custom Roles', value: '3' },
      { label: 'Permission Keys', value: '220' },
      { label: 'Users Mapped', value: '4,200+' },
    ],
    features: [
      'Master Admin / Admin / Counsellor / Faculty / Trainer',
      'HR / Accountant / Librarian / Receptionist',
      'Transport / Hostel Manager',
      'Student / Parent',
      'Custom Roles',
      'Permission Matrix',
    ],
    columns: cols(['id', 'ID'], ['name', 'Role'], ['users', 'Users'], ['permissions', 'Permissions'], ['status', 'Status']),
    rows: D.roles,
    searchKeys: ['id', 'name'],
    related: ['Users', 'Security'],
  },

  Branches: {
    title: 'Branches',
    stats: [
      { label: 'Branches', value: '3' },
      { label: 'Students', value: '2,486' },
      { label: 'Faculty', value: '128' },
      { label: 'Combined Revenue', value: '₹62.4L' },
    ],
    features: ['Multi-branch', 'Branch dashboard', 'Branch analytics', 'Branch users'],
    columns: cols(['id', 'ID'], ['name', 'Branch'], ['students', 'Students'], ['faculty', 'Faculty'], ['revenue', 'Revenue'], ['status', 'Status']),
    rows: D.branches,
    searchKeys: ['id', 'name'],
    related: ['Institute Overview', 'Users', 'Analytics'],
  },

  Users: {
    title: 'Users',
    stats: [
      { label: 'Portal Users', value: '4,280' },
      { label: 'Active Today', value: '1,240' },
      { label: 'Locked', value: '6' },
      { label: 'Invites Pending', value: '18' },
    ],
    features: ['User directory', 'Role assignment', 'Branch scope', 'Session status'],
    columns: cols(['id', 'ID'], ['name', 'Name'], ['email', 'Email'], ['role', 'Role'], ['branch', 'Branch'], ['lastLogin', 'Last Login'], ['status', 'Status']),
    rows: D.users,
    searchKeys: ['id', 'name', 'email', 'role'],
    related: ['Roles & Permissions', 'Security'],
  },

  'Website CMS': {
    title: 'Website CMS',
    stats: [
      { label: 'Pages', value: '8' },
      { label: 'Published', value: '7' },
      { label: 'Drafts', value: '1' },
      { label: 'Blogs', value: '12' },
    ],
    features: ['Homepage', 'About', 'Courses', 'Gallery', 'Testimonials', 'Blogs', 'Career', 'Contact'],
    columns: cols(['id', 'ID'], ['page', 'Page'], ['sections', 'Sections'], ['updated', 'Updated'], ['status', 'Status']),
    rows: D.cmsPages,
    searchKeys: ['id', 'page'],
    related: ['Manage Landing Page', 'Hero left CMS'],
  },

  'Email Templates': {
    title: 'Email Templates',
    stats: [
      { label: 'Templates', value: '28' },
      { label: 'Active', value: '22' },
      { label: 'Sent (month)', value: '18.4k' },
      { label: 'Open Rate', value: '42%' },
    ],
    features: ['SMTP', 'Admission / Fee / Exam / Certificate emails'],
    columns: cols(['id', 'ID'], ['name', 'Template'], ['trigger', 'Trigger'], ['status', 'Status']),
    rows: D.emailTemplates,
    searchKeys: ['id', 'name', 'trigger'],
    related: ['Messages', 'System Settings'],
  },

  'SMS Templates': {
    title: 'SMS Templates',
    stats: [
      { label: 'Templates', value: '16' },
      { label: 'OTP', value: '4' },
      { label: 'Sent (month)', value: '42k' },
      { label: 'Delivery', value: '98.6%' },
    ],
    features: ['OTP', 'Admission / Attendance / Fee / Exam SMS', 'Bulk SMS'],
    columns: cols(['id', 'ID'], ['name', 'Template'], ['type', 'Type'], ['status', 'Status']),
    rows: D.smsTemplates,
    searchKeys: ['id', 'name', 'type'],
    related: ['Messages', 'System Settings'],
  },

  'WhatsApp Templates': {
    title: 'WhatsApp Templates',
    stats: [
      { label: 'Templates', value: '12' },
      { label: 'Approved', value: '9' },
      { label: 'Pending', value: '3' },
      { label: 'Sent (month)', value: '21k' },
    ],
    features: ['Templates', 'Bulk Messages', 'Admission / Fee / Exam reminders'],
    columns: cols(['id', 'ID'], ['name', 'Template'], ['category', 'Category'], ['status', 'Status']),
    rows: D.whatsappTemplates,
    searchKeys: ['id', 'name', 'category'],
    related: ['Messages', 'Integrations'],
  },

  'API Management': {
    title: 'API Management',
    stats: [
      { label: 'Live Keys', value: '6' },
      { label: 'Webhooks', value: '8' },
      { label: 'Calls (24h)', value: '42.1k' },
      { label: 'Errors', value: '0.4%' },
    ],
    features: ['REST API', 'API Keys', 'Webhooks', 'Third-party Integration'],
    columns: cols(['id', 'ID'], ['name', 'Name'], ['key', 'Key'], ['created', 'Created'], ['status', 'Status']),
    rows: D.apiKeys,
    searchKeys: ['id', 'name'],
    related: ['Integrations', 'Security'],
  },

  Integrations: {
    title: 'Integrations',
    stats: [
      { label: 'Connected', value: '8' },
      { label: 'Pending', value: '2' },
      { label: 'Payments', value: 'Razorpay' },
      { label: 'Storage', value: 'S3 + Cloudinary' },
    ],
    features: ['Payment Gateway', 'Storage', 'SMS', 'Drive'],
    columns: cols(['id', 'ID'], ['name', 'Integration'], ['category', 'Category'], ['status', 'Status']),
    rows: D.integrations,
    searchKeys: ['id', 'name', 'category'],
    related: ['API Management', 'System Settings'],
  },

  Security: {
    title: 'Security',
    stats: [
      { label: '2FA Enabled', value: 'Yes' },
      { label: 'Active Sessions', value: '2' },
      { label: 'Devices', value: '3' },
      { label: 'IP Rules', value: '4' },
    ],
    features: ['2FA UI', 'Session / Device Management', 'Login History', 'Audit Logs', 'IP Whitelist'],
    columns: cols(['id', 'ID'], ['device', 'Device'], ['location', 'Location'], ['ip', 'IP'], ['lastActive', 'Last Active'], ['status', 'Status']),
    rows: D.securitySessions,
    searchKeys: ['id', 'device', 'location', 'ip'],
    related: ['Audit Logs', 'Users', 'Backup'],
  },

  Profile: {
    title: 'Profile',
    stats: [
      { label: 'Role', value: 'Master Admin' },
      { label: 'Branch Scope', value: 'All' },
      { label: '2FA', value: 'On' },
      { label: 'Theme', value: 'Enterprise' },
    ],
    features: ['Profile', 'Password', 'Activity', 'Preferences'],
    columns: cols(['id', 'ID'], ['name', 'Name'], ['email', 'Email'], ['role', 'Role'], ['branch', 'Branch'], ['lastLogin', 'Last Login'], ['status', 'Status']),
    rows: D.users.filter((u) => u.role === 'Master Admin'),
    searchKeys: ['name', 'email'],
    related: ['Security', 'System Settings'],
  },

  'System Settings': {
    title: 'System Settings',
    stats: [
      { label: 'Academic Session', value: 'Odd 2026' },
      { label: 'Timezone', value: 'Asia/Kolkata' },
      { label: 'Currency', value: 'INR' },
      { label: 'Language', value: 'English' },
    ],
    features: [
      'Institute Details',
      'Logo / Favicon',
      'Academic Session',
      'Working Days',
      'Timezone / Currency / Language',
      'Email / SMS / WhatsApp',
      'Payment Gateway',
      'Google Drive / AWS S3 / Cloudinary',
      'Backup Settings',
    ],
    columns: cols(['id', 'ID'], ['name', 'Integration'], ['category', 'Category'], ['status', 'Status']),
    rows: D.integrations,
    searchKeys: ['id', 'name', 'category'],
    related: ['Settings', 'Integrations', 'Backup', 'Security'],
  },
}

export function getErpModule(section) {
  return erpModules[section] || null
}

export { money }
