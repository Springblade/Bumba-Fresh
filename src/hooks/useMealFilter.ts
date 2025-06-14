import { useState, useMemo, useCallback, useEffect } from 'react';
import { useDebounce } from './useDebounce';
interface Meal {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  tags: string[];
  category: string[];
  overlayBadge?: string;
  isNew?: boolean;
}
export function useMealFilter(initialMeals: Meal[], itemsPerPage: number) {
  // States with memoized initial values
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuickFilter, setActiveQuickFilter] = useState('all');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  // Debounced values
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const debouncedQuickFilter = useDebounce(activeQuickFilter, 300);
  // Memoized filter functions
  const filterByQuickFilter = useCallback((meal: Meal, filter: string) => {
    return filter === 'all' || filter === 'new' && meal.isNew || meal.category.includes(filter);
  }, []);
  const filterByDetailedFilters = useCallback((meal: Meal, filters: string[]) => {
    return filters.length === 0 || filters.every(filter => meal.tags.includes(filter));
  }, []);
  const filterBySearch = useCallback((meal: Meal, query: string) => {
    if (!query) return true;
    const searchLower = query.toLowerCase();
    return meal.name.toLowerCase().includes(searchLower) || meal.description.toLowerCase().includes(searchLower) || meal.tags.some(tag => tag.toLowerCase().includes(searchLower));
  }, []);
  // Compute filtered meals with optimized filtering
  const filteredMeals = useMemo(() => {
    setIsLoading(true);
    const filtered = initialMeals.filter(meal => filterByQuickFilter(meal, debouncedQuickFilter) && filterByDetailedFilters(meal, selectedFilters) && filterBySearch(meal, debouncedSearchQuery));
    setIsLoading(false);
    return filtered;
  }, [initialMeals, debouncedSearchQuery, debouncedQuickFilter, selectedFilters, filterByQuickFilter, filterByDetailedFilters, filterBySearch]);
  // Compute paginated meals and total pages with memoization
  const paginatedData = useMemo(() => {
    const total = Math.ceil(filteredMeals.length / itemsPerPage);
    const start = (page - 1) * itemsPerPage;
    const paginated = filteredMeals.slice(start, start + itemsPerPage);
    return {
      paginatedMeals: paginated,
      totalPages: total,
      totalResults: filteredMeals.length
    };
  }, [filteredMeals, page, itemsPerPage]);
  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchQuery, debouncedQuickFilter, selectedFilters]);
  // Memoized state updates
  const updateSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);
  const updateQuickFilter = useCallback((filter: string) => {
    setActiveQuickFilter(filter);
  }, []);
  const updateSelectedFilters = useCallback((filters: string[]) => {
    setSelectedFilters(filters);
  }, []);
  const updatePage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);
  return {
    ...paginatedData,
    searchQuery,
    setSearchQuery: updateSearchQuery,
    activeQuickFilter,
    setActiveQuickFilter: updateQuickFilter,
    selectedFilters,
    setSelectedFilters: updateSelectedFilters,
    page,
    setPage: updatePage,
    isLoading,
    hasFilters: Boolean(debouncedSearchQuery || debouncedQuickFilter !== 'all' || selectedFilters.length > 0)
  };
}