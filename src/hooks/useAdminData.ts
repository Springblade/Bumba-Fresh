import { useCallback, useState } from 'react';
import { useAsyncData } from './useAsyncData';
import { 
  AdminStats, 
  AdminOrder, 
  AdminMeal, 
  AdminCustomer,
  AdminSubscription 
} from '../types/shared';

/* 
 * CHANGE: Created admin data hook for fetching and managing admin panel data
 * DATE: 21-06-2025
 */
interface AdminDataOptions {
  includeInactive?: boolean;
  dateRange?: 'day' | 'week' | 'month' | 'year';
  status?: string;
}

export function useAdminData(options: AdminDataOptions = {}) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  // Fetch dashboard stats
  const fetchStats = useCallback(async (): Promise<AdminStats> => {
    // In a real app, this would be an API call
    // For now, return mock data
    const stats: AdminStats = {
      totalRevenue: 12345.67,
      activeCustomers: 854,
      ordersThisWeek: 248,
      averageOrderValue: 54.67,
      revenueChange: 12.5,  // Add this property
      percentChange: {
        revenue: 12.5,
        customers: 5.3,
        orders: 18.2,
        averageOrder: -2.1
      }
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return stats;
  }, [options.dateRange]);
  
  // Fetch orders with optional filters
  const fetchOrders = useCallback(async (): Promise<AdminOrder[]> => {
    // In a real app, this would filter based on options
    const orders: AdminOrder[] = [
      { 
        id: 'ORD-1001', 
        customer: 'John Smith', 
        email: 'john@example.com',
        date: '20-06-2025', 
        total: '$75.50', 
        status: 'delivered',
        items: 3
      },
      { 
        id: 'ORD-1002', 
        customer: 'Emma Wilson', 
        email: 'emma@example.com',
        date: '20-06-2025', 
        total: '$128.25', 
        status: 'processing',
        items: 5
      },
      { 
        id: 'ORD-1003', 
        customer: 'Michael Brown', 
        email: 'michael@example.com',
        date: '19-06-2025', 
        total: '$64.99', 
        status: 'shipped',
        items: 2
      },
      { 
        id: 'ORD-1004', 
        customer: 'Sarah Johnson', 
        email: 'sarah@example.com',
        date: '19-06-2025', 
        total: '$42.75', 
        status: 'cancelled',
        items: 1
      },
      { 
        id: 'ORD-1005', 
        customer: 'Robert Davis', 
        email: 'robert@example.com',
        date: '18-06-2025', 
        total: '$89.50', 
        status: 'delivered',
        items: 4
      },
    ];
    
    // Filter by status if provided
    const filteredOrders = options.status ? 
      orders.filter(order => order.status === options.status) : 
      orders;
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return filteredOrders;
  }, [options.status]);
  
  // Fetch meals with optional filters
  const fetchMeals = useCallback(async (): Promise<AdminMeal[]> => {
    const meals: AdminMeal[] = [
      {
        id: '1',  // Convert to string
        name: 'Grilled Salmon Bowl',
        category: 'Lunch',
        price: '$12.99',
        calories: 450,
        status: 'active',
        tags: ['High Protein', 'Gluten Free'],
        inventory: 24
      },
      {
        id: '2',  // Convert to string
        name: 'Quinoa Buddha Bowl',
        category: 'Lunch',
        price: '$11.49',
        calories: 380,
        status: 'active',
        tags: ['Vegetarian', 'High Fiber'],
        inventory: 18
      },
      {
        id: '3',
        name: 'Chicken Fajita Bowl',
        category: 'Dinner',
        price: '$13.99',
        calories: 520,
        status: 'active',
        tags: ['High Protein', 'Spicy'],
        inventory: 12
      },
      {
        id: '4',
        name: 'Mediterranean Plate',
        category: 'Lunch',
        price: '$10.99',
        calories: 420,
        status: 'inactive',
        tags: ['Vegetarian'],
        inventory: 0
      }
    ];
    
    // Filter by status if needed
    const filteredMeals = !options.includeInactive ? 
      meals.filter(meal => meal.status === 'active') : 
      meals;
    
    await new Promise(resolve => setTimeout(resolve, 600));
    return filteredMeals;
  }, [options.includeInactive]);

  // Fetch customers
  const fetchCustomers = useCallback(async (): Promise<AdminCustomer[]> => {
    const customers: AdminCustomer[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john@example.com',
        phone: '555-123-4567',
        subscribed: true,
        totalSpent: 350.25,  // Include this property
        ordersCount: 8,
        joinedDate: '15-01-2025',
        status: 'active'
      },
      {
        id: '2',
        firstName: 'Emma',
        lastName: 'Wilson',
        email: 'emma@example.com',
        subscribed: true,
        ordersCount: 12,
        joinedDate: '05-12-2024',
        totalSpent: 568.25,
        lastOrderDate: '18-06-2025'
      },
      {
        id: '3',
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael@example.com',
        subscribed: false,
        ordersCount: 3,
        joinedDate: '20-03-2025',
        totalSpent: 124.50
      }
    ];
    
    await new Promise(resolve => setTimeout(resolve, 500));
    return customers;
  }, []);

  // Fetch subscriptions
  const fetchSubscriptions = useCallback(async (): Promise<AdminSubscription[]> => {
    const subscriptions: AdminSubscription[] = [
      {
        id: 'SUB-1',
        customer: 'John Smith',
        email: 'john@example.com',
        plan: 'Family Plan',
        status: 'active',
        nextDelivery: '25-06-2025',
        mealsPerWeek: 12,
        started: '10-03-2025',
        startDate: '10-03-2025',
        interval: 'weekly'
      },
      {
        id: 'SUB-1002',
        customer: 'Emma Wilson',
        email: 'emma@example.com', // Add missing email
        plan: 'Couples Plan',
        status: 'active',
        mealsPerWeek: 8, // Add missing mealsPerWeek
        started: '10-12-2024', // Add missing started
        startDate: '10-12-2024',
        nextDelivery: '24-06-2025',
        billingFrequency: 'weekly',
        amount: '$64.99'
      },
      {
        id: 'SUB-1003',
        customer: 'Michael Brown',
        email: 'michael@example.com', // Add missing email
        plan: 'Singles Plan',
        status: 'paused',
        mealsPerWeek: 5, // Add missing mealsPerWeek
        started: '20-03-2025', // Add missing started
        startDate: '20-03-2025',
        nextDelivery: '05-07-2025',
        billingFrequency: 'monthly',
        amount: '$49.99'
      }
    ];
    
    await new Promise(resolve => setTimeout(resolve, 700));
    return subscriptions;
  }, []);

  // Update order status
  const updateOrderStatus = useCallback(async (orderId: string, status: string): Promise<boolean> => {
    // In a real app, this would be an API call
    console.log(`Updating order ${orderId} to ${status}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }, []);

  // Using our custom useAsyncData hook to handle loading/error states
  const stats = useAsyncData<AdminStats>(fetchStats, [options.dateRange]);
  const orders = useAsyncData<AdminOrder[]>(fetchOrders, [options.status]);
  const meals = useAsyncData<AdminMeal[]>(fetchMeals, [options.includeInactive]);
  const customers = useAsyncData<AdminCustomer[]>(fetchCustomers, []);
  const subscriptions = useAsyncData<AdminSubscription[]>(fetchSubscriptions, []);

  return {
    stats,
    orders,
    meals,
    customers,
    subscriptions,
    selectedOrderId,
    setSelectedOrderId,
    updateOrderStatus,
  };
}