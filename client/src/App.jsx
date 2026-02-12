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
import RecruiterJobApplicants from './pages/recruiter/JobApplicants';
import RecruiterScheduleInterview from './pages/recruiter/ScheduleInterview';
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminPrepNotes from './pages/admin/PrepNotes';
import Profile from './pages/Profile';

const AppRoutes = () => {
  const { user } = useAuth();

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
        path="/recruiter/interviews"
        element={
          <PrivateRoute allowedRoles={['recruiter']}>
            <RecruiterInterviews />
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

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
