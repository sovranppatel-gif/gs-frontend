// src/components/master-admin/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import logo from "../../../assets/logo.png";
import landingbg from "../../../assets/images/landing-bg.jpg";
import { API_URL } from "../../../utils/api.js";
import { persistMasterAdminSession } from "../../../utils/masterAdminAuth.js";
import { logoBox, logoGlow, primaryBtn } from "../../../utils/masterAdminTheme.js";

export default function MasterAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/master-admin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success || !data.token) {
        setError(data.message || "Invalid email or password");
        return;
      }

      persistMasterAdminSession({ token: data.token, user: data.user });
      navigate("/master-admin/dashboard", { replace: true });
    } catch {
      setError("Unable to reach server. Is the API running on port 3000?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden py-16 text-slate-100 md:py-24">
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
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#FF7A00]">Master Admin</p>
          </div>
        </div>

        <span className="inline-flex items-center rounded-full border border-[#00A896]/35 bg-[#06151C]/60 px-3 py-1 text-xs font-semibold tracking-wide text-[#00E5CC] backdrop-blur-md">
          <Shield className="mr-1 h-3.5 w-3.5 text-[#FF5E14]" /> Master Admin Access
        </span>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Secure{" "}
          <span className="bg-gradient-to-r from-[#FF5E14] via-[#FF8800] to-[#00A896] bg-clip-text text-transparent">
            Login
          </span>
        </h1>
        <p className="mt-1 text-sm text-slate-200">Access your admin dashboard</p>

        <div className="group relative mt-6 flex h-full flex-col rounded-lg border border-[#00A896]/30 bg-[#06151C]/75 p-6 text-slate-100 shadow-[0_18px_45px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="grid gap-3 text-slate-100" noValidate>
            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-none text-red-300" />
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}

            <label className="mt-2 text-xs font-medium text-slate-100" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF5E14]" />
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@growskillstech.com"
                autoComplete="username"
                required
                className="w-full rounded-lg border border-[#00A896]/30 bg-white/5 py-2.5 pl-10 pr-3 text-white placeholder:text-slate-400 focus:border-[#00A896] focus:outline-none focus:ring-2 focus:ring-[#FF5E14]/30"
              />
            </div>

            <div className="mt-1 flex items-center justify-between">
              <label className="text-xs font-medium text-slate-100" htmlFor="password">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF5E14]" />
              <input
                id="password"
                name="password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                className="w-full rounded-lg border border-[#00A896]/30 bg-white/5 py-2.5 pl-10 pr-10 text-white placeholder:text-slate-400 focus:border-[#00A896] focus:outline-none focus:ring-2 focus:ring-[#FF5E14]/30"
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-100 hover:bg-white/10"
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
              {loading ? "Logging in..." : "Login as Master Admin"}
              {!loading ? <ArrowRight size={14} /> : null}
            </button>
          </form>

          <p className="mt-4 text-center text-[11px] text-slate-300">
            Default dev credentials are set in <code className="text-slate-200">server/.env</code> (see{" "}
            <code className="text-slate-200">.env.example</code>).
          </p>
        </div>
      </div>
    </section>
  );
}
