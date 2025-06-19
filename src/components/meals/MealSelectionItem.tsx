import React, { lazy } from 'react';
import { CheckIcon } from 'lucide-react';
import { motion } from 'framer-motion';
interface Meal {
  id: number;
  name: string;
  description: string;
  image: string;
  tags: string[];
}
interface MealSelectionItemProps {
  meal: Meal;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: () => void;
}
export const MealSelectionItem = ({
  meal,
  isSelected,
  isDisabled,
  onSelect
}: MealSelectionItemProps) => {
  return <motion.div layout initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: -20
  }} className={`
        relative p-4 border rounded-xl transition-colors cursor-pointer
        ${isSelected ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
      `} onClick={() => !isDisabled && onSelect()}>
      <div className="flex gap-4">
        <img src={meal.image} alt={meal.name} className="w-20 h-20 rounded-lg object-cover" loading="lazy" />
        <div>
          <h3 className="font-medium text-gray-900">{meal.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2 mb-2">
            {meal.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {meal.tags.map(tag => <span key={tag} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                {tag}
              </span>)}
          </div>
        </div>
        {isSelected && <div className="absolute top-4 right-4">
            <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
              <CheckIcon className="w-4 h-4 text-white" />
            </div>
          </div>}
      </div>
    </motion.div>;
};