import MealCard from './MealCard';
import { EmptyState } from '../../../components/ui/EmptyState';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import type { BaseMeal } from '../../../types/shared';

// Updated interface to match what MealCard expects
interface MealGridProps {
  meals: Array<BaseMeal & {
    prepTime: string;
    calories: string;
  }>;
  isLoading: boolean;
  onAddToCart: (meal: BaseMeal & { prepTime: string; calories: string }) => void;
  onLike: (id: number) => Promise<void>;
  likedMeals: number[];
  recentlyAdded: number[];
}

export const MealGrid = ({
  meals,
  isLoading,
  onAddToCart,
  onLike,
  likedMeals,
  recentlyAdded
}: MealGridProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (meals.length === 0) {
    return (
      <EmptyState 
        title="No Meals Found" 
        description="We couldn't find any meals matching your criteria." 
      />
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {meals.map(meal => (
        <MealCard 
          key={meal.id} 
          meal={meal}
          onAddToCart={onAddToCart} 
          onLike={onLike} 
          isLiked={likedMeals.includes(meal.id)} 
          recentlyAdded={recentlyAdded.includes(meal.id)} 
        />
      ))}
    </div>
  );
};