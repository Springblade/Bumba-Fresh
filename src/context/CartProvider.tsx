import React, { useEffect, useMemo, useState } from 'react';
import { CartStateContext } from './CartStateContext';
import { CartDispatchContext } from './CartDispatchContext';
import { MealItem, SubscriptionItem } from './types';
export function CartProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<(MealItem | SubscriptionItem)[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  // Memoize state values
  const state = useMemo(() => ({
    items,
    cartCount: items.reduce((total, item) => item.type === 'meal' ? total + item.quantity : total + 1, 0)
  }), [items]);
  // Memoize dispatch functions
  const dispatch = useMemo(() => ({
    addToCart: (newItem: Omit<MealItem, 'type' | 'quantity'>) => {
      setItems(currentItems => {
        const existingItem = currentItems.find(item => item.type === 'meal' && item.id === newItem.id);
        if (existingItem && existingItem.type === 'meal') {
          return currentItems.map(item => item.type === 'meal' && item.id === newItem.id ? {
            ...item,
            quantity: item.quantity + 1
          } : item);
        }
        return [...currentItems, {
          type: 'meal',
          ...newItem,
          quantity: 1
        }];
      });
    },
    addSubscriptionItem: (item: Omit<SubscriptionItem, 'type'>) => {
      setItems(currentItems => {
        const filteredItems = currentItems.filter(item => item.type !== 'subscription');
        return [...filteredItems, {
          type: 'subscription',
          ...item
        }];
      });
    },
    removeFromCart: (id: number | string) => {
      setItems(currentItems => currentItems.filter(item => item.type === 'meal' ? item.id !== id : item.planName !== id));
    },
    clearCart: () => {
      setItems([]);
    },
    incrementQuantity: (mealId: number) => {
      setItems(currentItems => currentItems.map(item => item.type === 'meal' && item.id === mealId ? {
        ...item,
        quantity: item.quantity + 1
      } : item));
    },
    decrementQuantity: (mealId: number) => {
      setItems(currentItems => {
        const item = currentItems.find(item => item.type === 'meal' && item.id === mealId);
        if (item && item.type === 'meal') {
          if (item.quantity === 1) {
            return currentItems.filter(item => !(item.type === 'meal' && item.id === mealId));
          }
          return currentItems.map(item => item.type === 'meal' && item.id === mealId ? {
            ...item,
            quantity: item.quantity - 1
          } : item);
        }
        return currentItems;
      });
    },
    updateSubscriptionPlan: (planName: string, updatedData: Partial<SubscriptionItem>) => {
      setItems(currentItems => currentItems.map(item => item.type === 'subscription' && item.planName === planName ? {
        ...item,
        ...updatedData
      } : item));
    }
  }), []);
  // Save to localStorage when items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
  return <CartStateContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>;
}