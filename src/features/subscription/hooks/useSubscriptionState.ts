import { useState, useCallback } from 'react';
import { SubscriptionState, SubscriptionPlan, SubscriptionMeal, BillingFrequency } from '../types';
const initialState: SubscriptionState = {
  plan: null,
  selectedMeals: [],
  billingFrequency: 'weekly'
};
export const useSubscriptionState = () => {
  const [state, setState] = useState<SubscriptionState>(initialState);
  const setPlan = useCallback((plan: SubscriptionPlan) => {
    setState(prev => ({
      ...prev,
      plan
    }));
  }, []);
  const setSelectedMeals = useCallback((meals: SubscriptionMeal[]) => {
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