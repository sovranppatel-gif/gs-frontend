// src/components/students/pages/Signup.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Phone,
  Tag,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Megaphone,
  ChevronDown,
} from "lucide-react";
import logo from "../../../assets/logo.png";
import landingbg from "../../../assets/images/landing-bg.jpg";
import { persistStudentSession } from "../../../utils/studentAuth.js";
import { logoBox, logoGlow, primaryBtn } from "../../../utils/masterAdminTheme.js";
import {
  sendEmailOtp,
  verifyEmailOtp,
  registerStudent,
} from "../../../services/studentAuthService.js";
import { HEARD_ABOUT_OPTIONS } from "../../../utils/heardAboutOptions.js";

const inputClass =
  "w-full rounded-xl border border-[#00A896]/30 bg-white/5 py-2.5 pl-10 pr-3 text-white placeholder-slate-400 focus:border-[#00A896] focus:outline-none focus:ring-2 focus:ring-[#FF5E14]/30";

export default function StudentSignup() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [heardAbout, setHeardAbout] = useState("");
  const [heardAboutOther, setHeardAboutOther] = useState("");
  const [heardAboutOpen, setHeardAboutOpen] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [otpInfo, setOtpInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const heardAboutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  useEffect(() => {
    if (!heardAboutOpen) return;
    const onPointerDown = (e) => {
      if (heardAboutRef.current && !heardAboutRef.current.contains(e.target)) {
        setHeardAboutOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setHeardAboutOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [heardAboutOpen]);

  const normalizeMobile = (value) => value.replace(/\D/g, "").slice(0, 10);
  const isValidMobile = (value) => /^[6-9]\d{9}$/.test(value);
  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

  const resetOtpState = () => {
    setOtpSent(false);
    setOtpVerified(false);
    setOtp("");
    setOtpInfo("");
  };

  const handleSendOtp = async () => {
    setError("");
    setOtpInfo("");

    if (!isValidEmail(email)) {
      setError("Enter a valid email address");
      return;
    }

    setOtpSending(true);
    try {
      await sendEmailOtp(email.trim().toLowerCase());
      setOtpSent(true);
      setOtpVerified(false);
      setOtp("");
      setResendIn(60);
      setOtpInfo(`OTP sent to ${email.trim().toLowerCase()}`);
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setOtpInfo("");

    if (!otp.trim() || otp.trim().length !== 6) {
      setError("Enter the 6-digit OTP");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Enter a valid email address");
      return;
    }

    setOtpVerifying(true);
    try {
      await verifyEmailOtp(email.trim().toLowerCase(), otp.trim());
      setOtpVerified(true);
      setOtpInfo("Email verified");
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill all required fields");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Enter a valid email address");
      return;
    }
    if (!isValidMobile(mobile)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    if (!otpVerified) {
      setError("Please verify your email with OTP");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!heardAbout) {
      setError("Please select how you heard about us");
      return;
    }
    if (heardAbout === "Others" && !heardAboutOther.trim()) {
      setError("Please tell us where you heard about us");
      return;
    }

    setLoading(true);
    try {
      const data = await registerStudent({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        mobile: mobile.trim(),
        heardAbout,
        heardAboutOther:
          heardAbout === "Others" ? heardAboutOther.trim() : undefined,
        promoCode: promoCode.trim() || undefined,
      });

      persistStudentSession({ token: data.token, user: data.user });
      navigate("/students/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden py-16 md:py-24">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <img
          src={landingbg}
          alt=""
          className="h-full w-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[#06151C]/65" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,168,150,0.18),transparent_55%),radial-gradient(circle_at_bottom,_rgba(255,94,20,0.16),transparent_55%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-md px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="relative shrink-0">
            <div className={logoGlow} />
            <div className={logoBox}>
              <img src={logo} alt="Grow Skills Tech" className="h-10 w-10 object-contain" />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-white">Grow Skills Tech</p>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#FF7A00]">Student Portal</p>
          </div>
        </div>

        <span className="inline-flex items-center rounded-full border border-[#00A896]/35 bg-[#06151C]/60 px-3 py-1 text-xs font-semibold tracking-wide text-[#00E5CC] backdrop-blur-md">
          <GraduationCap className="mr-1 h-3.5 w-3.5 text-[#FF5E14]" /> Create Student Account
        </span>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Join{" "}
          <span className="bg-gradient-to-r from-[#FF5E14] via-[#FF8800] to-[#00A896] bg-clip-text text-transparent">
            Now
          </span>
        </h1>
        <p className="mt-1 text-sm text-slate-300">Create your student account</p>

        <div className="group relative mt-6 flex h-full flex-col rounded-2xl border border-[#00A896]/30 bg-[#06151C]/75 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="grid gap-3" noValidate>
            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-none text-red-300" />
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}
            {!error && otpInfo && (
              <div className="flex items-start gap-2 rounded-xl border border-[#00A896]/30 bg-[#00A896]/10 p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-[#00E5CC]" />
                <p className="text-xs text-[#00E5CC]">{otpInfo}</p>
              </div>
            )}

            <label className="mt-2 text-xs font-medium text-slate-200" htmlFor="student-name">
              Full Name
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF5E14]" />
              <input
                id="student-name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                autoComplete="name"
                required
                className={inputClass}
              />
            </div>

            <label className="mt-1 text-xs font-medium text-slate-200" htmlFor="student-signup-email">
              Email
            </label>
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF5E14]" />
                <input
                  id="student-signup-email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    resetOtpState();
                  }}
                  placeholder="student@example.com"
                  autoComplete="email"
                  required
                  disabled={otpVerified}
                  className={`${inputClass} disabled:opacity-70`}
                />
              </div>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpSending || otpVerified || (otpSent && resendIn > 0)}
                className="shrink-0 rounded-xl border border-[#00A896]/40 bg-[#00A896]/15 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#00E5CC] transition hover:bg-[#00A896]/25 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {otpVerified
                  ? "Verified"
                  : otpSending
                    ? "Sending..."
                    : otpSent && resendIn > 0
                      ? `${resendIn}s`
                      : otpSent
                        ? "Resend"
                        : "Send OTP"}
              </button>
            </div>

            {otpSent && !otpVerified && (
              <>
                <label className="mt-1 text-xs font-medium text-slate-200" htmlFor="student-otp">
                  Enter OTP
                </label>
                <div className="flex gap-2">
                  <div className="relative min-w-0 flex-1">
                    <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF5E14]" />
                    <input
                      id="student-otp"
                      name="otp"
                      type="text"
                      inputMode="numeric"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="6-digit OTP"
                      autoComplete="one-time-code"
                      className={inputClass}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otpVerifying}
                    className="shrink-0 rounded-xl bg-gradient-to-r from-[#FF5E14] to-[#008C95] px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {otpVerifying ? "..." : "Verify"}
                  </button>
                </div>
              </>
            )}

            <label className="mt-1 text-xs font-medium text-slate-200" htmlFor="student-mobile">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF5E14]" />
              <input
                id="student-mobile"
                name="mobile"
                type="tel"
                inputMode="numeric"
                value={mobile}
                onChange={(e) => setMobile(normalizeMobile(e.target.value))}
                placeholder="10-digit mobile number"
                autoComplete="tel"
                required
                className={inputClass}
              />
            </div>

            <label className="mt-1 text-xs font-medium text-slate-200" htmlFor="student-signup-password">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF5E14]" />
              <input
                id="student-signup-password"
                name="password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                className="w-full rounded-xl border border-[#00A896]/30 bg-white/5 py-2.5 pl-10 pr-10 text-white placeholder-slate-400 focus:border-[#00A896] focus:outline-none focus:ring-2 focus:ring-[#FF5E14]/30"
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-200 hover:bg-white/10"
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <label className="mt-1 text-xs font-medium text-slate-200" htmlFor="student-confirm-password">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF5E14]" />
              <input
                id="student-confirm-password"
                name="confirmPassword"
                type={showPass ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                required
                className={inputClass}
              />
            </div>

            <label className="mt-1 text-xs font-medium text-slate-200" htmlFor="student-heard-about">
              How did you hear about us?
            </label>
            <div className="relative" ref={heardAboutRef}>
              <input type="hidden" name="heardAbout" value={heardAbout} required />
              <Megaphone className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-[#FF5E14]" />
              <button
                id="student-heard-about"
                type="button"
                aria-haspopup="listbox"
                aria-expanded={heardAboutOpen}
                onClick={() => setHeardAboutOpen((open) => !open)}
                className={`flex w-full items-center rounded-xl border border-[#00A896]/30 bg-white/5 py-2.5 pl-10 pr-10 text-left focus:border-[#00A896] focus:outline-none focus:ring-2 focus:ring-[#FF5E14]/30 ${
                  heardAbout ? "text-white" : "text-slate-400"
                }`}
              >
                <span className="min-w-0 flex-1 truncate">
                  {heardAbout || "Select a source"}
                </span>
                <ChevronDown
                  className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-300 transition-transform ${
                    heardAboutOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {heardAboutOpen ? (
                <ul
                  role="listbox"
                  aria-labelledby="student-heard-about"
                  className="absolute z-20 mt-1 max-h-44 w-full overflow-y-auto overscroll-contain rounded-xl border border-[#00A896]/35 bg-[#06151C] py-1 shadow-[0_12px_30px_rgba(0,0,0,0.45)] [scrollbar-width:thin] [scrollbar-color:rgba(255,94,20,0.45)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#FF5E14]/40"
                >
                  {HEARD_ABOUT_OPTIONS.map((opt) => {
                    const selected = heardAbout === opt;
                    return (
                      <li key={opt} role="option" aria-selected={selected}>
                        <button
                          type="button"
                          onClick={() => {
                            setHeardAbout(opt);
                            if (opt !== "Others") setHeardAboutOther("");
                            setHeardAboutOpen(false);
                          }}
                          className={`flex w-full px-3 py-2 text-left text-sm transition ${
                            selected
                              ? "bg-[#00A896]/20 text-[#00E5CC]"
                              : "text-slate-200 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {opt}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>

            {heardAbout === "Others" ? (
              <>
                <label className="mt-1 text-xs font-medium text-slate-200" htmlFor="student-heard-about-other">
                  Please specify source
                </label>
                <div className="relative">
                  <Megaphone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF5E14]" />
                  <input
                    id="student-heard-about-other"
                    name="heardAboutOther"
                    type="text"
                    value={heardAboutOther}
                    onChange={(e) => setHeardAboutOther(e.target.value.slice(0, 200))}
                    placeholder="Write your source"
                    autoComplete="off"
                    required
                    className={inputClass}
                  />
                </div>
              </>
            ) : null}

            <label className="mt-1 text-xs font-medium text-slate-200" htmlFor="student-promo">
              Promo Code <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <div className="relative">
              <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF5E14]" />
              <input
                id="student-promo"
                name="promoCode"
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                placeholder="Enter promo code"
                autoComplete="off"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !otpVerified}
              className={`mt-4 w-full justify-center ${primaryBtn} disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {loading ? "Creating account..." : "Create Student Account"}
              {!loading ? <ArrowRight size={14} /> : null}
            </button>
          </form>

          <p className="mt-4 text-center text-[11px] text-slate-400">
            Already have an account?{" "}
            <Link to="/students" replace className="font-semibold text-[#00E5CC] hover:text-[#FF5E14]">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
