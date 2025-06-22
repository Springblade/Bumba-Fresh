import React from 'react';
import { SearchXIcon, FilterXIcon } from 'lucide-react';
import { Button } from './Button';
interface EmptyStateProps {
  onClearFilters?: () => void;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;  // Add icon prop
}
export const EmptyState = ({
  onClearFilters,
  title = 'No Meals Found',
  description = "We couldn't find any meals matching your search. Try adjusting your filters or search for another dish.",
  action,
  icon  // Add icon to destructuring
}: EmptyStateProps) => {
  return <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Display icon if provided */}
      {icon && (
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary-100 rounded-full scale-150 opacity-20 animate-pulse" />
          <div className="relative text-primary-600">{icon}</div>
        </div>
      )}
      <h2 className="text-2xl font-semibold text-gray-900 mb-3">{title}</h2>
      <p className="text-gray-600 max-w-md mb-8">{description}</p>
      {action}
    </div>;
};