import { useCallback, useMemo, useState, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle as AlertCircleIcon, Calendar as CalendarIcon, CreditCard as CreditCardIcon, PauseCircle as PauseCircleIcon, RefreshCw as RefreshCwIcon, UtensilsIcon, XCircle as XCircleIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Dialog } from '../ui/Dialog';
// Lazy load the meal selection component
const MealSelectionModal = lazy(() => import('../MealSelectionModal'));
interface Subscription {
  plan: string;
  status: 'active' | 'paused' | 'cancelled';
  nextBillingDate: string;
  nextDeliveryDate: string;
}
export const SubscriptionManagement = () => {
  const navigate = useNavigate();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showMealSelection, setShowMealSelection] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Mock data - replace with real data
  const subscription: Subscription | null = useMemo(() => ({
    plan: 'Premium Plan',
    status: 'active',
    nextBillingDate: '2024-03-01',
    nextDeliveryDate: '2024-02-22'
  }), []);
  const handlePauseSubscription = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // Update subscription status
    } catch (error) {
      console.error('Error updating subscription:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  const handleCancelSubscription = useCallback(async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setShowCancelDialog(false);
      // Update subscription status
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  if (!subscription) {
    // Create a custom empty state since EmptyState doesn't support icon or action props
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="relative mb-8">
          <RefreshCwIcon className="w-16 h-16 text-primary-600" />
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
  return <div className="space-y-8">
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
        {/* Next Billing and Delivery Info */}
        <div className="mt-6 grid grid-cols-2 gap-6">
          <div className="flex items-center">
            <CalendarIcon className="w-5 h-5 text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Next Billing Date</p>
              <p className="font-medium">
                {new Date(subscription.nextBillingDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <UtensilsIcon className="w-5 h-5 text-gray-400 mr-2" />
            <div>
              <p className="text-sm text-gray-500">Next Delivery</p>
              <p className="font-medium">
                {new Date(subscription.nextDeliveryDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-6">Manage Subscription</h2>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="flex items-center justify-center" onClick={handlePauseSubscription} disabled={isLoading}>
            <PauseCircleIcon className="w-4 h-4 mr-2" />
            {subscription.status === 'active' ? 'Pause' : 'Resume'} Subscription
          </Button>
          <Button variant="outline" className="flex items-center justify-center" onClick={() => {}} disabled={isLoading}>
            <CreditCardIcon className="w-4 h-4 mr-2" />
            Update Payment Method
          </Button>
          <Button variant="ghost" className="flex items-center justify-center text-error-600 hover:bg-error-50 col-span-2" onClick={() => setShowCancelDialog(true)} disabled={isLoading}>
            <XCircleIcon className="w-4 h-4 mr-2" />
            Cancel Subscription
          </Button>
        </div>
      </div>
      {/* Modals */}
      <Dialog isOpen={showCancelDialog} onClose={() => setShowCancelDialog(false)} title="Cancel Subscription" description="Are you sure you want to cancel your subscription? This action cannot be undone.">
        <div className="p-4 bg-error-50 rounded-lg mb-6">
          <div className="flex items-start">
            <AlertCircleIcon className="w-5 h-5 text-error-600 mt-0.5 mr-3" />
            <div className="text-sm text-error-600">
              <p className="font-medium mb-1">Please Note:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Your current subscription will end on{' '}
                  {subscription.nextBillingDate}
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
            {isLoading ? 'Cancelling...' : 'Yes, Cancel Subscription'}
          </Button>
        </div>
      </Dialog>
      <Suspense fallback={<div>Loading meal selection...</div>}>
        {showMealSelection && <MealSelectionModal isOpen={showMealSelection} onClose={() => setShowMealSelection(false)} currentSelections={[]} onSave={() => {}} mealsPerWeek={3} planName={subscription.plan} />}
      </Suspense>
    </div>;
};
