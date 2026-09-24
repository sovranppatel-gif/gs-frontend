// src/components/master-admin/MasterAdmin.jsx
import React from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import {
  isMasterAdminTokenValid,
  clearMasterAdminSession,
} from "../../utils/masterAdminAuth.js";
import SeoHead from "../SeoHead.jsx";
import { slugToSection } from "../../utils/masterAdminRoutes.js";
import {
  MasterAdminThemeProvider,
  useMasterAdminTheme,
  getMasterAdminShell,
} from "./MasterAdminTheme.jsx";

function pageTitleFromPath(pathname) {
  if (pathname === "/master-admin") {
    return "Admin | Grow Skills Tech";
  }
  const match = pathname.match(/^\/master-admin\/([^/]+)/);
  if (!match) return "Admin | Grow Skills Tech";
  if (match[1] === "landing-page") return "Landing Page | Admin";
  const section = slugToSection(match[1]);
  if (!section) return "Admin | Grow Skills Tech";
  return `${section} | Admin`;
}

function MasterAdminShell() {
  const location = useLocation();
  const { isDark } = useMasterAdminTheme();
  const shell = getMasterAdminShell(isDark);

  const checkAuth = () => {
    if (!isMasterAdminTokenValid()) {
      clearMasterAdminSession();
      return false;
    }
    return true;
  };

  const isAuthenticated = checkAuth();
  const isLoginPage = location.pathname === "/master-admin";

  if (!isAuthenticated && !isLoginPage) {
    return <Navigate to="/master-admin" replace />;
  }

  if (isAuthenticated && isLoginPage) {
    return <Navigate to="/master-admin/dashboard" replace />;
  }

  // Login is always dark-styled; don't inherit light-theme `text-black` onto it.
  const loginShell = getMasterAdminShell(true);
  const activeShell = isLoginPage ? loginShell : shell;

  return (
    <div
      data-theme={isLoginPage || isDark ? 'dark' : 'light'}
      className={`master-admin-container min-h-screen font-sans selection:bg-[#FF5E14]/40 selection:text-white transition-colors duration-300 ${activeShell.root}`}
    >
      <SeoHead
        title={pageTitleFromPath(location.pathname)}
        description="Grow Skills Tech admin area."
        path={location.pathname}
        noindex
        includeWebsiteSchema={false}
      />
      {!isLoginPage && (
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className={`absolute inset-0 ${activeShell.glow}`} />
          <div className={`absolute inset-0 bg-[size:120px_120px] ${activeShell.grid}`} />
        </div>
      )}
      <Outlet />
    </div>
  );
}

export default function MasterAdmin() {
  return (
    <MasterAdminThemeProvider>
      <MasterAdminShell />
    </MasterAdminThemeProvider>
  );
}
