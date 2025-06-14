import { useState, useCallback } from 'react';
import { BillingFrequency, SubscriptionPlan } from '../types';
export const useSubscription = () => {
  const [billingFrequency, setBillingFrequency] = useState<BillingFrequency>('weekly');
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
    billingFrequency,
    setBillingFrequency,
    calculatePrice
  };
};