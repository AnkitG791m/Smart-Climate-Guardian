import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = 'h-6 w-full' }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-xl ${className}`}
      role="status"
      aria-label="Loading..."
    />
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Header Skeleton */}
      <div className="h-24 bg-slate-200 dark:bg-[#111c19] rounded-2xl animate-pulse" />
      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 h-80 bg-slate-200 dark:bg-[#111c19] rounded-2xl animate-pulse" />
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-36 bg-slate-200 dark:bg-[#111c19] rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
      {/* Charts Skeleton */}
      <div className="h-72 bg-slate-200 dark:bg-[#111c19] rounded-2xl animate-pulse" />
    </div>
  );
};
