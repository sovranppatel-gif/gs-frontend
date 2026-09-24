// src/components/partner/PartnerDashboard.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Handshake, LogOut, Home } from "lucide-react";
import {
  clearPartnerSession,
  getPartnerSession,
} from "../../utils/partnerAuth.js";
import { logoBox, logoGlow, primaryBtn, secondaryBtn } from "../../utils/masterAdminTheme.js";
import logo from "../../assets/logo.png";

export default function PartnerDashboard() {
  const session = getPartnerSession();
  const navigate = useNavigate();

  const handleSignOut = () => {
    clearPartnerSession();
    navigate("/partner", { replace: true });
  };

  return (
    <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <div className={logoGlow} />
            <div className={logoBox}>
              <img src={logo} alt="Grow Skills Tech" className="h-10 w-10 object-contain" />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.12em] text-white">Grow Skills Tech</p>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#FF7A00]">Partner Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/" className={secondaryBtn}>
            <Home size={14} />
            Home
          </Link>
          <button type="button" onClick={handleSignOut} className={secondaryBtn}>
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-[#00A896]/30 bg-[#06151C]/75 p-8 shadow-[0_18px_45px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <span className="inline-flex items-center rounded-full border border-[#00A896]/35 bg-[#06151C]/60 px-3 py-1 text-xs font-semibold tracking-wide text-[#00E5CC]">
          <Handshake className="mr-1 h-3.5 w-3.5 text-[#FF5E14]" /> Welcome
        </span>
        <h1 className="mt-4 text-3xl font-bold text-white">
          Hello,{" "}
          <span className="bg-gradient-to-r from-[#FF5E14] via-[#FF8800] to-[#00A896] bg-clip-text text-transparent">
            {session?.name || "Partner"}
          </span>
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          You are signed in as <span className="text-slate-100">{session?.email}</span>.
        </p>
        <p className="mt-4 text-sm text-slate-400">
          Partner dashboard UI is ready. Partner tools and server APIs will be connected later.
        </p>
        <Link to="/" className={`mt-6 ${primaryBtn}`}>
          Back to website
        </Link>
      </div>
    </div>
  );
}
