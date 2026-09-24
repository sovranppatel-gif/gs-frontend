// src/components/faculty/Faculty.jsx
import React from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import {
  isFacultyLoggedIn,
  clearFacultySession,
} from "../../utils/facultyAuth.js";
import SeoHead from "../SeoHead.jsx";
import { FacultyThemeProvider, useFacultyTheme, getFacultyShell } from "./FacultyTheme.jsx";
import { slugToSection } from "../../utils/facultyRoutes.js";

function pageTitleFromPath(pathname) {
  if (pathname === "/faculty") {
    return "Faculty | Grow Skills Tech";
  }
  const match = pathname.match(/^\/faculty\/([^/]+)/);
  if (!match) return "Faculty | Grow Skills Tech";
  const section = slugToSection(match[1]);
  if (!section) return "Faculty | Grow Skills Tech";
  return `${section} | Faculty Portal`;
}

function FacultyShell() {
  const location = useLocation();
  const { isDark } = useFacultyTheme();
  const shell = getFacultyShell(isDark);

  const checkAuth = () => {
    if (!isFacultyLoggedIn()) {
      clearFacultySession();
      return false;
    }
    return true;
  };

  const isAuthenticated = checkAuth();
  const isAuthPage = location.pathname === "/faculty";

  if (!isAuthenticated && !isAuthPage) {
    return <Navigate to="/faculty" replace />;
  }

  if (isAuthenticated && isAuthPage) {
    return <Navigate to="/faculty/dashboard" replace />;
  }

  return (
    <div
      className={`faculty-container min-h-screen font-sans selection:bg-[#FF5E14]/40 selection:text-white transition-colors duration-300 ${shell.root}`}
    >
      <SeoHead
        title={pageTitleFromPath(location.pathname)}
        description="Grow Skills Tech faculty portal."
        path={location.pathname}
        noindex
        includeWebsiteSchema={false}
      />
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className={`absolute inset-0 ${shell.glow}`} />
        <div className={`absolute inset-0 bg-[size:120px_120px] ${shell.grid}`} />
      </div>
      <Outlet />
    </div>
  );
}

export default function Faculty() {
  return (
    <FacultyThemeProvider>
      <FacultyShell />
    </FacultyThemeProvider>
  );
}
