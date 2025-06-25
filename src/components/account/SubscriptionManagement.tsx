import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle as AlertCircleIcon, RefreshCw as RefreshCwIcon, XCircle as XCircleIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Dialog } from '../ui/Dialog';
import { EmptyState } from '../ui/EmptyState';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { getUserSubscription, cancelSubscription } from '../../services/subscriptions';
import { useAuth } from '../../context/AuthContext';
import { useToasts } from '../../hooks/useToasts';

interface Subscription {
  plan_id: number;
  plan: string;
  status: 'active' | 'paused' | 'cancelled';
  subscriptionPlan: string;
}

export const SubscriptionManagement = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToasts();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch subscription data
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        if (!isAuthenticated || !user) {
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
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
        setIsLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [isAuthenticated, user]);

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    setIsActionLoading(true);
    try {
      await cancelSubscription(subscription.plan_id);
      
      toast({
        title: 'Subscription Cancelled',
        description: 'Your subscription has been cancelled successfully.',
        type: 'success'
      });
      
      setShowCancelDialog(false);
      setSubscription(null); // Remove subscription to show empty state
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('subscriptionCancelled'));
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to cancel subscription. Please try again.',
        type: 'error'
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 mt-4">Loading subscription information...</p>
      </div>
    );
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
    return <EmptyState 
      icon={<RefreshCwIcon className="w-12 h-12" />} 
      title="No Active Subscription" 
      description="You don't have an active subscription. Subscribe now to get fresh, healthy meals delivered to your door." 
      action={<Button onClick={() => navigate('/subscribe')} size="lg">
            Explore Our Plans
          </Button>} 
    />;
  }
  return <div className="space-y-8">
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
            <Button onClick={() => navigate('/subscribe')} variant="outline" disabled={isActionLoading}>
              Change Plan
            </Button>
            <Button 
              variant="ghost" 
              className="text-error-600 hover:bg-error-50" 
              onClick={() => setShowCancelDialog(true)}
              disabled={isActionLoading || subscription.status === 'cancelled'}
            >
              <XCircleIcon className="w-4 h-4 mr-2" />
              Cancel Subscription
            </Button>
          </div>
        </div>
      </div>

      <Dialog isOpen={showCancelDialog} onClose={() => setShowCancelDialog(false)} title="Cancel Subscription" description="Are you sure you want to cancel your subscription? This action cannot be undone.">
        <div className="p-4 bg-error-50 rounded-lg mb-6">
          <div className="flex items-start">
            <AlertCircleIcon className="w-5 h-5 text-error-600 mt-0.5 mr-3" />
            <div className="text-sm text-error-600">
              <p className="font-medium mb-1">Please Note:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>You will lose access to member-only benefits</li>
                <li>Any unused credits will be forfeited</li>
                <li>This action cannot be undone</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setShowCancelDialog(false)} disabled={isActionLoading}>
            Keep Subscription
          </Button>
          <Button variant="outline" className="text-error-600 hover:bg-error-50" onClick={handleCancelSubscription} disabled={isActionLoading}>
            {isActionLoading ? 'Cancelling...' : 'Yes, Cancel Subscription'}
          </Button>
        </div>
      </Dialog>
    </div>;
};