import React, { useEffect, useState, createContext, useContext } from 'react';
type CartItem = {
  id: number;
  name: string;
  price: string;
  quantity: number;
};
type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  cartCount: number;
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
  const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === newItem.id);
      if (existingItem) {
        return currentItems.map(item => item.id === newItem.id ? {
          ...item,
          quantity: item.quantity + 1
        } : item);
      }
      return [...currentItems, {
        ...newItem,
        quantity: 1
      }];
    });
  };
  const removeFromCart = (id: number) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  return <CartContext.Provider value={{
    items,
    addToCart,
    removeFromCart,
    cartCount
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