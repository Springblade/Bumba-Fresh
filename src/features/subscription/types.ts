import { LucideIcon } from 'lucide-react';
export type BillingFrequency = 'weekly' | 'monthly';
export interface SubscriptionPlan {
  name: string;
  description: string;
  mealsPerWeek: number;
  pricePerMeal: number;
  popular?: boolean;
  tierColor: string;
  features: Array<{
    text: string;
    included: boolean;
    icon?: LucideIcon;
  }>;
}
export interface SubscriptionState {
  plan: string | null;
  billingFrequency: BillingFrequency;
  selectedMeals: string[];
  status: 'active' | 'paused' | 'cancelled';
  nextBillingDate?: string;
  nextDeliveryDate?: string;
}