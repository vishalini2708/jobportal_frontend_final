import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext.jsx';

const JobContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'https://backend-job-portal-0kb0.onrender.com/api';

export const JobProvider = ({ children }) => {
  const { user, updateUserBookmarks } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [experienceFilter, setExperienceFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  
  // Extra features
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Load recently viewed jobs
  useEffect(() => {
    const stored = localStorage.getItem('hirewave_recent');
    if (stored) {
      try {
        setRecentlyViewed(JSON.parse(stored));
      } catch (err) {
        localStorage.removeItem('hirewave_recent');
      }
    }
  }, []);

  // Sync / fetch all jobs
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (categoryFilter !== 'All') params.append('category', categoryFilter);
      if (experienceFilter !== 'All') params.append('experience', experienceFilter);
      if (typeFilter !== 'All') params.append('jobType', typeFilter);

      const res = await fetch(`${API_URL}/jobs?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to retrieve job listings');
      
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [searchQuery, categoryFilter, experienceFilter, typeFilter]);

  // Track recently viewed jobs
  const addToRecentlyViewed = (job) => {
    if (!job) return;
    setRecentlyViewed(prev => {
      const filtered = prev.filter(item => item._id !== job._id);
      const updated = [job, ...filtered].slice(0, 4);
      localStorage.setItem('hirewave_recent', JSON.stringify(updated));
      return updated;
    });
  };

  // Bookmark toggling
  const toggleBookmark = async (jobId) => {
    if (!user) {
      toast.error('Please log in to save jobs!');
      return;
    }

    const isBookmarked = user.savedJobs && user.savedJobs.includes(jobId);
    const method = isBookmarked ? 'DELETE' : 'POST';

    try {
      const res = await fetch(`${API_URL}/auth/bookmark/${jobId}`, {
        method,
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Operation failed');

      updateUserBookmarks(data.savedJobs);
      toast.success(isBookmarked ? 'Job unsaved successfully' : 'Job saved to your bookmarks! 🔖');
    } catch (err) {
      toast.error(err.message || 'Bookmark action failed');
    }
  };

  // Create Job (Recruiter only)
  const createJob = async (jobData) => {
    try {
      const res = await fetch(`${API_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(jobData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create job');

      toast.success('Job listing posted successfully! 🚀');
      fetchJobs();
      return { success: true, data };
    } catch (err) {
      toast.error(err.message || 'Failed to create job');
      return { success: false, error: err.message };
    }
  };

  // Update Job (Recruiter only)
  const updateJob = async (jobId, jobData) => {
    try {
      const res = await fetch(`${API_URL}/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(jobData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update job');

      toast.success('Job details updated! ✏️');
      fetchJobs();
      return { success: true, data };
    } catch (err) {
      toast.error(err.message || 'Failed to update job');
      return { success: false, error: err.message };
    }
  };

  // Delete Job (Recruiter only)
  const deleteJob = async (jobId) => {
    try {
      const res = await fetch(`${API_URL}/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete job');

      toast.success('Job listing deleted successfully');
      fetchJobs();
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to delete job');
      return { success: false };
    }
  };

  // Apply to Job (utilizing spec POST /api/apply endpoint!)
  const applyToJob = async (jobId, formData) => {
    try {
      // Append jobId into the multi-part form data
      formData.append('jobId', jobId);

      const res = await fetch(`${API_URL}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: formData // Multi-part Form Data (Multer)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Application submission failed');

      toast.success('Application submitted successfully! Good luck 🎉');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to submit application');
      return { success: false, error: err.message };
    }
  };

  return (
    <JobContext.Provider value={{
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
      recentlyViewed,
      addToRecentlyViewed,
      toggleBookmark,
      createJob,
      updateJob,
      deleteJob,
      applyToJob,
      fetchJobs
    }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => useContext(JobContext);
