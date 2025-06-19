import React from 'react';
import { SearchXIcon, FilterXIcon } from 'lucide-react';
import { Button } from './Button';
interface EmptyStateProps {
  onClearFilters?: () => void;
  title?: string;
  description?: string;
}
export const EmptyState = ({
  onClearFilters,
  title = 'No Meals Found',
  description = "We couldn't find any meals matching your search. Try adjusting your filters or search for another dish."
}: EmptyStateProps) => {
  return <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-primary-100 rounded-full scale-150 opacity-20 animate-pulse" />
        <SearchXIcon className="w-16 h-16 text-primary-600 relative" />
      </div>
      <h2 className="text-2xl font-semibold text-gray-900 mb-3">{title}</h2>
      <p className="text-gray-600 max-w-md mb-8">{description}</p>
      {onClearFilters && <Button onClick={onClearFilters} variant="outline" leftIcon={<FilterXIcon className="w-4 h-4" />}>
          Clear All Filters
        </Button>}
    </div>;
};