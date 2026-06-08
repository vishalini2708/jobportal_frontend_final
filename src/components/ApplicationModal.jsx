import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle, Loader } from 'lucide-react';
import { useJobs } from '../context/JobContext.jsx';
import toast from 'react-hot-toast';

export default function ApplicationModal({ job, onClose, onSuccess }) {
  const { applyToJob } = useJobs();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [resume, setResume] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Handle file select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx', 'doc'].includes(ext)) {
      toast.error('Invalid file type! Please upload a PDF, DOC, or DOCX document.');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Resume must be under 5MB.');
      return;
    }

    setResume(file);
    toast.success('Resume selected! Ready to upload.');
  };

  // Handle submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return toast.error('Full Name is required.');
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return toast.error('Valid Email Address is required.');
    if (!resume) return toast.error('Please attach your resume.');

    setIsSubmitting(true);
    setUploadProgress(20);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('resume', resume);

    // Simulate progress updates for a rich premium user experience!
    const timer = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 80) {
          clearInterval(timer);
          return 80;
        }
        return prev + 20;
      });
    }, 150);

    const result = await applyToJob(job._id, formData);
    
    clearInterval(timer);
    setUploadProgress(100);

    setTimeout(() => {
      setIsSubmitting(false);
      if (result.success) {
        onSuccess();
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 font-sans">
      
      {/* Dark overlay backdrop blur */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Glass Modal Content Container */}
      <div className="relative w-full max-w-lg glass border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 animate-scale-up overflow-hidden">
        
        {/* Glow corner decorations */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 rounded-full bg-purple-500/10 blur-2xl"></div>

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Applying For Position</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">{job.title}</h2>
            <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">{job.company} — {job.location}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Elon Musk"
              required
              className="w-full bg-slate-950/60 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="elon@spacex.com"
              required
              className="w-full bg-slate-950/60 border border-slate-850 hover:border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all duration-200"
            />
          </div>

          {/* Upload Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Upload Resume (PDF, DOC, DOCX)</label>
            
            <div className="relative border-2 border-dashed border-slate-850 hover:border-indigo-500/50 rounded-2xl p-6 bg-slate-950/20 text-center cursor-pointer transition-colors duration-200">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.docx,.doc"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {resume ? (
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-3 bg-indigo-950/40 rounded-xl text-indigo-400">
                    <FileText size={28} />
                  </div>
                  <p className="text-sm font-semibold text-white max-w-xs truncate">{resume.name}</p>
                  <p className="text-[10px] text-slate-500">{(resume.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-3 bg-slate-900 rounded-xl text-slate-400">
                    <Upload size={28} />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-200">Select file or drag it here</h4>
                  <p className="text-xs text-slate-500">PDF, DOC, or DOCX documents up to 5MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Progress bar if uploading */}
          {isSubmitting && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-semibold text-slate-400">
                <span>Uploading application...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-150"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex items-center space-x-3 pt-4 border-t border-slate-900">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-3 text-slate-400 hover:text-white bg-slate-900 border border-slate-850 hover:bg-slate-800/80 rounded-xl text-sm font-bold transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 btn-gradient text-white rounded-xl text-sm font-bold shadow-glow flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Sending...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
