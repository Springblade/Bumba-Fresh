import React, { useState, useEffect } from 'react';
import { Select } from '../ui/Select';
import { Edit2Icon, CheckIcon } from 'lucide-react';
import { getAllMeals, Meal } from '../../services/meals';
import { motion, AnimatePresence } from 'framer-motion';
interface QuickSwapMealProps {
  currentMeal: string;
  onSwap: (newMeal: string) => void;
  disabled?: boolean;
}
export const QuickSwapMeal = ({
  currentMeal,
  onSwap,
  disabled = false
}: QuickSwapMealProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoadingMeals, setIsLoadingMeals] = useState(true);

  // Fetch meals on component mount
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setIsLoadingMeals(true);
        const apiMeals = await getAllMeals();
        setMeals(apiMeals);
      } catch (error) {
        console.error('Error fetching meals for swap:', error);
        setMeals([]);
      } finally {
        setIsLoadingMeals(false);
      }
    };

    fetchMeals();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMeal = e.target.value;
    if (newMeal !== currentMeal) {
      onSwap(newMeal);
      setIsEditing(false);
      // Show success indicator
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  const mealOptions = meals.map(meal => ({
    value: meal.name,
    label: meal.name
  }));

  if (isLoadingMeals) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">Loading meals...</span>
      </div>
    );
  }
  if (isEditing) {
    return <div className="flex items-center gap-2">
        <Select options={mealOptions} value={currentMeal} onChange={handleChange} className="w-64" autoFocus onBlur={() => setIsEditing(false)} />
      </div>;
  }
  return <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">{currentMeal}</span>
      <AnimatePresence>
        {showSuccess ? <motion.span initial={{
        opacity: 0,
        scale: 0.8
      }} animate={{
        opacity: 1,
        scale: 1
      }} exit={{
        opacity: 0,
        scale: 0.8
      }} className="text-success-500">
            <CheckIcon className="w-4 h-4" />
          </motion.span> : <button onClick={() => setIsEditing(true)} className="p-1 text-gray-400 hover:text-gray-600 transition-colors" disabled={disabled} title="Swap meal">
            <Edit2Icon className="w-4 h-4" />
          </button>}
      </AnimatePresence>
    </div>;
};