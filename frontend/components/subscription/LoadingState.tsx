import React from 'react';
import { Loader2Icon } from 'lucide-react';
export const LoadingState = () => {
  return <div className="flex flex-col items-center justify-center py-12">
      <Loader2Icon className="w-8 h-8 text-primary-600 animate-spin mb-4" />
      <p className="text-gray-600 text-sm">
        Loading your subscription details...
      </p>
    </div>;
};