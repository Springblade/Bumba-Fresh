import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { HeartIcon, InstagramIcon, BookOpenIcon, CheckCircle as CheckCircleIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { Timeline } from '../components/checkout/Timeline';
import { EngagementCard } from '../components/checkout/EngagementCard';
import GradientText from '../components/GradientText';

// Type definitions for confirmation page items
interface MealItem {
  type: 'meal';
  id: number;
  name: string;
  quantity: number;
  price?: string;
}

interface SubscriptionItem {
  type: 'subscription';
  planName: string;
  totalCost: number;
}

type ConfirmationItem = MealItem | SubscriptionItem;
const ConfirmationPage = () => {
  const location = useLocation();
  const { order, subscription } = location.state || {};
  
  // Use either order or subscription data
  const confirmationData = order || subscription;
  
  // Redirect if no data is present
  if (!confirmationData) {
    return <Navigate to="/" replace />;
  }
  
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Determine if we're displaying an order or subscription
  const isSubscription = !!subscription;
  
  // Get the appropriate reference number
  const referenceNumber = isSubscription 
    ? confirmationData.subscriptionNumber 
    : confirmationData.orderNumber;
  
  // Get the appropriate delivery or next billing date
  const dateToShow = isSubscription 
    ? confirmationData.nextBillingDate 
    : confirmationData.estimatedDelivery;
  
  // Get items to display
  const itemsToDisplay = isSubscription 
    ? [{ type: 'subscription', planName: confirmationData.planName, totalCost: confirmationData.subtotal }] 
    : confirmationData.items;
  return <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
            <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center">
              <CheckCircleIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Thank you for your {isSubscription ? 'subscription' : 'order'}!
          </h1>
          <div className="flex flex-col items-center gap-2">
            <p className="text-xl text-gray-600">
              {isSubscription ? 'Subscription' : 'Order'} <span className="font-medium">#{referenceNumber}</span>
            </p>
            <p className="text-gray-500">
              {isSubscription ? 'Next billing date' : 'Estimated delivery'}: {formatDate(dateToShow)}
            </p>
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-2 mb-12">
          {/* Order/Subscription Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">
              {isSubscription ? 'Subscription' : 'Order'} Details
            </h2>
            <div className="space-y-4">
              {isSubscription ? (
                <div className="flex justify-between items-start py-2">
                  <div>
                    <p className="font-medium">{confirmationData.planName}</p>
                    <p className="text-sm text-gray-500">
                      Billing: {confirmationData.billingFrequency}
                    </p>
                  </div>
                  <p className="font-medium">${confirmationData.subtotal.toFixed(2)}</p>
                </div>
              ) : (
                itemsToDisplay.map((item: ConfirmationItem) => (
                  <div key={item.type === 'meal' ? item.id : item.planName} className="flex justify-between items-start py-2">
                    <div>
                      <p className="font-medium">
                        {item.type === 'meal' ? item.name : item.planName}
                      </p>
                      {item.type === 'meal' && (
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      )}
                    </div>
                    <p className="font-medium">
                      $
                      {item.type === 'meal'
                        ? (parseFloat((item.price || '0').replace('$', '')) * item.quantity).toFixed(2)
                        : item.totalCost.toFixed(2)}
                    </p>
                  </div>
                ))
              )}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${confirmationData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-success-600">Free</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">Tax</span>
                  <span>${confirmationData.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold mt-4 pt-4 border-t">
                  <span>Total</span>
                  <span>${confirmationData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Shipping Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Shipping Details</h2>
            <div className="space-y-2">
              <p className="text-gray-600">{confirmationData.shippingAddress.fullName}</p>
              <p className="text-gray-600">
                {confirmationData.shippingAddress.phoneNumber}
              </p>
              <p className="text-gray-600">{confirmationData.shippingAddress.address}</p>
              <p className="text-gray-600">
                {confirmationData.shippingAddress.city}, {confirmationData.shippingAddress.postalCode}
              </p>
            </div>
          </div>
        </div>
        {/* Engagement Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          <EngagementCard title="Share the Health" description="Refer a friend and you both get 15% off your next order!" ctaText="Get Referral Link" icon={<HeartIcon className="w-6 h-6" />} onClick={() => {}} variant="featured" />
          <EngagementCard title="Follow Our Journey" description="Get daily inspiration and exclusive offers on Instagram" ctaText="Follow @BumbaFresh" icon={<InstagramIcon className="w-6 h-6" />} onClick={() => {}} />
        </div>
      </div>
    </div>;
};
export default ConfirmationPage;
