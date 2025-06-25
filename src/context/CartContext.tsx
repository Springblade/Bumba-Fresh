import React, { useEffect, useState, createContext, useContext } from 'react';
type MealItem = {
  type: 'meal';
  id: number;
  name: string;
  price: string;
  quantity: number;
  image?: string;
};
export interface SubscriptionItem {
  type: 'subscription';
  planName: string;
  weeks: number;
  mealsByWeek: string[][];
  totalCost: number;
  billingFrequency: 'weekly' | 'monthly';
};
type CartItem = MealItem | SubscriptionItem;
type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<MealItem, 'type' | 'quantity'>) => void;
  addSubscriptionItem: (item: SubscriptionItem) => void;
  removeFromCart: (id: number | string) => void;
  clearCart: () => void;
  cartCount: number;
  updateSubscriptionPlan: (planName: string, updatedData: Partial<SubscriptionItem>) => void;
  hasSubscription: () => boolean;
  incrementQuantity: (mealId: number) => void;
  decrementQuantity: (mealId: number) => void;
};
const CartContext = createContext<CartContextType | undefined>(undefined);
export function CartProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);
  const addToCart = (newItem: Omit<MealItem, 'type' | 'quantity'>) => {
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
  };
  const incrementQuantity = (mealId: number) => {
    setItems(currentItems => currentItems.map(item => item.type === 'meal' && item.id === mealId ? {
      ...item,
      quantity: item.quantity + 1
    } : item));
  };
  const decrementQuantity = (mealId: number) => {
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
  };
  const addSubscriptionItem = (item: SubscriptionItem) => {
    setItems(currentItems => {
      // Remove any existing subscription items first
      const filteredItems = currentItems.filter(i => i.type !== 'subscription');
      
      return [...filteredItems, {
        type: 'subscription',
        planName: item.planName,
        weeks: item.weeks,
        mealsByWeek: item.mealsByWeek,
        totalCost: item.totalCost,
        billingFrequency: item.billingFrequency
      }];
    });
  };
  const updateSubscriptionPlan = (planName: string, updatedData: Partial<SubscriptionItem>) => {
    setItems(currentItems => currentItems.map(item => item.type === 'subscription' && item.planName === planName ? {
      ...item,
      ...updatedData
    } : item));
  };
  const removeFromCart = (id: number | string) => {
    setItems(currentItems => currentItems.filter(item => item.type === 'meal' ? item.id !== id : item.planName !== id));
  };
  const clearCart = () => {
    setItems([]);
  };
  const hasSubscription = () => {
    return items.some(item => item.type === 'subscription');
  };
  const cartCount = items.reduce((total, item) => item.type === 'meal' ? total + item.quantity : total + 1, 0);
  return <CartContext.Provider value={{
    items,
    addToCart,
    addSubscriptionItem,
    removeFromCart,
    clearCart,
    cartCount,
    updateSubscriptionPlan,
    hasSubscription,
    incrementQuantity,
    decrementQuantity
  }}>
      {children}
    </CartContext.Provider>;
}
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
