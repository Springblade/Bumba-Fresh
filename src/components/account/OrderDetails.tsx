import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Timeline } from '../ui/Timeline';
import { LoadingSpinner } from '../LoadingSpinner';
import { orderService } from '../../services/orderService';

interface OrderDetailsProps {
  orderId?: string; // Made optional for backward compatibility
}

interface OrderData {
  order_id: number;
  total_price: number;
  status: string;
  order_date: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface OrderMeal {
  meal_id: number;
  meal: string;
  quantity: number;
  unit_price: number;
}

interface DeliveryData {
  delivery_address: string;
  s_firstname: string;
  s_lastname: string;
  s_phone: string;
  city: string;
  delivery_status: string;
  estimated_time: string;
}

const statusTimeline: Record<string, { label: string; order: number }> = {
  pending: { label: 'Order Confirmed', order: 1 },
  confirmed: { label: 'Order Confirmed', order: 1 },
  preparing: { label: 'Preparing Meals', order: 2 },
  shipped: { label: 'Shipped', order: 3 },
  delivered: { label: 'Delivered', order: 4 },
  cancelled: { label: 'Cancelled', order: 0 }
};

export const OrderDetails = ({ orderId: propOrderId }: OrderDetailsProps) => {
  const navigate = useNavigate();
  const { orderId: paramOrderId } = useParams<{ orderId: string }>();
  const orderId = propOrderId || paramOrderId;
  
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [meals, setMeals] = useState<OrderMeal[]>([]);
  const [delivery, setDelivery] = useState<DeliveryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add comprehensive logging and error handling
  console.log('OrderDetails: Component render, props orderId:', propOrderId);
  console.log('OrderDetails: Component render, params orderId:', paramOrderId);
  console.log('OrderDetails: Final orderId:', orderId);
  console.log('OrderDetails: Current state:', { orderData, meals: meals?.length, delivery, isLoading, error });

  useEffect(() => {
    const fetchOrderDetails = async () => {
      console.log('OrderDetails: useEffect triggered');
      console.log('OrderDetails: Component mounted, orderId from params:', paramOrderId);
      console.log('OrderDetails: Component mounted, orderId from props:', propOrderId);
      console.log('OrderDetails: Final orderId to use:', orderId);
      
      if (!orderId) {
        console.error('OrderDetails: No order ID provided');
        setError('No order ID provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        console.log('OrderDetails: Starting fetch for orderId:', orderId);
        
        // Convert display ID (BUMBA-00001) back to numeric ID
        let numericOrderId: number;
        
        if (typeof orderId === 'string' && orderId.startsWith('BUMBA-')) {
          const numericPart = orderId.replace('BUMBA-', '');
          numericOrderId = parseInt(numericPart, 10);
          console.log('OrderDetails: Converted BUMBA format orderId:', orderId, 'to numeric:', numericOrderId);
        } else {
          numericOrderId = parseInt(String(orderId), 10);
          console.log('OrderDetails: Converted direct orderId:', orderId, 'to numeric:', numericOrderId);
        }

        if (isNaN(numericOrderId) || numericOrderId <= 0) {
          throw new Error(`Invalid order ID format: ${orderId} -> ${numericOrderId}`);
        }

        console.log('OrderDetails: Fetching details for numeric order ID:', numericOrderId);
        
        // Fetch order and meals data separately with error handling
        let orderResponse, mealsData;
        
        try {
          console.log('OrderDetails: Calling orderService.getOrderById with:', numericOrderId);
          orderResponse = await orderService.getOrderById(numericOrderId);
          console.log('OrderDetails: Order response received:', orderResponse);
        } catch (orderError) {
          console.error('OrderDetails: Failed to fetch order:', orderError);
          throw new Error(`Failed to fetch order details: ${(orderError as Error)?.message || orderError}`);
        }

        try {
          console.log('OrderDetails: Calling orderService.getOrderMeals with:', numericOrderId);
          mealsData = await orderService.getOrderMeals(numericOrderId);
          console.log('OrderDetails: Meals data received:', mealsData);
        } catch (mealsError) {
          console.warn('OrderDetails: Failed to fetch meals, continuing with empty array:', mealsError);
          mealsData = [];
        }
        
        // Validate order response
        if (!orderResponse) {
          throw new Error('No order response received from server');
        }

        if (!(orderResponse as any).order) {
          console.error('OrderDetails: Invalid order response structure:', orderResponse);
          throw new Error('Invalid order response structure - missing order property');
        }

        console.log('OrderDetails: Setting order data:', (orderResponse as any).order);
        console.log('OrderDetails: Setting meals data:', mealsData);

        setOrderData((orderResponse as any).order);
        setMeals(Array.isArray(mealsData) ? mealsData : []);

        // Try to fetch delivery data (might not exist for older orders)
        try {
          const deliveryResponse = await fetch(`/api/delivery/order/${numericOrderId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          });
          
          if (deliveryResponse.ok) {
            const deliveryData = await deliveryResponse.json();
            setDelivery(deliveryData.delivery);
          }
        } catch (deliveryError) {
          console.warn('OrderDetails: Could not fetch delivery data:', deliveryError);
        }

      } catch (error) {
        console.error('OrderDetails: Error fetching order details:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch order details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);  // Generate timeline based on order status with error handling
  const generateTimeline = (status: string) => {
    try {
      const currentStatus = statusTimeline[status] || statusTimeline.pending;
      const allStatuses = ['pending', 'preparing', 'shipped', 'delivered'];
      
      return allStatuses.map(statusKey => {
        const statusInfo = statusTimeline[statusKey];
        const isCompleted = statusInfo.order <= currentStatus.order;
        const isCurrent = statusKey === status;
        
        return {
          status: statusInfo.label,
          date: isCurrent && orderData ? orderData.order_date : '',
          completed: isCompleted
        };
      });
    } catch (error) {
      console.error('OrderDetails: Error generating timeline:', error);
      return [];
    }
  };
  // Wrap the component in try-catch for error handling
  try {
    console.log('OrderDetails: Rendering component, current state:', { 
      isLoading, 
      error, 
      hasOrderData: !!orderData, 
      mealsCount: meals?.length || 0 
    });

    if (isLoading) {
      console.log('OrderDetails: Rendering loading state');
      return (
        <div className="flex items-center justify-center min-h-64">
          <LoadingSpinner />
        </div>
      );
    }

    if (error) {
      console.log('OrderDetails: Rendering error state:', error);
      return (
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-red-800 font-medium mb-2">Error Loading Order</h3>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <p className="text-red-600 text-xs mb-4">Order ID: {orderId}</p>
            <Button onClick={() => navigate('/account/orders')} variant="outline" size="sm">
              Back to Orders
            </Button>
          </div>
        </div>
      );
    }

    if (!orderData) {
      console.log('OrderDetails: No order data available');
      return (
        <div className="text-center py-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-yellow-800 font-medium mb-2">Order Not Found</h3>
            <p className="text-yellow-600 text-sm mb-4">Could not find order data</p>
            <p className="text-yellow-600 text-xs mb-4">Order ID: {orderId}</p>
            <Button onClick={() => navigate('/account/orders')} variant="outline" size="sm">
              Back to Orders
            </Button>
          </div>
        </div>
      );
    }

    console.log('OrderDetails: Rendering order details for:', orderData.order_id);

    const timeline = generateTimeline(orderData.status || 'pending');
    const safeMeals = Array.isArray(meals) ? meals : [];
    const subtotal = safeMeals.reduce((sum, meal) => {
      const quantity = parseFloat(String(meal?.quantity || '0')) || 0;
      const unitPrice = parseFloat(String(meal?.unit_price || '0')) || 0;
      return sum + (quantity * unitPrice);
    }, 0);

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/account/orders')} className="text-gray-600">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
          <div className="text-right">
            <h1 className="text-2xl font-bold">
              Order {orderData.order_id ? `BUMBA-${orderData.order_id.toString().padStart(5, '0')}` : 'Unknown'}
            </h1>
            <p className="text-gray-500">
              Placed on {orderData.order_date ? new Date(orderData.order_date).toLocaleDateString() : 'Unknown date'}
            </p>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-6">Order Status</h2>
          <Timeline steps={timeline} />
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-6">Order Items</h2>
          <div className="divide-y divide-gray-200">
            {safeMeals.length > 0 ? safeMeals.map((meal, index) => {
              try {
                // Add null checks and type conversions
                const quantity = parseFloat(String(meal?.quantity || '0')) || 0;
                const unitPrice = parseFloat(String(meal?.unit_price || '0')) || 0;
                const mealName = meal?.meal || 'Unknown Item';
                
                return (
                  <div key={index} className="py-4 flex items-center">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Image</span>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium">{mealName}</h3>
                      <p className="text-sm text-gray-500">
                        Quantity: {quantity}
                      </p>
                      <p className="text-sm text-gray-500">
                        ${unitPrice.toFixed(2)} each
                      </p>
                    </div>
                    <p className="font-medium">${(quantity * unitPrice).toFixed(2)}</p>
                  </div>
                );
              } catch (mealError) {
                console.error('OrderDetails: Error rendering meal:', meal, mealError);
                return (
                  <div key={index} className="py-4 px-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-medium">Error loading meal item</p>
                    <p className="text-red-600 text-sm">Meal data: {JSON.stringify(meal)}</p>
                  </div>
                );
              }
            }) : (
              <div className="py-8 text-center">
                <p className="text-gray-500">No meal items found for this order</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-2 gap-8">
          {/* Shipping Address */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
            <div className="text-gray-600">
              {delivery ? (
                <>
                  <p className="font-medium">{delivery.s_firstname || ''} {delivery.s_lastname || ''}</p>
                  <p>{delivery.delivery_address || 'Address not available'}</p>
                  <p>{delivery.city || 'City not available'}</p>
                  <p>{delivery.s_phone || 'Phone not available'}</p>
                </>
              ) : (
                <p className="text-gray-400 italic">Delivery information not available</p>
              )}
            </div>
          </div>

          {/* Cost Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
                <span>Total</span>
                <span>${(parseFloat(String(orderData.total_price || '0')) || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );  } catch (componentError) {
    console.error('OrderDetails: Critical component error:', componentError);
    console.error('OrderDetails: Component state when error occurred:', {
      orderId,
      orderData,
      meals: meals?.length,
      delivery,
      isLoading,
      error
    });
    
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-red-800 font-medium mb-2">Component Error</h3>
          <p className="text-red-600 text-sm mb-2">Failed to render order details</p>
          <p className="text-red-600 text-xs mb-2">Order ID: {orderId}</p>
          <p className="text-red-600 text-xs mb-4">Error: {(componentError as Error)?.message || String(componentError)}</p>
          <div className="flex gap-2 justify-center">
            <Button onClick={() => navigate('/account/orders')} variant="outline" size="sm">
              Back to Orders
            </Button>
            <Button onClick={() => window.location.reload()} variant="outline" size="sm">
              Reload Page
            </Button>
          </div>
        </div>
      </div>
    );
  }
};