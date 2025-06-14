import React, { useEffect, useState, createContext, useContext } from 'react';
type SubscriptionContextType = {
  selectedPlan: string | null;
  weeks: number;
  mealsByWeek: string[][];
  setSelectedPlan: (planName: string) => void;
  setWeeks: (n: number) => void;
  setMealsByWeek: (weekIndex: number, meals: string[]) => void;
  clearSubscription: () => void;
};
const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);
export function SubscriptionProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(() => {
    const saved = localStorage.getItem('selectedPlan');
    return saved || null;
  });
  const [weeks, setWeeks] = useState<number>(() => {
    const saved = localStorage.getItem('subscriptionWeeks');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [mealsByWeek, setMealsByWeek] = useState<string[][]>(() => {
    const saved = localStorage.getItem('mealsByWeek');
    return saved ? JSON.parse(saved) : [];
  });
  // Persist state changes to localStorage
  useEffect(() => {
    if (selectedPlan) {
      localStorage.setItem('selectedPlan', selectedPlan);
    } else {
      localStorage.removeItem('selectedPlan');
    }
  }, [selectedPlan]);
  useEffect(() => {
    localStorage.setItem('subscriptionWeeks', weeks.toString());
  }, [weeks]);
  useEffect(() => {
    localStorage.setItem('mealsByWeek', JSON.stringify(mealsByWeek));
  }, [mealsByWeek]);
  const handleSetMealsByWeek = (weekIndex: number, meals: string[]) => {
    setMealsByWeek(current => {
      const newMeals = [...current];
      newMeals[weekIndex] = meals;
      return newMeals;
    });
  };
  const clearSubscription = () => {
    setSelectedPlan(null);
    setWeeks(1);
    setMealsByWeek([]);
    localStorage.removeItem('selectedPlan');
    localStorage.removeItem('subscriptionWeeks');
    localStorage.removeItem('mealsByWeek');
  };
  return <SubscriptionContext.Provider value={{
    selectedPlan,
    weeks,
    mealsByWeek,
    setSelectedPlan,
    setWeeks,
    setMealsByWeek: handleSetMealsByWeek,
    clearSubscription
  }}>
      {children}
    </SubscriptionContext.Provider>;
}
export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}