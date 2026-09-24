// src/components/students/Students.jsx
import React from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import {
  isStudentLoggedIn,
  clearStudentSession,
} from "../../utils/studentAuth.js";
import SeoHead from "../SeoHead.jsx";
import { StudentThemeProvider, useStudentTheme, getStudentShell } from "./StudentTheme.jsx";
import { slugToSection } from "../../utils/studentRoutes.js";

function pageTitleFromPath(pathname) {
  if (
    pathname === "/students" ||
    pathname === "/students/signup" ||
    pathname === "/students/forgot-password"
  ) {
    return "Students | Grow Skills Tech";
  }
  const match = pathname.match(/^\/students\/([^/]+)/);
  if (!match) return "Students | Grow Skills Tech";
  const section = slugToSection(match[1]);
  if (!section) return "Students | Grow Skills Tech";
  return `${section} | Student Portal`;
}

function StudentsShell() {
  const location = useLocation();
  const { isDark } = useStudentTheme();
  const shell = getStudentShell(isDark);

  const checkAuth = () => {
    if (!isStudentLoggedIn()) {
      clearStudentSession();
      return false;
    }
    return true;
  };

  const isAuthenticated = checkAuth();
  const isAuthPage =
    location.pathname === "/students" ||
    location.pathname === "/students/signup" ||
    location.pathname === "/students/forgot-password";

  if (!isAuthenticated && !isAuthPage) {
    return <Navigate to="/students" replace />;
  }

  if (isAuthenticated && isAuthPage) {
    return <Navigate to="/students/dashboard" replace />;
  }

  return (
    <div
      className={`students-container min-h-screen font-sans selection:bg-[#FF5E14]/40 selection:text-white transition-colors duration-300 ${shell.root}`}
    >
      <SeoHead
        title={pageTitleFromPath(location.pathname)}
        description="Grow Skills Tech student portal."
        path={location.pathname}
        noindex
        includeWebsiteSchema={false}
      />
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className={`absolute inset-0 ${shell.glow}`} />
        <div
          className={`absolute inset-0 bg-[size:120px_120px] ${shell.grid}`}
        />
      </div>
      <Outlet />
    </div>
  );
}

export default function Students() {
  return (
    <StudentThemeProvider>
      <StudentsShell />
    </StudentThemeProvider>
  );
}
