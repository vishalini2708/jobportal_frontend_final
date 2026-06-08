import React from 'react';

export default function SkeletonLoader({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="glass rounded-2xl p-6 border border-slate-800/80 shadow-lg flex flex-col justify-between h-56">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {/* Logo block */}
              <div className="w-12 h-12 rounded-xl skeleton-pulse bg-slate-800"></div>
              <div className="space-y-2 flex-1">
                {/* Title line */}
                <div className="h-4 w-3/4 rounded skeleton-pulse bg-slate-800"></div>
                {/* Company line */}
                <div className="h-3 w-1/2 rounded skeleton-pulse bg-slate-800"></div>
              </div>
            </div>
            
            {/* Meta details */}
            <div className="flex items-center space-x-3 pt-2">
              <div className="h-3 w-16 rounded skeleton-pulse bg-slate-800"></div>
              <div className="h-3 w-20 rounded skeleton-pulse bg-slate-800"></div>
              <div className="h-3 w-24 rounded skeleton-pulse bg-slate-800"></div>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-4 mt-4 flex justify-between items-center">
            {/* Salary block */}
            <div className="h-4 w-28 rounded skeleton-pulse bg-slate-800"></div>
            {/* Action button */}
            <div className="h-9 w-20 rounded-lg skeleton-pulse bg-slate-800"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
