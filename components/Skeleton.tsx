
import React from 'react';

export const PostSkeleton: React.FC = () => (
  <div className="bg-white/5 border border-white/5 rounded-sm p-8 animate-pulse mb-8">
    <div className="h-6 w-1/4 bg-white/10 rounded mb-6"></div>
    <div className="h-10 w-3/4 bg-white/10 rounded mb-4"></div>
    <div className="h-4 w-full bg-white/10 rounded mb-2"></div>
    <div className="h-4 w-full bg-white/10 rounded mb-2"></div>
    <div className="h-4 w-2/3 bg-white/10 rounded"></div>
  </div>
);

export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="h-20 bg-white/5 border border-white/5 rounded animate-pulse"></div>
    ))}
  </div>
);
