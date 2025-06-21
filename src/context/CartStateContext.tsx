import React, { createContext, useContext } from 'react';
import { CartMeal } from '../types/shared';

// Define SubscriptionItem here since it's not directly available in shared.ts
interface SubscriptionItem {
  type: 'subscription';
  planName: string;
  weeks: number;
  mealsByWeek: string[][];
  totalCost: number;
  billingFrequency: 'weekly' | 'monthly';
}

// Use CartMeal as MealItem for consistency
type MealItem = CartMeal;

interface CartState {
  items: (MealItem | SubscriptionItem)[];
  cartCount: number;
}
const CartStateContext = createContext<CartState | undefined>(undefined);
export function useCartState() {
  const context = useContext(CartStateContext);
  if (context === undefined) {
    throw new Error('useCartState must be used within a CartProvider');
  }
  return context;
}
export { CartStateContext };
