// src/components/partner/Partner.jsx
import React from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import {
  isPartnerLoggedIn,
  clearPartnerSession,
} from "../../utils/partnerAuth.js";
import SeoHead from "../SeoHead.jsx";

export default function Partner() {
  const location = useLocation();

  const checkAuth = () => {
    if (!isPartnerLoggedIn()) {
      clearPartnerSession();
      return false;
    }
    return true;
  };

  const isAuthenticated = checkAuth();
  const isAuthPage =
    location.pathname === "/partner" ||
    location.pathname === "/partner/signup";

  if (!isAuthenticated && !isAuthPage) {
    return <Navigate to="/partner" replace />;
  }

  if (isAuthenticated && isAuthPage) {
    return <Navigate to="/partner/dashboard" replace />;
  }

  return (
    <div className="partner-container min-h-screen bg-[#06151C] text-slate-100 font-sans selection:bg-[#FF5E14]/40 selection:text-white">
      <SeoHead
        title="Partner | Grow Skills Tech"
        description="Grow Skills Tech partner portal."
        path={location.pathname}
        noindex
        includeWebsiteSchema={false}
      />
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,168,150,0.18),transparent_55%),radial-gradient(circle_at_bottom,_rgba(255,94,20,0.16),transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:120px_120px]" />
      </div>
      <Outlet />
    </div>
  );
}
