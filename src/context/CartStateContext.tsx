import React, { createContext, useContext } from 'react';
import { MealItem, SubscriptionItem } from './types';
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