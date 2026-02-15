import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/student/Dashboard';
import StudentJobs from './pages/student/Jobs';
import StudentApplications from './pages/student/Applications';
import StudentInterviews from './pages/student/Interviews';
import StudentPrepNotes from './pages/student/PrepNotes';
import StudentATSScanner from './pages/student/ATSScanner';
import StudentCourses from './pages/student/Courses';
import StudentMockInterview from './pages/student/MockInterview';
import StudentMockInterviewSession from './pages/student/MockInterviewSession';
import StudentProgress from './pages/student/Progress';
import RecruiterDashboard from './pages/recruiter/Dashboard';
import RecruiterPostJob from './pages/recruiter/PostJob';
import RecruiterInterviews from './pages/recruiter/Interviews';
import RecruiterApplications from './pages/recruiter/Applications';
import RecruiterJobApplicants from './pages/recruiter/JobApplicants';
import RecruiterScheduleInterview from './pages/recruiter/ScheduleInterview';
import AdminDashboard from './pages/admin/Dashboard';
import AdminPlacements from './pages/admin/Placements';
import AdminUsers from './pages/admin/Users';
import AdminPrepNotes from './pages/admin/PrepNotes';
import Profile from './pages/Profile';

const AppRoutes = () => {
  const { user } = useAuth();

  // Dynamic Theme Engine
  useEffect(() => {
    const root = document.documentElement;

    const themes = {
      student: {
        '--p-50': '#ecfdf5', '--p-100': '#d1fae5', '--p-200': '#a7f3d0',
        '--p-300': '#6ee7b7', '--p-400': '#34d399', '--p-500': '#10b981',
        '--p-600': '#059669', '--p-700': '#047857', '--p-800': '#065f46', '--p-900': '#064e3b',
        '--shadow-sm': 'rgba(16, 185, 129, 0.05)',
        '--shadow-md': 'rgba(5, 150, 105, 0.1)',
        '--shadow-lg': 'rgba(16, 185, 129, 0.15)'
      },
      recruiter: {
        '--p-50': '#eef2ff', '--p-100': '#e0e7ff', '--p-200': '#c7d2fe',
        '--p-300': '#a5b4fc', '--p-400': '#818cf8', '--p-500': '#6366f1',
        '--p-600': '#4f46e5', '--p-700': '#4338ca', '--p-800': '#3730a3', '--p-900': '#1e1b4b',
        '--shadow-sm': 'rgba(99, 102, 241, 0.05)',
        '--shadow-md': 'rgba(79, 70, 229, 0.1)',
        '--shadow-lg': 'rgba(99, 102, 241, 0.15)'
      },
      admin: {
        '--p-50': '#faf5ff', '--p-100': '#f3e8ff', '--p-200': '#e9d5ff',
        '--p-300': '#d8b4fe', '--p-400': '#a855f7', '--p-500': '#9333ea',
        '--p-600': '#7e22ce', '--p-700': '#6b21a8', '--p-800': '#581c87', '--p-900': '#3b0764',
        '--shadow-sm': 'rgba(168, 85, 247, 0.05)',
        '--shadow-md': 'rgba(126, 34, 206, 0.1)',
        '--shadow-lg': 'rgba(168, 85, 247, 0.15)'
      }
    };

    const currentTheme = themes[user?.role] || themes.student;

    Object.entries(currentTheme).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }, [user]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <PrivateRoute allowedRoles={['student']}>
            <StudentDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/jobs"
        element={
          <PrivateRoute allowedRoles={['student']}>
            <StudentJobs />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/applications"
        element={
          <PrivateRoute allowedRoles={['student']}>
            <StudentApplications />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/interviews"
        element={
          <PrivateRoute allowedRoles={['student']}>
            <StudentInterviews />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/prep-notes"
        element={
          <PrivateRoute allowedRoles={['student']}>
            <StudentPrepNotes />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/ats-scanner"
        element={
          <PrivateRoute allowedRoles={['student']}>
            <StudentATSScanner />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/courses"
        element={
          <PrivateRoute allowedRoles={['student']}>
            <StudentCourses />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/mock-interview"
        element={
          <PrivateRoute allowedRoles={['student']}>
            <StudentMockInterview />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/mock-interview/:id"
        element={
          <PrivateRoute allowedRoles={['student']}>
            <StudentMockInterviewSession />
          </PrivateRoute>
        }
      />
      <Route
        path="/student/progress"
        element={
          <PrivateRoute allowedRoles={['student']}>
            <StudentProgress />
          </PrivateRoute>
        }
      />

      {/* Recruiter Routes */}
      <Route
        path="/recruiter/dashboard"
        element={
          <PrivateRoute allowedRoles={['recruiter']}>
            <RecruiterDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/recruiter/post-job"
        element={
          <PrivateRoute allowedRoles={['recruiter']}>
            <RecruiterPostJob />
          </PrivateRoute>
        }
      />
      <Route
        path="/recruiter/edit-job/:jobId"
        element={
          <PrivateRoute allowedRoles={['recruiter']}>
            <RecruiterPostJob />
          </PrivateRoute>
        }
      />
      <Route
        path="/recruiter/interviews"
        element={
          <PrivateRoute allowedRoles={['recruiter']}>
            <RecruiterInterviews />
          </PrivateRoute>
        }
      />
      <Route
        path="/recruiter/applications"
        element={
          <PrivateRoute allowedRoles={['recruiter']}>
            <RecruiterApplications />
          </PrivateRoute>
        }
      />
      <Route
        path="/recruiter/job/:jobId/applicants"
        element={
          <PrivateRoute allowedRoles={['recruiter']}>
            <RecruiterJobApplicants />
          </PrivateRoute>
        }
      />
      <Route
        path="/recruiter/schedule-interview/:applicationId"
        element={
          <PrivateRoute allowedRoles={['recruiter']}>
            <RecruiterScheduleInterview />
          </PrivateRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/placements"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminPlacements />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminUsers />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/prep-notes"
        element={
          <PrivateRoute allowedRoles={['admin']}>
            <AdminPrepNotes />
          </PrivateRoute>
        }
      />

      {/* Common Routes */}
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

import StudentChatbot from './components/student/StudentChatbot';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <AppRoutes />
          <StudentChatbot />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
