import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { User, Mail, Upload, FileText, CheckCircle, Loader, Edit, Key } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [resume, setResume] = useState(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || 'https://backend-job-portal-0kb0.onrender.com/api';

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type (PDF only)
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'pdf') {
      toast.error('Invalid file type! Resumes must be submitted in PDF format.');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Resume must be under 5MB.');
      return;
    }

    setResume(file);
    toast.success('Resume loaded! Click "Save Changes" to upload.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.error('Full Name cannot be empty.');
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return toast.error('Please enter a valid email.');

    setIsSubmitting(true);
    setUploadProgress(20);

    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('email', email.trim());
    if (resume) {
      formData.append('resume', resume);
    }

    // Simulate upload progress
    const timer = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 80) {
          clearInterval(timer);
          return 80;
        }
        return prev + 20;
      });
    }, 100);

    const result = await updateProfile(formData);
    
    clearInterval(timer);
    setUploadProgress(100);

    setTimeout(() => {
      setIsSubmitting(false);
      setResume(null);
    }, 300);
  };

  const getResumeUrl = (link) => {
    const rootUrl = API_URL.replace('/api', '');
    return `${rootUrl}/uploads/${link}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans space-y-8 text-left">
      
      <div>
        <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Workspace</span>
        <h1 className="text-3xl font-extrabold text-white">Profile Settings</h1>
        <p className="text-xs text-slate-400 mt-1">Configure your personal criteria, view role designations, and manage saved resumes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Account Summary info */}
        <div className="glass rounded-3xl p-6 border border-slate-850 shadow-lg text-center relative overflow-hidden space-y-4">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-24 h-24 rounded-full bg-indigo-500/5 blur-xl"></div>
          
          <div className="w-20 h-20 mx-auto rounded-2xl btn-gradient flex items-center justify-center font-bold text-white text-3xl shadow-glow">
            {user?.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-white">{user?.name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
          </div>

          <div className="pt-4 border-t border-slate-900 flex justify-between text-xs">
            <span className="text-slate-500 font-semibold">Account Class</span>
            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
              user?.role === 'recruiter' 
                ? 'bg-purple-950/40 border border-purple-900/40 text-purple-400' 
                : 'bg-emerald-950/20 border border-emerald-900/30 text-emerald-400'
            }`}>
              {user?.role === 'recruiter' ? 'Portal Recruiter' : 'Job Seeker'}
            </span>
          </div>
        </div>

        {/* Right Column: Edit Profile details Form */}
        <div className="lg:col-span-2 glass rounded-3xl p-6 sm:p-8 border border-slate-850 shadow-lg space-y-6">
          <h2 className="text-lg font-bold text-white border-l-4 border-indigo-500 pl-3">Personal Credentials</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative flex items-center bg-slate-950/60 border border-slate-850 focus-within:border-indigo-500 rounded-xl px-3 py-1 text-slate-400 focus-within:text-white transition-colors duration-200">
                <User size={16} className="mr-2.5 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Steve Jobs"
                  required
                  className="bg-transparent text-sm w-full py-2.5 focus:outline-none text-white placeholder-slate-655"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative flex items-center bg-slate-950/60 border border-slate-850 focus-within:border-indigo-500 rounded-xl px-3 py-1 text-slate-400 focus-within:text-white transition-colors duration-200">
                <Mail size={16} className="mr-2.5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="steve@apple.com"
                  required
                  className="bg-transparent text-sm w-full py-2.5 focus:outline-none text-white placeholder-slate-655"
                />
              </div>
            </div>

            {/* Resume Upload: Seeker only! */}
            {user?.role === 'seeker' && (
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold text-slate-350 uppercase tracking-wider border-t border-slate-900 pt-4">Resume Documents</h3>
                
                {/* Active Resume displaying */}
                {user?.resume ? (
                  <div className="p-4 bg-slate-900 border border-slate-850 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs">
                      <div className="p-2.5 bg-indigo-950/40 border border-indigo-900/30 rounded-xl text-indigo-400">
                        <FileText size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white truncate max-w-[200px]">{user.resume}</h4>
                        <p className="text-[10px] text-emerald-450 mt-0.5 font-bold uppercase">Active PDF Resume</p>
                      </div>
                    </div>
                    <a
                      href={getResumeUrl(user.resume)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-extrabold text-indigo-400 hover:text-indigo-300 bg-slate-950 border border-slate-855 px-3 py-1.5 rounded-lg"
                    >
                      View File
                    </a>
                  </div>
                ) : (
                  <div className="p-4 bg-red-950/10 border border-red-900/20 rounded-2xl text-xs text-slate-450">
                    No active resume uploaded. Attach a PDF resume below to enable rapid job applications!
                  </div>
                )}

                {/* Upload drag drop selector */}
                <div className="relative border-2 border-dashed border-slate-850 hover:border-indigo-500/50 rounded-2xl p-6 bg-slate-950/20 text-center cursor-pointer transition-colors duration-200">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {resume ? (
                    <div className="flex flex-col items-center space-y-1.5 text-xs">
                      <FileText size={24} className="text-indigo-400" />
                      <p className="font-bold text-white truncate max-w-[250px]">{resume.name}</p>
                      <p className="text-[10px] text-slate-500">{(resume.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-1 text-xs">
                      <Upload size={24} className="text-slate-500" />
                      <h4 className="font-bold text-slate-350">Select PDF resume to update</h4>
                      <p className="text-[10px] text-slate-500">Only PDF documents up to 5MB are accepted</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Simulating progress if uploading */}
            {isSubmitting && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-[10px] font-semibold text-slate-450 uppercase">
                  <span>Uploading files...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-150"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Save CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-7 py-3 btn-gradient text-white rounded-xl text-sm font-bold shadow-glow flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 mt-6"
            >
              {isSubmitting ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Saving Changes...
                </>
              ) : (
                'Save Changes'
              )}
            </button>

          </form>
        </div>

      </div>

    </div>
  );
}
