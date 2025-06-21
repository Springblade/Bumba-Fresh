import { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { useAuth } from '../context/AuthContext';

export interface Order {
  order_id: number;
  user_id: number;
  total_price: string | number; // Database can return this as string
  status: string;
  order_date: string;
}

export interface OrderHistoryItem {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  orderId: number; // Keep the original order ID for fetching details
  meals?: OrderMeal[]; // Optional meal details
}

export interface OrderMeal {
  meal_id: number;
  meal: string;
  quantity: number | string; // Database can return this as string
  unit_price: number | string; // Database can return this as string
}

// Map database status to UI status
const mapOrderStatus = (dbStatus: string): OrderHistoryItem['status'] => {
  switch (dbStatus?.toLowerCase()) {
    case 'pending':
      return 'pending';
    case 'confirmed':
      return 'confirmed';
    case 'preparing':
      return 'preparing';
    case 'shipped':
      return 'shipped';
    case 'delivered':
      return 'delivered';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'pending';
  }
};

// Convert database order to UI format
const transformOrder = (dbOrder: Order): OrderHistoryItem => ({
  id: `BUMBA-${dbOrder.order_id.toString().padStart(5, '0')}`,
  orderId: dbOrder.order_id,
  date: dbOrder.order_date,
  total: parseFloat(String(dbOrder.total_price)) || 0,
  status: mapOrderStatus(dbOrder.status),
  items: 1 // Default to 1, will be updated when meal details are fetched
});

export const useOrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('useOrderHistory: Hook initialized, user:', user);

  const fetchOrders = async () => {
    console.log('useOrderHistory: fetchOrders called, user:', user);
    
    if (!user) {
      console.log('useOrderHistory: No user, setting empty orders and loading false');
      setOrders([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('useOrderHistory: Fetching orders for user:', user.email);
      const dbOrders = await orderService.getUserOrders();
      console.log('useOrderHistory: Raw orders from API:', dbOrders);
      
      // Transform orders and fetch meal details with individual error handling
      const transformedOrders = await Promise.allSettled(
        dbOrders.map(async (dbOrder) => {
          const baseOrder = transformOrder(dbOrder);
          
          try {
            // Fetch meal details for this order
            const meals = await orderService.getOrderMeals(dbOrder.order_id);
            console.log(`useOrderHistory: Fetched ${meals.length} meals for order ${dbOrder.order_id}`);
            
            // Calculate total items (sum of quantities)
            const totalItems = meals.reduce((sum: number, meal: any) => {
              const quantity = parseInt(String(meal.quantity || '0')) || 0;
              return sum + quantity;
            }, 0);
            
            return {
              ...baseOrder,
              items: totalItems || 1, // Fallback to 1 if no meals found
              meals: meals
            };
          } catch (error) {
            console.warn(`useOrderHistory: Failed to fetch meals for order ${dbOrder.order_id}:`, error);
            return baseOrder; // Return base order without meal details
          }
        })
      );
      
      // Extract successful results and filter out failed ones
      const successfulOrders = transformedOrders
        .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
        .map(result => result.value);
      
      console.log('useOrderHistory: Enhanced orders with meal details:', successfulOrders);
      setOrders(successfulOrders);
    } catch (error) {
      console.error('useOrderHistory: Error fetching orders:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch orders');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const refetch = () => {
    fetchOrders();
  };

  return {
    orders,
    isLoading,
    error,
    refetch
  };
};
