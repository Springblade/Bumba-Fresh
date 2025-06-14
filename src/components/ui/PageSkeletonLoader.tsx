import React from 'react';
export const PageSkeletonLoader = () => {
  return <div className="min-h-screen flex flex-col animate-pulse">
      {/* Header */}
      <header className="w-full py-4 px-6 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="h-8 w-32 bg-gray-200 rounded-lg" />
          <div className="flex items-center space-x-6">
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-8 w-8 bg-gray-200 rounded-full" />
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="h-8 w-48 bg-gray-200 rounded-lg mb-8" />
          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-8 space-y-6">
              {[...Array(3)].map((_, i) => <div key={i} className="bg-white p-6 rounded-xl border border-gray-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0" />
                    <div className="flex-grow space-y-3">
                      <div className="h-6 w-3/4 bg-gray-200 rounded" />
                      <div className="h-4 w-1/2 bg-gray-200 rounded" />
                      <div className="h-4 w-1/4 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>)}
            </div>
            {/* Right Column */}
            <div className="lg:col-span-4">
              <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
                <div className="h-6 w-32 bg-gray-200 rounded" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-4 w-1/2 bg-gray-200 rounded" />
                </div>
                <div className="h-10 w-full bg-gray-200 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="w-full py-6 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => <div key={i} className="space-y-3">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
                <div className="h-3 w-16 bg-gray-200 rounded" />
              </div>)}
          </div>
        </div>
      </footer>
      {/* Shimmer Effect Overlay */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-pulse {
          position: relative;
          overflow: hidden;
        }
        .animate-pulse::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>;
};