import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useJobs } from '../context/JobContext.jsx';
import JobCard from '../components/JobCard.jsx';
import { User, Bookmark, Send, Clock, BookOpen, Trash2, Calendar, FileText, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserDashboard() {
  const { user } = useAuth();
  const { recentlyViewed, toggleBookmark, jobs } = useJobs();
  const [activeTab, setActiveTab] = useState('applications');
  
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'https://backend-job-portal-0kb0.onrender.com/api';

  // Fetch applications list
  const fetchMyApplications = async () => {
    if (!user) return;
    setLoadingApps(true);
    try {
      const res = await fetch(`${API_URL}/applications/my-applications`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setApplications(data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load applications history.');
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    fetchMyApplications();
  }, [user]);

  // Filter bookmarked jobs from complete list
  const bookmarkedJobs = jobs.filter(j => user && user.savedJobs && user.savedJobs.includes(j._id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-8">
      
      {/* 1. Header welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-6 text-left">
        <div>
          <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Candidate Hub</span>
          <h1 className="text-3xl font-extrabold text-white">Welcome back, {user?.name}!</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your active bookmarks, track application status, and view history.</p>
        </div>

        {/* Short profile badge */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-850 px-4 py-2.5 rounded-2xl w-fit">
          <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center font-bold text-white shadow-glow">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">{user?.name}</h4>
            <p className="text-[10px] text-slate-500">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Tab select row */}
      <div className="flex border-b border-slate-900 gap-6 text-sm">
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 font-semibold transition-colors relative ${
            activeTab === 'applications' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Send size={15} />
            My Applications ({applications.length})
          </span>
          {activeTab === 'applications' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full"></div>
          )}
        </button>

        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`pb-3 font-semibold transition-colors relative ${
            activeTab === 'bookmarks' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Bookmark size={15} />
            Saved Bookmarks ({bookmarkedJobs.length})
          </span>
          {activeTab === 'bookmarks' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full"></div>
          )}
        </button>

        <button
          onClick={() => setActiveTab('recently')}
          className={`pb-3 font-semibold transition-colors relative ${
            activeTab === 'recently' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <BookOpen size={15} />
            Recently Viewed ({recentlyViewed.length})
          </span>
          {activeTab === 'recently' && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full"></div>
          )}
        </button>
      </div>

      {/* Tab Panels */}
      <section className="min-h-[300px]">
        {/* TAB 1: Applications */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            {loadingApps ? (
              <div className="text-center py-10 text-slate-450 text-xs font-semibold animate-pulse">Retecting submission logs...</div>
            ) : applications.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {applications.map((app) => (
                  <div 
                    key={app._id} 
                    className="glass p-5 rounded-2xl border border-slate-850 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 text-left hover:border-slate-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl font-bold shadow-inner">
                        {app.jobDetails?.companyLogo || '💼'}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white leading-tight">{app.jobDetails?.title}</h4>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{app.jobDetails?.company} — {app.jobDetails?.location}</p>
                      </div>
                    </div>

                    {/* Meta stats details */}
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-450">
                        <Calendar size={13} className="text-indigo-400" />
                        <span>Applied: {new Date(app.appliedDate).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-450">
                        <FileText size={13} className="text-purple-400" />
                        <span className="max-w-[120px] truncate">{app.resume}</span>
                      </div>

                      <span className="px-2.5 py-1 bg-emerald-950/20 border border-emerald-900/30 text-emerald-450 font-bold rounded-lg text-[10px] tracking-wide uppercase">
                        Received
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div className="glass rounded-3xl p-16 border border-slate-850 text-center flex flex-col items-center justify-center space-y-4">
                <Send size={36} className="text-slate-650" />
                <h3 className="text-lg font-bold text-slate-350">No applications submitted</h3>
                <p className="text-sm text-slate-550 max-w-sm">
                  You haven't applied for any positions yet. Find the right job listing and apply in minutes!
                </p>
                <a href="/jobs" className="px-5 py-2 btn-gradient text-white rounded-xl text-xs font-bold shadow-glow">
                  Search Openings
                </a>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Saved Bookmarks */}
        {activeTab === 'bookmarks' && (
          <div>
            {bookmarkedJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarkedJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <div className="glass rounded-3xl p-16 border border-slate-850 text-center flex flex-col items-center justify-center space-y-4">
                <Bookmark size={36} className="text-slate-650" />
                <h3 className="text-lg font-bold text-slate-350">No saved jobs</h3>
                <p className="text-sm text-slate-550 max-w-sm">
                  Bookmark jobs you're interested in while browsing to keep them stored here!
                </p>
                <a href="/jobs" className="px-5 py-2 btn-gradient text-white rounded-xl text-xs font-bold shadow-glow">
                  Browse Positions
                </a>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Recently Viewed */}
        {activeTab === 'recently' && (
          <div>
            {recentlyViewed.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentlyViewed.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <div className="glass rounded-3xl p-16 border border-slate-850 text-center flex flex-col items-center justify-center space-y-4">
                <BookOpen size={36} className="text-slate-650" />
                <h3 className="text-lg font-bold text-slate-350">No recently viewed jobs</h3>
                <p className="text-sm text-slate-550 max-w-sm">
                  Jobs you inspect in detail will be compiled here for convenient recall.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

    </div>
  );
}
