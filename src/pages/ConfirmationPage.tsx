import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { HeartIcon, InstagramIcon, BookOpenIcon, CheckCircle as CheckCircleIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { Timeline } from '../components/checkout/Timeline';
import { EngagementCard } from '../components/checkout/EngagementCard';
import GradientText from '../components/GradientText';
const ConfirmationPage = () => {
  const location = useLocation();
  const {
    order
  } = location.state || {};
  // Redirect if no order data is present
  if (!order) {
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
            Thank you for your order!
          </h1>
          <div className="flex flex-col items-center gap-2">
            <p className="text-xl text-gray-600">
              Order <span className="font-medium">#{order.orderNumber}</span>
            </p>
            <p className="text-gray-500">
              Estimated delivery: {formatDate(order.estimatedDelivery)}
            </p>
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-2 mb-12">
          {/* Order Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Order Details</h2>
            <div className="space-y-4">
              {order.items.map((item: any) => <div key={item.type === 'meal' ? item.id : item.planName} className="flex justify-between items-start py-2">
                  <div>
                    <p className="font-medium">
                      {item.type === 'meal' ? item.name : item.planName}
                    </p>
                    {item.type === 'meal' && <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>}
                  </div>
                  <p className="font-medium">
                    $
                    {item.type === 'meal' ? (parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2) : item.totalCost.toFixed(2)}
                  </p>
                </div>)}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-success-600">Free</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold mt-4 pt-4 border-t">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Shipping Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6">Shipping Details</h2>
            <div className="space-y-2">
              <p className="text-gray-600">{order.shippingAddress.fullName}</p>
              <p className="text-gray-600">
                {order.shippingAddress.phoneNumber}
              </p>
              <p className="text-gray-600">{order.shippingAddress.address}</p>
              <p className="text-gray-600">
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
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