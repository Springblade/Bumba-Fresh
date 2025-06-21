import { useNavigate } from 'react-router-dom';
import { ChevronRight as ChevronRightIcon, RefreshCw, UtensilsIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../LoadingSpinner';
import { useOrderHistory } from '../../hooks/useOrderHistory';

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';

const statusStyles: Record<OrderStatus, {
  bg: string;
  text: string;
  label: string;
}> = {
  pending: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
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
    bg: 'bg-purple-100',
    text: 'text-purple-800',
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
  const { orders, isLoading, error, refetch } = useOrderHistory();

  // Debug console logs
  console.log('OrderHistory render:', { orders, isLoading, error });

  // Wrap entire component in try-catch for error handling
  try {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-64">
          <LoadingSpinner />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-red-800 font-medium mb-2">Error Loading Orders</h3>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <Button onClick={refetch} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-primary-100 rounded-full scale-150 opacity-20 animate-pulse" />
            <UtensilsIcon className="w-16 h-16 text-primary-600 relative" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">No orders yet</h2>
          <p className="text-gray-600 max-w-md mb-8">
            You haven't placed any orders yet. Start exploring our delicious meals!
          </p>
          <Button onClick={() => navigate('/menu')} size="lg">
            Start Shopping
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {orders.map((order, orderIndex) => {
          try {
            // Validate order object
            if (!order || typeof order !== 'object') {
              console.warn('OrderHistory: Invalid order at index', orderIndex, order);
              return null;
            }

            // Add detailed debugging for each order
            console.log(`OrderHistory: Rendering order ${orderIndex}:`, {
              id: order.id,
              orderId: order.orderId,
              status: order.status,
              total: order.total,
              items: order.items,
              date: order.date,
              meals: order.meals,
              mealsCount: order.meals?.length || 0
            });            // Validate critical properties before rendering
            const safeOrder = {
              id: order.id || `order-${orderIndex}`,
              orderId: order.orderId || order.id,
              status: order.status || 'pending',
              total: parseFloat(String(order.total || '0')) || 0,
              items: parseInt(String(order.items || '0')) || 0,
              date: order.date || new Date().toISOString(),
              meals: Array.isArray(order.meals) ? order.meals : []
            };

            console.log(`OrderHistory: Safe order data for ${orderIndex}:`, safeOrder);

            return (
              <div key={safeOrder.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-medium">{safeOrder.id}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-sm text-gray-500">Date Placed</p>
                    <p className="font-medium">
                      {safeOrder.date ? new Date(safeOrder.date).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-sm text-gray-500">Items</p>
                    <p className="font-medium">{safeOrder.items} item{safeOrder.items !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-medium">${safeOrder.total.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                        ${statusStyles[safeOrder.status].bg} 
                        ${statusStyles[safeOrder.status].text}
                      `}>
                      {statusStyles[safeOrder.status].label}
                    </span>
                  </div>
                  <Button onClick={() => navigate(`/account/orders/${safeOrder.orderId}`)} variant="outline" className="ml-4">
                    View Details
                    <ChevronRightIcon className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                
                {/* Meal Summary */}
                {safeOrder.meals.length > 0 && (
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Order Items:</h4>
                    <div className="space-y-2">                      {safeOrder.meals.slice(0, 3).map((meal, index) => {
                        try {
                          console.log(`OrderHistory: Rendering meal ${index} for order ${orderIndex}:`, meal);
                            // Convert string values to numbers (database returns strings)
                          const quantity = parseInt(String(meal?.quantity || '0')) || 0;
                          const mealName = meal?.meal || 'Unknown Item';
                          const unitPrice = parseFloat(String(meal?.unit_price || '0')) || 0;
                          
                          return (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <span className="text-gray-600">
                                {quantity}x {mealName}
                              </span>
                              <span className="text-gray-500">
                                ${(quantity * unitPrice).toFixed(2)}
                              </span>
                            </div>
                          );
                        } catch (mealError) {
                          console.error('OrderHistory: Error rendering meal:', meal, mealError);
                          return (
                            <div key={index} className="text-sm text-red-600">
                              Error loading meal item
                            </div>
                          );
                        }
                      })}
                      {safeOrder.meals.length > 3 && (
                        <div className="text-sm text-gray-500 italic">
                          +{safeOrder.meals.length - 3} more item{safeOrder.meals.length - 3 !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          } catch (orderError) {
            console.error('OrderHistory: Error rendering order at index', orderIndex, 'Order data:', order, 'Error:', orderError);
            return (
              <div key={`error-${orderIndex}`} className="bg-red-50 border border-red-200 rounded-xl p-6">
                <p className="text-red-800 font-medium">Error loading order</p>
                <p className="text-red-600 text-sm">Order ID: {order?.id || 'Unknown'}</p>
                <p className="text-red-600 text-xs mt-2">Error: {(orderError as Error)?.message || String(orderError) || 'Unknown error'}</p>
              </div>
            );
          }
        }).filter(Boolean)}
      </div>
    );
  } catch (componentError) {
    console.error('OrderHistory: Critical component error:', componentError);
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-red-800 font-medium mb-2">Component Error</h3>
          <p className="text-red-600 text-sm mb-4">Failed to render order history</p>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm">
            Reload Page
          </Button>
        </div>
      </div>
    );
  }
};