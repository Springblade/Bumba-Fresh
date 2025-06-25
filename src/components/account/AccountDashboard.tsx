import { useState, useEffect, useMemo } from 'react';
import { CreditCard as CreditCardIcon, Package as PackageIcon, RefreshCw as RefreshCwIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUserOrders } from '../../services/orders';
import { LoadingSpinner } from '../ui/LoadingSpinner';
export const AccountDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeOrdersCount, setActiveOrdersCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
    value: 'Active',
    icon: RefreshCwIcon,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600'
  }, {
    label: 'Next Billing',
    value: 'Mar 1, 2024',
    icon: CreditCardIcon,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600'
  }], [activeOrdersCount, isLoading, error]);
  return <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">
          Welcome back! Here's a quick overview of your account.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statsData.map((stat, index) => <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 transition-shadow hover:shadow-md">
            <div className="flex items-center space-x-4">
              <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {/* Handle loading state for Active Orders */}
                  {stat.label === 'Active Orders' ? (
                    stat.isLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : stat.error ? (
                      <span className="text-red-500" title={stat.error}>0</span>
                    ) : (
                      stat.value
                    )
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