import { fetchData } from './api';

export interface OrderItem {
  mealId: number;
  quantity: number;
  price: number;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
}

export interface CreateOrderRequest {
  totalAmount: number;
  items: OrderItem[];
  shippingInfo: ShippingInfo;
}

export interface OrderResponse {
  orderId: number;
  status: string;
  message: string;
}

export const orderService = {
  /**
   * Create a new order with delivery information
   */
  async createOrder(orderData: CreateOrderRequest): Promise<OrderResponse> {
    try {
      console.log('OrderService: Creating order with data:', orderData);
      
      // Create the order
      console.log('OrderService: Making order request...');
      const orderResponse = await fetchData('/orders', {
        method: 'POST',
        body: JSON.stringify({
          totalAmount: orderData.totalAmount,
          items: orderData.items.map(item => ({
            mealId: item.mealId,
            quantity: item.quantity,
            price: item.price
          }))
        })
      }) as any;

      console.log('OrderService: Order response:', orderResponse);
      const orderId = orderResponse.order.order_id;

      // Create delivery record
      const deliveryAddress = `${orderData.shippingInfo.address}, ${orderData.shippingInfo.city}, ${orderData.shippingInfo.zipCode}`;
      
      console.log('OrderService: Creating delivery record...');
      const deliveryResponse = await fetchData('/delivery', {
        method: 'POST',
        body: JSON.stringify({
          orderId,
          delivery_address: deliveryAddress,
          s_firstname: orderData.shippingInfo.firstName,
          s_lastname: orderData.shippingInfo.lastName,
          s_phone: orderData.shippingInfo.phone,
          city: orderData.shippingInfo.city,
          delivery_status: 'pending',
          estimated_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
        })
      });

      console.log('OrderService: Delivery response:', deliveryResponse);

      return {
        orderId,
        status: 'success',
        message: 'Order created successfully'
      };
    } catch (error) {
      console.error('OrderService: Error creating order:', error);
      
      // Preserve the original error message for better debugging
      const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
      throw new Error(errorMessage);
    }
  },

  /**
   * Get all orders for the authenticated user
   */
  async getUserOrders(): Promise<any[]> {
    try {
      console.log('OrderService: Fetching user orders...');
      const response = await fetchData('/orders') as any;
      console.log('OrderService: Orders response:', response);
      return response.orders || [];
    } catch (error) {
      console.error('OrderService: Error fetching orders:', error);
      throw new Error('Failed to fetch orders');
    }
  },

  /**
   * Get order details with delivery information
   */
  async getOrderById(orderId: number) {
    try {
      const response = await fetchData(`/orders/${orderId}`);
      return response;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw new Error('Failed to fetch order');
    }
  },

  /**
   * Get order meals for a specific order
   */
  async getOrderMeals(orderId: number) {
    try {
      const response = await fetchData(`/orders/${orderId}/meals`) as any;
      return response.meals || [];
    } catch (error) {
      console.error('Error fetching order meals:', error);
      return [];
    }
  },

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: number, status: string) {
    try {
      const response = await fetchData(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      return response;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error('Failed to update order status');
    }
  }
};
