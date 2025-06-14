import React, { useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle as AlertCircleIcon, Calendar as CalendarIcon, CreditCard as CreditCardIcon, PauseCircle as PauseCircleIcon, RefreshCw as RefreshCwIcon, UtensilsIcon, XCircle as XCircleIcon } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Dialog } from '../../../components/ui/Dialog';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useSubscriptionActions } from '../hooks/useSubscriptionActions';
import { SubscriptionLoadingState } from './SubscriptionLoadingState';
import { motion, AnimatePresence } from 'framer-motion';
// ... rest of imports
export const SubscriptionManagement = () => {
  const navigate = useNavigate();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showMealSelection, setShowMealSelection] = useState(false);
  const {
    isLoading,
    pauseSubscription,
    resumeSubscription,
    cancelSubscription,
    updatePaymentMethod
  } = useSubscriptionActions();
  // ... existing subscription data
  const handlePauseToggle = async () => {
    if (subscription.status === 'active') {
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
    return <EmptyState icon={<RefreshCwIcon className="w-12 h-12" />} title="No Active Subscription" description="You don't have an active subscription. Subscribe now to get fresh, healthy meals delivered to your door." action={<Button onClick={() => navigate('/subscribe')} size="lg">
            Explore Our Plans
          </Button>} />;
  }
  return <AnimatePresence mode="wait">
      {isLoading ? <SubscriptionLoadingState /> : <motion.div className="space-y-8" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} exit={{
      opacity: 0
    }}>
          {/* Rest of the component structure remains the same */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {/* ... existing subscription overview section ... */}
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
            {/* ... existing dialog content ... */}
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