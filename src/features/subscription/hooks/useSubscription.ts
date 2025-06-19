import { useState, useEffect, useCallback } from 'react';
import { BillingFrequency, SubscriptionStatus } from '../../../types/shared';

// Define SubscriptionPlan here since it's not in shared.ts
interface SubscriptionPlan {
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

export const useSubscription = () => {
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [billingFrequency, setBillingFrequency] = useState<BillingFrequency>('weekly');
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);
  const [status, setStatus] = useState<'active' | 'paused' | 'cancelled'>('active');

  const calculatePrice = useCallback((plan: SubscriptionPlan, frequency: BillingFrequency) => {
    const weeklyTotal = plan.mealsPerWeek * plan.pricePerMeal;
    const monthlyTotal = weeklyTotal * 4 * (frequency === 'monthly' ? 0.9 : 1); // 10% discount for monthly
    return {
      weeklyTotal,
      monthlyTotal,
      finalTotal: frequency === 'monthly' ? monthlyTotal / 4 : weeklyTotal,
      monthlyDiscount: frequency === 'monthly' ? '10%' : null
    };
  }, []);

  return {
    plan,
    billingFrequency,
    selectedMeals,
    status,
    setPlan,
    setBillingFrequency,
    setSelectedMeals,
    setStatus,
    calculatePrice
  };
};