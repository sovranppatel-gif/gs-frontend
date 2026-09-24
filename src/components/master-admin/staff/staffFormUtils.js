export function staffProfilePath(id) {
  return `/master-admin/staff/${encodeURIComponent(id)}`
}

export function staffAddPath() {
  return '/master-admin/staff/new'
}

export const STAFF_GENDERS = ['Male', 'Female', 'Other']

export const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-[#00A896] focus:ring-2 focus:ring-[#00A896]/15'

export function photoSrc(photo, apiUrl = '') {
  const value = String(photo || '').trim()
  if (!value) return ''
  if (/^(data:|https?:|blob:)/i.test(value)) return value
  return `${apiUrl}${value}`
}

export function staffInitials(name) {
  return String(name || 'ST')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}

export function emptyStaffForm() {
  return {
    profilePhoto: '',
    firstName: '',
    middleName: '',
    lastName: '',
    parentName: '',
    dateOfBirth: '',
    gender: 'Male',
    bloodGroup: '',
    personalMobile: '',
    whatsapp: '',
    personalEmail: '',
    officialEmail: '',
    alternateContact: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    emergencyName: '',
    emergencyRelationship: '',
    emergencyPhone: '',
    emergencyAlternatePhone: '',
    departmentId: '',
    designationId: '',
    reportingManagerId: '',
    branch: '',
    joiningDate: new Date().toISOString().slice(0, 10),
    employmentType: 'Full Time',
    workMode: 'Office',
    probationPeriodMonths: '',
    probationEndDate: '',
    shift: '',
    weeklyWorkingDays: 6,
    monthlySalary: '',
    basic: '',
    hra: '',
    allowances: '',
    incentives: '',
    variablePay: '',
    deductions: '',
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifsc: '',
    bankBranch: '',
    loginEnabled: false,
    username: '',
    password: '',
    role: 'Staff',
    status: 'Active',
  }
}

function dateInputValue(value) {
  if (!value) return ''
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10)
}

export function staffToForm(entry) {
  const personal = entry?.personalDetails || {}
  const emergency = entry?.emergencyContact || {}
  const employment = entry?.employmentDetails || {}
  const account = entry?.accountDetails || {}
  const salary = entry?.salaryDetails || {}
  const bank = entry?.bankDetails || {}
  return {
    ...emptyStaffForm(),
    profilePhoto: personal.profilePhoto || '',
    firstName: personal.firstName || '',
    middleName: personal.middleName || '',
    lastName: personal.lastName || '',
    parentName: personal.parentName || '',
    dateOfBirth: dateInputValue(personal.dateOfBirth),
    gender: personal.gender || 'Male',
    bloodGroup: personal.bloodGroup || '',
    personalMobile: personal.personalMobile || '',
    whatsapp: personal.whatsapp || '',
    personalEmail: personal.personalEmail || '',
    officialEmail: personal.officialEmail || '',
    alternateContact: personal.alternateContact || '',
    address: personal.address || '',
    city: personal.city || '',
    state: personal.state || '',
    pincode: personal.pincode || '',
    emergencyName: emergency.name || '',
    emergencyRelationship: emergency.relationship || '',
    emergencyPhone: emergency.phone || '',
    emergencyAlternatePhone: emergency.alternatePhone || '',
    departmentId: employment.departmentId || '',
    designationId: employment.designationId || '',
    reportingManagerId: employment.reportingManagerId || '',
    branch: employment.branch || '',
    joiningDate: dateInputValue(employment.joiningDate) || new Date().toISOString().slice(0, 10),
    employmentType: employment.employmentType || 'Full Time',
    workMode: employment.workMode || 'Office',
    probationPeriodMonths: employment.probationPeriodMonths ?? '',
    probationEndDate: dateInputValue(employment.probationEndDate),
    shift: employment.shift || '',
    weeklyWorkingDays: employment.weeklyWorkingDays ?? 6,
    monthlySalary: salary.monthlySalary ?? '',
    basic: salary.basic ?? '',
    hra: salary.hra ?? '',
    allowances: salary.allowances ?? '',
    incentives: salary.incentives ?? '',
    variablePay: salary.variablePay ?? '',
    deductions: salary.deductions ?? '',
    bankName: bank.bankName || '',
    accountHolderName: bank.accountHolderName || '',
    // Masked account number (e.g. "XXXXXX9012") from the server is never
    // re-submitted as-is — leaving this blank on edit means "no change";
    // the admin must retype the full number to actually change it.
    accountNumber: '',
    ifsc: bank.ifsc || '',
    bankBranch: bank.branch || '',
    loginEnabled: Boolean(account.loginEnabled),
    username: account.username || '',
    password: '',
    role: account.role || 'Staff',
    status: entry?.status || 'Active',
  }
}

export function formToPayload(form) {
  return {
    personalDetails: {
      firstName: form.firstName,
      middleName: form.middleName,
      lastName: form.lastName,
      profilePhoto: form.profilePhoto,
      parentName: form.parentName,
      dateOfBirth: form.dateOfBirth || null,
      gender: form.gender,
      bloodGroup: form.bloodGroup,
      personalMobile: form.personalMobile,
      whatsapp: form.whatsapp,
      personalEmail: form.personalEmail,
      officialEmail: form.officialEmail,
      alternateContact: form.alternateContact,
      address: form.address,
      city: form.city,
      state: form.state,
      pincode: form.pincode,
    },
    emergencyContact: {
      name: form.emergencyName,
      relationship: form.emergencyRelationship,
      phone: form.emergencyPhone,
      alternatePhone: form.emergencyAlternatePhone,
    },
    employmentDetails: {
      departmentId: form.departmentId,
      designationId: form.designationId,
      reportingManagerId: form.reportingManagerId,
      branch: form.branch,
      joiningDate: form.joiningDate || null,
      employmentType: form.employmentType,
      workMode: form.workMode,
      probationPeriodMonths: Number(form.probationPeriodMonths) || 0,
      probationEndDate: form.probationEndDate || null,
      shift: form.shift,
      weeklyWorkingDays: Number(form.weeklyWorkingDays) || 0,
    },
    accountDetails: {
      loginEnabled: Boolean(form.loginEnabled),
      username: form.username || form.officialEmail,
      role: form.role,
      permissions: [],
    },
    password: form.password,
    salaryDetails: {
      monthlySalary: Number(form.monthlySalary) || 0,
      basic: Number(form.basic) || 0,
      hra: Number(form.hra) || 0,
      allowances: Number(form.allowances) || 0,
      incentives: Number(form.incentives) || 0,
      variablePay: Number(form.variablePay) || 0,
      deductions: Number(form.deductions) || 0,
    },
    bankDetails: {
      bankName: form.bankName,
      accountHolderName: form.accountHolderName,
      // The server only ever sends back a masked account number
      // ("XXXXXX9012") — staffToForm() deliberately leaves this field blank
      // rather than round-tripping that mask, since resubmitting it would
      // overwrite the real number with the literal masked string. A blank
      // value here means "not retyped"; staff.service.js's updateStaff()
      // treats blank as "leave the stored number unchanged" for that reason.
      accountNumber: form.accountNumber,
      ifsc: form.ifsc,
      branch: form.bankBranch,
    },
    status: form.status,
  }
}
