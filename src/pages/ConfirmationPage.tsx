import React from 'react';
import { CheckoutLayout } from '../components/checkout/CheckoutLayout';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { CheckCircleIcon, ClockIcon, MapPinIcon, CreditCardIcon, PrinterIcon, ShareIcon } from 'lucide-react';
const ConfirmationPage = () => {
  const navigate = useNavigate();
  const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  return <CheckoutLayout currentStep="confirmation" sidebar={<div className="space-y-4">
          <OrderSummary />
          <div className="flex flex-col gap-3">
            <Button variant="outline" className="w-full" leftIcon={<PrinterIcon className="w-5 h-5" />} onClick={() => window.print()}>
              Download Receipt
            </Button>
            <Button variant="outline" className="w-full" leftIcon={<ShareIcon className="w-5 h-5" />}>
              Share Order
            </Button>
          </div>
        </div>}>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircleIcon className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-gray-600">
              Thank you for your order. We'll notify you when it's on its way!
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <ClockIcon className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  Estimated Delivery
                </h3>
                <p className="text-gray-600">
                  Your order will arrive in 30-45 minutes
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <MapPinIcon className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Delivery Address</h3>
                <p className="text-gray-600">
                  123 Main St, San Francisco, CA 94105
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <CreditCardIcon className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Payment Method</h3>
                <p className="text-gray-600">Credit Card ending in •••• 4242</p>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-6">
              <p className="text-sm text-gray-500 mb-4">
                Order ID: <span className="font-medium">{orderId}</span>
              </p>
              <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CheckoutLayout>;
};
export default ConfirmationPage;