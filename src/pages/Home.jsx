import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useJobs } from '../context/JobContext.jsx';
import JobCard from '../components/JobCard.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';
import { Search, Briefcase, Users, Building2, Terminal, Code, Award, Layers } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const { jobs, loading } = useJobs();
  const [localSearch, setLocalSearch] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(localSearch.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  // Static stats counters
  const stats = [
    { label: 'Active Jobs', value: '12,480+', icon: <Briefcase className="text-indigo-400" /> },
    { label: 'Elite Companies', value: '1,200+', icon: <Building2 className="text-purple-400" /> },
    { label: 'Successful Placements', value: '45,800+', icon: <Users className="text-emerald-400" /> }
  ];

  // Quick categories
  const categories = [
    { name: 'Frontend', count: '148 Jobs', icon: <Code size={20} className="text-indigo-400" /> },
    { name: 'Backend', count: '293 Jobs', icon: <Terminal size={20} className="text-purple-400" /> },
    { name: 'Full Stack', count: '412 Jobs', icon: <Layers size={20} className="text-emerald-400" /> },
    { name: 'Design', count: '89 Jobs', icon: <Award size={20} className="text-amber-400" /> }
  ];

  // Get recent 3 jobs
  const featuredJobs = jobs.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-24 font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center pt-8 pb-14 min-h-[500px]">
        {/* Glow behind title */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-3xl -z-10 pointer-events-none"></div>

        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 text-indigo-300 mb-6 shadow-md animate-pulse">
          ✨ Introducing HireWave Premium Portal
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight font-sans">
          The future of tech recruitment. <br/>
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent">
            Build your dream career.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl font-medium leading-relaxed">
          Discover remote, hybrid, and local engineering opportunities with custom filters, resume uploads, and direct recruiter applications.
        </p>

        {/* Large search bar */}
        <form 
          onSubmit={handleSearchSubmit} 
          className="mt-10 w-full max-w-2xl bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800/80 shadow-2xl flex flex-col sm:flex-row items-center gap-2.5 backdrop-blur-md"
        >
          <div className="flex items-center gap-2 flex-1 w-full pl-3">
            <Search className="text-slate-500" size={20} />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search by job title, company, or city..."
              className="bg-transparent text-sm text-white placeholder-slate-500 w-full focus:outline-none py-2"
            />
          </div>
          <button 
            type="submit" 
            className="w-full sm:w-auto px-7 py-3 btn-gradient text-white rounded-xl text-sm font-bold shadow-glow flex items-center justify-center gap-2 transition-all duration-200"
          >
            <span>Search Jobs</span>
          </button>
        </form>

        {/* Floating Quick Categories tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-6 text-xs text-slate-500 font-semibold">
          <span>Popular Searches:</span>
          {['React', 'Node.js', 'Chennai', 'Remote'].map((tag) => (
            <Link
              key={tag}
              to={`/jobs?search=${encodeURIComponent(tag)}`}
              className="px-3 py-1 bg-slate-900 border border-slate-850 hover:border-slate-700 text-slate-450 hover:text-white rounded-lg transition-all duration-200"
            >
              {tag}
            </Link>
          ))}
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass rounded-2xl p-6 border border-slate-850 shadow-md flex items-center gap-4 hover:-translate-y-0.5 transition-all duration-200">
            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 shadow-inner">
              {stat.icon}
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-white">{stat.value}</h3>
              <p className="text-xs font-semibold text-slate-450 uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* 3. Job Categories Grid */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Explore Spaces</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Popular Job Categories</h2>
          </div>
          <Link to="/jobs" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            See all opportunities →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              onClick={() => navigate(`/jobs?category=${encodeURIComponent(cat.name)}`)}
              className="glass p-5 rounded-2xl border border-slate-850 shadow-md cursor-pointer hover:border-indigo-500/30 hover:bg-slate-900/60 transition-all duration-200 text-center flex flex-col items-center justify-center space-y-3"
            >
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl shadow-inner text-indigo-400">
                {cat.icon}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-snug">{cat.name}</h4>
                <p className="text-[10px] font-semibold text-slate-500 mt-0.5">{cat.count}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Featured Jobs Section */}
      <section className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Top Positions</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Featured Openings</h2>
          </div>
          <Link to="/jobs" className="text-xs font-bold text-indigo-400 hover:text-indigo-300">
            Browse all jobs ({jobs.length})
          </Link>
        </div>

        {loading ? (
          <SkeletonLoader count={3} />
        ) : featuredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-2xl p-12 border border-slate-850 text-center flex flex-col items-center justify-center space-y-4">
            <Briefcase size={40} className="text-slate-650" />
            <h3 className="text-lg font-bold text-slate-300">No jobs posted yet</h3>
            <p className="text-sm text-slate-550 max-w-sm">
              Our partner companies are preparing new job listings. Check back shortly!
            </p>
          </div>
        )}
      </section>

      {/* 5. Trending Companies Banner */}
      <section className="glass rounded-3xl p-8 sm:p-10 border border-slate-850 shadow-lg text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-28 h-28 rounded-full bg-purple-500/5 blur-2xl"></div>
        
        <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-6">Trending partners hiring on HireWave</h3>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-350">
          {['Apple', 'Stripe', 'Google', 'Vercel', 'Linear', 'Airbnb'].map((co) => (
            <div key={co} className="text-lg font-extrabold tracking-wider text-slate-300 hover:text-white cursor-default">
              {co}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
