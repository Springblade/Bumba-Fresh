import React, { lazy, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check as CheckIcon } from 'lucide-react';
interface Meal {
  id: number;
  name: string;
  image: string;
  description: string;
  tags: string[];
}
interface MealSelectionGridProps {
  meals: Meal[];
  selectedMeals: number[];
  onToggleMeal: (id: number) => void;
  maxSelections: number;
}
export const MealSelectionGrid = memo(({
  meals,
  selectedMeals,
  onToggleMeal,
  maxSelections
}: MealSelectionGridProps) => {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {meals.map(meal => {
        const isSelected = selectedMeals.includes(meal.id);
        const isDisabled = !isSelected && selectedMeals.length >= maxSelections;
        return <motion.div key={meal.id} layout initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} exit={{
          opacity: 0,
          y: -20
        }} className={`
                relative rounded-lg border overflow-hidden transition-all
                ${isSelected ? 'border-primary-600 ring-2 ring-primary-100' : 'border-gray-200'}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-300'}
              `} onClick={() => !isDisabled && onToggleMeal(meal.id)}>
                <div className="flex gap-4 p-4">
                  <img src={meal.image} alt={meal.name} className="w-24 h-24 rounded-md object-cover" loading="lazy" />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                      {meal.name}
                    </h3>
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
                      <motion.div initial={{
                scale: 0
              }} animate={{
                scale: 1
              }} className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                        <CheckIcon className="w-4 h-4 text-white" />
                      </motion.div>
                    </div>}
                </div>
              </motion.div>;
      })}
        </AnimatePresence>
      </div>;
});
MealSelectionGrid.displayName = 'MealSelectionGrid';