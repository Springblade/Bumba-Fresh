import React, { createContext, useContext } from 'react';
import { CartItem, SubscriptionItem, CartState } from '../types';
interface CartContextValue {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  addSubscription: (subscription: SubscriptionItem) => void;
  removeSubscription: (planName: string) => void;
  clearCart: () => void;
}
export const CartContext = createContext<CartContextValue | null>(null);
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};