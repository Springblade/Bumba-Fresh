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
  address?: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
}

// Add other types as needed
