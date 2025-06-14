import { BillingFrequency } from '../../../types/shared';
export interface CartItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
  type: 'meal';
}
export interface SubscriptionItem {
  planName: string;
  weeks: number;
  mealsByWeek: string[][];
  totalCost: number;
  billingFrequency: BillingFrequency;
  type: 'subscription';
}
export type CartState = {
  items: (CartItem | SubscriptionItem)[];
  total: number;
};