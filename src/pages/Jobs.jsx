import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useJobs } from '../context/JobContext.jsx';
import JobCard from '../components/JobCard.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';
import { Search, SlidersHorizontal, MapPin, Briefcase, RefreshCw, XCircle } from 'lucide-react';

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    jobs,
    loading,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    experienceFilter,
    setExperienceFilter,
    typeFilter,
    setTypeFilter,
    fetchJobs
  } = useJobs();

  // Load initial query parameters from URL on mount
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const cat = searchParams.get('category') || 'All';
    const exp = searchParams.get('experience') || 'All';
    const type = searchParams.get('jobType') || 'All';

    setSearchQuery(search);
    setCategoryFilter(cat);
    setExperienceFilter(exp);
    setTypeFilter(type);
  }, [searchParams]);

  // Sync state back to URL query parameters
  const updateUrlParams = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleClearAll = () => {
    setSearchQuery('');
    setCategoryFilter('All');
    setExperienceFilter('All');
    setTypeFilter('All');
    setSearchParams({});
  };

  const categories = ['All', 'Frontend', 'Backend', 'Full Stack', 'Design', 'Other'];
  const experiences = ['All', 'Entry Level', '1-2 Years', '3+ Years', '5+ Years'];
  const jobTypes = ['All', 'Remote', 'Hybrid', 'Onsite'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      {/* Page Title Header */}
      <div className="mb-10 text-left">
        <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Search Spaces</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Find Your Next Adventure</h1>
        <p className="text-sm text-slate-400 mt-1.5">Filter through hundreds of elite engineering and design roles available globally.</p>
      </div>

      {/* Advanced Filter Control Grid */}
      <section className="glass rounded-2xl p-5 sm:p-6 border border-slate-850 shadow-lg space-y-4 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          
          {/* Main search inputs */}
          <div className="flex-1 w-full flex items-center bg-slate-950/60 border border-slate-855 rounded-xl px-3 py-1.5 focus-within:border-indigo-500 transition-colors duration-200">
            <Search className="text-slate-500 mr-2.5" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                updateUrlParams('search', e.target.value);
              }}
              placeholder="Search roles or keywords (e.g. React, Vercel, Node)..."
              className="bg-transparent text-sm text-white placeholder-slate-500 w-full focus:outline-none py-2"
            />
          </div>

          {/* Quick Clear Filter CTA */}
          <div className="flex w-full lg:w-auto items-center justify-between gap-3 border-t border-slate-900 lg:border-t-0 pt-3 lg:pt-0">
            <span className="text-xs text-slate-500 font-semibold md:hidden flex items-center gap-1.5">
              <SlidersHorizontal size={14} />
              Refined Search Filters
            </span>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-xs font-semibold px-4 py-2.5 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Dropdowns filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-900">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-450 tracking-wider mb-1.5">Tech Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                updateUrlParams('category', e.target.value);
              }}
              className="w-full bg-slate-950/60 border border-slate-850 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-350 focus:outline-none transition-colors duration-200"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-450 tracking-wider mb-1.5">Required Experience</label>
            <select
              value={experienceFilter}
              onChange={(e) => {
                setExperienceFilter(e.target.value);
                updateUrlParams('experience', e.target.value);
              }}
              className="w-full bg-slate-950/60 border border-slate-850 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-350 focus:outline-none transition-colors duration-200"
            >
              {experiences.map(exp => <option key={exp} value={exp}>{exp}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-450 tracking-wider mb-1.5">Work Setup</label>
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                updateUrlParams('jobType', e.target.value);
              }}
              className="w-full bg-slate-950/60 border border-slate-850 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-350 focus:outline-none transition-colors duration-200"
            >
              {jobTypes.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Results Title Count */}
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs text-slate-400 font-semibold tracking-wide">
          {loading ? 'Searching opportunities...' : `Showing ${jobs.length} total matches`}
        </span>
        <button
          onClick={fetchJobs}
          className="p-2 bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
          title="Refresh listings"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Jobs Grid / Skeletons / Empty state */}
      {loading ? (
        <SkeletonLoader count={6} />
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      ) : (
        <div className="glass rounded-3xl p-16 border border-slate-850 text-center flex flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-red-450 shadow-inner">
            <XCircle size={32} />
          </div>
          <h3 className="text-lg font-bold text-white">No jobs found matching filters</h3>
          <p className="text-sm text-slate-500 max-w-sm">
            We couldn't locate any active postings matching your search criteria. Try modifying your search or clearing active filters!
          </p>
          <button
            onClick={handleClearAll}
            className="px-6 py-2.5 btn-gradient text-white rounded-xl text-xs font-bold shadow-glow"
          >
            Clear Active Filters
          </button>
        </div>
      )}

    </div>
  );
}
