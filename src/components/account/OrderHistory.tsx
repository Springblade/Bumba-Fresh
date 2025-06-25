import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight as ChevronRightIcon, UtensilsIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { getUserOrders } from '../../services/orders';

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: number;
}
const statusStyles: Record<OrderStatus, {
  bg: string;
  text: string;
  label: string;
}> = {
  pending: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    label: 'Pending'
  },
  confirmed: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    label: 'Confirmed'
  },
  preparing: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    label: 'Preparing'
  },
  shipped: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    label: 'Shipped'
  },
  delivered: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    label: 'Delivered'
  },
  cancelled: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    label: 'Cancelled'
  }
};
export const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log(' Fetching user orders...');
        const response = await getUserOrders();
        console.log(' Received response:', response);
        
        // Handle different response formats
        let apiOrders = [];
        
        if (Array.isArray(response)) {
          apiOrders = response;
        } else if (response && typeof response === 'object') {
          if (Array.isArray(response.orders)) {
            apiOrders = response.orders;
          } else if (Array.isArray(response.data)) {
            apiOrders = response.data;
          } else if (response.message && response.message.includes('No orders found')) {
            // Handle case where user has no orders
            console.log('ℹ No orders found for user');
            setOrders([]);
            setIsLoading(false);
            return;
          }
        }
        
        // If we still don't have an array, log the issue but don't throw an error
        if (!Array.isArray(apiOrders)) {
          console.error(' Could not extract orders array from response:', response);
          apiOrders = []; // Set to empty array instead of throwing
        }
        
        // Transform API orders to component format with safe fallbacks
        const transformedOrders: Order[] = [];
        
        for (const apiOrder of apiOrders) {
          try {
            // Skip if not an object
            if (!apiOrder || typeof apiOrder !== 'object') {
              console.warn(' Skipping invalid order object:', apiOrder);
              continue;
            }
            
            // Extract order ID with fallbacks
            const orderId = apiOrder.order_id || apiOrder.id || apiOrder.orderId || 'unknown';
            
            // Format order ID for display
            const displayId = `BUMBA-${orderId}`;
            
            // Extract date with fallbacks
            const dateStr = apiOrder.order_date || apiOrder.date || apiOrder.created_at || new Date().toISOString();
            
            // Extract total with fallbacks
            const totalPrice = apiOrder.total_price || apiOrder.total || apiOrder.totalPrice || 0;
            
            // Extract status with fallbacks and validation
            let status = (apiOrder.status || 'pending').toLowerCase();
            if (!Object.keys(statusStyles).includes(status)) {
              console.warn(` Unknown status "${status}", defaulting to "pending"`);
              status = 'pending';
            }
            
            // Extract items count with fallbacks
            const itemsCount = apiOrder.items_count || 
                              (apiOrder.items ? apiOrder.items.length : 0) || 
                              apiOrder.itemsCount || 
                              0;
            
            transformedOrders.push({
              id: displayId,
              date: dateStr,
              total: Number(totalPrice),
              status: status as OrderStatus,
              items: Number(itemsCount)
            });
          } catch (err) {
            // Log but continue processing other orders
            console.warn(' Error transforming order:', err);
          }
        }
        
        console.log(' Transformed orders:', transformedOrders);
        setOrders(transformedOrders);
      } catch (err) {
        console.error(' Error fetching orders:', err);
        
        // Don't throw the error - just set error state
        // Check if it's an authentication error
        if (err instanceof Error) {
          if (err.message.includes('Authorization') || err.message.includes('401')) {
            setError('Please log in to view your order history');
          } else if (err.message.includes('Validation')) {
            setError('Failed to load orders: Please try again later');
          } else {
            setError(`Failed to load orders: ${err.message}`);
          }
        } else {
          setError('Failed to load orders: Unknown error');
        }
        
        setOrders([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <div className="space-y-2">
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
          <Button onClick={() => navigate('/menu')} variant="primary" className="ml-2">
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState 
        icon={<UtensilsIcon className="w-12 h-12" />} 
        title="No orders yet" 
        description="You haven't placed any orders yet. Start exploring our delicious meals!" 
        action={
          <Button onClick={() => navigate('/menu')} size="lg">
            Start Shopping
          </Button>
        } 
      />
    );
  }

  return (
    <div className="space-y-4">
      {orders.map(order => (
        <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">{order.id}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-sm text-gray-500">Date Placed</p>
              <p className="font-medium">
                {new Date(order.date).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-medium">${order.total.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Status</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                  ${statusStyles[order.status].bg} 
                  ${statusStyles[order.status].text}
                `}>
                {statusStyles[order.status].label}
              </span>
            </div>
            <Button onClick={() => navigate(`/account/orders/${order.id}`)} variant="outline" className="ml-4">
              View Details
              <ChevronRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
