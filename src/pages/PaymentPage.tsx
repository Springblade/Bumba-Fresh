import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckoutLayout } from '../components/checkout/CheckoutLayout';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { Button } from '../components/ui/Button';
import { ShippingForm } from '../components/checkout/ShippingForm';
import { PaymentMethodSelector } from '../components/checkout/PaymentMethodSelector';
import { LockIcon } from 'lucide-react';
const PaymentPage = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    navigate('/checkout/confirmation');
  };
  return <CheckoutLayout currentStep="payment" sidebar={<div className="space-y-4">
          <OrderSummary showItems={false} />
          <Button className="w-full" type="submit" form="payment-form" isLoading={isProcessing}>
            {isProcessing ? 'Processing...' : 'Place Order'}
          </Button>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <LockIcon className="w-4 h-4" />
            <span>Secure payment processing</span>
          </div>
        </div>}>
      <form id="payment-form" onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Shipping Information
            </h2>
            <ShippingForm />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Payment Method
            </h2>
            <PaymentMethodSelector />
          </div>
        </div>
      </form>
    </CheckoutLayout>;
};
export default PaymentPage;