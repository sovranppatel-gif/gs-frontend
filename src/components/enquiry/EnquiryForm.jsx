import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Briefcase, GraduationCap } from "lucide-react";
import { addEnquiry } from "../../services/enquiryService.js";
import { HEARD_ABOUT_OPTIONS } from "../../utils/heardAboutOptions.js";

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Outside India",
];

// 1. क्लाइंट्स के लिए सर्विसेज
const serviceTypes = [
  "Web Application & SaaS Development",
  "Mobile App Development (Android/iOS)",
  "Desktop Application Development",
  "IT Consulting & Tech Architecture",
  "Software Maintenance & Support",
  "Digital Solutions & UI/UX Branding",
  "Other Custom Requirement",
];

// 2. स्टूडेंट्स/ट्रेनिंग के लिए कोर्सेज
const trainingCourses = [
  "Full-Stack MERN Development (React, Node, MongoDB)",
  "Frontend Engineering (React.js / Next.js Pro)",
  "Backend Architecture & API Development",
  "Mobile App Development (React Native / Flutter)",
  "Python, Data Analytics & AI/ML Basics",
  "UI/UX Design & Figma Mastery",
  "Industrial Training / College Internship Program",
  "Custom Corporate / Batch Training",
];

// क्लाइंट प्रोजेक्ट बजट
const projectBudgets = [
  "Not Sure / Need Guidance",
  "Under ₹50,000",
  "₹50,000 – ₹2,00,000",
  "₹2,00,000 – ₹5,00,000",
  "₹5,00,000+ (Enterprise)",
];

// स्टूडेंट स्टेटस
const studentStatuses = [
  "College Student (Pursuing Degree)",
  "Fresh Graduate / Job Seeker",
  "Working Professional (Upskilling/Switch)",
  "Beginner / Self-Learner",
];

export { indianStates, serviceTypes, trainingCourses, projectBudgets, studentStatuses };

const emptyForm = {
  enquiryType: "client", // 'client' or 'student'
  fullName: "",
  companyOrCollege: "",
  workEmail: "",
  mobile: "",
  city: "",
  state: "",
  // Client Specific Fields
  serviceRequested: "",
  projectBudget: "",
  projectDetails: "",
  // Student Specific Fields
  courseRequested: "",
  studentStatus: "",
  trainingGoals: "",
  heardAbout: "",
  heardAboutOther: "",
  allowUpdates: true,
};

export default function EnquiryForm({ source = "home" }) {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState({ type: "idle", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const successToastTimerRef = useRef(null);

  const inputBase =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-3 sm:py-2.5 text-base sm:text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FF5E14]/40 focus:border-[#FF5E14] transition touch-manipulation";
  const labelBase =
    "text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] sm:tracking-[0.2em] text-slate-500 mb-1 flex items-center justify-between";

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  useEffect(() => {
    return () => {
      if (successToastTimerRef.current) {
        clearTimeout(successToastTimerRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!form.fullName.trim() || !form.workEmail.trim() || !form.mobile.trim()) {
      setStatus({ type: "error", message: "Please enter your Name, Email, and Mobile number." });
      return;
    }

    // Conditional Validation
    if (form.enquiryType === "client" && !form.serviceRequested) {
      setStatus({ type: "error", message: "Please select the IT service you require." });
      return;
    }
    if (form.enquiryType === "student" && !form.courseRequested) {
      setStatus({ type: "error", message: "Please select the training course you are interested in." });
      return;
    }
    if (!form.heardAbout) {
      setStatus({ type: "error", message: "Please select how you heard about us." });
      return;
    }
    if (form.heardAbout === "Others" && !form.heardAboutOther.trim()) {
      setStatus({ type: "error", message: "Please tell us where you heard about us." });
      return;
    }

    try {
      setSubmitting(true);
      await addEnquiry({
        source,
        ...form,
        heardAboutOther:
          form.heardAbout === "Others" ? form.heardAboutOther.trim() : "",
      });
      setForm(emptyForm);
      setStatus({
        type: "success",
        message: "Thank you! Your enquiry has been submitted. Our team will get in touch with you soon.",
      });
      if (successToastTimerRef.current) {
        clearTimeout(successToastTimerRef.current);
      }
      setShowSuccessToast(true);
      successToastTimerRef.current = setTimeout(() => {
        setShowSuccessToast(false);
      }, 3500);
    } catch (err) {
      setStatus({
        type: "error",
        message: err?.message || "Unable to submit right now. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative z-10">
      <div
        className="pointer-events-none absolute -inset-0.5 bg-gradient-to-br from-[#06151C]/65 via-[#008C95]/30 to-[#FF5E14]/30 opacity-80 blur-3xl -z-10"
        aria-hidden
      />

      <div className="relative isolate rounded-2xl border border-slate-200/90 bg-white backdrop-blur-2xl shadow-[0_24px_80px_rgba(6,21,28,0.18)] overflow-hidden pointer-events-auto">
        <div
          className="pointer-events-none absolute -top-20 -right-10 h-40 w-40 rounded-full bg-[#FF5E14]/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-10 h-40 w-40 rounded-full bg-[#008C95]/15 blur-3xl"
          aria-hidden
        />

        {/* Form Header */}
        <div className="relative px-5 sm:px-6 py-5 sm:py-6 border-b border-slate-100 flex flex-col gap-1 bg-slate-50/60">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.26em] text-[#FF5E14]">
            Build Skills • Build Solutions
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Connect With Grow Skills Tech
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
            Looking for professional IT development services or practical software training? Fill out the details below.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="relative z-10 px-5 sm:px-6 pb-6 pt-5 space-y-5 text-xs sm:text-[13px] touch-manipulation"
        >
          {/* Section 1: Contact Information */}
          <div className="space-y-3.5">
            <h3 className="text-[10px] font-bold uppercase text-[#008C95] tracking-widest border-b border-slate-100 pb-1">
              01. Basic Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelBase}>Full Name *</label>
                <input
                  type="text"
                  className={inputBase}
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={(e) => setField("fullName", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={labelBase}>
                  {form.enquiryType === "client" ? "Company / Startup Name" : "College / University Name"}
                </label>
                <input
                  type="text"
                  className={inputBase}
                  placeholder={form.enquiryType === "client" ? "Business Name" : "Your College or Current Company"}
                  value={form.companyOrCollege}
                  onChange={(e) => setField("companyOrCollege", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelBase}>Email Address *</label>
                <input
                  type="email"
                  className={inputBase}
                  placeholder="name@example.com"
                  value={form.workEmail}
                  onChange={(e) => setField("workEmail", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={labelBase}>Mobile / WhatsApp *</label>
                <input
                  type="tel"
                  className={inputBase}
                  placeholder="+91 XXXXX XXXXX"
                  value={form.mobile}
                  onChange={(e) => setField("mobile", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelBase}>City</label>
                <input
                  type="text"
                  className={inputBase}
                  placeholder="Your City"
                  value={form.city}
                  onChange={(e) => setField("city", e.target.value)}
                />
              </div>
              <div>
                <label className={labelBase}>State</label>
                <select
                  className={inputBase}
                  value={form.state}
                  onChange={(e) => setField("state", e.target.value)}
                >
                  <option value="" disabled>
                    Select state
                  </option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Enquiry Type & Requirements */}
          <div className="space-y-4 pt-2">
            <h3 className="text-[10px] font-bold uppercase text-[#008C95] tracking-widest border-b border-slate-100 pb-1">
              02. What Are You Looking For?
            </h3>

            {/* Toggle Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => setField("enquiryType", "client")}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-bold text-xs transition duration-200 ${
                  form.enquiryType === "client"
                    ? "bg-gradient-to-r from-[#FF5E14] to-[#FF7A00] text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Briefcase size={15} />
                <span>Project / IT Service</span>
              </button>

              <button
                type="button"
                onClick={() => setField("enquiryType", "student")}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-bold text-xs transition duration-200 ${
                  form.enquiryType === "student"
                    ? "bg-gradient-to-r from-[#008C95] to-[#00A896] text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <GraduationCap size={16} />
                <span>IT Training / Course</span>
              </button>
            </div>

            {/* CONDITIONAL OPTION 1: CLIENT ENQUIRY */}
            {form.enquiryType === "client" && (
              <div className="space-y-3.5 animate-fadeIn">
                <div>
                  <label className={labelBase}>Service Required *</label>
                  <select
                    className={inputBase}
                    value={form.serviceRequested}
                    onChange={(e) => setField("serviceRequested", e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select primary service needed
                    </option>
                    {serviceTypes.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelBase}>Estimated Budget Range</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {projectBudgets.map((budget) => (
                      <label
                        key={budget}
                        className="flex items-center gap-2 py-1 sm:py-0.5 text-xs text-slate-600 cursor-pointer touch-manipulation"
                      >
                        <input
                          type="radio"
                          name="projectBudget"
                          className="h-4 w-4 shrink-0 text-[#FF5E14] focus:ring-[#FF5E14]/20"
                          checked={form.projectBudget === budget}
                          onChange={() => setField("projectBudget", budget)}
                        />
                        {budget}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelBase}>Project Summary / Key Requirements</label>
                  <textarea
                    rows={3}
                    className={`${inputBase} resize-none`}
                    placeholder="Briefly describe your software application, specific features required, or consulting scope..."
                    value={form.projectDetails}
                    onChange={(e) => setField("projectDetails", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* CONDITIONAL OPTION 2: STUDENT / TRAINING ENQUIRY */}
            {form.enquiryType === "student" && (
              <div className="space-y-3.5 animate-fadeIn">
                <div>
                  <label className={labelBase}>Course / Training Program *</label>
                  <select
                    className={inputBase}
                    value={form.courseRequested}
                    onChange={(e) => setField("courseRequested", e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select the training course
                    </option>
                    {trainingCourses.map((course) => (
                      <option key={course} value={course}>
                        {course}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelBase}>Current Profile Status</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {studentStatuses.map((status) => (
                      <label
                        key={status}
                        className="flex items-center gap-2 py-1 sm:py-0.5 text-xs text-slate-600 cursor-pointer touch-manipulation"
                      >
                        <input
                          type="radio"
                          name="studentStatus"
                          className="h-4 w-4 shrink-0 text-[#008C95] focus:ring-[#008C95]/20"
                          checked={form.studentStatus === status}
                          onChange={() => setField("studentStatus", status)}
                        />
                        {status}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelBase}>Career Goal / Motivation</label>
                  <textarea
                    rows={3}
                    className={`${inputBase} resize-none`}
                    placeholder="What are your career goals? (e.g., Looking for placement, preparing for industrial internship, upskilling...)"
                    value={form.trainingGoals}
                    onChange={(e) => setField("trainingGoals", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Consent & Submit */}
          <div className="space-y-4 pt-3 border-t border-slate-100">
            <div>
              <label className={labelBase} htmlFor="enquiry-heard-about">
                How did you hear about us?
              </label>
              <select
                id="enquiry-heard-about"
                className={inputBase}
                value={form.heardAbout}
                onChange={(e) => {
                  const value = e.target.value;
                  setForm((f) => ({
                    ...f,
                    heardAbout: value,
                    heardAboutOther: value === "Others" ? f.heardAboutOther : "",
                  }));
                }}
                required
              >
                <option value="">Select a source</option>
                {HEARD_ABOUT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {form.heardAbout === "Others" ? (
              <div>
                <label className={labelBase} htmlFor="enquiry-heard-about-other">
                  Please specify source
                </label>
                <input
                  id="enquiry-heard-about-other"
                  type="text"
                  className={inputBase}
                  value={form.heardAboutOther}
                  onChange={(e) => setField("heardAboutOther", e.target.value.slice(0, 200))}
                  placeholder="Write your source"
                  required
                />
              </div>
            ) : null}

            <label className="flex items-start gap-3 text-xs text-slate-600 cursor-pointer touch-manipulation py-0.5">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-[#FF5E14] focus:ring-[#FF5E14]/20"
                checked={form.allowUpdates}
                onChange={(e) => setField("allowUpdates", e.target.checked)}
              />
              <span>I consent to receiving response updates and details via WhatsApp/Email.</span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-lg transition duration-300 hover:-translate-y-0.5 ${
                form.enquiryType === "client"
                  ? "bg-gradient-to-r from-[#FF5E14] via-[#FF7A00] to-[#008C95] shadow-[0_15px_35px_rgba(255,94,20,0.35)]"
                  : "bg-gradient-to-r from-[#008C95] via-[#00A896] to-[#FF5E14] shadow-[0_15px_35px_rgba(0,140,149,0.35)]"
              }`}
            >
              {submitting
                ? "Submitting..."
                : form.enquiryType === "client"
                ? "Request Consultation"
                : "Submit Course Enquiry"}
              <ArrowRight size={16} />
            </button>

            {status.message && (
              <div
                role="status"
                className={`rounded-lg px-3.5 py-2.5 text-xs font-medium ${
                  status.type === "success"
                    ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                    : "bg-amber-50 text-amber-900 border border-amber-200"
                }`}
              >
                {status.message}
              </div>
            )}
          </div>
        </form>
      </div>

      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-[70] flex items-center gap-2 max-w-sm rounded-xl border border-emerald-200 bg-white px-4 py-3.5 text-xs font-bold text-emerald-800 shadow-[0_12px_35px_rgba(0,0,0,0.15)] animate-bounce">
          <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
          <span>Form Submitted Successfully! Our team will contact you soon.</span>
        </div>
      )}
    </div>
  );
}