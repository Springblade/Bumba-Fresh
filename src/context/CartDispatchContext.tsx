import React, { createContext, useContext } from 'react';
import { MealItem, SubscriptionItem } from './types';
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