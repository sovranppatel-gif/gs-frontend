// src/components/students/pages/ForgotPassword.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import logo from "../../../assets/logo.png";
import landingbg from "../../../assets/images/landing-bg.jpg";
import { persistStudentSession } from "../../../utils/studentAuth.js";
import { logoBox, logoGlow, primaryBtn } from "../../../utils/masterAdminTheme.js";
import {
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetStudentPassword,
} from "../../../services/studentAuthService.js";

const inputClass =
  "w-full rounded-xl border border-[#00A896]/30 bg-white/5 py-2.5 pl-10 pr-3 text-white placeholder-slate-400 focus:border-[#00A896] focus:outline-none focus:ring-2 focus:ring-[#FF5E14]/30";

export default function StudentForgotPassword() {
  const [step, setStep] = useState(1); // 1 email, 2 otp, 3 new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const isValidEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

  const handleSendOtp = async () => {
    setError("");
    setInfo("");

    if (!isValidEmail(email)) {
      setError("Enter a valid email address");
      return;
    }

    setOtpSending(true);
    try {
      const normalized = email.trim().toLowerCase();
      await sendForgotPasswordOtp(normalized);
      setEmail(normalized);
      setStep(2);
      setOtp("");
      setResendIn(60);
      setInfo(`OTP sent to ${normalized}`);
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setInfo("");

    if (!otp.trim() || otp.trim().length !== 6) {
      setError("Enter the 6-digit OTP");
      return;
    }

    setOtpVerifying(true);
    try {
      await verifyForgotPasswordOtp(email.trim().toLowerCase(), otp.trim());
      setStep(3);
      setInfo("OTP verified. Set your new password.");
    } catch (err) {
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const data = await resetStudentPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      persistStudentSession({ token: data.token, user: data.user });
      navigate("/students/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to reset password");
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
          <GraduationCap className="mr-1 h-3.5 w-3.5 text-[#FF5E14]" /> Reset Password
        </span>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Forgot{" "}
          <span className="bg-gradient-to-r from-[#FF5E14] via-[#FF8800] to-[#00A896] bg-clip-text text-transparent">
            Password
          </span>
        </h1>
        <p className="mt-1 text-sm text-slate-300">
          {step === 1 && "Enter your email to receive an OTP"}
          {step === 2 && "Enter the OTP sent to your email"}
          {step === 3 && "Create a new password and continue to dashboard"}
        </p>

        <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-slate-300">
          {[1, 2, 3].map((n) => (
            <React.Fragment key={n}>
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full border ${
                  step >= n
                    ? "border-[#00A896] bg-[#00A896]/25 text-[#00E5CC]"
                    : "border-white/20 bg-white/5 text-slate-400"
                }`}
              >
                {n}
              </span>
              {n < 3 ? <span className="h-px flex-1 bg-white/15" /> : null}
            </React.Fragment>
          ))}
        </div>

        <div className="group relative mt-6 flex h-full flex-col rounded-2xl border border-[#00A896]/30 bg-[#06151C]/75 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <form
            onSubmit={
              step === 3
                ? handleResetPassword
                : (e) => {
                    e.preventDefault();
                    if (step === 1) handleSendOtp();
                    else if (step === 2) handleVerifyOtp();
                  }
            }
            className="grid gap-3"
            noValidate
          >
            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-none text-red-300" />
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}
            {!error && info && (
              <div className="flex items-start gap-2 rounded-xl border border-[#00A896]/30 bg-[#00A896]/10 p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-[#00E5CC]" />
                <p className="text-xs text-[#00E5CC]">{info}</p>
              </div>
            )}

            {step === 1 && (
              <>
                <label className="mt-2 text-xs font-medium text-slate-200" htmlFor="forgot-email">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF5E14]" />
                  <input
                    id="forgot-email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@growskillstech.com"
                    autoComplete="username"
                    required
                    className={inputClass}
                  />
                </div>

                <button
                  type="submit"
                  disabled={otpSending}
                  className={`mt-4 w-full justify-center ${primaryBtn} disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {otpSending ? "Sending OTP..." : "Send OTP"}
                  {!otpSending ? <ArrowRight size={14} /> : null}
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <label className="mt-2 text-xs font-medium text-slate-200" htmlFor="forgot-otp">
                  Enter OTP
                </label>
                <div className="relative">
                  <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF5E14]" />
                  <input
                    id="forgot-otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="6-digit OTP"
                    autoComplete="one-time-code"
                    required
                    className={inputClass}
                  />
                </div>

                <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
                  <span>Sent to {email}</span>
                  <button
                    type="button"
                    disabled={resendIn > 0 || otpSending}
                    onClick={handleSendOtp}
                    className="font-semibold text-[#00E5CC] hover:text-[#FF5E14] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend OTP"}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={otpVerifying}
                  className={`mt-4 w-full justify-center ${primaryBtn} disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {otpVerifying ? "Verifying..." : "Verify OTP"}
                  {!otpVerifying ? <ArrowRight size={14} /> : null}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setOtp("");
                    setError("");
                    setInfo("");
                  }}
                  className="mt-1 text-center text-[11px] font-semibold text-slate-400 hover:text-white"
                >
                  Change email
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <label className="mt-2 text-xs font-medium text-slate-200" htmlFor="forgot-password">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF5E14]" />
                  <input
                    id="forgot-password"
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

                <label className="mt-2 text-xs font-medium text-slate-200" htmlFor="forgot-confirm">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF5E14]" />
                  <input
                    id="forgot-confirm"
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

                <button
                  type="submit"
                  disabled={loading}
                  className={`mt-4 w-full justify-center ${primaryBtn} disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {loading ? "Updating..." : "Update Password & Login"}
                  {!loading ? <ArrowRight size={14} /> : null}
                </button>
              </>
            )}
          </form>

          <p className="mt-4 text-center text-[11px] text-slate-400">
            Remember your password?{" "}
            <Link to="/students" replace className="font-semibold text-[#00E5CC] hover:text-[#FF5E14]">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
