import React from 'react';
import { Loader2Icon } from 'lucide-react';
export const SubscriptionLoadingState = () => {
  return <div className="flex items-center justify-center min-h-[200px]">
      <div className="flex flex-col items-center space-y-4">
        <Loader2Icon className="w-8 h-8 text-primary-600 animate-spin" />
        <p className="text-gray-600 text-sm">Processing your request...</p>
      </div>
    </div>;
};