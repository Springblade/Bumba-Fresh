import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import { useToasts } from './hooks/useToasts';
// ... existing imports ...

const PricingSection = () => {
  const [billingFrequency, setBillingFrequency] = useState<'weekly' | 'monthly'>('weekly');
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  const {
    addSubscriptionItem,
    hasSubscription
  } = useCart();
  const {
    toast
  } = useToasts();

  const handleSelectPlan = (planName: string) => {
    if (hasSubscription()) {
      toast({
        title: 'Subscription Limit',
        description: 'You can only have one subscription in your cart. Please remove the existing one to add a new plan.',
        type: 'warning'
      });
      navigate('/cart');
      return;
    }
    const configureUrl = `/configure-subscription?plan=${encodeURIComponent(planName)}&billing=${billingFrequency}`;
    if (!user) {
      const encodedRedirectUrl = encodeURIComponent(configureUrl);
      navigate(`/auth?next=${encodedRedirectUrl}`);
      return;
    }
    navigate(configureUrl);
  };
  // ... rest of the component ...
};

export default PricingSection;