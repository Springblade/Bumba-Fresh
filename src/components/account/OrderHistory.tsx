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
  const [error, setError] = useState<string | null>(null);  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('🔄 Fetching user orders...');
        const apiOrders = await getUserOrders();
        console.log('📦 Received orders:', apiOrders);
        
        // Validate that apiOrders is an array
        if (!Array.isArray(apiOrders)) {
          console.error('❌ API response is not an array:', apiOrders);
          throw new Error('Invalid response format: expected array of orders');
        }
        
        // Transform API orders to component format
        const transformedOrders: Order[] = apiOrders.map((apiOrder) => {
          // Validate each order object
          if (!apiOrder || typeof apiOrder !== 'object') {
            console.error('❌ Invalid order object:', apiOrder);
            throw new Error('Invalid order data received');
          }
          
          return {
            id: `BUMBA-${apiOrder.order_id}`,
            date: apiOrder.order_date,
            total: Number(apiOrder.total_price) || 0,
            status: apiOrder.status as OrderStatus,
            items: Number(apiOrder.items_count) || 0
          };
        });
        
        console.log('✅ Transformed orders:', transformedOrders);
        setOrders(transformedOrders);
      } catch (err) {
        console.error('❌ Error fetching orders:', err);
        
        // Don't throw the error - just set error state
        // Check if it's an authentication error
        if (err instanceof Error && (err.message.includes('Authorization') || err.message.includes('401'))) {
          setError('Please log in to view your order history');
        } else {
          setError(`Failed to load orders: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
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
  return <div className="space-y-4">
      {orders.map(order => <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-colors">
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
        </div>)}
    </div>;
};