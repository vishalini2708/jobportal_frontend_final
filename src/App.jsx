import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { JobProvider } from './context/JobContext.jsx';

// Components & Layout
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Pages
import Home from './pages/Home.jsx';
import Jobs from './pages/Jobs.jsx';
import JobDetails from './pages/JobDetails.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import UserDashboard from './pages/UserDashboard.jsx'; // Job Seeker Dashboard
import AdminDashboard from './pages/AdminDashboard.jsx'; // Recruiter Dashboard
import Profile from './pages/Profile.jsx'; // Profile page

// Smart Dashboard Switcher based on User Role
function DashboardSwitcher() {
  const { user } = useAuth();
  if (user && user.role === 'recruiter') {
    return <AdminDashboard />;
  }
  return <UserDashboard />;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <JobProvider>
          <div className="flex flex-col min-h-screen">
            
            {/* Navigation Bar */}
            <Navbar />

            {/* Main Application Routes */}
            <main className="flex-grow">
              <Routes>
                {/* Public pages */}
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/job/:id" element={<JobDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/register" element={<Navigate to="/signup" replace />} /> {/* Compatibility redirect */}

                {/* Dashboard: Seeker or Recruiter */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <DashboardSwitcher />
                    </ProtectedRoute>
                  } 
                />

                {/* Seeker / Recruiter Profile details page */}
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />

                {/* Catch-all redirect to Home */}
                <Route path="*" element={<Home />} />
              </Routes>
            </main>

            {/* Custom Footer */}
            <Footer />
            
            {/* Hot Toast Notifications */}
            <Toaster 
              position="top-right"
              toastOptions={{
                className: 'glass text-white border border-slate-800 text-xs font-semibold rounded-xl px-4 py-2.5',
                duration: 4000,
                style: {
                  background: 'rgba(18, 24, 41, 0.9)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
                },
              }}
            />
          </div>
        </JobProvider>
      </AuthProvider>
    </Router>
  );
}
