import { useState, useEffect, useMemo } from 'react';
import { Package as PackageIcon, RefreshCw as RefreshCwIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUserOrders } from '../../services/orders';
import { getUserSubscription } from '../../services/subscriptions';
import { LoadingSpinner } from '../ui/LoadingSpinner';
export const AccountDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeOrdersCount, setActiveOrdersCount] = useState<number>(0);
  const [subscriptionData, setSubscriptionData] = useState<{
    status: string;
    nextBillingDate: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);

  // Fetch user orders and calculate active orders count
  useEffect(() => {
    const fetchActiveOrders = async () => {
      try {
        if (!isAuthenticated || !user) {
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        setError(null);
        
        console.log('AccountDashboard: Fetching user orders for active count...');
        const response = await getUserOrders();
        console.log('AccountDashboard: Received orders response:', response);
        
        // Handle different response formats
        let orders = [];
        if (Array.isArray(response)) {
          orders = response;
        } else if (response && typeof response === 'object') {
          if (Array.isArray(response.orders)) {
            orders = response.orders;
          } else if (Array.isArray(response.data)) {
            orders = response.data;
          }
        }

        // Filter for active orders (not delivered or cancelled)
        const activeOrders = orders.filter((order: any) => {
          const status = (order.status || '').toLowerCase();
          return status !== 'delivered' && status !== 'cancelled';
        });

        const activeCount = activeOrders.length;
        console.log(` AccountDashboard: Found ${activeCount} active orders out of ${orders.length} total orders`);
        
        setActiveOrdersCount(activeCount);
      } catch (err) {
        console.error(' AccountDashboard: Error fetching active orders:', err);
        setError('Unable to load order information');
        setActiveOrdersCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveOrders();
  }, [isAuthenticated, user]);

  // Fetch user subscription data
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        if (!isAuthenticated || !user) {
          setIsSubscriptionLoading(false);
          return;
        }

        setIsSubscriptionLoading(true);
        setSubscriptionError(null);
        
        console.log('AccountDashboard: Fetching user subscription...');
        const response = await getUserSubscription();
        console.log('AccountDashboard: Received subscription response:', response);
        
        if (response.subscription) {
          setSubscriptionData({
            status: response.subscription.status,
            nextBillingDate: response.subscription.nextBillingDate
          });
        } else {
          // No active subscription
          setSubscriptionData(null);
        }
      } catch (err) {
        console.error('AccountDashboard: Error fetching subscription:', err);
        setSubscriptionError('Unable to load subscription information');
        setSubscriptionData(null);
      } finally {
        setIsSubscriptionLoading(false);
      }
    };

    fetchSubscription();

    // Listen for subscription changes (e.g., after cancellation)
    const handleSubscriptionChange = () => {
      console.log('AccountDashboard: Subscription change detected, refreshing...');
      fetchSubscription();
    };

    // Listen for custom events that indicate subscription changes
    window.addEventListener('subscriptionCancelled', handleSubscriptionChange);
    window.addEventListener('subscriptionUpdated', handleSubscriptionChange);

    return () => {
      window.removeEventListener('subscriptionCancelled', handleSubscriptionChange);
      window.removeEventListener('subscriptionUpdated', handleSubscriptionChange);
    };
  }, [isAuthenticated, user]);

  const statsData = useMemo(() => [{
    label: 'Active Orders',
    value: activeOrdersCount.toString(),
    isLoading: isLoading,
    error: error,
    icon: PackageIcon,
    bgColor: 'bg-primary-50',
    iconColor: 'text-primary-600'
  }, {
    label: 'Subscription Status',
    value: subscriptionData?.status === 'active' ? 'Active' : 
           subscriptionData?.status === 'paused' ? 'Paused' :
           subscriptionData?.status === 'cancelled' ? 'Cancelled' : 'Inactive',
    isLoading: isSubscriptionLoading,
    error: subscriptionError,
    icon: RefreshCwIcon,
    bgColor: subscriptionData?.status === 'active' ? 'bg-green-50' : 
             subscriptionData?.status === 'paused' ? 'bg-yellow-50' :
             subscriptionData?.status === 'cancelled' ? 'bg-red-50' : 'bg-gray-50',
    iconColor: subscriptionData?.status === 'active' ? 'text-green-600' : 
               subscriptionData?.status === 'paused' ? 'text-yellow-600' :
               subscriptionData?.status === 'cancelled' ? 'text-red-600' : 'text-gray-600'
  }], [activeOrdersCount, isLoading, error, subscriptionData, isSubscriptionLoading, subscriptionError]);
  return <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">
          Welcome back! Here's a quick overview of your account.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {statsData.map((stat, index) => <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 transition-shadow hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {/* Handle loading state for all stats */}
                  {stat.isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : stat.error ? (
                    <span className="text-red-500" title={stat.error}>
                      {stat.label === 'Active Orders' ? '0' : 'Error'}
                    </span>
                  ) : (
                    stat.value
                  )}
                </p>
              </div>
            </div>
          </div>)}
      </div>
    </div>;
};