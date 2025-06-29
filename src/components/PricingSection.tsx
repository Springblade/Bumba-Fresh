import { useState, useEffect, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getUserSubscription } from '../services/subscriptions';
import { plans } from '../features/subscription/data/plans';
import { BillingToggle } from '../features/subscription/components/BillingToggle';
import { PricingHeader } from '../features/subscription/components/PricingHeader';
import { PlanCard } from '../features/subscription/components/PlanCard';
import { useSubscription } from '../features/subscription/hooks/useSubscription';
const PricingSection = () => {
  const {
    billingFrequency,
    setBillingFrequency
  } = useSubscription();
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated
  } = useAuth();
  const {
    hasSubscription
  } = useCart();
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  // Check for active subscription
  useEffect(() => {
    const checkActiveSubscription = async () => {
      if (!isAuthenticated || !user) {
        setHasActiveSubscription(false);
        return;
      }

      try {
        const response = await getUserSubscription();
        if (response.subscription && response.subscription.status === 'active') {
          setHasActiveSubscription(true);
        } else {
          setHasActiveSubscription(false);
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
        setHasActiveSubscription(false);
      }
    };

    checkActiveSubscription();
  }, [isAuthenticated, user]);

  const handleSelectPlan = (planName: string) => {
    // Check for active subscription first
    if (hasActiveSubscription) {
      alert('You already have an active subscription. Please cancel or manage your current subscription before selecting a new plan.');
      navigate('/account/subscription');
      return;
    }

    // Check for subscription in cart
    if (hasSubscription()) {
      alert('You already have a subscription in your cart. Please modify it there.');
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
  return <section className="w-full py-24 bg-gradient-to-b from-white to-gray-50" id="pricing">
      <div className="container mx-auto px-4">
        <PricingHeader />
        <BillingToggle billingFrequency={billingFrequency} onChange={setBillingFrequency} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {plans.map(plan => <PlanCard key={plan.name} plan={plan} onSelect={() => handleSelectPlan(plan.name)} billingFrequency={billingFrequency} />)}
        </div>
        <p className="text-center text-gray-500 text-sm mt-12">
          All plans include access to our recipe library and mobile app.
          <br />
          Need help choosing?{' '}
          <a href="#" className="text-primary-600 hover:text-primary-700 font-medium underline decoration-primary-200 underline-offset-2 hover:decoration-primary-500 transition-colors">
            Contact our team
          </a>
        </p>
      </div>
    </section>;
};
export default memo(PricingSection);