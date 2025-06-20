import React, { useEffect, useState } from 'react';
import { XIcon } from 'lucide-react';
type FilterGroup = {
  name: string;
  filters: string[];
};
type FilterModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
  onReset: () => void;
};
const FilterModal = ({
  isOpen,
  onClose,
  selectedFilters,
  onFilterChange,
  onReset
}: FilterModalProps) => {
  const [tempFilters, setTempFilters] = useState<string[]>([]);
  useEffect(() => {
    setTempFilters(selectedFilters);
  }, [selectedFilters]);
  const filterGroups: FilterGroup[] = [{
    name: 'Dietary',
    filters: ['Vegetarian', 'Vegan', 'Gluten Free', 'High Protein']
  }, {
    name: 'Preferences',
    filters: ['Spicy', 'Mediterranean', 'Asian', 'Low Carb']
  }];
  const handleCheckboxChange = (filter: string) => {
    setTempFilters(prev => prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]);
  };
  const handleApply = () => {
    onFilterChange(tempFilters);
    onClose();
  };
  const handleReset = () => {
    setTempFilters([]);
    onReset();
    onClose();
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Filter Meals</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {filterGroups.map(group => <div key={group.name} className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                {group.name}
              </h3>
              <div className="space-y-2">
                {group.filters.map(filter => <label key={filter} className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" checked={tempFilters.includes(filter)} onChange={() => handleCheckboxChange(filter)} className="form-checkbox h-5 w-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500 cursor-pointer" />
                    <span className="text-gray-700 group-hover:text-gray-900">
                      {filter}
                    </span>
                  </label>)}
              </div>
            </div>)}
        </div>
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-4">
          <button onClick={handleReset} className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors">
            Reset
          </button>
          <button onClick={handleApply} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
            Apply Filters
          </button>
        </div>
      </div>
    </div>;
};
export default FilterModal;