import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useJobs } from '../context/JobContext.jsx';
import { Shield, Plus, Briefcase, FileText, Users, Trash2, Edit, CheckCircle, ExternalLink, RefreshCw, X, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { jobs, createJob, updateJob, deleteJob, fetchJobs } = useJobs();
  
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState({ totalJobs: 0, totalApplicants: 0, activeUsers: 0 });
  const [applicants, setApplicants] = useState([]); // All applicants
  const [jobApplicantsList, setJobApplicantsList] = useState([]); // Selected job applicants
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState(null);
  
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingApps, setLoadingApps] = useState(true);
  const [loadingJobApps, setLoadingJobApps] = useState(false);
  
  // Job Form Modal State
  const [showJobModal, setShowJobModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingJobId, setEditingJobId] = useState(null);
  
  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formSalary, setFormSalary] = useState('');
  const [formExperience, setFormExperience] = useState('1-2 Years');
  const [formType, setFormType] = useState('Remote');
  const [formCategory, setFormCategory] = useState('Frontend');
  const [formDesc, setFormDesc] = useState('');
  const [formReq, setFormReq] = useState('');
  const [formResp, setFormResp] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'https://backend-job-portal-0kb0.onrender.com/api';

  // Fetch recruiter dashboard metrics
  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch(`${API_URL}/jobs/admin/stats`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch all applications
  const fetchAllApplicants = async () => {
    setLoadingApps(true);
    try {
      const res = await fetch(`${API_URL}/applications/my-applications`, { // fallback or recruiter dashboard listing
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      // Try resolving all recruiter applications
      const recruiterAppsRes = await fetch(`${API_URL}/applications/my-applications`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (recruiterAppsRes.ok) {
        // Enriched list
        const allJobs = await JobProvider; // fall back to global
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingApps(false);
    }
  };

  // Fetch applicants for a SPECIFIC job (utilizing spec endpoint GET /api/applicants/:jobId!)
  const fetchApplicantsForJob = async (job) => {
    setLoadingJobApps(true);
    setSelectedJobForApplicants(job);
    try {
      const res = await fetch(`${API_URL}/applicants/${job._id}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setJobApplicantsList(data);
      } else {
        throw new Error('Failed to resolve applicants');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to fetch applicants for this vacancy');
    } finally {
      setLoadingJobApps(false);
    }
  };

  // Sync recruiter jobs listing on mount
  const myPostedJobs = jobs.filter(j => j.createdBy === user?._id);

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchJobs();
    }
  }, [user]);

  // Open modal for Adding Job
  const handleOpenAdd = () => {
    setModalMode('add');
    setEditingJobId(null);
    setFormTitle('');
    setFormCompany('');
    setFormLocation('');
    setFormSalary('');
    setFormExperience('1-2 Years');
    setFormType('Remote');
    setFormCategory('Frontend');
    setFormDesc('');
    setFormReq('');
    setFormResp('');
    setShowJobModal(true);
  };

  // Open modal for Editing Job
  const handleOpenEdit = (job) => {
    setModalMode('edit');
    setEditingJobId(job._id);
    setFormTitle(job.title);
    setFormCompany(job.company);
    setFormLocation(job.location);
    setFormSalary(job.salary);
    setFormExperience(job.experience || '1-2 Years');
    setFormType(job.jobType || 'Remote');
    setFormCategory(job.category || 'Frontend');
    setFormDesc(job.description);
    setFormReq(job.requirements || '');
    setFormResp(job.responsibilities || '');
    setShowJobModal(true);
  };

  // Handle Form Submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formTitle.trim() || !formCompany.trim() || !formLocation.trim() || !formSalary.trim() || !formDesc.trim()) {
      return toast.error('Please complete all required fields.');
    }

    const jobData = {
      title: formTitle.trim(),
      company: formCompany.trim(),
      location: formLocation.trim(),
      salary: formSalary.trim(),
      experience: formExperience,
      jobType: formType,
      category: formCategory,
      description: formDesc.trim(),
      requirements: formReq.trim(),
      responsibilities: formResp.trim()
    };

    let res;
    if (modalMode === 'add') {
      res = await createJob(jobData);
    } else {
      res = await updateJob(editingJobId, jobData);
    }

    if (res.success) {
      setShowJobModal(false);
      fetchStats();
    }
  };

  // Confirm and delete
  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you absolutely sure you want to delete this job listing? This will also delete all associated seeker applications.')) {
      const success = await deleteJob(id);
      if (success) {
        fetchStats();
      }
    }
  };

  // Resume download link resolution
  const getResumeUrl = (link) => {
    const rootUrl = API_URL.replace('/api', '');
    return `${rootUrl}/uploads/${link}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-8">
      
      {/* Header welcomes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-6 text-left">
        <div>
          <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Recruiter Hub</span>
          <h1 className="text-3xl font-extrabold text-white flex items-center gap-2">
            <Shield className="text-purple-450" />
            Recruiter Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-1">Configure active vacancies, track applicants for each job, and view metrics.</p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-1.5 px-5 py-3 btn-gradient text-white rounded-xl text-xs font-bold shadow-glow hover:-translate-y-0.5 transition-all duration-200"
        >
          <Plus size={15} />
          Create Job Post
        </button>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-900 gap-6 text-sm">
        <button
          onClick={() => setActiveTab('stats')}
          className={`pb-3 font-semibold transition-colors relative ${
            activeTab === 'stats' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          Dashboard Analytics
          {activeTab === 'stats' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full"></div>}
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`pb-3 font-semibold transition-colors relative ${
            activeTab === 'jobs' ? 'text-indigo-400' : 'text-slate-400 hover:text-white'
          }`}
        >
          My Posted Jobs ({myPostedJobs.length})
          {activeTab === 'jobs' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-full"></div>}
        </button>
      </div>

      {/* Active Tab rendering */}
      <section className="min-h-[400px]">
        
        {/* TAB 1: Analytics cards */}
        {activeTab === 'stats' && (
          <div className="space-y-8 text-left">
            
            {/* Analytical Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass rounded-2xl p-6 border border-slate-850 shadow-md flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-extrabold text-white">{loadingStats ? '...' : stats.totalJobs}</h3>
                  <p className="text-xs font-semibold text-slate-450 uppercase tracking-wider mt-1">My Posted Jobs</p>
                </div>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-indigo-400 shadow-inner">
                  <Briefcase size={22} />
                </div>
              </div>

              <div className="glass rounded-2xl p-6 border border-slate-850 shadow-md flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-extrabold text-white">{loadingStats ? '...' : stats.totalApplicants}</h3>
                  <p className="text-xs font-semibold text-slate-450 uppercase tracking-wider mt-1">Total Job Applicants</p>
                </div>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-purple-400 shadow-inner">
                  <FileText size={22} />
                </div>
              </div>

              <div className="glass rounded-2xl p-6 border border-slate-850 shadow-md flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-extrabold text-white">{loadingStats ? '...' : stats.activeUsers}</h3>
                  <p className="text-xs font-semibold text-slate-455 uppercase tracking-wider mt-1">Portal Candidates</p>
                </div>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-emerald-400 shadow-inner">
                  <Users size={22} />
                </div>
              </div>
            </div>

            {/* Quick summaries list */}
            <div className="glass rounded-2xl p-6 border border-slate-850 shadow-md space-y-4">
              <h3 className="text-base font-extrabold text-white">Recent Vacancies Activity</h3>
              <div className="space-y-3">
                {myPostedJobs.slice(0, 4).map(job => (
                  <div key={job._id} className="flex justify-between items-center py-2 border-b border-slate-900 text-xs">
                    <div>
                      <h4 className="font-bold text-slate-200">{job.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{job.location} • {job.salary}</p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('jobs');
                        fetchApplicantsForJob(job);
                      }}
                      className="px-3 py-1.5 bg-slate-950 border border-slate-850 text-indigo-400 hover:text-indigo-300 font-bold rounded-lg text-[10px] uppercase flex items-center gap-1"
                    >
                      <Eye size={12} />
                      View Applicants ({(job.applicants || []).length})
                    </button>
                  </div>
                ))}
                {myPostedJobs.length === 0 && <p className="text-xs text-slate-500">No active job posts yet.</p>}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: Manage Jobs & Applicants for each job */}
        {activeTab === 'jobs' && (
          <div className="space-y-8">
            <div className="glass rounded-2xl border border-slate-850 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-850 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Title / Company</th>
                      <th className="px-6 py-4">Location & Salary</th>
                      <th className="px-6 py-4 text-center">Applicants</th>
                      <th className="px-6 py-4 text-center">Configure</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-slate-350">
                    {myPostedJobs.map((job) => (
                      <tr key={job._id} className="hover:bg-slate-900/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-white text-sm">{job.title}</div>
                          <div className="text-[10px] text-slate-500 uppercase mt-0.5">{job.company}</div>
                        </td>
                        <td className="px-6 py-4 text-left">
                          <div>{job.location} • {job.jobType}</div>
                          <div className="text-[10px] text-indigo-400 font-bold uppercase mt-0.5">{job.salary}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center">
                            <button
                              onClick={() => fetchApplicantsForJob(job)}
                              className="px-3.5 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded-xl text-indigo-400 hover:text-indigo-300 font-bold transition-all flex items-center gap-1.5"
                            >
                              <Users size={12} />
                              <span>View ({(job.applicants || []).length})</span>
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenEdit(job)}
                              className="p-2 bg-slate-900 hover:bg-indigo-950/40 text-slate-400 hover:text-indigo-400 border border-slate-800 rounded-xl transition-colors"
                              title="Edit vacancy details"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteJob(job._id)}
                              className="p-2 bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-slate-800 rounded-xl transition-colors"
                              title="Delete listing"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {myPostedJobs.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-slate-550 font-semibold">No vacancies posted yet. Click "Create Job Post" to start.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* APPLICANTS FOR SELECTED JOB (utilizing spec GET /api/applicants/:jobId!) */}
            {selectedJobForApplicants && (
              <div className="glass rounded-3xl p-6 border border-slate-850 shadow-lg space-y-4 text-left animate-slide-in">
                <div className="flex justify-between items-start border-b border-slate-900 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Applicant Database</span>
                    <h3 className="text-lg font-extrabold text-white">Candidates for: {selectedJobForApplicants.title}</h3>
                    <p className="text-[10px] text-slate-550 uppercase mt-0.5">{selectedJobForApplicants.company} — {selectedJobForApplicants.location}</p>
                  </div>
                  <button
                    onClick={() => setSelectedJobForApplicants(null)}
                    className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>

                {loadingJobApps ? (
                  <p className="text-xs text-slate-450 font-semibold animate-pulse text-center py-6">Loading candidates list...</p>
                ) : jobApplicantsList.length > 0 ? (
                  <div className="overflow-x-auto rounded-2xl border border-slate-900">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-900/40 text-slate-400 border-b border-slate-900 uppercase font-bold">
                        <tr>
                          <th className="px-4 py-3">Full Name</th>
                          <th className="px-4 py-3">Email Address</th>
                          <th className="px-4 py-3">Applied Date</th>
                          <th className="px-4 py-3 text-center">Resume link</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900 text-slate-350">
                        {jobApplicantsList.map((app) => (
                          <tr key={app._id} className="hover:bg-slate-900/10">
                            <td className="px-4 py-3 font-bold text-white text-sm">{app.name}</td>
                            <td className="px-4 py-3 font-semibold text-slate-300">{app.email}</td>
                            <td className="px-4 py-3">{new Date(app.appliedDate).toLocaleDateString()}</td>
                            <td className="px-4 py-3">
                              <div className="flex justify-center">
                                <a
                                  href={getResumeUrl(app.resume)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 font-bold px-3 py-1.5 border border-slate-850 rounded-lg text-[10px]"
                                >
                                  <ExternalLink size={11} />
                                  Download Resume
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 text-center py-6">No applications received yet for this vacancy.</p>
                )}
              </div>
            )}
          </div>
        )}

      </section>

      {/* JOB CREATION / EDITING MODAL PORTAL */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowJobModal(false)}></div>
          <div className="relative w-full max-w-2xl glass border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-y-auto max-h-[85vh] text-left animate-scale-up">
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  {modalMode === 'add' ? 'Create Job Post' : 'Edit Job Post'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Please populate the vacancy criteria and descriptions below.</p>
              </div>
              <button onClick={() => setShowJobModal(false)} className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 font-sans">
              
              {/* Title & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-300 tracking-wider mb-1.5">Job Title*</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Senior Frontend Architect"
                    required
                    className="w-full bg-slate-950/60 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-655 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-300 tracking-wider mb-1.5">Company Name*</label>
                  <input
                    type="text"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    placeholder="Vercel"
                    required
                    className="w-full bg-slate-950/60 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-655 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Location & Salary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-300 tracking-wider mb-1.5">Location*</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="Remote (Global) or Chennai, IN"
                    required
                    className="w-full bg-slate-950/60 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-655 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-300 tracking-wider mb-1.5">Salary Range*</label>
                  <input
                    type="text"
                    value={formSalary}
                    onChange={(e) => setFormSalary(e.target.value)}
                    placeholder="$120,000 - $140,000 /yr"
                    required
                    className="w-full bg-slate-950/60 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-655 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Experience / Setup / Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-300 tracking-wider mb-1.5">Experience*</label>
                  <select
                    value={formExperience}
                    onChange={(e) => setFormExperience(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-slate-350 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Entry Level">Entry Level</option>
                    <option value="1-2 Years">1-2 Years</option>
                    <option value="3+ Years">3+ Years</option>
                    <option value="5+ Years">5+ Years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-300 tracking-wider mb-1.5">Job Setup*</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-slate-350 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">Onsite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-300 tracking-wider mb-1.5">Category*</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-slate-350 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Full Stack">Full Stack</option>
                    <option value="Design">Design</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-300 tracking-wider mb-1.5">Full Job Description*</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Explain details of responsibilities, cultural fits, work tasks..."
                  required
                  rows="4"
                  className="w-full bg-slate-950/60 border border-slate-850 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-655 focus:outline-none transition-all"
                ></textarea>
              </div>

              {/* Requirements & Responsibilities */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-300 tracking-wider mb-1.5">Skills Required (comma-separated list)</label>
                <input
                  type="text"
                  value={formReq}
                  onChange={(e) => setFormReq(e.target.value)}
                  placeholder="React, TypeScript, Next.js, CSS Modules"
                  className="w-full bg-slate-950/60 border border-slate-850 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-655 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-300 tracking-wider mb-1.5">Responsibilities (period-separated sentences)</label>
                <textarea
                  value={formResp}
                  onChange={(e) => setFormResp(e.target.value)}
                  placeholder="Architect frontend layers. Coordinate with UI/UX mockups. Audit Web Vitals benchmarks."
                  rows="2"
                  className="w-full bg-slate-950/60 border border-slate-850 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-655 focus:outline-none transition-all"
                ></textarea>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-900">
                <button
                  type="button"
                  onClick={() => setShowJobModal(false)}
                  className="flex-1 py-3 text-slate-400 hover:text-white bg-slate-900 border border-slate-850 hover:bg-slate-800 rounded-xl text-xs font-bold transition-all duration-205"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 btn-gradient text-white rounded-xl text-xs font-bold shadow-glow"
                >
                  {modalMode === 'add' ? 'Create Vacancy' : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
