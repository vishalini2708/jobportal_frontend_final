import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { UserPlus, User, Mail, Lock, Shield, Loader, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('seeker'); // Spec role 'seeker'
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Field Validations
    if (!name.trim()) return toast.error('Full Name is required.');
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      return toast.error('Please enter a valid email address.');
    }
    if (!password || password.length < 6) {
      return toast.error('Password must be at least 6 characters.');
    }

    setIsSubmitting(true);
    const res = await signup(name.trim(), email.trim(), password, role);
    setIsSubmitting(false);

    if (res.success) {
      navigate('/dashboard'); // Direct to their corresponding dashboard switcher!
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 font-sans">
      
      {/* Glass container */}
      <div className="relative glass border border-slate-800/80 rounded-3xl p-8 shadow-2xl overflow-hidden text-left">
        
        {/* Glow corner filters */}
        <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-indigo-500/10 blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-purple-500/10 blur-2xl"></div>

        {/* Header content */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-slate-900 border border-slate-800 rounded-2xl text-indigo-400 mb-3 shadow-inner">
            <UserPlus size={26} className="stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Create Account</h2>
          <p className="text-xs text-slate-400 mt-1">Get started to apply for premium engineering vacancies.</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Full Name</label>
            <div className="relative flex items-center bg-slate-950/60 border border-slate-850 focus-within:border-indigo-500 rounded-xl px-3 py-0.5 text-slate-450 focus-within:text-white transition-colors duration-200">
              <User size={16} className="mr-2.5 text-slate-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Steve Wozniak"
                required
                className="bg-transparent text-sm w-full py-2.5 focus:outline-none text-white placeholder-slate-655"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Email Address</label>
            <div className="relative flex items-center bg-slate-950/60 border border-slate-850 focus-within:border-indigo-500 rounded-xl px-3 py-0.5 text-slate-450 focus-within:text-white transition-colors duration-200">
              <Mail size={16} className="mr-2.5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="steve@woz.com"
                required
                className="bg-transparent text-sm w-full py-2.5 focus:outline-none text-white placeholder-slate-655"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
            <div className="relative flex items-center bg-slate-950/60 border border-slate-855 focus-within:border-indigo-500 rounded-xl px-3 py-0.5 text-slate-455 focus-within:text-white transition-colors duration-200">
              <Lock size={16} className="mr-2.5 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-transparent text-sm w-full py-2.5 focus:outline-none text-white placeholder-slate-655"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1 hover:text-white text-slate-500 focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Role selector toggles */}
          <div className="space-y-1.5 pt-1">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Select Account Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('seeker')}
                className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  role === 'seeker'
                    ? 'bg-indigo-950/40 border-indigo-700/50 text-indigo-400'
                    : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-white hover:border-slate-800'
                }`}
              >
                <User size={13} />
                Job Seeker
              </button>

              <button
                type="button"
                onClick={() => setRole('recruiter')}
                className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  role === 'recruiter'
                    ? 'bg-purple-950/40 border-purple-700/50 text-purple-400'
                    : 'bg-slate-900 border-slate-850 text-slate-400 hover:text-white hover:border-slate-800'
                }`}
              >
                <Shield size={13} />
                Recruiter
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 btn-gradient text-white rounded-xl text-sm font-bold shadow-glow flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 mt-6"
          >
            {isSubmitting ? (
              <>
                <Loader size={16} className="animate-spin" />
                Registering...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer signin directions */}
        <div className="text-center mt-6 pt-5 border-t border-slate-900">
          <p className="text-xs text-slate-450">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-indigo-400 hover:text-indigo-300">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
