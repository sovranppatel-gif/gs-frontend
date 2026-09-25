import { useEffect, useRef, useState } from "react";
import { X, ChevronDown, Search, Loader2 } from "lucide-react";
import {
  submitWorkshopRegistration,
  getActiveColleges,
} from "../../services/workshopService";
import WorkshopSuccess from "./WorkshopSuccess";

const COURSES = ["BCA", "MCA", "B.Tech", "M.Tech", "B.Sc", "M.Sc", "B.Com", "MBA", "BA", "MA", "MCOM", "Other"];

const SEMESTER_YEARS = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester",
  "1st Year",
  "2nd Year",
  "3rd Year",
  "Final Year",
  "PASSOUT",
];

const CODING_EXPERIENCE = ["Beginner", "Intermediate", "Advanced", "Professional"];

const NOT_LISTED = "__NOT_LISTED__";

const emptyForm = {
  fullName: "",
  mobile: "",
  email: "",
  universityId: "",
  collegeName: "",
  course: "",
  semesterYear: "",
  codingExperience: "",
};

export default function WorkshopRegistrationForm({ referralCode, referredCollegeName, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [colleges, setColleges] = useState([]);
  const [collegesLoading, setCollegesLoading] = useState(true);
  const [collegeSearch, setCollegeSearch] = useState("");
  const [collegeDropdownOpen, setCollegeDropdownOpen] = useState(false);
  const [selectedCollegeLabel, setSelectedCollegeLabel] = useState("");
  const [showOtherCollegeInput, setShowOtherCollegeInput] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { entry, isDuplicate }
  const collegeDropdownRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    getActiveColleges()
      .then((rows) => {
        if (!cancelled) setColleges(rows);
      })
      .catch(() => {
        if (!cancelled) setColleges([]);
      })
      .finally(() => {
        if (!cancelled) setCollegesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!referralCode || !referredCollegeName) return;
    const matchedCollege = colleges.find(
      (college) => college.name.trim().toLowerCase() === referredCollegeName.trim().toLowerCase()
    );
    if (matchedCollege) {
      setForm((current) => ({ ...current, universityId: matchedCollege._id, collegeName: matchedCollege.name }));
      setSelectedCollegeLabel(matchedCollege.name);
      setShowOtherCollegeInput(false);
    } else {
      setForm((current) => ({ ...current, universityId: "", collegeName: referredCollegeName }));
      setSelectedCollegeLabel(referredCollegeName);
      setShowOtherCollegeInput(true);
    }
  }, [colleges, referralCode, referredCollegeName]);

  useEffect(() => {
    if (!collegeDropdownOpen) return;
    const onPointerDown = (e) => {
      if (
        collegeDropdownRef.current &&
        !collegeDropdownRef.current.contains(e.target)
      ) {
        setCollegeDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [collegeDropdownOpen]);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const filteredColleges = colleges.filter((c) =>
    c.name.toLowerCase().includes(collegeSearch.toLowerCase())
  );

  const handleSelectCollege = (college) => {
    if (college === NOT_LISTED) {
      setForm((f) => ({ ...f, universityId: "", collegeName: "" }));
      setSelectedCollegeLabel("College not listed");
      setShowOtherCollegeInput(true);
    } else {
      setForm((f) => ({ ...f, universityId: college._id, collegeName: college.name }));
      setSelectedCollegeLabel(college.name);
      setShowOtherCollegeInput(false);
    }
    setCollegeDropdownOpen(false);
    setCollegeSearch("");
  };

  const validateIndianMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile.replace(/\D/g, ""));
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setError("");

    if (!form.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!validateIndianMobile(form.mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!validateEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!form.universityId && !form.collegeName.trim()) {
      setError("Please select your college or enter its name.");
      return;
    }
    if (!form.course) {
      setError("Please select your course.");
      return;
    }
    if (!form.semesterYear) {
      setError("Please select your semester/year.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...form,
        mobile: form.mobile.replace(/\D/g, "").slice(-10),
        email: form.email.trim().toLowerCase(),
        referralCode: referralCode || null,
      };
      const res = await submitWorkshopRegistration(payload);
      setResult({ entry: res.entry, isDuplicate: res.isDuplicate });
    } catch (err) {
      setError(err?.message || "Unable to submit right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <WorkshopSuccess
        registration={result.entry}
        isDuplicate={result.isDuplicate}
        onClose={onClose}
      />
    );
  }

  const inputBase =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A896]/40 focus:border-[#00A896] transition";
  const labelBase =
    "text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 mb-1.5 block";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-3 py-3 backdrop-blur-sm sm:items-center sm:px-4 sm:py-6">
      <div className="relative my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100dvh-3rem)]">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-slate-100 p-2 transition hover:bg-slate-200 sm:right-4 sm:top-4"
          aria-label="Close"
        >
          <X size={18} className="text-slate-600" />
        </button>

        <div className="border-b border-slate-100 px-5 pb-4 pt-7 sm:px-8 sm:pt-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#FF5E14] mb-1">
            Skills Enhance Workshop
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Register Now
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Fill in your details below to secure your spot.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5 sm:px-8 sm:py-6">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelBase}>Mobile Number *</label>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                className={inputBase}
                placeholder="Enter your 10-digit mobile number"
                value={form.mobile}
                onChange={(e) => setField("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                required
              />
            </div>
            <div>
              <label className={labelBase}>Email ID *</label>
              <input
                type="email"
                className={inputBase}
                placeholder="Enter your email address"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                required
              />
            </div>
          </div>

          {/* College Dropdown */}
          <div ref={collegeDropdownRef} className="relative">
            <label className={labelBase}>College / Institute *</label>
            <button
              type="button"
              onClick={() => {
                if (!referralCode) setCollegeDropdownOpen((o) => !o);
              }}
              disabled={Boolean(referralCode)}
              className={`${inputBase} flex items-center justify-between text-left disabled:cursor-not-allowed disabled:bg-slate-50`}
            >
              <span className={selectedCollegeLabel ? "text-slate-900" : "text-slate-400"}>
                {selectedCollegeLabel || "Select your college"}
              </span>
              <ChevronDown size={16} className="text-slate-400 shrink-0" />
            </button>

            {collegeDropdownOpen && (
              <div className="absolute z-20 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg max-h-60 overflow-hidden flex flex-col">
                <div className="p-2 border-b border-slate-100">
                  <div className="flex items-center gap-2 rounded-md bg-slate-50 px-2.5 py-2">
                    <Search size={14} className="text-slate-400 shrink-0" />
                    <input
                      autoFocus
                      type="text"
                      value={collegeSearch}
                      onChange={(e) => setCollegeSearch(e.target.value)}
                      placeholder="Search college..."
                      className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div className="overflow-y-auto">
                  {collegesLoading ? (
                    <div className="flex items-center gap-2 px-3 py-3 text-sm text-slate-500">
                      <Loader2 size={14} className="animate-spin" /> Loading colleges...
                    </div>
                  ) : (
                    <>
                      {filteredColleges.map((c) => (
                        <button
                          key={c._id}
                          type="button"
                          onClick={() => handleSelectCollege(c)}
                          className="w-full text-left px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
                        >
                          {c.name}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleSelectCollege(NOT_LISTED)}
                        className="w-full text-left px-3 py-2.5 text-sm font-semibold text-[#FF5E14] hover:bg-orange-50 transition border-t border-slate-100"
                      >
                        College not listed
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {showOtherCollegeInput && (
            <div>
              <label className={labelBase}>{referralCode ? "College Name *" : "Enter College Name *"}</label>
              <input
                type="text"
                className={inputBase}
                placeholder="Enter your college name"
                value={form.collegeName}
                onChange={(e) => setField("collegeName", e.target.value)}
                readOnly={Boolean(referralCode)}
                required
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelBase}>Course *</label>
              <select
                className={inputBase}
                value={form.course}
                onChange={(e) => setField("course", e.target.value)}
                required
              >
                <option value="" disabled>
                  Select course
                </option>
                {COURSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelBase}>Semester / Year *</label>
              <select
                className={inputBase}
                value={form.semesterYear}
                onChange={(e) => setField("semesterYear", e.target.value)}
                required
              >
                <option value="" disabled>
                  Select semester/year
                </option>
                {SEMESTER_YEARS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelBase}>Coding Experience</label>
            <select
              className={inputBase}
              value={form.codingExperience}
              onChange={(e) => setField("codingExperience", e.target.value)}
            >
              <option value="">Select level (optional)</option>
              {CODING_EXPERIENCE.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-gradient-to-r from-[#FF5E14] to-[#ff7a2d] hover:from-[#ff7a2d] hover:to-[#ff8c42] text-white font-bold py-3.5 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Submitting...
              </>
            ) : (
              "Submit Registration"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
