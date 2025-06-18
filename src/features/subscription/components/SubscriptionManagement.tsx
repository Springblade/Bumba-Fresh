import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PauseCircle as PauseCircleIcon, RefreshCw as RefreshCwIcon, XCircle as XCircleIcon, CreditCard as CreditCardIcon, Loader2 as Loader2Icon } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Dialog } from '../../../components/ui/Dialog';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useSubscriptionActions } from '../hooks/useSubscriptionActions';
import { motion, AnimatePresence } from 'framer-motion';
import { SubscriptionLoadingState } from './SubscriptionLoadingState';

// Define subscription type
interface Subscription {
  plan: string;
  status: 'active' | 'paused' | 'cancelled';
  nextBillingDate: string;
  nextDeliveryDate: string;
  currentMeals: Array<{
    id: number;
    name: string;
    image: string;
  }>;
}

export const SubscriptionManagement = () => {
  const navigate = useNavigate();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  
  const {
    isLoading,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    updatePaymentMethod
  } = useSubscriptionActions();
  
  // Mock subscription data - replace with real data from API
  const subscription: Subscription | null = {
    plan: 'Premium Plan',
    status: 'active',
    nextBillingDate: '2024-03-01',
    nextDeliveryDate: '2024-02-22',
    currentMeals: [{
      id: 1,
      name: 'Grilled Salmon Bowl',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288'
    }, {
      id: 2,
      name: 'Quinoa Buddha Bowl',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd'
    }]
  };

  const handlePauseToggle = async () => {
    if (subscription?.status === 'active') {
      await pauseSubscription();
    } else {
      await resumeSubscription();
    }
  };

  const handleCancelSubscription = async () => {
    const success = await cancelSubscription();
    if (success) {
      setShowCancelDialog(false);
      // Additional cleanup if needed
    }
  };

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
      {isLoading ? <SubscriptionLoadingState /> : <motion.div className="space-y-8" initial={{
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
                  {subscription.plan}
                </h2>
                <div className="mt-2 flex items-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                      ${subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {subscription.status === 'active' ? 'Active' : 'Paused'}
                  </span>
                </div>
              </div>
              <Button onClick={() => navigate('/subscribe')} variant="outline" disabled={isLoading}>
                Change Plan
              </Button>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-6">Manage Subscription</h2>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="flex items-center justify-center" onClick={handlePauseToggle} disabled={isLoading}>
                <PauseCircleIcon className="w-4 h-4 mr-2" />
                {subscription.status === 'active' ? 'Pause' : 'Resume'}{' '}
                Subscription
              </Button>
              <Button variant="outline" className="flex items-center justify-center" onClick={updatePaymentMethod} disabled={isLoading}>
                <CreditCardIcon className="w-4 h-4 mr-2" />
                Update Payment Method
              </Button>
              <Button variant="ghost" className="flex items-center justify-center text-error-600 hover:bg-error-50 col-span-2" onClick={() => setShowCancelDialog(true)} disabled={isLoading}>
                <XCircleIcon className="w-4 h-4 mr-2" />
                Cancel Subscription
              </Button>
            </div>
          </div>
          {/* Cancel Dialog */}
          <Dialog isOpen={showCancelDialog} onClose={() => setShowCancelDialog(false)} title="Cancel Subscription" description="Are you sure you want to cancel your subscription? This action cannot be undone.">
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





