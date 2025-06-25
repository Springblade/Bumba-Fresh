import { useCallback, useState } from 'react';
import { useAsyncData } from './useAsyncData';
import { fetchData } from '../services/api';
import { 
  AdminStats, 
  AdminOrder, 
  AdminMeal, 
  AdminCustomer,
} from '../types/shared';

/* 
 * CHANGE: Created admin data hook for fetching and managing admin panel data
 * DATE: 21-06-2025
 */

// Pagination utility function
export function usePagination<T>(data: T[], itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);
  
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  return {
    currentData,
    currentPage,
    totalPages,
    totalItems: data.length,
    itemsPerPage,
    startIndex: startIndex + 1,
    endIndex: Math.min(endIndex, data.length),
    hasNext: currentPage < totalPages,
    hasPrevious: currentPage > 1,
    goToPage,
    goToPrevious,
    goToNext,
    setCurrentPage
  };
}

interface AdminDataOptions {
  includeInactive?: boolean;
  dateRange?: 'day' | 'week' | 'month' | 'year';
  status?: string;
  page?: number;
  limit?: number;
}

export function useAdminData(options: AdminDataOptions = {}) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);  // Fetch dashboard stats
  const fetchStats = useCallback(async (): Promise<AdminStats> => {
    try {
      console.log('🔄 Fetching admin stats from API...');
      // Try the test endpoint first for debugging
      let response;
      try {
        response = await fetchData<{ stats: any }>('/admin/test-stats');
        console.log('📊 Using test-stats endpoint - Raw API response:', response);      } catch (testError) {
        console.log('⚠️ Test endpoint failed, trying regular endpoint:', (testError as Error).message);
        // Fallback to regular endpoint
        response = await fetchData<{ stats: any }>('/admin/stats');
        console.log('📊 Using regular stats endpoint - Raw API response:', response);
      }
      
      const apiStats = response.stats;
      console.log('📈 Parsed stats:', apiStats);
      
      const stats: AdminStats = {
        totalRevenue: apiStats.totalRevenue || 0,
        activeCustomers: apiStats.activeCustomers || 0,
        ordersThisWeek: apiStats.ordersThisWeek || 0,
        averageOrderValue: apiStats.averageOrderValue || 0,
        percentChange: {
          customers: apiStats.percentChange?.customers || 0,
          orders: apiStats.percentChange?.orders || 0,
          averageOrder: apiStats.percentChange?.averageOrder || 0
        }
      };
      
      console.log('✅ Final transformed stats:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Error fetching admin stats:', error);
      // Return fallback data if API call fails
      const stats: AdminStats = {        
        totalRevenue: 0,
        activeCustomers: 0,
        ordersThisWeek: 0,
        averageOrderValue: 0,
        percentChange: {
          customers: 0,
          orders: 0,
          averageOrder: 0
        }
      };
      return stats;
    }
  }, [options.dateRange]);
  // Fetch orders with optional filters
  const fetchOrders = useCallback(async (): Promise<AdminOrder[]> => {
    try {
      console.log('🔄 Fetching admin orders from API...');
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (options.status && options.status !== 'all') {
        queryParams.append('status', options.status);
      }
      
      // Try the test endpoint first for debugging
      let response;
      try {
        const testUrl = `/admin/test-orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        response = await fetchData<{ orders: AdminOrder[] }>(testUrl);
        console.log('📦 Using test-orders endpoint - Raw API response:', response);
      } catch (testError) {
        console.log('⚠️ Test orders endpoint failed, trying regular endpoint:', (testError as Error).message);
        // Fallback to regular endpoint
        const url = `/admin/orders${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        response = await fetchData<{ orders: AdminOrder[] }>(url);
        console.log('📦 Using regular orders endpoint - Raw API response:', response);
      }
      
      console.log('✅ Final orders data:', response.orders);
      return response.orders || [];
    } catch (error) {
      console.error('❌ Error fetching admin orders:', error);
      // Return fallback data if API call fails
      return [];
    }
  }, [options.status]);
    // Fetch meals with optional filters
  const fetchMeals = useCallback(async (): Promise<AdminMeal[]> => {
    try {
      const { getAllMeals } = await import('../services/meals');
      const apiMeals = await getAllMeals();
      
      // Transform API data to AdminMeal format
      const transformedMeals: AdminMeal[] = apiMeals.map(meal => ({
        id: meal.id.toString(),
        name: meal.name,
        category: meal.category || 'Other',
        price: `$${(typeof meal.price === 'number' ? meal.price : parseFloat(meal.price) || 0).toFixed(2)}`,
        calories: meal.calories || 0,
        status: 'active' as const,
        tags: meal.tags || [],
        inventory: Math.floor(Math.random() * 50) + 10 // Mock inventory count for now
      }));
      
      // Filter by status if needed
      const filteredMeals = !options.includeInactive ? 
        transformedMeals.filter(meal => meal.status === 'active') : 
        transformedMeals;
      
      await new Promise(resolve => setTimeout(resolve, 600));
      return filteredMeals;
    } catch (error) {
      console.error('Error fetching meals in useAdminData:', error);
      // Return empty array on error
      return [];
    }
  }, [options.includeInactive]);  // Fetch customers
  const fetchCustomers = useCallback(async (): Promise<AdminCustomer[]> => {
    try {
      console.log('🔄 Fetching admin customers from API...');
      
      // Try the test endpoint first for debugging
      let response;
      try {
        response = await fetchData<{ customers: AdminCustomer[] }>('/admin/test-customers');
        console.log('👥 Using test-customers endpoint - Raw API response:', response);
      } catch (testError) {
        console.log('⚠️ Test customers endpoint failed, trying regular endpoint:', (testError as Error).message);
        // Fallback to regular endpoint
        response = await fetchData<{ customers: AdminCustomer[] }>('/admin/customers');
        console.log('👥 Using regular customers endpoint - Raw API response:', response);
      }
      
      console.log('✅ Final customers data:', response.customers);
      return response.customers || [];
    } catch (error) {
      console.error('❌ Error fetching admin customers:', error);
      // Return empty array if API call fails
      return [];
    }
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

  return {
    stats,
    orders,
    meals,
    customers,
    selectedOrderId,
    setSelectedOrderId,
    updateOrderStatus,
  };
}