import React, { useCallback, useEffect, useState, Suspense, lazy } from 'react';
import { Dialog } from './ui/Dialog';
import { Button } from './ui/Button';
import { Loader2Icon } from 'lucide-react';
import { MealSearchBar } from './meals/MealSearchBar';
import { generateDummyMeals } from '../utils/mealGenerator';
import { MealSelectionGrid } from './subscription/MealSelectionGrid';
import { LoadingState } from './subscription/LoadingState';
import { ErrorState } from './subscription/ErrorState';
// Lazy load the MealSelectionItem component
const MealSelectionItem = lazy(() => import('./meals/MealSelectionItem').then(mod => ({
  default: mod.MealSelectionItem
})));
interface Meal {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  calories: string;
  prepTime: string;
  tags: string[];
}
interface MealSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedMeals: string[]) => void;
  mealsPerWeek: number;
  currentSelections?: string[];
  planName: string;
}
export const MealSelectionModal = ({
  isOpen,
  onClose,
  onSave,
  mealsPerWeek,
  currentSelections = [],
  planName
}: MealSelectionModalProps) => {
  const [selectedMeals, setSelectedMeals] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedMeals([]);
      setSearchQuery('');
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);
  // Memoized meals data
  const allMeals = generateDummyMeals(12);
  // Handle meal selection
  const handleToggleMeal = useCallback((mealId: number) => {
    setSelectedMeals(current => {
      if (current.includes(mealId)) {
        return current.filter(id => id !== mealId);
      }
      if (current.length >= mealsPerWeek) return current;
      return [...current, mealId];
    });
  }, [mealsPerWeek]);
  // Handle save
  const handleSave = useCallback(async () => {
    if (selectedMeals.length !== mealsPerWeek) return;
    setIsSaving(true);
    try {
      // Convert meal IDs to meal names before saving
      const selectedMealNames = selectedMeals.map(id => {
        const meal = allMeals.find(m => m.id === id);
        return meal ? meal.name : '';
      }).filter(name => name !== '');
      
      await onSave(selectedMealNames);
      onClose();
    } catch (error) {
      setError('Failed to save meal selections. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }, [selectedMeals, mealsPerWeek, onSave, onClose, allMeals]);
  if (error) {
    return <Dialog isOpen={isOpen} onClose={onClose} title="Error" description={error}>
        <ErrorState message={error} onRetry={() => setError(null)} />
      </Dialog>;
  }
  return <Dialog isOpen={isOpen} onClose={onClose} title={`Select Your Meals - ${planName}`} description={`Choose ${mealsPerWeek} meals for your subscription`}>
      <div className="space-y-6">
        <MealSearchBar value={searchQuery} onChange={setSearchQuery} />
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">
            Selected: {selectedMeals.length} of {mealsPerWeek}
          </span>
        </div>
        {/* Meal grid with loading state */}
        {isLoading ? <LoadingState /> : <MealSelectionGrid meals={allMeals} selectedMeals={selectedMeals} onToggleMeal={handleToggleMeal} maxSelections={mealsPerWeek} />}
      </div>
      {/* Footer */}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={selectedMeals.length !== mealsPerWeek || isSaving}>
          {isSaving ? <>
              <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </> : 'Save Selections'}
        </Button>
      </div>
    </Dialog>;
};
export default MealSelectionModal;
