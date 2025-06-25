import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { getUserOrderById, getOrderItems, getOrderDelivery } from '../../services/orders';
import { useAuth } from '../../context/AuthContext';

export const OrderDetails: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();  const [order, setOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [orderDelivery, setOrderDelivery] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Log component mounting and orderId
  console.log('🔄 OrderDetails component mounted with orderId:', orderId);
  console.log('🔑 Auth status from context:', { 
    isAuthenticated, 
    user: user?.email, 
    authLoading 
  });  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('🔄 OrderDetails useEffect called with orderId:', orderId);
        
        // Wait for authentication to complete
        if (authLoading) {
          console.log('⏳ Waiting for authentication to complete...');
          return;
        }
        
        // Check authentication status
        if (!isAuthenticated) {
          console.error('❌ User is not authenticated');
          setError('Please log in to view order details');
          setIsLoading(false);
          return;
        }
        
        // Validate orderId parameter
        if (!orderId || orderId.trim() === '') {
          console.error('❌ OrderId is empty or null:', orderId);
          setError('Invalid order ID');
          setIsLoading(false);
          return;
        }
        
        // Check if orderId has the BUMBA- prefix
        if (!orderId.startsWith('BUMBA-')) {
          console.error('❌ OrderId does not start with BUMBA-:', orderId);
          setError('Invalid order ID format');
          setIsLoading(false);
          return;
        }
        
        // Extract numeric ID from order ID string (remove "BUMBA-" prefix)
        const numericOrderId = parseInt(orderId.replace('BUMBA-', ''));
        
        // Validate that we got a valid number
        if (isNaN(numericOrderId) || numericOrderId <= 0) {
          console.error('❌ Invalid order ID format:', orderId, 'parsed to:', numericOrderId);
          setError('Invalid order ID format');
          setIsLoading(false);
          return;
        }
          console.log('🔄 Fetching order details for ID:', numericOrderId);        try {
          console.log('📡 Calling getUserOrderById with ID:', numericOrderId);
          const orderData = await getUserOrderById(numericOrderId);
          console.log('✅ Order data received:', orderData);
          
          // Validate order data structure
          if (!orderData || typeof orderData !== 'object') {
            throw new Error('Invalid order data received: expected object, got ' + typeof orderData);
          }
          
          if (!orderData.order_id) {
            throw new Error('Invalid order data: missing order_id field');
          }
          
          setOrder(orderData);
        } catch (orderError) {
          console.error('❌ Error fetching order:', orderError);
          console.error('❌ Error details:', {
            message: orderError instanceof Error ? orderError.message : 'Unknown error',
            stack: orderError instanceof Error ? orderError.stack : 'No stack trace',
            name: orderError instanceof Error ? orderError.name : 'Unknown error type'
          });
          throw new Error(`Failed to fetch order: ${orderError instanceof Error ? orderError.message : 'Unknown error'}`);
        }
          try {
          console.log('🍽️ Calling getOrderItems with ID:', numericOrderId);
          const itemsData = await getOrderItems(numericOrderId);
          console.log('✅ Order items received:', itemsData);
          setOrderItems(itemsData);
        } catch (itemsError) {
          console.error('❌ Error fetching order items:', itemsError);
          // Don't fail if items fetch fails, just show empty items
          console.warn('⚠️ Continuing without items data');
          setOrderItems([]);
        }

        try {
          console.log('🚚 Calling getOrderDelivery with ID:', numericOrderId);
          const deliveryData = await getOrderDelivery(numericOrderId);
          console.log('✅ Order delivery received:', deliveryData);
          setOrderDelivery(deliveryData);
        } catch (deliveryError) {
          console.error('❌ Error fetching order delivery:', deliveryError);
          // Don't fail if delivery fetch fails, just show fallback info
          console.warn('⚠️ Continuing without delivery data');
          setOrderDelivery(null);
        }
        
      } catch (err) {
        console.error('❌ Error fetching order details:', err);
        setError(`Failed to load order details: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if orderId exists
    if (orderId) {
      fetchOrderDetails();
    } else {
      setError('No order ID provided');
      setIsLoading(false);
    }
  }, [orderId, isAuthenticated, authLoading]);
  // Early return with error handling for rendering
  try {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      );
    }    if (error || !order) {
      return (
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">{error || 'Order not found'}</div>
          <div className="space-y-2">
            <Button onClick={() => navigate('/account/orders')} variant="outline">
              Back to Orders
            </Button>            {error?.includes('log in') && (
              <Button onClick={() => navigate('/login')} variant="primary" className="ml-2">
                Log In
              </Button>
            )}
          </div>
        </div>
      );
    }

    // Create timeline based on order status
    const getOrderTimeline = (status: string, orderDate: string) => {
      const baseTimeline = [
        { status: 'Order Confirmed', date: orderDate, completed: true },
        { status: 'Preparing Meals', date: orderDate, completed: status !== 'pending' },
        { status: 'Shipped', date: orderDate, completed: ['shipped', 'delivered'].includes(status) },
        { status: 'Delivered', date: orderDate, completed: status === 'delivered' }
      ];
      
      if (status === 'cancelled') {
        return [
          { status: 'Order Confirmed', date: orderDate, completed: true },
          { status: 'Cancelled', date: orderDate, completed: true }
        ];
      }
      
      return baseTimeline;
    };

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/account/orders')} className="text-gray-600">
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
          <div className="text-right">
            <h1 className="text-2xl font-semibold text-gray-900">Order {orderId}</h1>
            <p className="text-gray-600">
              Placed on {new Date(order.order_date).toLocaleDateString()}
            </p>
          </div>
        </div>
          {/* Order Timeline */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-6">Order Status</h2>
          <div className="space-y-4">
            {getOrderTimeline(order.status, order.order_date).map((step, index) => (
              <div key={index} className={`flex items-center ${step.completed ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-4 h-4 rounded-full mr-3 ${step.completed ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                <span className="font-medium">{step.status}</span>
              </div>
            ))}
          </div>
        </div>
          {/* Order Items */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-6">Order Items</h2>
          <div className="divide-y divide-gray-200">
            {orderItems.map((item, index) => (
              <div key={item.meal_id || index} className="py-4 flex items-center">
                <img 
                  src={item.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} 
                  alt={item.meal || "Meal"} 
                  className="w-16 h-16 rounded-lg object-cover" 
                />
                <div className="ml-4 flex-1">
                  <h3 className="font-medium">{item.meal || "Unknown Meal"}</h3>
                  <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="font-medium">${(typeof item.unit_price === 'string' ? parseFloat(item.unit_price) : (item.unit_price || 0)) * item.quantity}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Order Details Grid */}
        <div className="grid grid-cols-2 gap-8">          {/* Shipping Address */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
            <div className="text-gray-600">
              {orderDelivery ? (
                <>
                  <p>{orderDelivery.s_firstname} {orderDelivery.s_lastname}</p>
                  <p>{orderDelivery.s_phone}</p>
                  <p>{orderDelivery.delivery_address}</p>
                  <p>{orderDelivery.city}</p>
                </>
              ) : (
                <>
                  <p>{user?.firstName || 'Name'} {user?.lastName || 'not available'}</p>
                  <p>{user?.email || 'Email not available'}</p>
                  <p>Shipping address details not available</p>
                </>
              )}
            </div>
          </div>
          
          {/* Cost Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${typeof order.total_price === 'string' ? parseFloat(order.total_price).toFixed(2) : order.total_price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
                <span>Total</span>
                <span>${typeof order.total_price === 'string' ? parseFloat(order.total_price).toFixed(2) : order.total_price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (err) {
    console.error('❌ Error rendering OrderDetails:', err);
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Error loading order details</div>
        <Button onClick={() => navigate('/account/orders')} variant="outline">
          Back to Orders
        </Button>
      </div>
    );
  }
};