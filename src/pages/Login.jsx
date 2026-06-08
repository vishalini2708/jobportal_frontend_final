import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { LogIn, Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      return toast.error('Please enter a valid email address.');
    }
    if (!password || password.length < 6) {
      return toast.error('Password must be at least 6 characters long.');
    }

    setIsSubmitting(true);
    const res = await login(email.trim(), password);
    setIsSubmitting(false);

    if (res.success) {
      navigate('/dashboard'); // Direct to their corresponding dashboard switcher!
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 font-sans">
      
      {/* Glass card container */}
      <div className="relative glass border border-slate-800/80 rounded-3xl p-8 shadow-2xl overflow-hidden text-left">
        
        {/* Glow styling */}
        <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-indigo-500/10 blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-purple-500/10 blur-2xl"></div>

        {/* Header logo & title */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-slate-900 border border-slate-800 rounded-2xl text-indigo-400 mb-3 shadow-inner">
            <LogIn size={26} className="stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400 mt-1">Log in to view listings and submit resume applications.</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Email Address</label>
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

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
              <a href="#" className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300">Forgot Password?</a>
            </div>
            <div className="relative flex items-center bg-slate-950/60 border border-slate-850 focus-within:border-indigo-500 rounded-xl px-3 py-1 text-slate-400 focus-within:text-white transition-colors duration-200">
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 btn-gradient text-white rounded-xl text-sm font-bold shadow-glow flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 mt-6"
          >
            {isSubmitting ? (
              <>
                <Loader size={16} className="animate-spin" />
                Validating...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer sign up navigations */}
        <div className="text-center mt-6 pt-6 border-t border-slate-900">
          <p className="text-xs text-slate-450">
            New to HireWave?{' '}
            <Link to="/signup" className="font-bold text-indigo-400 hover:text-indigo-300">
              Create an account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
