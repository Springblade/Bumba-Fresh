import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw as RefreshCwIcon, XCircle as XCircleIcon, Loader2 as Loader2Icon } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Dialog } from '../../../components/ui/Dialog';
import { useSubscriptionActions } from '../hooks/useSubscriptionActions';
import { getUserSubscription } from '../../../services/subscriptions';
import { useAuth } from '../../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { SubscriptionLoadingState } from './SubscriptionLoadingState';

// Define subscription type
interface Subscription {
  plan_id: number;
  plan: string;
  status: 'active' | 'paused' | 'cancelled';
  nextBillingDate: string;
  nextDeliveryDate: string;
  subscriptionPlan: string;
}

export const SubscriptionManagement = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const {
    isLoading,
    cancelSubscription
  } = useSubscriptionActions();

  // Fetch subscription data
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        if (!isAuthenticated || !user) {
          setIsLoadingData(false);
          return;
        }

        setIsLoadingData(true);
        setError(null);
        
        console.log('🔄 Fetching subscription data...');
        const response = await getUserSubscription();
        console.log('✅ Subscription data received:', response);
        
        if (response.subscription) {
          // Transform the data to match component needs
          const subscriptionData: Subscription = {
            plan_id: response.subscription.plan_id,
            plan: response.subscription.plan,
            status: response.subscription.status,
            nextBillingDate: response.subscription.nextBillingDate,
            nextDeliveryDate: response.subscription.nextDeliveryDate,
            subscriptionPlan: response.subscription.subscriptionPlan
          };
          setSubscription(subscriptionData);
        } else {
          setSubscription(null);
        }
      } catch (err) {
        console.error('❌ Error fetching subscription:', err);
        setError('Failed to load subscription information');
        setSubscription(null);
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchSubscriptionData();
  }, [isAuthenticated, user]);

  const handleCancelSubscription = async () => {
    if (!subscription) return;
    
    const success = await cancelSubscription(subscription.plan_id);
    if (success) {
      setShowCancelDialog(false);
      // Set subscription to null to show empty state
      setSubscription(null);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('subscriptionCancelled'));
    }
  };

  // Loading state
  if (isLoadingData) {
    return <SubscriptionLoadingState />;
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <XCircleIcon className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Error Loading Subscription</h2>
        <p className="text-gray-600 max-w-md mb-8">{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  if (!subscription) {
    // Create a custom empty state since EmptyState doesn't support icon or action props
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary-100 rounded-full scale-150 opacity-20 animate-pulse" />
          <RefreshCwIcon className="w-16 h-16 text-primary-600 relative" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">No Active Subscription</h2>
        <p className="text-gray-600 max-w-md mb-8">
          You don't have an active subscription. Subscribe now to get fresh, healthy meals delivered to your door.
        </p>
        <Button onClick={() => navigate('/subscribe')} size="lg">
          Explore Our Plans
        </Button>
      </div>
    );
  }
  return <AnimatePresence mode="wait">
      {(isLoading || isLoadingData) ? <SubscriptionLoadingState /> : <motion.div className="space-y-8" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }}>
          {/* Subscription Overview */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {subscription.plan} Plan
                </h2>
                <div className="mt-2 flex items-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                      ${subscription.status === 'active' ? 'bg-green-100 text-green-800' : 
                        subscription.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                    {subscription.status === 'active' ? 'Active' : 
                     subscription.status === 'paused' ? 'Paused' : 'Cancelled'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Button onClick={() => navigate('/subscribe')} variant="outline" disabled={isLoading}>
                  Change Plan
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-error-600 hover:bg-error-50" 
                  onClick={() => setShowCancelDialog(true)} 
                  disabled={isLoading || subscription.status === 'cancelled'}
                >
                  <XCircleIcon className="w-4 h-4 mr-2" />
                  Cancel Subscription
                </Button>
              </div>
            </div>
          </div>


          {/* Cancel Dialog */}
          <Dialog isOpen={showCancelDialog} onClose={() => setShowCancelDialog(false)} title="Cancel Subscription" description="Are you sure you want to cancel your subscription? This action cannot be undone.">
            <div className="p-4 bg-error-50 rounded-lg mb-6">
              <div className="flex items-start">
                <XCircleIcon className="w-5 h-5 text-error-600 mt-0.5 mr-3" />
                <div className="text-sm text-error-600">
                  <p className="font-medium mb-1">Please Note:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      Your current subscription will end on{' '}
                      {new Date(subscription.nextBillingDate).toLocaleDateString()}
                    </li>
                    <li>You will lose access to member-only benefits</li>
                    <li>Any unused credits will be forfeited</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowCancelDialog(false)} disabled={isLoading}>
                Keep Subscription
              </Button>
              <Button variant="outline" className="text-error-600 hover:bg-error-50" onClick={handleCancelSubscription} disabled={isLoading}>
                {isLoading ? <>
                    <Loader2Icon className="w-4 h-4 mr-2 animate-spin" />
                    Cancelling...
                  </> : 'Yes, Cancel Subscription'}
              </Button>
            </div>
          </Dialog>
        </motion.div>}
    </AnimatePresence>;
};





