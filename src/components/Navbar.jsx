import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Menu, X, LogOut, Briefcase, LayoutDashboard, UserCheck, Shield, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Jobs', path: '/jobs' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full glass-nav backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-tight text-white font-sans">
              <span className="p-2 btn-gradient rounded-xl text-white shadow-glow">
                <Briefcase size={20} className="stroke-[2.5]" />
              </span>
              <span className="font-extrabold tracking-wide bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                HireWave
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-indigo-400 bg-slate-900/60 shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {/* Dashboard Redirect: seeker -> Seeker Dashboard, recruiter -> Recruiter Dashboard */}
            {user && (
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-indigo-400 bg-slate-900/60 shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`
                }
              >
                <LayoutDashboard size={15} />
                {user.role === 'recruiter' ? 'Recruiter Dashboard' : 'Job Seeker Dashboard'}
              </NavLink>
            )}

            {user && (
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-indigo-400 bg-slate-900/60 shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                  }`
                }
              >
                <User size={15} />
                My Profile
              </NavLink>
            )}
          </div>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800">
                  <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${user.role === 'recruiter' ? 'bg-purple-500' : 'bg-emerald-500'}`}></span>
                  <span className="text-xs font-semibold text-slate-300">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1.5 bg-slate-800/80 hover:bg-red-950/40 border border-slate-700 hover:border-red-900/50 text-slate-300 hover:text-red-400 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 btn-gradient text-white rounded-lg text-sm font-semibold shadow-glow"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-400 hover:text-white p-2 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-t border-slate-800 shadow-2xl animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg text-base font-semibold ${
                    isActive ? 'text-indigo-400 bg-slate-900/80 shadow-inner' : 'text-slate-300 hover:bg-slate-800'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {user && (
              <NavLink
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg text-base font-semibold ${
                    isActive ? 'text-indigo-400 bg-slate-900/80 shadow-inner' : 'text-slate-300 hover:bg-slate-800'
                  }`
                }
              >
                {user.role === 'recruiter' ? 'Recruiter Dashboard' : 'Job Seeker Dashboard'}
              </NavLink>
            )}

            {user && (
              <NavLink
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg text-base font-semibold ${
                    isActive ? 'text-indigo-400 bg-slate-900/80 shadow-inner' : 'text-slate-300 hover:bg-slate-800'
                  }`
                }
              >
                My Profile
              </NavLink>
            )}
          </div>

          <div className="pt-4 pb-4 border-t border-slate-800 px-4">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full btn-gradient flex items-center justify-center font-bold text-white shadow-glow">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">{user.name}</h4>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-red-950/40 border border-red-900/50 hover:bg-red-900/30 text-red-400 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-slate-300 hover:text-white py-2 rounded-lg text-sm font-medium border border-slate-800"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center btn-gradient text-white py-2.5 rounded-lg text-sm font-semibold shadow-glow"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
