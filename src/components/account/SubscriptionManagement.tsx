import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle as AlertCircleIcon, Calendar as CalendarIcon, CreditCard as CreditCardIcon, PauseCircle as PauseCircleIcon, RefreshCw as RefreshCwIcon, UtensilsIcon, XCircle as XCircleIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Dialog } from '../ui/Dialog';
import { EmptyState } from '../ui/EmptyState';
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
  // Mock data - replace with real data
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
  if (!subscription) {
    return <EmptyState icon={<RefreshCwIcon className="w-12 h-12" />} title="No Active Subscription" description="You don't have an active subscription. Subscribe now to get fresh, healthy meals delivered to your door." action={<Button onClick={() => navigate('/subscribe')} size="lg">
            Explore Our Plans
          </Button>} />;
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
          <Button onClick={() => navigate('/subscribe')} variant="outline">
            Change Plan
          </Button>
        </div>
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
      {/* Next Week's Meals */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Next Week's Meals</h2>
          <Button variant="outline">Change Meals</Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {subscription.currentMeals.map(meal => <div key={meal.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <img src={meal.image} alt={meal.name} className="w-full h-32 object-cover" />
              <div className="p-3">
                <h3 className="font-medium text-sm">{meal.name}</h3>
              </div>
            </div>)}
        </div>
      </div>
      {/* Subscription Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-6">Manage Subscription</h2>
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="flex items-center justify-center" onClick={() => {}}>
            <PauseCircleIcon className="w-4 h-4 mr-2" />
            {subscription.status === 'active' ? 'Pause' : 'Resume'} Subscription
          </Button>
          <Button variant="outline" className="flex items-center justify-center" onClick={() => {}}>
            <CreditCardIcon className="w-4 h-4 mr-2" />
            Update Payment Method
          </Button>
          <Button variant="ghost" className="flex items-center justify-center text-error-600 hover:bg-error-50 col-span-2" onClick={() => setShowCancelDialog(true)}>
            <XCircleIcon className="w-4 h-4 mr-2" />
            Cancel Subscription
          </Button>
        </div>
      </div>
      {/* Cancel Subscription Dialog */}
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
          <Button variant="ghost" onClick={() => setShowCancelDialog(false)}>
            Keep Subscription
          </Button>
          <Button variant="outline" className="text-error-600 hover:bg-error-50" onClick={() => {
          // Handle cancellation
          setShowCancelDialog(false);
        }}>
            Yes, Cancel Subscription
          </Button>
        </div>
      </Dialog>
    </div>;
};