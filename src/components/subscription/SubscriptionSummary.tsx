import React from 'react';
import { Button } from '../ui/Button';
import { ChevronRightIcon, AlertCircleIcon, Loader2Icon } from 'lucide-react';
import GradientText from '../GradientText';
interface SubscriptionSummaryProps {
  weeks: number;
  selectedMeals: string[];
  planName: string | null;
  onAddToCart: () => void;
  onBack: () => void;
}
export const SubscriptionSummary: React.FC<SubscriptionSummaryProps> = ({
  weeks,
  selectedMeals,
  planName,
  onAddToCart,
  onBack
}) => {
  const remainingSelections = 3 - selectedMeals.length;
  const pricePerMeal = planName === 'Family Plan' ? 6.99 : 7.99;
  return <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold mb-6">
        <GradientText variant="primary">Subscription Summary</GradientText>
      </h3>
      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Duration</span>
          <span className="font-medium text-gray-900">
            {weeks} {weeks === 1 ? 'week' : 'weeks'}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Meals Selected</span>
          <span className="font-medium text-gray-900">
            {selectedMeals.length} of 3
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Price per Meal</span>
          <span className="font-medium text-gray-900">
            ${pricePerMeal.toFixed(2)}
          </span>
        </div>
      </div>
      {remainingSelections > 0 && <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg mb-6" role="alert" aria-live="polite">
          <AlertCircleIcon className="w-4 h-4 flex-shrink-0" />
          <span>
            Please select {remainingSelections} more meal
            {remainingSelections !== 1 ? 's' : ''} to continue
          </span>
        </div>}
      <div className="flex flex-col gap-3">
        <Button onClick={onAddToCart} disabled={selectedMeals.length !== 3} className="w-full group">
          {selectedMeals.length === 3 ? <>
              Add to Cart
              <ChevronRightIcon className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </> : <>
              Select {remainingSelections} More Meal
              {remainingSelections !== 1 ? 's' : ''}
              <Loader2Icon className="ml-2 w-4 h-4 animate-spin" />
            </>}
        </Button>
        <Button variant="outline" onClick={onBack} className="w-full">
          Back
        </Button>
      </div>
    </div>;
};