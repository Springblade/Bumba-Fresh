export type BillingFrequency = 'weekly' | 'monthly';
export interface BaseMeal {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  tags: string[];
  category?: string[];
  overlayBadge?: 'Popular' | 'New' | 'Bestseller' | 'Limited Time';
  isNew?: boolean;
}
export interface CartMeal extends BaseMeal {
  quantity: number;
  type: 'meal';
}
export interface SubscriptionMeal extends BaseMeal {
  calories: string;
  prepTime: string;
  dietaryInfo: string[];
}
export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled';
export interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}
export interface LoadingState {
  isLoading: boolean;
  error: Error | null;
}
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  ease?: number[];
}

// User related types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: Address;
  isAdmin?: boolean;  // Add the isAdmin property
  role?: 'user' | 'admin' | 'dietitian';
  createdAt?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'dietitian';  // Add 'dietitian' role
  timestamp: Date;
  read: boolean;
  category?: 'nutrition' | 'general';  // Track message purpose
  userId?: string;  // Track which user sent the message
}

export interface ChatState {
  isOpen: boolean;
  messages: ChatMessage[];
  unreadCount: number;
}

// Add conversation type for the admin interface
export interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  status: 'active' | 'archived';
}

// Admin related types
export interface AdminStats {
  totalRevenue: number;
  activeCustomers: number;
  ordersThisWeek: number;
  averageOrderValue: number;
  percentChange?: {
    revenue?: number;
    customers?: number;
    orders?: number;
    averageOrder?: number;
  };
}

export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  date: string;
  total: string;
  status: 'pending'|'confirmed'|'preparing'|'shipped'|'delivered'|'canceled';
  items: number;
}

export interface AdminMeal {
  id: string;  // Ensure id is string type
  name: string;
  category: string;
  price: string;
  calories: number;
  status: 'active' | 'inactive';
  tags?: string[];  // Add tags property
  imageUrl?: string;
  inventory?: number;  // Optional inventory property
}

export interface AdminCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subscribed: boolean;
  ordersCount: number;
  joinedDate: string;
  totalSpent?: number;  // Add totalSpent property
  lastOrderDate?: string;
  status?: 'active' | 'inactive';
  phone?: string;
}

