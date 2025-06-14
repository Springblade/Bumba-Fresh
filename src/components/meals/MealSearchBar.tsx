import React from 'react';
import { SearchIcon } from 'lucide-react';
interface MealSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}
export const MealSearchBar = ({
  value,
  onChange
}: MealSearchBarProps) => {
  return <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input type="search" placeholder="Search meals..." value={value} onChange={e => onChange(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" aria-label="Search meals" />
    </div>;
};