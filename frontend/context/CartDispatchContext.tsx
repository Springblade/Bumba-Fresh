import React, { createContext, useContext } from 'react';
import { CartMeal as MealItem } from '../types/shared';

// Define SubscriptionItem here since it's not directly available in shared.ts
interface SubscriptionItem {
  type: 'subscription';
  planName: string;
  weeks: number;
  mealsByWeek: string[][];
  totalCost: number;
  billingFrequency: 'weekly' | 'monthly';
}

interface CartDispatch {
  addToCart: (item: Omit<MealItem, 'type' | 'quantity'>) => void;
  addSubscriptionItem: (item: Omit<SubscriptionItem, 'type'>) => void;
  removeFromCart: (id: number | string) => void;
  clearCart: () => void;
  incrementQuantity: (mealId: number) => void;
  decrementQuantity: (mealId: number) => void;
  updateSubscriptionPlan: (planName: string, updatedData: Partial<SubscriptionItem>) => void;
}
const CartDispatchContext = createContext<CartDispatch | undefined>(undefined);
export function useCartDispatch() {
  const context = useContext(CartDispatchContext);
  if (context === undefined) {
    throw new Error('useCartDispatch must be used within a CartProvider');
  }
  return context;
}
export { CartDispatchContext };
