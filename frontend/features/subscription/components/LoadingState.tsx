import React from 'react';
export const LoadingState = () => {
  return <div className="space-y-6 animate-pulse">
      {[1, 2, 3].map(index => <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start space-x-4">
            <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0" />
            <div className="flex-grow space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        </div>)}
    </div>;
};