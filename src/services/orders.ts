import { fetchData } from './api';

export interface Order {
  order_id: number;
  user_id: number;
  total_price: string | number;  // Backend returns string, frontend might expect number
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  order_date: string;
  items_count?: number;  // Add items count field
  email?: string;
  first_name?: string;
  last_name?: string;
}

export interface OrderItem {
  order_id: number;
  meal_id: number;
  quantity: number;
  unit_price: string | number;  // Price per unit from backend
  meal: string;  // Meal name from inventory table
  available_quantity: number;  // Available quantity in inventory
  price: string | number;  // Base price from inventory
  image_url?: string;  // Meal image URL from inventory
}

export interface CreateOrderRequest {
  totalAmount: number;
  items: {
    mealId: number;
    quantity: number;
    price: number;
  }[];
}

export interface CompleteOrderRequest {
  totalAmount: number;
  items: {
    mealId: number;
    quantity: number;
    price: number;
  }[];
  shippingAddress: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
  };
  paymentMethod: string;
}

export interface CompleteOrderResponse {
  message: string;
  order: Order;
  orderNumber: string;
}

/**
 * Fetch all orders for the current user
 */
export async function getUserOrders(): Promise<any> {
  try {
    console.log(' getUserOrders called');
    
    // Try the correct endpoint first
    try {
      const response = await fetchData<any>('/orders');
      console.log(' getUserOrders response from /orders:', response);
      return response;
    } catch (error) {
      console.warn(' Error fetching from /orders, trying /orders/user:', error);
      
      // Try alternative endpoint
      const response = await fetchData<any>('/orders/user');
      console.log(' getUserOrders response from /orders/user:', response);
      return response;
    }
  } catch (error) {
    console.error(' Error in getUserOrders:', error);
    throw error;
  }
}

/**
 * Fetch a specific order by ID for the authenticated user
 */
export async function getUserOrderById(orderId: number): Promise<Order> {
  try {
    console.log(' getUserOrderById called with orderId:', orderId);
    const response = await fetchData<{ message: string; order: Order }>(`/orders/${orderId}`);
    console.log(' getUserOrderById response:', response);
    return response.order;
  } catch (error) {
    console.error(' Error in getUserOrderById:', error);
    throw error;
  }
}

/**
 * Fetch order items for a specific order
 */
export async function getOrderItems(orderId: number): Promise<OrderItem[]> {
  try {
    console.log(' getOrderItems called with orderId:', orderId);
    const response = await fetchData<{ message: string; meals: OrderItem[] }>(`/orders/${orderId}/meals`);
    console.log(' getOrderItems response:', response);
    return response.meals || [];
  } catch (error) {
    console.error(' Error in getOrderItems:', error);
    throw error;
  }
}

/**
 * Create a new order
 */
export async function createOrder(orderData: CreateOrderRequest): Promise<Order> {
  try {
    const response = await fetchData<{ message: string; order: Order }>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return response.order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

/**
 * Complete an order with shipping information and payment
 */
export async function completeOrder(orderData: CompleteOrderRequest): Promise<CompleteOrderResponse> {
  try {
    const response = await fetchData<CompleteOrderResponse>('/orders/complete', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return response;
  } catch (error) {
    console.error('Error completing order:', error);
    throw error;
  }
}

/**
 * Fetch delivery/shipping information for a specific order
 */
export async function getOrderDelivery(orderId: number): Promise<{
  delivery_id: number;
  order_id: number;
  delivery_status: string;
  estimated_time: string | null;
  delivery_address: string;
  s_firstname: string;
  s_lastname: string;
  s_phone: string;
  city: string;
}> {
  try {
    console.log(' getOrderDelivery called with orderId:', orderId);
    const response = await fetchData<{ 
      message: string; 
      delivery: {
        delivery_id: number;
        order_id: number;
        delivery_status: string;
        estimated_time: string | null;
        delivery_address: string;
        s_firstname: string;
        s_lastname: string;
        s_phone: string;
        city: string;
      } 
    }>(`/orders/${orderId}/delivery`);
    console.log(' getOrderDelivery response:', response);
    return response.delivery;
  } catch (error) {
    console.error(' Error in getOrderDelivery:', error);
    throw error;
  }
}

/**
 * Transform order status for display
 */
export function getOrderStatusDisplay(status: string): {
  label: string;
  color: string;
} {
  switch (status) {
    case 'pending':
      return { label: 'Pending', color: 'bg-gray-100 text-gray-800' };
    case 'confirmed':
      return { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' };
    case 'preparing':
      return { label: 'Preparing', color: 'bg-yellow-100 text-yellow-800' };
    case 'shipped':
      return { label: 'Shipped', color: 'bg-blue-100 text-blue-800' };
    case 'delivered':
      return { label: 'Delivered', color: 'bg-green-100 text-green-800' };
    case 'cancelled':
      return { label: 'Cancelled', color: 'bg-red-100 text-red-800' };
    default:
      return { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
  }
}
