/**
 * Grow Skills Tech — Master Admin ERP dummy data
 * Realistic interconnected institute data for demo UI
 */

export const instituteProfile = {
  name: 'Grow Skills Tech',
  logoText: 'GST',
  academicYear: '2025–26',
  currentSession: 'Odd Semester · Jul–Dec 2026',
  branch: 'Bengaluru Main Campus',
  address: 'Whitefield, Bengaluru, Karnataka 560066',
  phone: '+91 80 4123 8890',
  email: 'admin@growskillstech.com',
  healthScore: 92,
  overallProgress: 78,
  currency: 'INR',
  timezone: 'Asia/Kolkata',
}

export const dashboardStats = [
  { key: 'students', label: 'Total Students', value: '2,486', hint: 'Active + Alumni' },
  { key: 'activeStudents', label: 'Active Students', value: '2,104', hint: 'Current session' },
  { key: 'admissions', label: 'New Admissions', value: '186', hint: 'This month' },
  { key: 'pendingAdmissions', label: 'Pending Admissions', value: '42', hint: 'Awaiting approval' },
  { key: 'faculty', label: 'Total Faculty', value: '128', hint: 'Full-time + visiting' },
  { key: 'staff', label: 'Total Staff', value: '64', hint: 'Admin + support' },
  { key: 'departments', label: 'Departments', value: '12', hint: 'Academic units' },
  { key: 'courses', label: 'Courses', value: '86', hint: 'Published' },
  { key: 'programs', label: 'Programs', value: '18', hint: 'Degree / diploma' },
  { key: 'batches', label: 'Batches', value: '54', hint: 'Running' },
  { key: 'subjects', label: 'Subjects', value: '214', hint: 'Mapped' },
  { key: 'todayAttendance', label: "Today's Attendance", value: '91%', hint: 'Campus average' },
  { key: 'overallAttendance', label: 'Overall Attendance', value: '87%', hint: 'Session to date' },
  { key: 'assignments', label: 'Assignments', value: '312', hint: 'Active' },
  { key: 'exams', label: 'Exams', value: '28', hint: 'Scheduled / live' },
  { key: 'certificates', label: 'Certificates', value: '1,842', hint: 'Issued YTD' },
  { key: 'feeCollection', label: 'Fee Collection', value: '₹48.2L', hint: 'This month' },
  { key: 'pendingFees', label: 'Pending Fees', value: '₹12.6L', hint: 'Overdue + due' },
  { key: 'revenue', label: 'Monthly Revenue', value: '₹62.4L', hint: 'All streams' },
  { key: 'expenses', label: 'Monthly Expenses', value: '₹28.9L', hint: 'Ops + payroll' },
  { key: 'profit', label: 'Profit', value: '₹33.5L', hint: 'Net this month' },
  { key: 'library', label: 'Library Books', value: '18,420', hint: 'Catalogued' },
  { key: 'hostel', label: 'Hostel Students', value: '486', hint: 'Occupied beds' },
  { key: 'transport', label: 'Transport Vehicles', value: '22', hint: 'Active fleet' },
  { key: 'placements', label: 'Placements', value: '312', hint: 'Offers YTD' },
  { key: 'internships', label: 'Internships', value: '198', hint: 'Active + completed' },
  { key: 'tickets', label: 'Open Tickets', value: '17', hint: 'Help desk' },
  { key: 'notifications', label: 'Unread Notifications', value: '34', hint: 'Admin inbox' },
]

export const kpiTrend = [
  { name: 'Jan', admissions: 42, revenue: 38, attendance: 86 },
  { name: 'Feb', admissions: 55, revenue: 41, attendance: 88 },
  { name: 'Mar', admissions: 68, revenue: 49, attendance: 87 },
  { name: 'Apr', admissions: 71, revenue: 52, attendance: 89 },
  { name: 'May', admissions: 48, revenue: 44, attendance: 85 },
  { name: 'Jun', admissions: 92, revenue: 58, attendance: 90 },
  { name: 'Jul', admissions: 186, revenue: 62, attendance: 91 },
]

export const feeDonut = [
  { name: 'Collected', value: 72 },
  { name: 'Pending', value: 18 },
  { name: 'Overdue', value: 10 },
]

export const coursePopularity = [
  { name: 'Full Stack', value: 420 },
  { name: 'Data Science', value: 310 },
  { name: 'Cloud DevOps', value: 265 },
  { name: 'UI/UX', value: 190 },
  { name: 'Cyber Security', value: 155 },
]

export const recentActivities = [
  { id: 1, text: 'Admission approved for Ananya Reddy · FS-2026-B3', time: '12 min ago', type: 'admission' },
  { id: 2, text: 'Fee receipt INV-4421 generated · ₹48,000', time: '28 min ago', type: 'fee' },
  { id: 3, text: 'Mid-sem exam schedule published for DS Batch A', time: '1 hr ago', type: 'exam' },
  { id: 4, text: 'Certificate issued · Internship · Rohan Mehta', time: '2 hr ago', type: 'certificate' },
  { id: 5, text: 'Help desk ticket #HD-118 assigned to IT', time: '3 hr ago', type: 'ticket' },
  { id: 6, text: 'Payroll run Jul-2026 completed for 192 employees', time: '5 hr ago', type: 'payroll' },
]

export const upcomingEvents = [
  { id: 1, title: 'Industry Expert Seminar — GenAI', date: '16 Jul 2026', venue: 'Auditorium A' },
  { id: 2, title: 'Hackathon Finale', date: '19 Jul 2026', venue: 'Innovation Lab' },
  { id: 3, title: 'Campus Placement Drive — Infosys', date: '22 Jul 2026', venue: 'Seminar Hall 2' },
]

export const upcomingBirthdays = [
  { id: 1, name: 'Priya Nair', role: 'Faculty · Data Science', date: '15 Jul' },
  { id: 2, name: 'Karthik Rao', role: 'Student · FS-B2', date: '16 Jul' },
  { id: 3, name: 'Meera Iyer', role: 'Accountant', date: '18 Jul' },
]

export const topFaculty = [
  { id: 1, name: 'Dr. Sneha Kapoor', dept: 'Data Science', rating: 4.9, students: 186 },
  { id: 2, name: 'Arjun Menon', dept: 'Full Stack', rating: 4.8, students: 210 },
  { id: 3, name: 'Neha Sharma', dept: 'Cloud', rating: 4.7, students: 142 },
]

export const topStudents = [
  { id: 1, name: 'Aisha Khan', batch: 'DS-2025-A', cgpa: 9.6 },
  { id: 2, name: 'Vikram Patel', batch: 'FS-2025-B', cgpa: 9.4 },
  { id: 3, name: 'Sana Qureshi', batch: 'UX-2026-A', cgpa: 9.3 },
]

export const quoteOfDay = {
  text: 'Education is the most powerful weapon which you can use to change the world.',
  author: 'Nelson Mandela',
}

export const weather = { temp: '27°C', condition: 'Partly cloudy', humidity: '64%', city: 'Bengaluru' }

/* ——— People & academics ——— */
export const students = [
  { id: 'STU-1001', name: 'Ananya Reddy', email: 'ananya.reddy@gst.edu', phone: '9876501001', program: 'BCA Full Stack', batch: 'FS-2026-B3', department: 'Computer Science', status: 'Active', attendance: '94%', fees: 'Paid', roll: 'FS26B3-014', parent: 'Ravi Reddy', city: 'Hyderabad' },
  { id: 'STU-1002', name: 'Rohan Mehta', email: 'rohan.mehta@gst.edu', phone: '9876501002', program: 'PG Diploma DS', batch: 'DS-2025-A', department: 'Data Science', status: 'Active', attendance: '89%', fees: 'Pending', roll: 'DS25A-008', parent: 'Anita Mehta', city: 'Pune' },
  { id: 'STU-1003', name: 'Sana Qureshi', email: 'sana.q@gst.edu', phone: '9876501003', program: 'UI/UX Design', batch: 'UX-2026-A', department: 'Design', status: 'Active', attendance: '96%', fees: 'Paid', roll: 'UX26A-003', parent: 'Imran Qureshi', city: 'Bengaluru' },
  { id: 'STU-1004', name: 'Vikram Patel', email: 'vikram.p@gst.edu', phone: '9876501004', program: 'BCA Full Stack', batch: 'FS-2025-B', department: 'Computer Science', status: 'Active', attendance: '91%', fees: 'Partial', roll: 'FS25B-021', parent: 'Kiran Patel', city: 'Ahmedabad' },
  { id: 'STU-1005', name: 'Aisha Khan', email: 'aisha.k@gst.edu', phone: '9876501005', program: 'PG Diploma DS', batch: 'DS-2025-A', department: 'Data Science', status: 'Active', attendance: '98%', fees: 'Paid', roll: 'DS25A-001', parent: 'Farhan Khan', city: 'Delhi' },
  { id: 'STU-1006', name: 'Karthik Rao', email: 'karthik.r@gst.edu', phone: '9876501006', program: 'Cloud DevOps', batch: 'CD-2026-A', department: 'Cloud', status: 'Suspended', attendance: '62%', fees: 'Overdue', roll: 'CD26A-019', parent: 'Lakshmi Rao', city: 'Chennai' },
  { id: 'STU-1007', name: 'Meera Das', email: 'meera.d@gst.edu', phone: '9876501007', program: 'Cyber Security', batch: 'CS-2026-B', department: 'Security', status: 'Active', attendance: '88%', fees: 'Paid', roll: 'CS26B-011', parent: 'Sourav Das', city: 'Kolkata' },
  { id: 'STU-1008', name: 'Aditya Verma', email: 'aditya.v@gst.edu', phone: '9876501008', program: 'BCA Full Stack', batch: 'FS-2026-B3', department: 'Computer Science', status: 'Active', attendance: '85%', fees: 'Pending', roll: 'FS26B3-027', parent: 'Pooja Verma', city: 'Noida' },
  { id: 'STU-1009', name: 'Ishita Bose', email: 'ishita.b@gst.edu', phone: '9876501009', program: 'Digital Marketing', batch: 'DM-2026-A', department: 'Marketing', status: 'Active', attendance: '92%', fees: 'Paid', roll: 'DM26A-006', parent: 'Arun Bose', city: 'Bengaluru' },
  { id: 'STU-1010', name: 'Nikhil Joshi', email: 'nikhil.j@gst.edu', phone: '9876501010', program: 'Cloud DevOps', batch: 'CD-2025-B', department: 'Cloud', status: 'Alumni', attendance: '90%', fees: 'Paid', roll: 'CD25B-004', parent: 'Seema Joshi', city: 'Mumbai' },
]

export const faculty = [
  { id: 'FAC-201', name: 'Dr. Sneha Kapoor', email: 'sneha.k@gst.edu', department: 'Data Science', qualification: 'PhD · IIT Madras', experience: '12 yrs', subjects: 'ML, Python', status: 'Active', rating: 4.9, salary: '₹1,25,000' },
  { id: 'FAC-202', name: 'Arjun Menon', email: 'arjun.m@gst.edu', department: 'Computer Science', qualification: 'M.Tech', experience: '9 yrs', subjects: 'React, Node', status: 'Active', rating: 4.8, salary: '₹98,000' },
  { id: 'FAC-203', name: 'Neha Sharma', email: 'neha.s@gst.edu', department: 'Cloud', qualification: 'AWS SA Pro', experience: '7 yrs', subjects: 'AWS, K8s', status: 'Active', rating: 4.7, salary: '₹1,10,000' },
  { id: 'FAC-204', name: 'Priya Nair', email: 'priya.n@gst.edu', department: 'Design', qualification: 'M.Des NID', experience: '6 yrs', subjects: 'Figma, UX', status: 'On Leave', rating: 4.6, salary: '₹85,000' },
  { id: 'FAC-205', name: 'Rahul Desai', email: 'rahul.d@gst.edu', department: 'Security', qualification: 'CEH · OSCP', experience: '10 yrs', subjects: 'Ethical Hacking', status: 'Active', rating: 4.5, salary: '₹1,05,000' },
  { id: 'FAC-206', name: 'Kavitha Krishnan', email: 'kavitha.k@gst.edu', department: 'Marketing', qualification: 'MBA', experience: '8 yrs', subjects: 'SEO, Ads', status: 'Active', rating: 4.4, salary: '₹78,000' },
]

export const staff = [
  { id: 'STF-301', name: 'Meera Iyer', role: 'Accountant', department: 'Finance', status: 'Active', attendance: '98%', salary: '₹55,000' },
  { id: 'STF-302', name: 'Suresh Pillai', role: 'HR Manager', department: 'HR', status: 'Active', attendance: '96%', salary: '₹72,000' },
  { id: 'STF-303', name: 'Anita Gomes', role: 'Librarian', department: 'Library', status: 'Active', attendance: '99%', salary: '₹42,000' },
  { id: 'STF-304', name: 'Ramesh Naik', role: 'Transport Manager', department: 'Transport', status: 'Active', attendance: '94%', salary: '₹48,000' },
  { id: 'STF-305', name: 'Fatima Sheikh', role: 'Hostel Warden', department: 'Hostel', status: 'Active', attendance: '97%', salary: '₹45,000' },
  { id: 'STF-306', name: 'Joseph Thomas', role: 'Receptionist', department: 'Admin', status: 'Active', attendance: '100%', salary: '₹28,000' },
]

export const parents = [
  { id: 'PAR-401', name: 'Ravi Reddy', student: 'Ananya Reddy', phone: '9876502001', email: 'ravi.reddy@mail.com', relation: 'Father', status: 'Active' },
  { id: 'PAR-402', name: 'Anita Mehta', student: 'Rohan Mehta', phone: '9876502002', email: 'anita.m@mail.com', relation: 'Mother', status: 'Active' },
  { id: 'PAR-403', name: 'Imran Qureshi', student: 'Sana Qureshi', phone: '9876502003', email: 'imran.q@mail.com', relation: 'Father', status: 'Active' },
  { id: 'PAR-404', name: 'Kiran Patel', student: 'Vikram Patel', phone: '9876502004', email: 'kiran.p@mail.com', relation: 'Father', status: 'Active' },
]

export const departments = [
  { id: 'DEP-01', name: 'Computer Science', head: 'Arjun Menon', programs: 4, faculty: 28, students: 620, status: 'Active' },
  { id: 'DEP-02', name: 'Data Science', head: 'Dr. Sneha Kapoor', programs: 3, faculty: 18, students: 410, status: 'Active' },
  { id: 'DEP-03', name: 'Cloud Computing', head: 'Neha Sharma', programs: 2, faculty: 14, students: 280, status: 'Active' },
  { id: 'DEP-04', name: 'Design', head: 'Priya Nair', programs: 2, faculty: 10, students: 190, status: 'Active' },
  { id: 'DEP-05', name: 'Cyber Security', head: 'Rahul Desai', programs: 2, faculty: 12, students: 210, status: 'Active' },
  { id: 'DEP-06', name: 'Digital Marketing', head: 'Kavitha Krishnan', programs: 1, faculty: 8, students: 155, status: 'Active' },
]

export const courses = [
  { id: 'CRS-501', name: 'Full Stack Web Development', category: 'Software', duration: '6 months', modules: 12, price: '₹89,999', faculty: 'Arjun Menon', status: 'Published' },
  { id: 'CRS-502', name: 'Data Science with Python', category: 'Analytics', duration: '8 months', modules: 14, price: '₹1,19,999', faculty: 'Dr. Sneha Kapoor', status: 'Published' },
  { id: 'CRS-503', name: 'AWS Cloud Architect', category: 'Cloud', duration: '5 months', modules: 10, price: '₹99,999', faculty: 'Neha Sharma', status: 'Published' },
  { id: 'CRS-504', name: 'UI/UX Professional', category: 'Design', duration: '4 months', modules: 8, price: '₹64,999', faculty: 'Priya Nair', status: 'Published' },
  { id: 'CRS-505', name: 'Ethical Hacking Bootcamp', category: 'Security', duration: '4 months', modules: 9, price: '₹79,999', faculty: 'Rahul Desai', status: 'Draft' },
  { id: 'CRS-506', name: 'Digital Marketing Mastery', category: 'Marketing', duration: '3 months', modules: 7, price: '₹49,999', faculty: 'Kavitha Krishnan', status: 'Published' },
]

export const programs = [
  { id: 'PRG-01', name: 'BCA Full Stack', semesters: 6, credits: 140, courses: 24, status: 'Active' },
  { id: 'PRG-02', name: 'PG Diploma Data Science', semesters: 2, credits: 48, courses: 10, status: 'Active' },
  { id: 'PRG-03', name: 'PG Certificate Cloud DevOps', semesters: 2, credits: 36, courses: 8, status: 'Active' },
  { id: 'PRG-04', name: 'Diploma UI/UX Design', semesters: 2, credits: 40, courses: 9, status: 'Active' },
]

export const batches = [
  { id: 'BAT-FS26B3', name: 'FS-2026-B3', program: 'BCA Full Stack', faculty: 'Arjun Menon', students: 42, schedule: 'Mon–Fri 10:00–13:00', progress: '34%', status: 'Running' },
  { id: 'BAT-DS25A', name: 'DS-2025-A', program: 'PG Diploma DS', faculty: 'Dr. Sneha Kapoor', students: 36, schedule: 'Mon–Fri 14:00–17:00', progress: '78%', status: 'Running' },
  { id: 'BAT-CD26A', name: 'CD-2026-A', program: 'Cloud DevOps', faculty: 'Neha Sharma', students: 28, schedule: 'Tue–Sat 09:00–12:00', progress: '22%', status: 'Running' },
  { id: 'BAT-UX26A', name: 'UX-2026-A', program: 'UI/UX Design', faculty: 'Priya Nair', students: 24, schedule: 'Mon–Thu 11:00–14:00', progress: '41%', status: 'Running' },
]

export const subjects = [
  { id: 'SUB-101', name: 'React & Modern Frontend', code: 'CS301', credits: 4, faculty: 'Arjun Menon', batch: 'FS-2026-B3', status: 'Active' },
  { id: 'SUB-102', name: 'Machine Learning Fundamentals', code: 'DS201', credits: 4, faculty: 'Dr. Sneha Kapoor', batch: 'DS-2025-A', status: 'Active' },
  { id: 'SUB-103', name: 'Kubernetes & Containers', code: 'CL210', credits: 3, faculty: 'Neha Sharma', batch: 'CD-2026-A', status: 'Active' },
  { id: 'SUB-104', name: 'Design Systems', code: 'UX120', credits: 3, faculty: 'Priya Nair', batch: 'UX-2026-A', status: 'Active' },
  { id: 'SUB-105', name: 'Network Security', code: 'CY180', credits: 4, faculty: 'Rahul Desai', batch: 'CS-2026-B', status: 'Active' },
]

export const classes = [
  { id: 'CLS-01', name: 'Lab A — Full Stack', room: 'LAB-201', capacity: 40, batch: 'FS-2026-B3', faculty: 'Arjun Menon', status: 'Occupied' },
  { id: 'CLS-02', name: 'Seminar Hall 1', room: 'SH-101', capacity: 120, batch: '—', faculty: '—', status: 'Available' },
  { id: 'CLS-03', name: 'Data Lab', room: 'LAB-305', capacity: 36, batch: 'DS-2025-A', faculty: 'Dr. Sneha Kapoor', status: 'Occupied' },
  { id: 'CLS-04', name: 'Cloud Lab', room: 'LAB-410', capacity: 30, batch: 'CD-2026-A', faculty: 'Neha Sharma', status: 'Occupied' },
]

/* ——— Admissions & leads ——— */
export const admissions = [
  { id: 'ADM-9001', applicant: 'Deepak Singh', program: 'BCA Full Stack', mode: 'Online', status: 'Pending', counsellor: 'Riya Sen', fee: '₹5,000', date: '12 Jul 2026' },
  { id: 'ADM-9002', applicant: 'Lakshmi Priya', program: 'PG Diploma DS', mode: 'Offline', status: 'Approved', counsellor: 'Amit Shah', fee: '₹5,000', date: '11 Jul 2026' },
  { id: 'ADM-9003', applicant: 'Omar Farooq', program: 'Cloud DevOps', mode: 'Online', status: 'Verification', status2: 'Verification', counsellor: 'Riya Sen', fee: '₹5,000', date: '10 Jul 2026' },
  { id: 'ADM-9004', applicant: 'Pooja Nair', program: 'UI/UX Design', mode: 'Walk-in', status: 'Rejected', counsellor: 'Amit Shah', fee: '—', date: '09 Jul 2026' },
  { id: 'ADM-9005', applicant: 'Harsh Gupta', program: 'Cyber Security', mode: 'Online', status: 'Approved', counsellor: 'Riya Sen', fee: '₹5,000', date: '08 Jul 2026' },
]

export const leads = [
  { id: 'LED-701', name: 'Snehal Patil', source: 'Website', status: 'New', counsellor: 'Riya Sen', phone: '9876511001', followUp: '15 Jul 2026', interest: 'Full Stack' },
  { id: 'LED-702', name: 'Gaurav Malhotra', source: 'WhatsApp', status: 'Contacted', counsellor: 'Amit Shah', phone: '9876511002', followUp: '14 Jul 2026', interest: 'Data Science' },
  { id: 'LED-703', name: 'Divya Krishnan', source: 'Phone', status: 'Qualified', counsellor: 'Riya Sen', phone: '9876511003', followUp: '16 Jul 2026', interest: 'Cloud' },
  { id: 'LED-704', name: 'Farhan Ali', source: 'Email', status: 'Converted', counsellor: 'Amit Shah', phone: '9876511004', followUp: '—', interest: 'UI/UX' },
  { id: 'LED-705', name: 'Ritu Agarwal', source: 'Walk-in', status: 'Lost', counsellor: 'Riya Sen', phone: '9876511005', followUp: '—', interest: 'Digital Marketing' },
  { id: 'LED-706', name: 'Yashwanth G', source: 'Website', status: 'New', counsellor: 'Unassigned', phone: '9876511006', followUp: '17 Jul 2026', interest: 'Cyber Security' },
]

export const enquiries = [
  { id: 'ENQ-801', name: 'Nisha Verma', channel: 'Walk-in', status: 'Open', assigned: 'Riya Sen', date: '14 Jul 2026', notes: 'Wants evening batch' },
  { id: 'ENQ-802', name: 'Prateek Jain', channel: 'Website', status: 'Follow-up', assigned: 'Amit Shah', date: '13 Jul 2026', notes: 'Scholarship query' },
  { id: 'ENQ-803', name: 'Shreya Iyer', channel: 'Phone', status: 'Closed', assigned: 'Riya Sen', date: '12 Jul 2026', notes: 'Joined FS-2026-B3' },
]

/* ——— Academic ops ——— */
export const attendanceRows = [
  { id: 'ATT-1', name: 'Ananya Reddy', role: 'Student', batch: 'FS-2026-B3', date: '14 Jul 2026', status: 'Present', method: 'QR' },
  { id: 'ATT-2', name: 'Rohan Mehta', role: 'Student', batch: 'DS-2025-A', date: '14 Jul 2026', status: 'Present', method: 'Biometric' },
  { id: 'ATT-3', name: 'Karthik Rao', role: 'Student', batch: 'CD-2026-A', date: '14 Jul 2026', status: 'Absent', method: '—' },
  { id: 'ATT-4', name: 'Arjun Menon', role: 'Faculty', batch: '—', date: '14 Jul 2026', status: 'Present', method: 'Biometric' },
  { id: 'ATT-5', name: 'Meera Iyer', role: 'Staff', batch: '—', date: '14 Jul 2026', status: 'Present', method: 'Biometric' },
  { id: 'ATT-6', name: 'Priya Nair', role: 'Faculty', batch: '—', date: '14 Jul 2026', status: 'Leave', method: '—' },
]

export const timetableSlots = [
  { id: 'TT-1', day: 'Monday', time: '10:00–11:00', subject: 'React', faculty: 'Arjun Menon', room: 'LAB-201', batch: 'FS-2026-B3' },
  { id: 'TT-2', day: 'Monday', time: '11:00–12:00', subject: 'Node.js', faculty: 'Arjun Menon', room: 'LAB-201', batch: 'FS-2026-B3' },
  { id: 'TT-3', day: 'Monday', time: '14:00–15:00', subject: 'ML Basics', faculty: 'Dr. Sneha Kapoor', room: 'LAB-305', batch: 'DS-2025-A' },
  { id: 'TT-4', day: 'Tuesday', time: '09:00–10:00', subject: 'AWS Core', faculty: 'Neha Sharma', room: 'LAB-410', batch: 'CD-2026-A' },
  { id: 'TT-5', day: 'Tuesday', time: '11:00–12:00', subject: 'Figma Lab', faculty: 'Priya Nair', room: 'DES-101', batch: 'UX-2026-A' },
  { id: 'TT-6', day: 'Wednesday', time: '10:00–11:00', subject: 'Network Security', faculty: 'Rahul Desai', room: 'LAB-220', batch: 'CS-2026-B' },
]

export const assignments = [
  { id: 'ASN-11', title: 'Build REST API with Auth', course: 'Full Stack', batch: 'FS-2026-B3', faculty: 'Arjun Menon', deadline: '20 Jul 2026', marks: 50, status: 'Open', submissions: 28 },
  { id: 'ASN-12', title: 'EDA on Housing Dataset', course: 'Data Science', batch: 'DS-2025-A', faculty: 'Dr. Sneha Kapoor', deadline: '18 Jul 2026', marks: 40, status: 'Open', submissions: 31 },
  { id: 'ASN-13', title: 'Deploy Node app on ECS', course: 'Cloud', batch: 'CD-2026-A', faculty: 'Neha Sharma', deadline: '22 Jul 2026', marks: 60, status: 'Draft', submissions: 0 },
  { id: 'ASN-14', title: 'Mobile App Wireframes', course: 'UI/UX', batch: 'UX-2026-A', faculty: 'Priya Nair', deadline: '17 Jul 2026', marks: 30, status: 'Closed', submissions: 24 },
]

export const homework = [
  { id: 'HW-21', title: 'JS Array Methods Practice', batch: 'FS-2026-B3', assigned: '14 Jul 2026', due: '15 Jul 2026', completion: '76%', status: 'Tracking' },
  { id: 'HW-22', title: 'Pandas Filtering Exercises', batch: 'DS-2025-A', assigned: '13 Jul 2026', due: '15 Jul 2026', completion: '88%', status: 'Tracking' },
  { id: 'HW-23', title: 'IAM Policy Worksheet', batch: 'CD-2026-A', assigned: '12 Jul 2026', due: '14 Jul 2026', completion: '100%', status: 'Completed' },
]

export const studyMaterials = [
  { id: 'SM-31', title: 'React Hooks Cheatsheet', type: 'PDF', course: 'Full Stack', version: 'v2.1', uploaded: '01 Jul 2026', size: '2.4 MB', status: 'Published' },
  { id: 'SM-32', title: 'Week 4 ML Lecture', type: 'Video', course: 'Data Science', version: 'v1.0', uploaded: '05 Jul 2026', size: '480 MB', status: 'Published' },
  { id: 'SM-33', title: 'AWS Lab Starter Kit', type: 'ZIP', course: 'Cloud', version: 'v3.0', uploaded: '08 Jul 2026', size: '18 MB', status: 'Published' },
  { id: 'SM-34', title: 'Design Critique Rubric', type: 'DOC', course: 'UI/UX', version: 'v1.2', uploaded: '10 Jul 2026', size: '180 KB', status: 'Draft' },
  { id: 'SM-35', title: 'OWASP Top 10 Slides', type: 'PPT', course: 'Security', version: 'v1.0', uploaded: '11 Jul 2026', size: '6.1 MB', status: 'Published' },
]

export const notes = [
  { id: 'NT-41', title: 'Redux Toolkit Notes', subject: 'React', author: 'Arjun Menon', batch: 'FS-2026-B3', updated: '12 Jul 2026', status: 'Published' },
  { id: 'NT-42', title: 'Gradient Descent Intuition', subject: 'ML', author: 'Dr. Sneha Kapoor', batch: 'DS-2025-A', updated: '11 Jul 2026', status: 'Published' },
]

export const questionBank = [
  { id: 'QB-51', title: 'What is closure in JS?', type: 'MCQ', difficulty: 'Easy', topic: 'JavaScript', status: 'Active' },
  { id: 'QB-52', title: 'Implement binary search', type: 'Programming', difficulty: 'Medium', topic: 'DSA', status: 'Active' },
  { id: 'QB-53', title: 'Explain overfitting', type: 'Theory', difficulty: 'Medium', topic: 'ML', status: 'Active' },
  { id: 'QB-54', title: 'CIDR notation quiz', type: 'MCQ', difficulty: 'Hard', topic: 'Networking', status: 'Draft' },
]

export const exams = [
  { id: 'EXM-61', name: 'FS Mid-Sem Theory', type: 'Offline', batch: 'FS-2026-B3', date: '25 Jul 2026', hall: 'Hall A', invigilator: 'Arjun Menon', status: 'Scheduled' },
  { id: 'EXM-62', name: 'DS Quiz — Week 10', type: 'Online', batch: 'DS-2025-A', date: '16 Jul 2026', hall: 'LMS', invigilator: 'Dr. Sneha Kapoor', status: 'Live' },
  { id: 'EXM-63', name: 'Cloud Lab Practical', type: 'Offline', batch: 'CD-2026-A', date: '28 Jul 2026', hall: 'LAB-410', invigilator: 'Neha Sharma', status: 'Scheduled' },
]

export const results = [
  { id: 'RES-71', student: 'Aisha Khan', exam: 'DS Mid-Sem', marks: 92, grade: 'A+', cgpa: 9.6, rank: 1, status: 'Published' },
  { id: 'RES-72', student: 'Vikram Patel', exam: 'FS Mid-Sem', marks: 88, grade: 'A', cgpa: 9.4, rank: 2, status: 'Published' },
  { id: 'RES-73', student: 'Sana Qureshi', exam: 'UX Mid-Sem', marks: 90, grade: 'A+', cgpa: 9.3, rank: 1, status: 'Published' },
  { id: 'RES-74', student: 'Rohan Mehta', exam: 'DS Mid-Sem', marks: 76, grade: 'B+', cgpa: 8.1, rank: 12, status: 'Published' },
]

export const certificates = [
  { id: 'CER-81', student: 'Nikhil Joshi', type: 'Course Certificate', course: 'Cloud DevOps', issued: '02 Jul 2026', verify: 'QR-8821', status: 'Issued' },
  { id: 'CER-82', student: 'Rohan Mehta', type: 'Internship Certificate', course: 'Data Intern', issued: '10 Jul 2026', verify: 'QR-8822', status: 'Issued' },
  { id: 'CER-83', student: 'Ananya Reddy', type: 'Participation Certificate', course: 'Hackathon', issued: '12 Jul 2026', verify: 'QR-8823', status: 'Issued' },
  { id: 'CER-84', student: 'Meera Das', type: 'Bonafide Certificate', course: '—', issued: '13 Jul 2026', verify: 'QR-8824', status: 'Pending' },
]

/* ——— Finance ——— */
export const fees = [
  { id: 'FEE-91', student: 'Ananya Reddy', category: 'Tuition', installment: '2/4', amount: '₹48,000', paid: '₹48,000', due: '₹0', status: 'Paid', date: '05 Jul 2026' },
  { id: 'FEE-92', student: 'Rohan Mehta', category: 'Tuition', installment: '3/4', amount: '₹55,000', paid: '₹30,000', due: '₹25,000', status: 'Pending', date: '01 Jul 2026' },
  { id: 'FEE-93', student: 'Karthik Rao', category: 'Tuition', installment: '2/4', amount: '₹42,000', paid: '₹0', due: '₹42,000', status: 'Overdue', date: '20 Jun 2026' },
  { id: 'FEE-94', student: 'Sana Qureshi', category: 'Lab Fee', installment: '1/1', amount: '₹8,000', paid: '₹8,000', due: '₹0', status: 'Paid', date: '08 Jul 2026' },
  { id: 'FEE-95', student: 'Aditya Verma', category: 'Hostel', installment: '1/2', amount: '₹35,000', paid: '₹17,500', due: '₹17,500', status: 'Partial', date: '03 Jul 2026' },
]

export const expenses = [
  { id: 'EXP-11', title: 'Lab equipment purchase', category: 'Assets', amount: '₹2,40,000', date: '05 Jul 2026', vendor: 'TechMart India', status: 'Approved' },
  { id: 'EXP-12', title: 'Electricity bill — Main', category: 'Utilities', amount: '₹86,400', date: '08 Jul 2026', vendor: 'BESCOM', status: 'Paid' },
  { id: 'EXP-13', title: 'Faculty travel — Conference', category: 'Travel', amount: '₹28,500', date: '10 Jul 2026', vendor: '—', status: 'Pending' },
]

export const income = [
  { id: 'INC-21', title: 'Tuition fees — July', category: 'Fees', amount: '₹48,20,000', date: '14 Jul 2026', status: 'Posted' },
  { id: 'INC-22', title: 'Corporate training — Acme Corp', category: 'Training', amount: '₹6,50,000', date: '09 Jul 2026', status: 'Posted' },
  { id: 'INC-23', title: 'Hostel mess charges', category: 'Hostel', amount: '₹3,12,000', date: '07 Jul 2026', status: 'Posted' },
]

export const accounting = [
  { id: 'ACC-1', account: 'Tuition Income', type: 'Income', balance: '₹2.4 Cr', period: 'FY 25-26' },
  { id: 'ACC-2', account: 'Salaries Payable', type: 'Liability', balance: '₹28.9 L', period: 'Jul 2026' },
  { id: 'ACC-3', account: 'Cash at Bank — HDFC', type: 'Asset', balance: '₹86.2 L', period: 'Current' },
  { id: 'ACC-4', account: 'GST Output', type: 'Tax', balance: '₹4.8 L', period: 'Jul 2026' },
]

export const salary = [
  { id: 'SAL-1', employee: 'Dr. Sneha Kapoor', role: 'Faculty', basic: '₹95,000', allowances: '₹30,000', deductions: '₹12,400', net: '₹1,12,600', status: 'Processed' },
  { id: 'SAL-2', employee: 'Arjun Menon', role: 'Faculty', basic: '₹75,000', allowances: '₹23,000', deductions: '₹9,800', net: '₹88,200', status: 'Processed' },
  { id: 'SAL-3', employee: 'Meera Iyer', role: 'Staff', basic: '₹42,000', allowances: '₹13,000', deductions: '₹5,200', net: '₹49,800', status: 'Processed' },
  { id: 'SAL-4', employee: 'Suresh Pillai', role: 'Staff', basic: '₹55,000', allowances: '₹17,000', deductions: '₹7,100', net: '₹64,900', status: 'Pending' },
]

export const payroll = [
  { id: 'PAY-JUL26', period: 'July 2026', employees: 192, gross: '₹1.48 Cr', pf: '₹8.2 L', esic: '₹1.1 L', tds: '₹12.6 L', status: 'Completed' },
  { id: 'PAY-JUN26', period: 'June 2026', employees: 190, gross: '₹1.45 Cr', pf: '₹8.0 L', esic: '₹1.05 L', tds: '₹12.1 L', status: 'Completed' },
]

/* ——— Facilities ——— */
export const libraryBooks = [
  { id: 'LIB-100', title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', copies: 8, available: 3, status: 'Available' },
  { id: 'LIB-101', title: 'Designing Data-Intensive Apps', author: 'Martin Kleppmann', isbn: '978-1449373320', copies: 5, available: 1, status: 'Available' },
  { id: 'LIB-102', title: 'Hands-On ML', author: 'Aurélien Géron', isbn: '978-1492032649', copies: 6, available: 0, status: 'Issued' },
  { id: 'LIB-103', title: "Don't Make Me Think", author: 'Steve Krug', isbn: '978-0321965516', copies: 4, available: 2, status: 'Available' },
]

export const libraryIssues = [
  { id: 'ISS-1', book: 'Clean Code', member: 'Vikram Patel', issued: '01 Jul 2026', due: '15 Jul 2026', fine: '₹0', status: 'Issued' },
  { id: 'ISS-2', book: 'Hands-On ML', member: 'Aisha Khan', issued: '28 Jun 2026', due: '12 Jul 2026', fine: '₹40', status: 'Overdue' },
]

export const hostelRooms = [
  { id: 'HST-A101', room: 'A-101', type: 'Double', beds: 2, occupied: 2, students: 'Ananya Reddy, Meera Das', fees: '₹8,500/mo', status: 'Full' },
  { id: 'HST-A102', room: 'A-102', type: 'Triple', beds: 3, occupied: 2, students: 'Sana Qureshi, Ishita Bose', fees: '₹6,500/mo', status: 'Available' },
  { id: 'HST-B201', room: 'B-201', type: 'Single', beds: 1, occupied: 1, students: 'Aditya Verma', fees: '₹12,000/mo', status: 'Full' },
]

export const transportVehicles = [
  { id: 'VEH-01', vehicle: 'KA-01-AB-1234', type: 'Bus', route: 'Whitefield Loop', driver: 'Ramesh Naik', capacity: 40, students: 36, status: 'Active' },
  { id: 'VEH-02', vehicle: 'KA-01-CD-5678', type: 'Bus', route: 'Electronic City', driver: 'Suresh K', capacity: 40, students: 32, status: 'Active' },
  { id: 'VEH-03', vehicle: 'KA-01-EF-9012', type: 'Van', route: 'Airport Road', driver: 'Imran B', capacity: 12, students: 9, status: 'Maintenance' },
]

export const inventory = [
  { id: 'INV-1', item: 'Dell Latitude Laptop', category: 'Assets', stock: 24, vendor: 'Dell India', status: 'In Stock' },
  { id: 'INV-2', item: 'Arduino Starter Kit', category: 'Lab', stock: 40, vendor: 'RoboMart', status: 'In Stock' },
  { id: 'INV-3', item: 'Projector Epson', category: 'Assets', stock: 2, vendor: 'Epson', status: 'Low Stock' },
  { id: 'INV-4', item: 'ID Card Ribbon', category: 'Consumable', stock: 0, vendor: 'OfficeDepot', status: 'Out of Stock' },
]

export const assets = [
  { id: 'AST-1', name: 'Server Rack — Lab 410', tag: 'AST-SR-410', value: '₹4,80,000', location: 'Cloud Lab', status: 'Active', maintenance: 'Aug 2026' },
  { id: 'AST-2', name: 'Generator 62.5 kVA', tag: 'AST-GN-01', value: '₹9,20,000', location: 'Utility Yard', status: 'Active', maintenance: 'Sep 2026' },
]

/* ——— Career ——— */
export const placements = [
  { id: 'PLC-1', company: 'Infosys', drive: 'Campus Drive Jul', eligible: 86, selected: 22, package: '₹4.5 LPA', status: 'Completed' },
  { id: 'PLC-2', company: 'Amazon', drive: 'SDE Intern', eligible: 40, selected: 6, package: '₹80k/mo', status: 'Ongoing' },
  { id: 'PLC-3', company: 'Freshworks', drive: 'Support Engineer', eligible: 55, selected: 0, package: '₹6 LPA', status: 'Scheduled' },
]

export const trainings = [
  { id: 'TRN-1', name: 'Soft Skills Intensive', type: 'Internal', trainer: 'Kavitha Krishnan', students: 120, progress: '60%', status: 'Running' },
  { id: 'TRN-2', name: 'AWS Partner Workshop', type: 'External', trainer: 'AWS Academy', students: 45, progress: '100%', status: 'Completed' },
]

export const internships = [
  { id: 'INT-1', student: 'Rohan Mehta', company: 'DataNest Pvt Ltd', mentor: 'Dr. Sneha Kapoor', duration: '3 months', status: 'Completed', stipend: '₹15,000' },
  { id: 'INT-2', student: 'Vikram Patel', company: 'CodeCraft', mentor: 'Arjun Menon', duration: '2 months', status: 'Active', stipend: '₹12,000' },
  { id: 'INT-3', student: 'Sana Qureshi', company: 'PixelForge', mentor: 'Priya Nair', duration: '2 months', status: 'Active', stipend: '₹10,000' },
]

export const events = [
  { id: 'EVT-1', title: 'GenAI Industry Seminar', type: 'Seminar', date: '16 Jul 2026', registrations: 210, venue: 'Auditorium A', status: 'Upcoming' },
  { id: 'EVT-2', title: 'GST Hackathon 2026', type: 'Hackathon', date: '19 Jul 2026', registrations: 96, venue: 'Innovation Lab', status: 'Upcoming' },
  { id: 'EVT-3', title: 'UX Critique Workshop', type: 'Workshop', date: '05 Jul 2026', registrations: 48, venue: 'DES-101', status: 'Completed' },
]

/* ——— Comms & support ——— */
export const announcements = [
  { id: 'ANN-1', title: 'Odd semester fee deadline extended', target: 'Students', pinned: 'Yes', date: '12 Jul 2026', status: 'Published' },
  { id: 'ANN-2', title: 'Faculty meeting — Friday 4 PM', target: 'Faculty', pinned: 'No', date: '13 Jul 2026', status: 'Published' },
  { id: 'ANN-3', title: 'Transport route change — EC city', target: 'All', pinned: 'Yes', date: '14 Jul 2026', status: 'Published' },
]

export const messages = [
  { id: 'MSG-1', from: 'Riya Sen', channel: 'Internal', subject: 'Admission docs pending', status: 'Unread', date: '14 Jul 2026' },
  { id: 'MSG-2', from: 'System', channel: 'Email', subject: 'Fee reminder batch sent', status: 'Read', date: '13 Jul 2026' },
  { id: 'MSG-3', from: 'Broadcast', channel: 'WhatsApp', subject: 'Exam hall allotment', status: 'Sent', date: '12 Jul 2026' },
]

export const notifications = [
  { id: 'NOT-1', title: '42 admissions awaiting approval', type: 'Admission', status: 'Unread', time: '10 min ago' },
  { id: 'NOT-2', title: 'Payroll TDS file ready', type: 'Payroll', status: 'Unread', time: '1 hr ago' },
  { id: 'NOT-3', title: 'Library overdue: 14 books', type: 'Library', status: 'Read', time: 'Yesterday' },
]

export const tickets = [
  { id: 'HD-118', subject: 'LMS login issue — Batch FS-B3', priority: 'High', assignee: 'IT Support', status: 'Open', raisedBy: 'Arjun Menon', date: '14 Jul 2026' },
  { id: 'HD-117', subject: 'Projector not working LAB-201', priority: 'Medium', assignee: 'Facilities', status: 'In Progress', raisedBy: 'Joseph Thomas', date: '13 Jul 2026' },
  { id: 'HD-116', subject: 'Fee receipt not downloaded', priority: 'Low', assignee: 'Accounts', status: 'Resolved', raisedBy: 'Ananya Reddy', date: '11 Jul 2026' },
]

/* ——— System ——— */
export const reportsList = [
  { id: 'RPT-1', name: 'Admission funnel — Jul 2026', category: 'Admissions', generated: '14 Jul 2026', format: 'PDF', status: 'Ready' },
  { id: 'RPT-2', name: 'Fee collection summary', category: 'Fees', generated: '14 Jul 2026', format: 'Excel', status: 'Ready' },
  { id: 'RPT-3', name: 'Attendance exception list', category: 'Attendance', generated: '13 Jul 2026', format: 'CSV', status: 'Ready' },
  { id: 'RPT-4', name: 'Placement offer tracker', category: 'Placement', generated: '12 Jul 2026', format: 'PDF', status: 'Ready' },
]

export const downloads = [
  { id: 'DL-1', name: 'Marksheet pack — DS Mid-Sem', type: 'Marksheet', size: '12 MB', date: '12 Jul 2026' },
  { id: 'DL-2', name: 'Fee invoices — July', type: 'Invoices', size: '4.2 MB', date: '14 Jul 2026' },
  { id: 'DL-3', name: 'Student master export', type: 'Student Data', size: '860 KB', date: '14 Jul 2026' },
]

export const backups = [
  { id: 'BKP-1', type: 'Automatic', location: 'AWS S3', size: '2.4 GB', date: '14 Jul 2026 02:00', status: 'Success' },
  { id: 'BKP-2', type: 'Manual', location: 'Local + Cloud', size: '2.4 GB', date: '10 Jul 2026 18:30', status: 'Success' },
  { id: 'BKP-3', type: 'Automatic', location: 'AWS S3', size: '2.3 GB', date: '13 Jul 2026 02:00', status: 'Success' },
]

export const auditLogs = [
  { id: 'AUD-1', actor: 'master-admin', action: 'Approved admission ADM-9002', ip: '103.24.x.x', time: '14 Jul 2026 21:10' },
  { id: 'AUD-2', actor: 'accountant', action: 'Generated payroll Jul-2026', ip: '103.24.x.x', time: '14 Jul 2026 18:02' },
  { id: 'AUD-3', actor: 'faculty-arjun', action: 'Published assignment ASN-11', ip: '49.36.x.x', time: '14 Jul 2026 11:44' },
]

export const roles = [
  { id: 'ROLE-1', name: 'Master Admin', users: 2, permissions: 'Full access', status: 'System' },
  { id: 'ROLE-2', name: 'Admin', users: 5, permissions: 'Institute ops', status: 'Active' },
  { id: 'ROLE-3', name: 'Counsellor', users: 8, permissions: 'Admissions & leads', status: 'Active' },
  { id: 'ROLE-4', name: 'Faculty', users: 128, permissions: 'Teaching modules', status: 'Active' },
  { id: 'ROLE-5', name: 'Accountant', users: 4, permissions: 'Fees & payroll', status: 'Active' },
  { id: 'ROLE-6', name: 'Librarian', users: 2, permissions: 'Library', status: 'Active' },
  { id: 'ROLE-7', name: 'Student', users: 2104, permissions: 'Self portal', status: 'Active' },
  { id: 'ROLE-8', name: 'Parent', users: 1860, permissions: 'Ward view', status: 'Active' },
]

export const branches = [
  { id: 'BR-1', name: 'Bengaluru Main', students: 1480, faculty: 78, revenue: '₹38.2 L', status: 'Active' },
  { id: 'BR-2', name: 'Hyderabad Hub', students: 620, faculty: 32, revenue: '₹14.8 L', status: 'Active' },
  { id: 'BR-3', name: 'Pune Satellite', students: 386, faculty: 18, revenue: '₹9.4 L', status: 'Active' },
]

export const users = [
  { id: 'USR-1', name: 'Master Admin', email: 'admin@growskillstech.com', role: 'Master Admin', branch: 'All', status: 'Active', lastLogin: '14 Jul 2026 21:00' },
  { id: 'USR-2', name: 'Riya Sen', email: 'riya.sen@gst.edu', role: 'Counsellor', branch: 'Bengaluru Main', status: 'Active', lastLogin: '14 Jul 2026 19:20' },
  { id: 'USR-3', name: 'Meera Iyer', email: 'meera.iyer@gst.edu', role: 'Accountant', branch: 'Bengaluru Main', status: 'Active', lastLogin: '14 Jul 2026 18:05' },
  { id: 'USR-4', name: 'Arjun Menon', email: 'arjun.m@gst.edu', role: 'Faculty', branch: 'Bengaluru Main', status: 'Active', lastLogin: '14 Jul 2026 16:40' },
]

export const emailTemplates = [
  { id: 'EM-1', name: 'Admission Confirmation', trigger: 'Admission approved', status: 'Active' },
  { id: 'EM-2', name: 'Fee Reminder', trigger: 'Due in 3 days', status: 'Active' },
  { id: 'EM-3', name: 'Exam Reminder', trigger: 'Exam −1 day', status: 'Active' },
  { id: 'EM-4', name: 'Certificate Issued', trigger: 'Certificate generated', status: 'Draft' },
]

export const smsTemplates = [
  { id: 'SMS-1', name: 'OTP Login', type: 'OTP', status: 'Active' },
  { id: 'SMS-2', name: 'Attendance alert', type: 'Attendance', status: 'Active' },
  { id: 'SMS-3', name: 'Fee due reminder', type: 'Fee', status: 'Active' },
]

export const whatsappTemplates = [
  { id: 'WA-1', name: 'Admission update', category: 'Admissions', status: 'Approved' },
  { id: 'WA-2', name: 'Fee reminder', category: 'Fees', status: 'Approved' },
  { id: 'WA-3', name: 'Exam hall allotment', category: 'Exams', status: 'Pending' },
]

export const apiKeys = [
  { id: 'API-1', name: 'Website Lead Webhook', key: 'gst_live_••••8f2a', created: '01 Jun 2026', status: 'Active' },
  { id: 'API-2', name: 'Payment Gateway Callback', key: 'gst_live_••••1c90', created: '12 Mar 2026', status: 'Active' },
  { id: 'API-3', name: 'LMS Sync (sandbox)', key: 'gst_test_••••aa11', created: '20 May 2026', status: 'Revoked' },
]

export const integrations = [
  { id: 'INTG-1', name: 'Razorpay', category: 'Payments', status: 'Connected' },
  { id: 'INTG-2', name: 'AWS S3', category: 'Storage', status: 'Connected' },
  { id: 'INTG-3', name: 'Cloudinary', category: 'Media', status: 'Connected' },
  { id: 'INTG-4', name: 'Google Drive', category: 'Storage', status: 'Pending' },
  { id: 'INTG-5', name: 'MSG91 SMS', category: 'SMS', status: 'Connected' },
]

export const securitySessions = [
  { id: 'SEC-1', device: 'Chrome · Windows', location: 'Bengaluru', ip: '103.24.x.x', lastActive: 'Now', status: 'Current' },
  { id: 'SEC-2', device: 'Safari · iPhone', location: 'Bengaluru', ip: '103.24.x.x', lastActive: '2 hrs ago', status: 'Active' },
  { id: 'SEC-3', device: 'Edge · Windows', location: 'Hyderabad', ip: '49.36.x.x', lastActive: '3 days ago', status: 'Revoked' },
]

export const cmsPages = [
  { id: 'CMS-1', page: 'Homepage', sections: 8, status: 'Published', updated: '10 Jul 2026' },
  { id: 'CMS-2', page: 'About', sections: 4, status: 'Published', updated: '02 Jul 2026' },
  { id: 'CMS-3', page: 'Courses', sections: 6, status: 'Published', updated: '08 Jul 2026' },
  { id: 'CMS-4', page: 'Gallery', sections: 2, status: 'Draft', updated: '05 Jul 2026' },
  { id: 'CMS-5', page: 'Testimonials', sections: 3, status: 'Published', updated: '01 Jul 2026' },
  { id: 'CMS-6', page: 'Blogs', sections: 12, status: 'Published', updated: '13 Jul 2026' },
  { id: 'CMS-7', page: 'Career Page', sections: 3, status: 'Published', updated: '28 Jun 2026' },
  { id: 'CMS-8', page: 'Contact Page', sections: 2, status: 'Published', updated: '15 Jun 2026' },
]

export const calendarItems = [
  { id: 'CAL-1', title: 'Academic calendar review', date: '15 Jul 2026', type: 'Internal' },
  { id: 'CAL-2', title: 'GenAI Seminar', date: '16 Jul 2026', type: 'Event' },
  { id: 'CAL-3', title: 'Fee deadline', date: '20 Jul 2026', type: 'Finance' },
  { id: 'CAL-4', title: 'FS Mid-Sem', date: '25 Jul 2026', type: 'Exam' },
]

export const analyticsSeries = {
  admissions: [
    { name: 'Jan', value: 42 },
    { name: 'Feb', value: 55 },
    { name: 'Mar', value: 68 },
    { name: 'Apr', value: 71 },
    { name: 'May', value: 48 },
    { name: 'Jun', value: 92 },
    { name: 'Jul', value: 186 },
  ],
  studentGrowth: [
    { name: '2022', value: 980 },
    { name: '2023', value: 1420 },
    { name: '2024', value: 1890 },
    { name: '2025', value: 2210 },
    { name: '2026', value: 2486 },
  ],
  revenueExpense: [
    { name: 'Jan', revenue: 38, expenses: 22 },
    { name: 'Feb', revenue: 41, expenses: 24 },
    { name: 'Mar', revenue: 49, expenses: 26 },
    { name: 'Apr', revenue: 52, expenses: 27 },
    { name: 'May', revenue: 44, expenses: 25 },
    { name: 'Jun', revenue: 58, expenses: 28 },
    { name: 'Jul', revenue: 62, expenses: 29 },
  ],
  attendance: [
    { name: 'Mon', value: 92 },
    { name: 'Tue', value: 90 },
    { name: 'Wed', value: 88 },
    { name: 'Thu', value: 91 },
    { name: 'Fri', value: 87 },
    { name: 'Sat', value: 84 },
  ],
  placements: [
    { name: 'IT Services', value: 120 },
    { name: 'Product', value: 78 },
    { name: 'Startup', value: 64 },
    { name: 'Consulting', value: 50 },
  ],
  facultyPerf: [
    { name: 'Sneha', value: 96 },
    { name: 'Arjun', value: 94 },
    { name: 'Neha', value: 92 },
    { name: 'Priya', value: 90 },
    { name: 'Rahul', value: 88 },
  ],
}
