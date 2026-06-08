import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MapPin, Briefcase, DollarSign, Calendar, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useJobs } from '../context/JobContext.jsx';

export default function JobCard({ job }) {
  const { user } = useAuth();
  const { toggleBookmark } = useJobs();

  const isBookmarked = user && user.savedJobs && user.savedJobs.includes(job._id);

  // Time formatter helper
  const formatTime = (isoString) => {
    if (!isoString) return 'Recent';
    const date = new Date(isoString);
    const diffTime = Math.abs(new Date() - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <div className="glass-card rounded-2xl p-6 relative flex flex-col justify-between h-64 border border-slate-800/80 shadow-lg font-sans">
      
      {/* Top Section */}
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            {/* Company logo/emoji icon */}
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-center text-2xl font-bold shadow-inner">
              {job.companyLogo || '💼'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight hover:text-indigo-400 transition-colors line-clamp-1">
                <Link to={`/job/${job._id}`}>{job.title}</Link>
              </h3>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{job.company}</p>
            </div>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleBookmark(job._id)}
            className={`p-2 rounded-xl border transition-all duration-200 ${
              isBookmarked
                ? 'bg-indigo-950/40 border-indigo-700/50 text-indigo-400'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
            title={isBookmarked ? 'Unsave job' : 'Save job'}
          >
            <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} className="transition-transform duration-200 active:scale-75" />
          </button>
        </div>

        {/* Badges metadata grid */}
        <div className="flex flex-wrap gap-2.5 mt-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-900/80 border border-slate-850 text-slate-300">
            <MapPin size={11} className="text-indigo-400" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-900/80 border border-slate-850 text-slate-300">
            <Briefcase size={11} className="text-purple-400" />
            {job.jobType}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-900/80 border border-slate-850 text-slate-300">
            <Calendar size={11} className="text-emerald-400" />
            {job.experience}
          </span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-slate-900 pt-4 mt-5 flex justify-between items-center">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block">Estimated Salary</span>
          <span className="text-sm font-extrabold text-white">{job.salary}</span>
        </div>

        <Link
          to={`/job/${job._id}`}
          className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 hover:shadow-glow hover:-translate-y-0.5"
        >
          View Details
          <ChevronRight size={13} />
        </Link>
      </div>

    </div>
  );
}
