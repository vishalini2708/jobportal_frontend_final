import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'https://backend-job-portal-0kb0.onrender.com/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('hirewave_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        localStorage.removeItem('hirewave_user');
      }
    }
    setLoading(false);
  }, []);

  // Register user (using /api/auth/register)
  const signup = async (name, email, password, role = 'seeker') => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('hirewave_user', JSON.stringify(data));
      setUser(data);
      toast.success(`Welcome aboard, ${data.name}! 🚀`);
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Login user (using /api/auth/login)
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('hirewave_user', JSON.stringify(data));
      setUser(data);
      toast.success(`Welcome back, ${data.name}! 👋`);
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Invalid email or password');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Get user profile (using /api/user/profile)
  const getProfile = async () => {
    if (!user) return null;
    try {
      const res = await fetch(`${API_URL}/user/profile`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const updated = { ...user, ...data };
        localStorage.setItem('hirewave_user', JSON.stringify(updated));
        setUser(updated);
        return updated;
      }
    } catch (err) {
      console.error('Failed to sync profile:', err);
    }
    return null;
  };

  // Update profile details (using PUT /api/user/profile)
  const updateProfile = async (formData) => {
    if (!user) return { success: false };
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: formData // Form Data
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');

      const updated = { ...user, ...data };
      localStorage.setItem('hirewave_user', JSON.stringify(updated));
      setUser(updated);
      toast.success('Profile details updated successfully! ✨');
      return { success: true, data: updated };
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('hirewave_user');
    setUser(null);
    toast.success('Signed out successfully. See you soon! 👋');
  };

  // Update user state directly (e.g. bookmarks)
  const updateUserBookmarks = (savedJobs) => {
    if (user) {
      const updatedUser = { ...user, savedJobs };
      localStorage.setItem('hirewave_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signup, 
      login, 
      logout, 
      getProfile, 
      updateProfile, 
      updateUserBookmarks 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
