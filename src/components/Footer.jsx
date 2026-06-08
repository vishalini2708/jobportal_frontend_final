import React from 'react';
import { Briefcase } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950/40 mt-auto py-10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 text-xl font-bold tracking-tight text-white mb-4">
              <span className="p-2 btn-gradient rounded-xl text-white shadow-glow">
                <Briefcase size={20} className="stroke-[2.5]" />
              </span>
              <span className="font-extrabold tracking-wide bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                HireWave
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm">
              Connecting elite talent with high-impact opportunities at the world's most progressive technology companies and startups.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Search Jobs</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Submit Resume</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Salary Calculator</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Contact</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Privacy & Terms</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-900 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} HireWave Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="hover:text-indigo-400 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-indigo-400 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
