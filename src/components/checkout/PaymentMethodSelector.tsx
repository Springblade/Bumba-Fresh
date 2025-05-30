import React, { useState } from 'react';
import { FormField } from '../ui/FormField';
import { CreditCardIcon, WalletIcon, TruckIcon, CheckIcon } from 'lucide-react';
type PaymentMethod = 'credit-card' | 'paypal' | 'cash';
export const PaymentMethodSelector = () => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('credit-card');
  const methods = [{
    id: 'credit-card',
    title: 'Credit Card',
    description: 'Pay securely with your credit card',
    icon: CreditCardIcon
  }, {
    id: 'paypal',
    title: 'PayPal',
    description: 'Pay with your PayPal account',
    icon: WalletIcon
  }, {
    id: 'cash',
    title: 'Cash on Delivery',
    description: 'Pay when you receive your order',
    icon: TruckIcon
  }] as const;
  return <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {methods.map(method => {
        const Icon = method.icon;
        return <label key={method.id} className={`
                relative flex flex-col p-4 border-2 rounded-lg cursor-pointer
                transition-all duration-200
                ${selectedMethod === method.id ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}
              `}>
              <input type="radio" name="payment-method" value={method.id} checked={selectedMethod === method.id} onChange={e => setSelectedMethod(e.target.value as PaymentMethod)} className="sr-only" />
              <div className="flex items-center gap-3 mb-2">
                <Icon className={`w-5 h-5 ${selectedMethod === method.id ? 'text-primary-600' : 'text-gray-400'}`} />
                <span className="font-medium text-gray-900">
                  {method.title}
                </span>
                {selectedMethod === method.id && <CheckIcon className="w-5 h-5 text-primary-600 absolute top-4 right-4" />}
              </div>
              <p className="text-sm text-gray-500">{method.description}</p>
            </label>;
      })}
      </div>
      {selectedMethod === 'credit-card' && <div className="mt-6 space-y-6 pt-6 border-t border-gray-100">
          <FormField label="Card Number" type="text" placeholder="1234 5678 9012 3456" icon={<CreditCardIcon className="w-5 h-5" />} required />
          <div className="grid grid-cols-2 gap-6">
            <FormField label="Expiry Date" type="text" placeholder="MM/YY" required />
            <FormField label="CVV" type="text" placeholder="123" required helperText="3-digit code on back of card" />
          </div>
        </div>}
    </div>;
};