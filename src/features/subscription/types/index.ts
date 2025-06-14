import { LucideIcon } from 'lucide-react';
import { BillingFrequency, SubscriptionStatus } from '../../../types/shared';
export type BillingFrequency = 'weekly' | 'monthly';
export interface PlanFeature {
  text: string;
  icon: LucideIcon;
  included: boolean;
}
export interface SubscriptionPlan {
  name: string;
  tagline: string;
  mealsPerWeek: number;
  pricePerMeal: number;
  basePrice: string;
  weeklyTotal: number;
  monthlyTotal: number;
  popular: boolean;
  features: Array<{
    text: string;
    included: boolean;
  }>;
  tierColor: string;
  description: string;
}
export interface SubscriptionMeal {
  id: number;
  name: string;
  image: string;
  description: string;
  tags: string[];
}
export interface SubscriptionState {
  plan: SubscriptionPlan | null;
  selectedMeals: SubscriptionMeal[];
  billingFrequency: BillingFrequency;
}
export interface Subscription {
  plan: string;
  status: SubscriptionStatus;
  nextBillingDate: string;
  nextDeliveryDate: string;
  currentMeals: Array<{
    id: number;
    name: string;
    image: string;
  }>;
  billingFrequency: BillingFrequency;
}