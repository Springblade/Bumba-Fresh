import React, { useCallback, memo } from 'react';
import { Search as SearchIcon, Filter as FilterIcon } from 'lucide-react';
import { motion } from 'framer-motion';
interface FilterSystemProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  selectedFilters: string[];
  onOpenDetailedFilters: () => void;
  quickFilters: Array<{
    id: string;
    label: string;
    icon: React.ElementType;
  }>;
  totalResults?: number;
}
export const FilterSystem = memo(({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  selectedFilters,
  onOpenDetailedFilters,
  quickFilters,
  totalResults
}: FilterSystemProps) => {
  // Memoize search handler
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);
  // Memoize filter button click handler
  const handleFilterClick = useCallback((filterId: string) => () => {
    onFilterChange(filterId);
  }, [onFilterChange]);
  return <div className="max-w-3xl mx-auto mb-12">
        {/* Search input */}
        <div className="relative mb-8">
          <input type="search" placeholder="Search meals..." value={searchQuery} onChange={handleSearchChange} className="w-full px-6 py-4 pl-12 rounded-full border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 text-lg" role="searchbox" aria-label="Search meals" />
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" aria-hidden="true" />
          {totalResults !== undefined && <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
              {totalResults} results
            </div>}
        </div>
        {/* Quick filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8" role="tablist">
          {quickFilters.map(filter => {
        const Icon = filter.icon;
        const isActive = activeFilter === filter.id;
        return <motion.button key={filter.id} onClick={handleFilterClick(filter.id)} whileTap={{
          scale: 0.95
        }} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors
                  ${isActive ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`} role="tab" aria-selected={isActive} aria-controls={`meals-${filter.id}`}>
                <Icon className="w-4 h-4" aria-hidden="true" />
                {filter.label}
              </motion.button>;
      })}
          <motion.button onClick={onOpenDetailedFilters} whileTap={{
        scale: 0.95
      }} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors bg-white text-gray-600 hover:bg-gray-50 border border-gray-200" aria-label="Open filters">
            <FilterIcon className="w-4 h-4" aria-hidden="true" />
            Filter
            {selectedFilters.length > 0 && <span className="ml-1 px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs">
                {selectedFilters.length}
              </span>}
          </motion.button>
        </div>
      </div>;
});
FilterSystem.displayName = 'FilterSystem';