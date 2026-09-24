// src/components/students/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import logo from "../../../assets/logo.png";
import landingbg from "../../../assets/images/landing-bg.jpg";
import { persistStudentSession } from "../../../utils/studentAuth.js";
import { logoBox, logoGlow, primaryBtn } from "../../../utils/masterAdminTheme.js";
import { loginStudent } from "../../../services/studentAuthService.js";

export default function StudentLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const data = await loginStudent({
        email: email.trim(),
        password,
      });
      persistStudentSession({ token: data.token, user: data.user });
      navigate("/students/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
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

        <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl border border-[#00A896]/30 bg-[#06151C]/60 p-1">
          <span className="rounded-lg bg-[#00A896]/25 px-3 py-2 text-center text-xs font-semibold text-[#00E5CC]">
            Student Login
          </span>
          <Link
            to="/faculty"
            replace
            className="rounded-lg px-3 py-2 text-center text-xs font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            Faculty Login
          </Link>
        </div>

        <span className="inline-flex items-center rounded-full border border-[#00A896]/35 bg-[#06151C]/60 px-3 py-1 text-xs font-semibold tracking-wide text-[#00E5CC] backdrop-blur-md">
          <GraduationCap className="mr-1 h-3.5 w-3.5 text-[#FF5E14]" /> Student Access
        </span>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Secure{" "}
          <span className="bg-gradient-to-r from-[#FF5E14] via-[#FF8800] to-[#00A896] bg-clip-text text-transparent">
            Login
          </span>
        </h1>
        <p className="mt-1 text-sm text-slate-300">Access your student dashboard</p>

        <div className="group relative mt-6 flex h-full flex-col rounded-2xl border border-[#00A896]/30 bg-[#06151C]/75 p-6 shadow-[0_18px_45px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="grid gap-3" noValidate>
            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-none text-red-300" />
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}

            <label className="mt-2 text-xs font-medium text-slate-200" htmlFor="student-email">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF5E14]" />
              <input
                id="student-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@growskillstech.com"
                autoComplete="username"
                required
                className="w-full rounded-xl border border-[#00A896]/30 bg-white/5 py-2.5 pl-10 pr-3 text-white placeholder-slate-400 focus:border-[#00A896] focus:outline-none focus:ring-2 focus:ring-[#FF5E14]/30"
              />
            </div>

            <div className="mt-1 flex items-center justify-between">
              <label className="text-xs font-medium text-slate-200" htmlFor="student-password">
                Password
              </label>
              <Link
                to="/students/forgot-password"
                className="text-[11px] font-semibold text-[#00E5CC] hover:text-[#FF5E14]"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF5E14]" />
              <input
                id="student-password"
                name="password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
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

            <button
              type="submit"
              disabled={loading}
              className={`mt-4 w-full justify-center ${primaryBtn} disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {loading ? "Connecting..." : "Login as Student"}
              {!loading ? <ArrowRight size={14} /> : null}
            </button>
          </form>

          <p className="mt-4 text-center text-[11px] text-slate-400">
            Don&apos;t have an account?{" "}
            <Link to="/students/signup" replace className="font-semibold text-[#00E5CC] hover:text-[#FF5E14]">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
