import React, { useCallback, useMemo, createContext, useContext, useReducer } from 'react';
type CartItem = {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
  type: 'meal';
};
type SubscriptionItem = {
  planName: string;
  weeks: number;
  mealsByWeek: string[][];
  totalCost: number;
  billingFrequency: 'weekly' | 'monthly';
  type: 'subscription';
};
type CartAction = {
  type: 'ADD_ITEM';
  payload: CartItem;
} | {
  type: 'REMOVE_ITEM';
  payload: number;
} | {
  type: 'UPDATE_QUANTITY';
  payload: {
    id: number;
    quantity: number;
  };
} | {
  type: 'ADD_SUBSCRIPTION';
  payload: SubscriptionItem;
} | {
  type: 'REMOVE_SUBSCRIPTION';
  payload: string;
} | {
  type: 'CLEAR_CART';
};
type CartState = {
  items: (CartItem | SubscriptionItem)[];
  total: number;
};
const CartContext = createContext<{
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  addSubscription: (subscription: SubscriptionItem) => void;
  removeSubscription: (planName: string) => void;
  clearCart: () => void;
} | null>(null);
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      {
        const existingItem = state.items.find(item => 'id' in item && item.id === action.payload.id);
        if (existingItem && 'quantity' in existingItem) {
          return {
            ...state,
            items: state.items.map(item => 'id' in item && item.id === action.payload.id ? {
              ...item,
              quantity: item.quantity + 1
            } : item)
          };
        }
        return {
          ...state,
          items: [...state.items, action.payload]
        };
      }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => !('id' in item) || item.id !== action.payload)
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item => 'id' in item && item.id === action.payload.id ? {
          ...item,
          quantity: action.payload.quantity
        } : item)
      };
    case 'ADD_SUBSCRIPTION':
      {
        const existingSubscriptionIndex = state.items.findIndex(item => 'type' in item && item.type === 'subscription' && item.planName === action.payload.planName);
        if (existingSubscriptionIndex > -1) {
          return {
            ...state,
            items: state.items.map((item, index) => index === existingSubscriptionIndex ? action.payload : item)
          };
        }
        return {
          ...state,
          items: [...state.items, action.payload]
        };
      }
    case 'REMOVE_SUBSCRIPTION':
      return {
        ...state,
        items: state.items.filter(item => !('planName' in item) || item.planName !== action.payload)
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };
    default:
      return state;
  }
};
export const CartProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0
  });
  const addItem = useCallback((item: CartItem) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: item
    });
  }, []);
  const removeItem = useCallback((id: number) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: id
    });
  }, []);
  const updateQuantity = useCallback((id: number, quantity: number) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: {
        id,
        quantity
      }
    });
  }, []);
  const addSubscription = useCallback((subscription: SubscriptionItem) => {
    dispatch({
      type: 'ADD_SUBSCRIPTION',
      payload: subscription
    });
  }, []);
  const removeSubscription = useCallback((planName: string) => {
    dispatch({
      type: 'REMOVE_SUBSCRIPTION',
      payload: planName
    });
  }, []);
  const clearCart = useCallback(() => {
    dispatch({
      type: 'CLEAR_CART'
    });
  }, []);
  const value = useMemo(() => ({
    state,
    addItem,
    removeItem,
    updateQuantity,
    addSubscription,
    removeSubscription,
    clearCart
  }), [state, addItem, removeItem, updateQuantity, addSubscription, removeSubscription, clearCart]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};