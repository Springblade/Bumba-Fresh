const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  message: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
  };
  token: string;
}

export async function fetchData<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  console.log('Making API request to:', url);
  console.log('Request options:', options);
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      // Add auth header when needed
      ...(localStorage.getItem('authToken') ? {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      } : {}),
    },
    ...options
  });
  
  console.log('Response status:', response.status, response.statusText);
    if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error('API Error Response:', error);
    
    // Create a more detailed error message for frontend handling
    let errorMessage = error.message || error.error || `API error: ${response.status}`;
    
    // If validation failed, include field-specific details
    if (error.details && Array.isArray(error.details)) {
      const fieldErrors = error.details.map((detail: any) => `${detail.path}: ${detail.msg}`).join(', ');
      errorMessage = `Validation failed: ${fieldErrors}`;
    }
    
    // For email conflicts, provide a clearer message
    if (response.status === 409 && errorMessage.includes('email')) {
      errorMessage = 'Email already exists';
    }
    
    throw new Error(errorMessage);
  }
  
  const data = await response.json();
  console.log('API Response Data:', data);
  return data;
}

// Auth API functions
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  return fetchData<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function registerUser(userData: RegisterData): Promise<AuthResponse> {
  return fetchData<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function verifyToken(): Promise<{ user: any }> {
  return fetchData<{ user: any }>('/auth/verify');
}

export async function logoutUser(): Promise<{ message: string }> {
  return fetchData<{ message: string }>('/auth/logout', {
    method: 'POST',
  });
}

// Meal interfaces
export interface Meal {
  meal_id: number;
  meal: string;
  quantity: number;
  price: number;
}

export interface OrderItem {
  mealId: number;
  quantity: number;
  price: number;
}

export interface CreateOrderData {
  totalAmount: number;
  items: OrderItem[];
}

export interface Order {
  order_id: number;
  user_id: number;
  total_amount: number;
  status: string;
  created_at: string;
  items?: OrderItem[];
}

// Meal API functions
export async function getMeals(filters?: { category?: string; dietary?: string }): Promise<{ meals: Meal[] }> {
  const queryParams = new URLSearchParams();
  if (filters?.category) queryParams.append('category', filters.category);
  if (filters?.dietary) queryParams.append('dietary', filters.dietary);
  
  const endpoint = `/meals${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  return fetchData<{ meals: Meal[] }>(endpoint);
}

export async function getMealById(id: number): Promise<{ meal: Meal }> {
  return fetchData<{ meal: Meal }>(`/meals/${id}`);
}

// Order API functions
export async function getOrders(): Promise<{ orders: Order[] }> {
  return fetchData<{ orders: Order[] }>('/orders');
}

export async function getOrderById(id: number): Promise<{ order: Order }> {
  return fetchData<{ order: Order }>(`/orders/${id}`);
}

export async function createOrder(orderData: CreateOrderData): Promise<{ order: Order }> {
  return fetchData<{ order: Order }>('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}