import React, { memo } from 'react';
import { FormField } from '../ui/FormField';
import { CreditCardIcon, LockIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
type PaymentMethod = 'credit-card' | 'paypal';
interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
  isProcessing: boolean;
}
export const PaymentMethodSelector = memo(({
  selectedMethod,
  onMethodChange,
  isProcessing
}: PaymentMethodSelectorProps) => {
  const methods = [{
    id: 'credit-card' as PaymentMethod,
    title: 'Credit Card',
    description: 'Pay securely with your credit or debit card',
    icon: 'https://cdn-icons-png.flaticon.com/512/179/179457.png'
  }, {
    id: 'paypal' as PaymentMethod,
    title: 'PayPal',
    description: 'Fast and secure payments with PayPal',
    icon: 'https://cdn-icons-png.flaticon.com/512/174/174861.png'
  }];
  return <div className="space-y-6">
        <div className="grid gap-4" role="radiogroup" aria-label="Payment method">
          {methods.map(method => {
        const isSelected = selectedMethod === method.id;
        return <motion.label key={method.id} className={`
                relative flex flex-col p-4 border-2 rounded-lg cursor-pointer
                transition-all duration-200
                ${isSelected ? 'border-primary-600 bg-primary-50' : 'border-gray-200'}
                ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-300'}
              `} whileHover={!isProcessing ? {
          y: -2
        } : undefined} whileTap={!isProcessing ? {
          y: 0
        } : undefined}>
                <input type="radio" name="payment-method" value={method.id} checked={isSelected} onChange={() => onMethodChange(method.id)} className="sr-only" disabled={isProcessing} />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <img src={method.icon} alt={`${method.title} logo`} className="max-w-full max-h-full" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {method.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {method.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center w-5 h-5 border-2 rounded-full">
                    <AnimatePresence>
                      {isSelected && <motion.div initial={{
                  scale: 0
                }} animate={{
                  scale: 1
                }} exit={{
                  scale: 0
                }} className="w-3 h-3 rounded-full bg-primary-600" />}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.label>;
      })}
        </div>
        <AnimatePresence mode="wait">
          {selectedMethod === 'credit-card' && <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: -20
      }} className="mt-6 space-y-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <LockIcon className="w-4 h-4" />
                <span>Your payment information is secure</span>
              </div>
              <FormField label="Card Number" type="text" placeholder="1234 5678 9012 3456" icon={<CreditCardIcon className="w-5 h-5" />} required disabled={isProcessing} pattern="[\d\s]{13,19}" maxLength={19} autoComplete="cc-number" />
              <div className="grid grid-cols-2 gap-6">
                <FormField label="Expiry Date" type="text" placeholder="MM/YY" required disabled={isProcessing} pattern="\d\d/\d\d" maxLength={5} autoComplete="cc-exp" />
                <FormField label="Security Code" type="text" placeholder="CVC" required disabled={isProcessing} pattern="\d{3,4}" maxLength={4} autoComplete="cc-csc" helperText="3-digit code on back of card" />
              </div>
            </motion.div>}
        </AnimatePresence>
      </div>;
});
PaymentMethodSelector.displayName = 'PaymentMethodSelector';