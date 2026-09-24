// src/components/partner/pages/Login.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Handshake,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import logo from "../../../assets/logo.png";
import landingbg from "../../../assets/images/landing-bg.jpg";
import { persistPartnerSession } from "../../../utils/partnerAuth.js";
import { logoBox, logoGlow, primaryBtn } from "../../../utils/masterAdminTheme.js";

export default function PartnerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    // Frontend-only: mock login (server later)
    persistPartnerSession({
      email: email.trim(),
      name: email.trim().split("@")[0] || "Partner",
    });
    navigate("/partner/dashboard", { replace: true });
    setLoading(false);
  };

  return (
    <section className="relative isolate flex min-h-[100dvh] items-center justify-center overflow-x-hidden py-8 sm:py-12 md:py-20">
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
        <div className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="relative shrink-0">
              <div className={logoGlow} />
              <div className={logoBox}>
                <img src={logo} alt="Grow Skills Tech" className="h-9 w-9 object-contain sm:h-10 sm:w-10" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold uppercase tracking-[0.1em] text-white sm:text-sm sm:tracking-[0.12em]">
                Grow Skills Tech
              </p>
              <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#FF7A00] sm:text-[11px] sm:tracking-[0.14em]">
                Partner Portal
              </p>
            </div>
          </div>
          <div className="min-w-0 sm:shrink-0 sm:text-right">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-xl md:text-2xl">
              Secure{" "}
              <span className="bg-gradient-to-r from-[#FF5E14] via-[#FF8800] to-[#00A896] bg-clip-text text-transparent">
                Login
              </span>
            </h1>
            <p className="mt-0.5 text-xs text-slate-300 sm:text-[13px]">Access your partner dashboard</p>
          </div>
        </div>

        <span className="inline-flex items-center rounded-full border border-[#00A896]/35 bg-[#06151C]/60 px-3 py-1 text-xs font-semibold tracking-wide text-[#00E5CC] backdrop-blur-md">
          <Handshake className="mr-1 h-3.5 w-3.5 text-[#FF5E14]" /> Partner Access
        </span>

        <div className="group relative mt-4 flex h-full flex-col rounded-2xl border border-[#00A896]/30 bg-[#06151C]/75 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:mt-6 sm:p-6">
          <form onSubmit={handleSubmit} className="grid gap-3" noValidate>
            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-none text-red-300" />
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}

            <label className="mt-1 text-xs font-medium text-slate-200 sm:mt-2" htmlFor="partner-email">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF5E14]" />
              <input
                id="partner-email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="partner@growskillstech.com"
                autoComplete="username"
                required
                className="w-full rounded-xl border border-[#00A896]/30 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-400 focus:border-[#00A896] focus:outline-none focus:ring-2 focus:ring-[#FF5E14]/30 sm:text-base"
              />
            </div>

            <div className="mt-1 flex items-center justify-between">
              <label className="text-xs font-medium text-slate-200" htmlFor="partner-password">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF5E14]" />
              <input
                id="partner-password"
                name="password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-[#00A896]/30 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-400 focus:border-[#00A896] focus:outline-none focus:ring-2 focus:ring-[#FF5E14]/30 sm:text-base"
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-200 hover:bg-white/10"
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-3 w-full justify-center sm:mt-4 ${primaryBtn} disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {loading ? "Logging in..." : "Login as Partner"}
              {!loading ? <ArrowRight size={14} /> : null}
            </button>
          </form>

          <p className="mt-4 text-center text-[11px] text-slate-400 sm:text-xs">
            Don&apos;t have an account?{" "}
            <Link to="/partner/signup" replace className="font-semibold text-[#00E5CC] hover:text-[#FF5E14]">
              Sign Up
            </Link>
          </p>
          <p className="mt-2 text-center text-[11px] text-slate-500">
            Frontend only — server auth coming soon.
          </p>
        </div>
      </div>
    </section>
  );
}
