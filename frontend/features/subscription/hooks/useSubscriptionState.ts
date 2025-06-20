import { useState, useCallback } from 'react';
import { BillingFrequency } from '../../../types/shared';

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

interface SubscriptionState {
  plan: SubscriptionPlan | null;
  selectedMeals: string[];
  billingFrequency: BillingFrequency;
  status: 'active' | 'paused' | 'cancelled';
  nextBillingDate?: string;
  nextDeliveryDate?: string;
}

const initialState: SubscriptionState = {
  plan: null,
  selectedMeals: [],
  billingFrequency: 'weekly',
  status: 'active'
};

export const useSubscriptionState = () => {
  const [state, setState] = useState<SubscriptionState>(initialState);
  
  const setPlan = useCallback((plan: SubscriptionPlan) => {
    setState(prev => ({
      ...prev,
      plan
    }));
  }, []);
  
  const setSelectedMeals = useCallback((meals: string[]) => {
    setState(prev => ({
      ...prev,
      selectedMeals: meals
    }));
  }, []);
  
  const setBillingFrequency = useCallback((frequency: BillingFrequency) => {
    setState(prev => ({
      ...prev,
      billingFrequency: frequency
    }));
  }, []);
  
  const resetState = useCallback(() => {
    setState(initialState);
  }, []);
  
  return {
    ...state,
    setPlan,
    setSelectedMeals,
    setBillingFrequency,
    resetState
  };
};