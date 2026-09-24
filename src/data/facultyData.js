/** Realistic dummy data for the Faculty ERP + LMS Dashboard */

export const facultyProfile = {
  id: 'GST-FAC-2019-042',
  empId: 'EMP-FAC-042',
  name: 'Priya Mehta',
  email: 'faculty@growskillstech.com',
  phone: '+91 98765 11022',
  dob: '1990-04-18',
  gender: 'Female',
  bloodGroup: 'O+',
  department: 'Full Stack Development',
  designation: 'Senior Faculty / Lead Trainer',
  qualification: 'M.Tech (CSE), B.Tech (IT)',
  experience: '8+ years',
  joiningDate: '2019-06-15',
  avatar:
    'https://ui-avatars.com/api/?name=Priya+Mehta&background=008C95&color=fff&size=128',
  rating: 4.8,
  teachingProgress: 78,
  weeklyProgress: 85,
  address: {
    line1: '12-B, Sector 62',
    line2: 'Near Tech Park',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201301',
  },
  emergency: {
    name: 'Amit Mehta',
    relation: 'Spouse',
    phone: '+91 98100 77889',
  },
  bank: {
    accountName: 'Priya Mehta',
    bankName: 'HDFC Bank',
    accountNo: 'XXXXXX4521',
    ifsc: 'HDFC0001234',
    pan: 'ABCDE1234F',
  },
  skills: ['React', 'Node.js', 'MongoDB', 'System Design', 'Mentoring', 'Curriculum Design'],
  expertise: ['Full Stack Web', 'MERN', 'Soft Skills for Devs', 'Interview Prep'],
  languages: ['English', 'Hindi', 'Gujarati'],
  certificates: [
    { title: 'AWS Certified Cloud Practitioner', year: '2024' },
    { title: 'Meta Front-End Professional', year: '2023' },
    { title: 'Google UX Foundations', year: '2022' },
  ],
  achievements: [
    'Best Faculty Award — 2025',
    'Highest Student Satisfaction — Q1 2026',
    '100% Batch Placement Mentor — FS 2024-B',
  ],
  awards: ['Star Trainer 2024', 'Innovation in Teaching 2025'],
  documents: [
    { name: 'Offer Letter.pdf', type: 'PDF', size: '240 KB' },
    { name: 'Degree Certificate.pdf', type: 'PDF', size: '1.2 MB' },
    { name: 'ID Proof.pdf', type: 'PDF', size: '800 KB' },
  ],
}

export const dashboardStats = {
  totalStudents: 186,
  activeStudents: 162,
  totalCourses: 8,
  activeCourses: 5,
  completedCourses: 3,
  currentBatches: 4,
  todaysClasses: 3,
  weeklyClasses: 14,
  pendingAssignments: 12,
  assignmentsChecked: 48,
  pendingHomework: 7,
  liveClassesToday: 2,
  examScheduled: 3,
  attendanceAverage: 91,
  studentSatisfaction: 4.7,
  certificatesIssued: 64,
  unreadMessages: 9,
  unreadNotifications: 6,
  teachingHoursWeek: 22,
  weeklyGoalHours: 24,
  teachingStreak: 18,
  overallRating: 4.8,
  teachingProgress: 78,
  weeklyProgress: 85,
}

export const quickActions = [
  { id: 'attendance', label: 'Take Attendance', section: 'Attendance' },
  { id: 'live', label: 'Start Live Class', section: 'Live Classes' },
  { id: 'notes', label: 'Upload Notes', section: 'Notes' },
  { id: 'assignment', label: 'Create Assignment', section: 'Assignments' },
  { id: 'exam', label: 'Create Exam', section: 'Exams' },
  { id: 'marks', label: 'Upload Marks', section: 'Marks & Results' },
  { id: 'students', label: 'View Students', section: 'Students' },
  { id: 'announce', label: 'Create Announcement', section: 'Announcements' },
]

export const motivationalQuote = {
  text: 'Teaching is the greatest act of optimism.',
  author: 'Colleen Wilcox',
}

export const activities = [
  { id: 1, type: 'assignment', title: 'Assignment Created', detail: 'React Hooks Lab for FS-2025-A', time: '2 hours ago' },
  { id: 2, type: 'notes', title: 'Notes Uploaded', detail: 'Node.js Middleware — PDF', time: '5 hours ago' },
  { id: 3, type: 'attendance', title: 'Attendance Marked', detail: 'Batch FS-2025-A · 42 Present', time: 'Yesterday' },
  { id: 4, type: 'exam', title: 'Exam Scheduled', detail: 'Mid-Term: Database Design', time: 'Yesterday' },
  { id: 5, type: 'marks', title: 'Marks Uploaded', detail: 'Assignment #12 checked — 38 submissions', time: '2 days ago' },
  { id: 6, type: 'certificate', title: 'Certificate Issued', detail: '3 students completed React Module', time: '3 days ago' },
  { id: 7, type: 'live', title: 'Live Class Started', detail: 'Advanced React Patterns', time: '3 days ago' },
  { id: 8, type: 'homework', title: 'Homework Checked', detail: 'CSS Grid practice set', time: '4 days ago' },
]

export const upcomingEvents = [
  { id: 1, title: 'Live: System Design Basics', date: 'Jul 15, 2026', time: '10:00 AM' },
  { id: 2, title: 'Assignment Deadline — Express API', date: 'Jul 16, 2026', time: '11:59 PM' },
  { id: 3, title: 'Mid-Term Exam — Database', date: 'Jul 20, 2026', time: '2:00 PM' },
  { id: 4, title: 'Faculty Meeting — Curriculum', date: 'Jul 18, 2026', time: '4:00 PM' },
]

export const todaysSchedule = [
  { time: '10:00 – 11:30', subject: 'React Advanced', batch: 'FS-2025-A', room: 'Lab-3', status: 'Upcoming' },
  { time: '12:00 – 13:00', subject: 'Doubt Clearing', batch: 'FS-2025-B', room: 'Hall-B', status: 'Upcoming' },
  { time: '16:00 – 17:30', subject: 'Node.js Backend', batch: 'FS-2025-A', room: 'Zoom', status: 'Upcoming' },
]

export const topStudents = [
  { id: 'S1', name: 'Aarav Sharma', batch: 'FS-2025-A', score: 94, progress: 92 },
  { id: 'S2', name: 'Ishita Kapoor', batch: 'FS-2025-A', score: 91, progress: 88 },
  { id: 'S3', name: 'Rohan Gupta', batch: 'FS-2025-B', score: 89, progress: 85 },
]

export const weakStudents = [
  { id: 'W1', name: 'Karan Joshi', batch: 'FS-2025-B', score: 52, attendance: 68 },
  { id: 'W2', name: 'Neha Rana', batch: 'FS-2025-A', score: 55, attendance: 72 },
  { id: 'W3', name: 'Vikram Singh', batch: 'FS-2025-C', score: 48, attendance: 61 },
]

export const pendingWork = [
  { id: 1, title: 'Check Assignment #14', type: 'Assignment', due: 'Today' },
  { id: 2, title: 'Mark attendance — Soft Skills', type: 'Attendance', due: 'Today' },
  { id: 3, title: 'Upload Mid-Term marks', type: 'Marks', due: 'Jul 16' },
  { id: 4, title: 'Approve leave for Lab slot', type: 'Leave', due: 'Jul 15' },
]

export const courses = [
  {
    id: 'C1',
    title: 'Full Stack Web Development',
    code: 'FSWD-101',
    students: 48,
    duration: '6 months',
    progress: 72,
    status: 'Active',
    batches: 2,
  },
  {
    id: 'C2',
    title: 'React Advanced Patterns',
    code: 'REACT-301',
    students: 36,
    duration: '8 weeks',
    progress: 55,
    status: 'Active',
    batches: 1,
  },
  {
    id: 'C3',
    title: 'Node.js Backend',
    code: 'NODE-201',
    students: 42,
    duration: '10 weeks',
    progress: 40,
    status: 'Active',
    batches: 1,
  },
  {
    id: 'C4',
    title: 'Database Design',
    code: 'DB-110',
    students: 40,
    duration: '6 weeks',
    progress: 88,
    status: 'Active',
    batches: 1,
  },
  {
    id: 'C5',
    title: 'Soft Skills for Developers',
    code: 'SS-050',
    students: 55,
    duration: '4 weeks',
    progress: 100,
    status: 'Completed',
    batches: 1,
  },
  {
    id: 'C6',
    title: 'Git & DevOps Basics',
    code: 'DEVOPS-100',
    students: 30,
    duration: '3 weeks',
    progress: 100,
    status: 'Completed',
    batches: 1,
  },
]

export const batches = [
  {
    id: 'B1',
    name: 'FS-2025-A',
    course: 'Full Stack Web Development',
    timing: 'Mon–Fri · 10:00–13:00',
    students: 42,
    trainer: 'Priya Mehta',
    status: 'Active',
    attendance: 93,
    performance: 86,
    progress: 72,
  },
  {
    id: 'B2',
    name: 'FS-2025-B',
    course: 'Full Stack Web Development',
    timing: 'Mon–Fri · 14:00–17:00',
    students: 38,
    trainer: 'Priya Mehta',
    status: 'Active',
    attendance: 89,
    performance: 81,
    progress: 68,
  },
  {
    id: 'B3',
    name: 'REACT-EVE-01',
    course: 'React Advanced Patterns',
    timing: 'Tue–Thu · 18:00–20:00',
    students: 28,
    trainer: 'Priya Mehta',
    status: 'Active',
    attendance: 91,
    performance: 84,
    progress: 55,
  },
  {
    id: 'B4',
    name: 'NODE-WKND',
    course: 'Node.js Backend',
    timing: 'Sat–Sun · 10:00–14:00',
    students: 32,
    trainer: 'Priya Mehta',
    status: 'Active',
    attendance: 87,
    performance: 79,
    progress: 40,
  },
]

export const students = [
  {
    id: 'GST-STU-0847',
    name: 'Aarav Sharma',
    batch: 'FS-2025-A',
    email: 'aarav.sharma@growskillstech.edu',
    phone: '+91 98765 43210',
    attendance: 94,
    performance: 92,
    assignmentStatus: 'On Track',
    feesStatus: 'Paid',
    progress: 88,
    marks: 91,
    status: 'Active',
  },
  {
    id: 'GST-STU-0851',
    name: 'Ishita Kapoor',
    batch: 'FS-2025-A',
    email: 'ishita.kapoor@growskillstech.edu',
    phone: '+91 98765 11122',
    attendance: 96,
    performance: 90,
    assignmentStatus: 'On Track',
    feesStatus: 'Paid',
    progress: 85,
    marks: 89,
    status: 'Active',
  },
  {
    id: 'GST-STU-0902',
    name: 'Rohan Gupta',
    batch: 'FS-2025-B',
    email: 'rohan.gupta@growskillstech.edu',
    phone: '+91 98765 33344',
    attendance: 88,
    performance: 84,
    assignmentStatus: 'Pending',
    feesStatus: 'Partial',
    progress: 76,
    marks: 82,
    status: 'Active',
  },
  {
    id: 'GST-STU-0915',
    name: 'Karan Joshi',
    batch: 'FS-2025-B',
    email: 'karan.joshi@growskillstech.edu',
    phone: '+91 98765 55566',
    attendance: 68,
    performance: 52,
    assignmentStatus: 'Late',
    feesStatus: 'Due',
    progress: 45,
    marks: 52,
    status: 'Active',
  },
  {
    id: 'GST-STU-0933',
    name: 'Neha Rana',
    batch: 'FS-2025-A',
    email: 'neha.rana@growskillstech.edu',
    phone: '+91 98765 77788',
    attendance: 72,
    performance: 55,
    assignmentStatus: 'Pending',
    feesStatus: 'Paid',
    progress: 50,
    marks: 58,
    status: 'Active',
  },
  {
    id: 'GST-STU-0940',
    name: 'Ananya Verma',
    batch: 'REACT-EVE-01',
    email: 'ananya.verma@growskillstech.edu',
    phone: '+91 98765 99900',
    attendance: 91,
    performance: 87,
    assignmentStatus: 'On Track',
    feesStatus: 'Paid',
    progress: 80,
    marks: 86,
    status: 'Active',
  },
]

export const attendanceRecords = [
  { id: 1, date: '2026-07-14', batch: 'FS-2025-A', subject: 'React Advanced', present: 40, absent: 2, leave: 0, percent: 95 },
  { id: 2, date: '2026-07-14', batch: 'FS-2025-B', subject: 'Node.js', present: 34, absent: 3, leave: 1, percent: 89 },
  { id: 3, date: '2026-07-13', batch: 'FS-2025-A', subject: 'Database', present: 39, absent: 3, leave: 0, percent: 93 },
  { id: 4, date: '2026-07-13', batch: 'REACT-EVE-01', subject: 'Hooks Lab', present: 26, absent: 2, leave: 0, percent: 93 },
  { id: 5, date: '2026-07-12', batch: 'NODE-WKND', subject: 'Express API', present: 28, absent: 4, leave: 0, percent: 88 },
]

export const subjectAttendance = [
  { subject: 'React', percent: 94 },
  { subject: 'Node.js', percent: 89 },
  { subject: 'Database', percent: 91 },
  { subject: 'Soft Skills', percent: 96 },
  { subject: 'DevOps', percent: 87 },
]

export const attendanceTrend = [
  { month: 'Feb', percent: 88 },
  { month: 'Mar', percent: 90 },
  { month: 'Apr', percent: 89 },
  { month: 'May', percent: 92 },
  { month: 'Jun', percent: 91 },
  { month: 'Jul', percent: 93 },
]

export const assignments = [
  {
    id: 'ASN-014',
    title: 'Build a REST API with Express',
    subject: 'Node.js Backend',
    batch: 'FS-2025-A',
    dueDate: 'Jul 16, 2026',
    marks: 20,
    pending: 12,
    submitted: 28,
    late: 2,
    checked: 18,
    status: 'Pending',
  },
  {
    id: 'ASN-013',
    title: 'React Custom Hooks Lab',
    subject: 'React Advanced',
    batch: 'FS-2025-A',
    dueDate: 'Jul 12, 2026',
    marks: 15,
    pending: 0,
    submitted: 40,
    late: 2,
    checked: 40,
    status: 'Completed',
  },
  {
    id: 'ASN-012',
    title: 'MongoDB Schema Design',
    subject: 'Database Design',
    batch: 'FS-2025-B',
    dueDate: 'Jul 10, 2026',
    marks: 20,
    pending: 5,
    submitted: 30,
    late: 3,
    checked: 25,
    status: 'Pending',
  },
  {
    id: 'ASN-011',
    title: 'CSS Grid Portfolio Layout',
    subject: 'Frontend Basics',
    batch: 'FS-2025-B',
    dueDate: 'Jul 05, 2026',
    marks: 10,
    pending: 0,
    submitted: 36,
    late: 1,
    checked: 36,
    status: 'Completed',
  },
]

export const homework = [
  {
    id: 'HW-028',
    title: 'Read useEffect deep dive article',
    subject: 'React',
    batch: 'FS-2025-A',
    dueDate: 'Jul 15, 2026',
    priority: 'High',
    status: 'Pending',
    submissions: 22,
  },
  {
    id: 'HW-027',
    title: 'Practice SQL joins worksheet',
    subject: 'Database',
    batch: 'FS-2025-B',
    dueDate: 'Jul 14, 2026',
    priority: 'Medium',
    status: 'Pending',
    submissions: 18,
  },
  {
    id: 'HW-026',
    title: 'Git branching exercise',
    subject: 'DevOps',
    batch: 'NODE-WKND',
    dueDate: 'Jul 13, 2026',
    priority: 'Low',
    status: 'Completed',
    submissions: 30,
  },
]

export const notes = [
  {
    id: 'N1',
    title: 'React Hooks Cheatsheet',
    subject: 'React',
    type: 'PDF',
    size: '1.4 MB',
    pinned: true,
    bookmarked: true,
    updated: 'Jul 12, 2026',
  },
  {
    id: 'N2',
    title: 'Express Middleware Guide',
    subject: 'Node.js',
    type: 'PPT',
    size: '3.2 MB',
    pinned: true,
    bookmarked: false,
    updated: 'Jul 10, 2026',
  },
  {
    id: 'N3',
    title: 'MongoDB Indexing Notes',
    subject: 'Database',
    type: 'DOC',
    size: '820 KB',
    pinned: false,
    bookmarked: true,
    updated: 'Jul 08, 2026',
  },
  {
    id: 'N4',
    title: 'Project Starter Kits',
    subject: 'Full Stack',
    type: 'ZIP',
    size: '12 MB',
    pinned: false,
    bookmarked: false,
    updated: 'Jul 05, 2026',
  },
]

export const studyMaterials = [
  {
    id: 'SM1',
    title: 'React Performance Deep Dive',
    type: 'Video',
    category: 'React',
    size: '240 MB',
    uploaded: 'Jul 11, 2026',
  },
  {
    id: 'SM2',
    title: 'API Design Best Practices',
    type: 'PDF',
    category: 'Backend',
    size: '2.1 MB',
    uploaded: 'Jul 09, 2026',
  },
  {
    id: 'SM3',
    title: 'System Design Slides',
    type: 'PPT',
    category: 'Architecture',
    size: '8.4 MB',
    uploaded: 'Jul 07, 2026',
  },
  {
    id: 'SM4',
    title: 'MDN Flexbox Guide',
    type: 'Link',
    category: 'Frontend',
    size: '—',
    uploaded: 'Jul 03, 2026',
  },
]

export const questionBank = [
  {
    id: 'Q1',
    type: 'MCQ',
    question: 'What does useMemo do in React?',
    subject: 'React',
    topic: 'Hooks',
    difficulty: 'Medium',
  },
  {
    id: 'Q2',
    type: 'Theory',
    question: 'Explain REST vs GraphQL with examples.',
    subject: 'Backend',
    topic: 'API Design',
    difficulty: 'Hard',
  },
  {
    id: 'Q3',
    type: 'Programming',
    question: 'Write a Node.js middleware for JWT auth.',
    subject: 'Node.js',
    topic: 'Auth',
    difficulty: 'Hard',
  },
  {
    id: 'Q4',
    type: 'MCQ',
    question: 'Which MongoDB index type supports geospatial queries?',
    subject: 'Database',
    topic: 'Indexing',
    difficulty: 'Easy',
  },
  {
    id: 'Q5',
    type: 'Theory',
    question: 'Describe CAP theorem briefly.',
    subject: 'System Design',
    topic: 'Distributed Systems',
    difficulty: 'Medium',
  },
]

export const liveClasses = [
  {
    id: 'LC1',
    title: 'React Advanced Patterns',
    batch: 'FS-2025-A',
    time: 'Today, 10:00 AM',
    duration: '90 min',
    participants: 42,
    status: 'Upcoming',
    link: 'https://meet.growskillstech.com/react-adv',
  },
  {
    id: 'LC2',
    title: 'Node.js Streams Workshop',
    batch: 'NODE-WKND',
    time: 'Today, 4:00 PM',
    duration: '120 min',
    participants: 28,
    status: 'Upcoming',
    link: 'https://meet.growskillstech.com/node-streams',
  },
  {
    id: 'LC3',
    title: 'Database Indexing',
    batch: 'FS-2025-B',
    time: 'Jul 12, 2:00 PM',
    duration: '60 min',
    participants: 35,
    status: 'Completed',
    link: '—',
  },
]

export const recordedLectures = [
  {
    id: 'RL1',
    title: 'Intro to React Hooks',
    course: 'React Advanced',
    subject: 'React',
    duration: '48:20',
    views: 126,
    progress: 100,
    thumbnail: 'https://ui-avatars.com/api/?name=RH&background=FF5E14&color=fff',
  },
  {
    id: 'RL2',
    title: 'Express Routing Deep Dive',
    course: 'Node.js Backend',
    subject: 'Node.js',
    duration: '55:10',
    views: 98,
    progress: 72,
    thumbnail: 'https://ui-avatars.com/api/?name=ER&background=008C95&color=fff',
  },
  {
    id: 'RL3',
    title: 'MongoDB Aggregation',
    course: 'Database Design',
    subject: 'Database',
    duration: '62:05',
    views: 84,
    progress: 40,
    thumbnail: 'https://ui-avatars.com/api/?name=MA&background=005F6B&color=fff',
  },
]

export const exams = [
  {
    id: 'EX-08',
    title: 'Mid-Term: Database Design',
    type: 'Online',
    batch: 'FS-2025-A',
    date: 'Jul 20, 2026',
    duration: '90 min',
    marks: 50,
    negative: true,
    students: 42,
    status: 'Scheduled',
  },
  {
    id: 'EX-07',
    title: 'React Module Test',
    type: 'Offline',
    batch: 'FS-2025-A',
    date: 'Jul 08, 2026',
    duration: '60 min',
    marks: 40,
    negative: false,
    students: 42,
    status: 'Completed',
  },
  {
    id: 'EX-06',
    title: 'Node.js Practical',
    type: 'Online',
    batch: 'FS-2025-B',
    date: 'Jul 25, 2026',
    duration: '120 min',
    marks: 60,
    negative: false,
    students: 38,
    status: 'Scheduled',
  },
]

export const marksResults = [
  {
    id: 'MR1',
    student: 'Aarav Sharma',
    batch: 'FS-2025-A',
    exam: 'React Module Test',
    internal: 18,
    external: 34,
    practical: 16,
    total: 68,
    grade: 'A',
    percent: 85,
    status: 'Pass',
    rank: 2,
  },
  {
    id: 'MR2',
    student: 'Ishita Kapoor',
    batch: 'FS-2025-A',
    exam: 'React Module Test',
    internal: 19,
    external: 36,
    practical: 17,
    total: 72,
    grade: 'A+',
    percent: 90,
    status: 'Pass',
    rank: 1,
  },
  {
    id: 'MR3',
    student: 'Rohan Gupta',
    batch: 'FS-2025-B',
    exam: 'React Module Test',
    internal: 15,
    external: 28,
    practical: 14,
    total: 57,
    grade: 'B+',
    percent: 71,
    status: 'Pass',
    rank: 8,
  },
  {
    id: 'MR4',
    student: 'Karan Joshi',
    batch: 'FS-2025-B',
    exam: 'React Module Test',
    internal: 10,
    external: 18,
    practical: 8,
    total: 36,
    grade: 'D',
    percent: 45,
    status: 'Fail',
    rank: 28,
  },
]

export const certificates = [
  {
    id: 'CERT-101',
    student: 'Aarav Sharma',
    course: 'React Module',
    issued: 'Jul 10, 2026',
    status: 'Issued',
  },
  {
    id: 'CERT-102',
    student: 'Ishita Kapoor',
    course: 'React Module',
    issued: 'Jul 10, 2026',
    status: 'Issued',
  },
  {
    id: 'CERT-103',
    student: 'Ananya Verma',
    course: 'Frontend Basics',
    issued: 'Jul 05, 2026',
    status: 'Pending',
  },
]

export const teachingHours = [
  { day: 'Mon', hours: 4.5 },
  { day: 'Tue', hours: 3.5 },
  { day: 'Wed', hours: 5 },
  { day: 'Thu', hours: 4 },
  { day: 'Fri', hours: 3 },
  { day: 'Sat', hours: 2 },
  { day: 'Sun', hours: 0 },
]

export const studentPerformanceChart = [
  { subject: 'React', avg: 86 },
  { subject: 'Node', avg: 78 },
  { subject: 'DB', avg: 82 },
  { subject: 'Soft Skills', avg: 90 },
  { subject: 'DevOps', avg: 74 },
]

export const assignmentStatusChart = [
  { name: 'Checked', value: 48 },
  { name: 'Pending', value: 12 },
  { name: 'Late', value: 5 },
]

export const courseCompletionChart = [
  { month: 'Feb', completion: 45, attendance: 88 },
  { month: 'Mar', completion: 52, attendance: 90 },
  { month: 'Apr', completion: 60, attendance: 89 },
  { month: 'May', completion: 68, attendance: 92 },
  { month: 'Jun', completion: 74, attendance: 91 },
  { month: 'Jul', completion: 78, attendance: 93 },
]

export const examPerformanceChart = [
  { name: 'React Test', score: 82 },
  { name: 'Node Quiz', score: 76 },
  { name: 'DB Mid', score: 80 },
  { name: 'Soft Skills', score: 88 },
]

export const weeklyProgressChart = [
  { week: 'W1', progress: 70 },
  { week: 'W2', progress: 74 },
  { week: 'W3', progress: 78 },
  { week: 'W4', progress: 85 },
]

export const monthlyProgressChart = [
  { month: 'Feb', hours: 72 },
  { month: 'Mar', hours: 80 },
  { month: 'Apr', hours: 76 },
  { month: 'May', hours: 88 },
  { month: 'Jun', hours: 84 },
  { month: 'Jul', hours: 70 },
]

export const facultyRatingChart = [
  { month: 'Feb', rating: 4.5 },
  { month: 'Mar', rating: 4.6 },
  { month: 'Apr', rating: 4.6 },
  { month: 'May', rating: 4.7 },
  { month: 'Jun', rating: 4.8 },
  { month: 'Jul', rating: 4.8 },
]

export const studentGrowthChart = [
  { month: 'Feb', students: 120 },
  { month: 'Mar', students: 135 },
  { month: 'Apr', students: 148 },
  { month: 'May', students: 160 },
  { month: 'Jun', students: 172 },
  { month: 'Jul', students: 186 },
]

export const timetableWeek = {
  Monday: [
    { time: '10:00 – 11:30', subject: 'React Advanced', batch: 'FS-2025-A', room: 'Lab-3', status: 'Upcoming' },
    { time: '16:00 – 17:30', subject: 'Project Mentoring', batch: 'FS-2025-A', room: 'Zoom', status: 'Upcoming' },
  ],
  Tuesday: [
    { time: '10:00 – 11:30', subject: 'Node.js Backend', batch: 'FS-2025-B', room: 'Lab-2', status: 'Upcoming' },
    { time: '18:00 – 20:00', subject: 'React Evening', batch: 'REACT-EVE-01', room: 'Hall-A', status: 'Upcoming' },
  ],
  Wednesday: [
    { time: '11:00 – 12:30', subject: 'Database Design', batch: 'FS-2025-A', room: 'Lab-1', status: 'Upcoming' },
  ],
  Thursday: [
    { time: '10:00 – 11:30', subject: 'Soft Skills', batch: 'FS-2025-B', room: 'Hall-A', status: 'Upcoming' },
    { time: '18:00 – 20:00', subject: 'React Evening', batch: 'REACT-EVE-01', room: 'Hall-A', status: 'Upcoming' },
  ],
  Friday: [
    { time: '10:00 – 12:00', subject: 'Full Stack Lab', batch: 'FS-2025-A', room: 'Lab-3', status: 'Upcoming' },
  ],
  Saturday: [
    { time: '10:00 – 14:00', subject: 'Node Weekend', batch: 'NODE-WKND', room: 'Lab-4', status: 'Upcoming' },
  ],
  Sunday: [],
}

export const announcements = [
  {
    id: 'A1',
    title: 'Mid-Term Exam Schedule Released',
    audience: 'Student',
    pinned: true,
    date: 'Jul 14, 2026',
    body: 'Database Mid-Term will be held on Jul 20. Syllabus and seating plan attached.',
  },
  {
    id: 'A2',
    title: 'Faculty Sync — Curriculum Update',
    audience: 'Faculty',
    pinned: true,
    date: 'Jul 13, 2026',
    body: 'Please review the updated React module outline before Friday.',
  },
  {
    id: 'A3',
    title: 'Lab Maintenance Window',
    audience: 'Student',
    pinned: false,
    date: 'Jul 12, 2026',
    body: 'Lab-3 will be offline on Jul 17 from 1–3 PM.',
  },
]

export const messages = [
  {
    id: 'M1',
    from: 'Aarav Sharma',
    type: 'Student',
    preview: 'Ma\'am, can I get an extension for ASN-014?',
    time: '10:24 AM',
    unread: true,
  },
  {
    id: 'M2',
    from: 'Master Admin',
    type: 'Admin',
    preview: 'Please submit July attendance report by Friday.',
    time: 'Yesterday',
    unread: true,
  },
  {
    id: 'M3',
    from: 'Ishita Kapoor',
    type: 'Student',
    preview: 'Shared my project GitHub link.',
    time: 'Jul 12',
    unread: false,
  },
  {
    id: 'M4',
    from: 'Rohan Gupta',
    type: 'Student',
    preview: 'Doubt on aggregation pipeline.',
    time: 'Jul 11',
    unread: false,
  },
]

export const leaves = [
  {
    id: 'LV-12',
    type: 'Casual Leave',
    from: 'Jul 18, 2026',
    to: 'Jul 18, 2026',
    days: 1,
    status: 'Pending',
    reason: 'Personal work',
  },
  {
    id: 'LV-11',
    type: 'Sick Leave',
    from: 'Jun 02, 2026',
    to: 'Jun 03, 2026',
    days: 2,
    status: 'Approved',
    reason: 'Fever',
  },
  {
    id: 'LV-10',
    type: 'Casual Leave',
    from: 'May 10, 2026',
    to: 'May 10, 2026',
    days: 1,
    status: 'Rejected',
    reason: 'Family function',
  },
]

export const leaveBalance = {
  casual: 8,
  sick: 6,
  earned: 12,
  used: 5,
}

export const salary = {
  current: 72000,
  month: 'June 2026',
  basic: 48000,
  hra: 12000,
  allowances: 8000,
  bonus: 5000,
  incentive: 3000,
  tax: 6200,
  net: 69800,
  history: [
    { month: 'June 2026', net: 69800, status: 'Paid' },
    { month: 'May 2026', net: 68500, status: 'Paid' },
    { month: 'April 2026', net: 72000, status: 'Paid' },
    { month: 'March 2026', net: 67000, status: 'Paid' },
  ],
}

export const tasks = [
  {
    id: 'T1',
    title: 'Prepare Database Mid-Term paper',
    priority: 'High',
    deadline: 'Jul 16, 2026',
    progress: 60,
    status: 'Pending',
  },
  {
    id: 'T2',
    title: 'Check ASN-014 submissions',
    priority: 'High',
    deadline: 'Jul 15, 2026',
    progress: 30,
    status: 'Pending',
  },
  {
    id: 'T3',
    title: 'Update React course outline',
    priority: 'Medium',
    deadline: 'Jul 18, 2026',
    progress: 80,
    status: 'Pending',
  },
  {
    id: 'T4',
    title: 'Upload weekend lab recording',
    priority: 'Low',
    deadline: 'Jul 14, 2026',
    progress: 100,
    status: 'Completed',
  },
]

export const calendarEvents = [
  { id: 1, title: 'Live Class — React', date: '2026-07-15', type: 'Meeting', time: '10:00 AM' },
  { id: 2, title: 'ASN-014 Due', date: '2026-07-16', type: 'Assignment', time: '11:59 PM' },
  { id: 3, title: 'Faculty Meeting', date: '2026-07-18', type: 'Meeting', time: '4:00 PM' },
  { id: 4, title: 'Database Mid-Term', date: '2026-07-20', type: 'Exam', time: '2:00 PM' },
  { id: 5, title: 'Independence Day', date: '2026-08-15', type: 'Holiday', time: 'All day' },
  { id: 6, title: 'Aarav Sharma Birthday', date: '2026-08-14', type: 'Birthday', time: '—' },
]

export const notifications = [
  { id: 1, title: 'Assignment Submitted', detail: 'Aarav submitted ASN-014', time: '20 min ago', read: false },
  { id: 2, title: 'Homework Submitted', detail: '12 students submitted HW-028', time: '1 hour ago', read: false },
  { id: 3, title: 'New Student Joined', detail: 'Meera Patel joined FS-2025-A', time: '3 hours ago', read: false },
  { id: 4, title: 'Exam Scheduled', detail: 'Node Practical on Jul 25', time: 'Yesterday', read: false },
  { id: 5, title: 'Attendance Pending', detail: 'Soft Skills — Jul 14 not marked', time: 'Yesterday', read: true },
  { id: 6, title: 'Course Updated', detail: 'Admin updated React syllabus', time: '2 days ago', read: true },
  { id: 7, title: 'Announcement', detail: 'Lab maintenance on Jul 17', time: '2 days ago', read: true },
  { id: 8, title: 'System Notification', detail: 'Password policy updated', time: '3 days ago', read: true },
]

export const supportTickets = [
  { id: 'TK-221', subject: 'Zoom link not working', status: 'Open', date: 'Jul 13, 2026' },
  { id: 'TK-210', subject: 'LMS upload limit increase', status: 'Resolved', date: 'Jul 05, 2026' },
]

export const faqs = [
  {
    q: 'How do I mark bulk attendance?',
    a: 'Open Attendance → Bulk Attendance, select batch and date, then mark Present/Absent for all students.',
  },
  {
    q: 'Can I edit marks after publishing?',
    a: 'Yes, within 48 hours of publish. After that, raise a ticket to Master Admin.',
  },
  {
    q: 'How are certificates generated?',
    a: 'Go to Certificates → Generate Certificate after the student completes the module criteria.',
  },
]

export const instituteNews = [
  { id: 1, title: 'New MERN weekend batch launching Aug 2026', date: 'Jul 12' },
  { id: 2, title: 'Campus placement drive — Sep 2026', date: 'Jul 10' },
]
