import React from 'react';
export const MealCardSkeleton = () => {
  return <div className="group flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="relative aspect-[4/3] bg-gray-200">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shimmer" />
      </div>
      <div className="flex flex-col flex-grow p-4 space-y-4">
        {/* Title placeholder */}
        <div className="h-6 bg-gray-200 rounded-md w-3/4">
          <div className="h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shimmer" />
        </div>
        {/* Description placeholder - two lines */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded-md w-full">
            <div className="h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shimmer" />
          </div>
          <div className="h-4 bg-gray-200 rounded-md w-5/6">
            <div className="h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shimmer" />
          </div>
        </div>
        {/* Tags placeholder */}
        <div className="flex flex-wrap gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-16">
            <div className="h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shimmer" />
          </div>
          <div className="h-6 bg-gray-200 rounded-full w-20">
            <div className="h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shimmer" />
          </div>
        </div>
        {/* Price and button placeholder */}
        <div className="flex items-center justify-between mt-auto pt-4">
          <div className="h-6 bg-gray-200 rounded-md w-16">
            <div className="h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shimmer" />
          </div>
          <div className="h-10 bg-gray-200 rounded-lg w-28">
            <div className="h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shimmer" />
          </div>
        </div>
      </div>
      <style jsx>{`
        .shimmer {
          animation: shimmer 2s infinite linear;
          background-size: 400% 100%;
        }
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>;
};