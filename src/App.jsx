import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./components/Landingpage/LandingPage";
import { AuthProvider } from "./context/auth.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import NavigationWrapper from "./components/NavigationWrapper.jsx";
import NotFound from "./components/NotFound.jsx";

// Master Admin Components
import MasterAdmin from "./components/master-admin/MasterAdmin.jsx";
import MasterAdminLogin from "./components/master-admin/pages/Login.jsx";
import MasterAdminDashboard from "./components/master-admin/MasterDashboard.jsx";
import LandingPageManage from "./components/master-admin/landing/ManageLandingPage.jsx";

// Students Components
import Students from "./components/students/Students.jsx";
import StudentLogin from "./components/students/pages/Login.jsx";
import StudentSignup from "./components/students/pages/Signup.jsx";
import StudentForgotPassword from "./components/students/pages/ForgotPassword.jsx";
import StudentsDashboard from "./components/students/StudentsDashboard.jsx";

// Partner Components
import Partner from "./components/partner/Partner.jsx";
import PartnerLogin from "./components/partner/pages/Login.jsx";
import PartnerSignup from "./components/partner/pages/Signup.jsx";
import PartnerDashboard from "./components/partner/PartnerDashboard.jsx";

// Workshop Registration (isolated feature)
import WorkshopPage from "./components/workshop/WorkshopPage.jsx";

// Faculty Components
import Faculty from "./components/faculty/Faculty.jsx";
import FacultyLogin from "./components/faculty/pages/Login.jsx";
import FacultyDashboard from "./components/faculty/FacultyDashboard.jsx";

const router = createBrowserRouter([
  {
    element: <NavigationWrapper />,
    children: [
      { path: "/", element: <LandingPage /> },

      // Workshop Registration (isolated feature, supports ?ref=COLLEGE_CODE)
      { path: "/workshop", element: <WorkshopPage /> },

      // Master Admin Routes
      {
        path: "/master-admin",
        element: <MasterAdmin />,
        children: [
          { index: true, element: <MasterAdminLogin /> },
          { path: "dashboard/:legacySlug", element: <MasterAdminDashboard /> },
          { path: ":sectionSlug/:studentId", element: <MasterAdminDashboard /> },
          { path: "landing-page", element: <LandingPageManage /> },
          { path: "faculty/new", element: <MasterAdminDashboard /> },
          { path: "faculty/assignments", element: <MasterAdminDashboard /> },
          { path: "faculty/timetable", element: <MasterAdminDashboard /> },
          { path: "faculty/:facultyId", element: <MasterAdminDashboard /> },
          { path: "faculty", element: <MasterAdminDashboard /> },
          { path: "staff/new", element: <MasterAdminDashboard /> },
          { path: "staff/departments", element: <MasterAdminDashboard /> },
          { path: "staff/designations", element: <MasterAdminDashboard /> },
          { path: "staff/:staffId", element: <MasterAdminDashboard /> },
          { path: "staff", element: <MasterAdminDashboard /> },
          { path: "id-card-generate/:studentId", element: <MasterAdminDashboard /> },
          { path: "fees/:feeStudentSlug", element: <MasterAdminDashboard /> },
          { path: ":sectionSlug", element: <MasterAdminDashboard /> },
        ],
      },

      // Students Routes
      {
        path: "/students",
        element: <Students />,
        children: [
          { index: true, element: <StudentLogin /> },
          { path: "signup", element: <StudentSignup /> },
          { path: "forgot-password", element: <StudentForgotPassword /> },
          { path: "dashboard/:legacySlug", element: <StudentsDashboard /> },
          { path: ":sectionSlug", element: <StudentsDashboard /> },
        ],
      },

      // Faculty Routes (login only — no signup)
      {
        path: "/faculty",
        element: <Faculty />,
        children: [
          { index: true, element: <FacultyLogin /> },
          { path: "dashboard/:legacySlug", element: <FacultyDashboard /> },
          { path: ":sectionSlug", element: <FacultyDashboard /> },
        ],
      },

      // Partner Routes
      {
        path: "/partner",
        element: <Partner />,
        children: [
          { index: true, element: <PartnerLogin /> },
          { path: "signup", element: <PartnerSignup /> },
          { path: "dashboard", element: <PartnerDashboard /> },
        ],
      },

      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white text-gray-800">
        <RouterProvider router={router} fallbackElement={<LoadingScreen />} />
      </div>
    </AuthProvider>
  );
}
