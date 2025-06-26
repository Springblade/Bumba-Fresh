import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlanCard } from '../components/subscription/PlanCard';
import WhySubscribe from '../components/subscription/WhySubscribe';
import FAQ from '../components/subscription/FAQ';
import GradientText from '../components/GradientText';
import { plans } from '../data/subscriptionPlans';
import { useAuth } from '../context/AuthContext';
import { getUserSubscription } from '../services/subscriptions';
import { Dialog } from '../components/ui/Dialog';
import { Button } from '../components/ui/Button';
import { AlertTriangle as AlertTriangleIcon } from 'lucide-react';
const SubscriptionPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [showActiveSubscriptionDialog, setShowActiveSubscriptionDialog] = useState(false);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  // Check for active subscription on component mount
  useEffect(() => {
    const checkActiveSubscription = async () => {
      if (!isAuthenticated || !user) {
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
    if (hasActiveSubscription) {
      setShowActiveSubscriptionDialog(true);
      return;
    }
    navigate(`/configure-subscription?plan=${encodeURIComponent(planName)}`);
  };

  const handleProceedToManageSubscription = () => {
    setShowActiveSubscriptionDialog(false);
    navigate('/account/subscription');
  };
  return <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-32 bg-gradient-to-b from-primary-50/50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your{' '}
              <GradientText variant="primary">Perfect Plan</GradientText>
            </h1>
            <p className="text-xl text-gray-600">
              Flexible meal plans designed to fit your lifestyle. Save more with
              our subscription options.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map(plan => <PlanCard key={plan.name} {...plan} onSelect={() => handleSelectPlan(plan.name)} />)}
          </div>
        </div>
      </section>
      {/* Why Subscribe Section */}
      <WhySubscribe />
      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            <GradientText variant="primary">
              Frequently Asked Questions
            </GradientText>
          </h2>
          <div className="max-w-3xl mx-auto">
            <FAQ />
          </div>
        </div>
      </section>

      {/* Active Subscription Dialog */}
      <Dialog 
        isOpen={showActiveSubscriptionDialog} 
        onClose={() => setShowActiveSubscriptionDialog(false)} 
        title="Active Subscription Found" 
        description="You already have an active subscription. To change your plan, please manage your current subscription first."
      >
        <div className="p-4 bg-warning-50 rounded-lg mb-6">
          <div className="flex items-start">
            <AlertTriangleIcon className="w-5 h-5 text-warning-600 mt-0.5 mr-3" />
            <div className="text-sm text-warning-700">
              <p className="font-medium mb-1">Cannot Subscribe to Multiple Plans</p>
              <p>
                You can only have one active subscription at a time. Please cancel or manage your current subscription before selecting a new plan.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setShowActiveSubscriptionDialog(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleProceedToManageSubscription}>
            Manage Current Subscription
          </Button>
        </div>
      </Dialog>
    </div>;
};
export default SubscriptionPage;