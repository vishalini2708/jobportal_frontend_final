import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import ApplicationModal from '../components/ApplicationModal.jsx';
import { Bookmark, MapPin, Briefcase, DollarSign, Calendar, ArrowLeft, Send, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toggleBookmark, addToRecentlyViewed } = useJobs();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'https://backend-job-portal-0kb0.onrender.com/api';
  const isBookmarked = user && user.savedJobs && user.savedJobs.includes(id);

  // Fetch job details on mount
  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/jobs/${id}`);
        if (!res.ok) throw new Error('Job listing not found');
        const data = await res.json();
        
        setJob(data);
        addToRecentlyViewed(data); // Add to recently viewed lists!

        // Check if user already applied
        if (user) {
          const appRes = await fetch(`${API_URL}/applications/my-applications`, {
            headers: { 'Authorization': `Bearer ${user.token}` }
          });
          if (appRes.ok) {
            const apps = await appRes.json();
            const applied = apps.some(app => app.job === id);
            setAlreadyApplied(applied);
          }
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load job details.');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, user]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <Clock size={32} className="mx-auto text-indigo-400 animate-spin" />
        <p className="text-slate-400 font-semibold text-sm">Parsing details...</p>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-8">
      
      {/* Back CTA */}
      <div>
        <Link 
          to="/jobs" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Listings
        </Link>
      </div>

      {/* Main Grid: Info Cards and Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Job Description and requirements */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main header block */}
          <div className="glass rounded-3xl p-6 sm:p-8 border border-slate-850 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-indigo-500/5 blur-2xl"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl font-bold shadow-inner">
                  {job.companyLogo || '💼'}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">{job.title}</h1>
                  <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mt-1">{job.company}</p>
                </div>
              </div>

              {/* Bookmark CTA */}
              <button
                onClick={() => toggleBookmark(job._id)}
                className={`w-fit p-3 rounded-2xl border transition-all duration-200 flex items-center gap-2 ${
                  isBookmarked
                    ? 'bg-indigo-950/40 border-indigo-700/50 text-indigo-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
                <span className="text-xs font-bold">{isBookmarked ? 'Saved' : 'Save'}</span>
              </button>
            </div>

            {/* Quick stats items */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-900 text-left">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Salary</span>
                <p className="text-sm font-extrabold text-white mt-0.5">{job.salary}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Location</span>
                <p className="text-sm font-bold text-slate-300 mt-0.5">{job.location}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Setup</span>
                <p className="text-sm font-bold text-slate-300 mt-0.5">{job.jobType}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Experience</span>
                <p className="text-sm font-bold text-slate-300 mt-0.5">{job.experience}</p>
              </div>
            </div>
          </div>

          {/* Core job contents details */}
          <div className="glass rounded-3xl p-6 sm:p-8 border border-slate-850 shadow-lg space-y-8 text-left">
            
            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">Job Description</h2>
              <p className="text-sm text-slate-350 leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>

            {/* Requirements / Skills */}
            {job.requirements && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-white border-l-4 border-purple-500 pl-3">Requirements & Skills</h2>
                <div className="flex flex-wrap gap-2 pt-1">
                  {job.requirements.split(',').map((skill, index) => (
                    <span 
                      key={index} 
                      className="px-3.5 py-1.5 bg-slate-900 border border-slate-850 rounded-xl text-xs font-semibold text-indigo-300"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Responsibilities */}
            {job.responsibilities && (
              <div className="space-y-3">
                <h2 className="text-lg font-bold text-white border-l-4 border-emerald-500 pl-3">Responsibilities</h2>
                <ul className="space-y-2 text-sm text-slate-350">
                  {job.responsibilities.split('.').filter(r => r.trim()).map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-emerald-500 font-bold mt-1">•</span>
                      <span>{resp.trim()}.</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sidebar Action card */}
        <div className="space-y-6">
          <div className="glass rounded-3xl p-6 border border-slate-850 shadow-lg space-y-6 text-left relative overflow-hidden">
            <div className="absolute bottom-0 right-0 -mr-12 -mb-12 w-24 h-24 rounded-full bg-indigo-500/5 blur-2xl"></div>

            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-900 pb-3">Quick Overview</h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Job Category</span>
                <span className="text-indigo-400 font-bold">{job.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Job Type</span>
                <span className="text-slate-300 font-semibold">{job.jobType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Posted Date</span>
                <span className="text-slate-300 font-semibold">
                  {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>

            {/* Submit Action Block */}
            {alreadyApplied ? (
              <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-2xl flex items-center gap-3 text-emerald-400">
                <CheckCircle size={20} className="flex-shrink-0" />
                <div className="text-left">
                  <h4 className="text-xs font-bold leading-tight">Already Applied</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Your application has been received.</p>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (!user) {
                    toast.error('Please login to apply!');
                    navigate('/login');
                  } else {
                    setShowApplyModal(true);
                  }
                }}
                className="w-full py-3.5 btn-gradient text-white rounded-2xl text-sm font-bold shadow-glow flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-200"
              >
                <Send size={15} />
                Apply Now
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Modal Portal display */}
      {showApplyModal && (
        <ApplicationModal
          job={job}
          onClose={() => setShowApplyModal(false)}
          onSuccess={() => {
            setShowApplyModal(false);
            setAlreadyApplied(true);
          }}
        />
      )}

    </div>
  );
}
