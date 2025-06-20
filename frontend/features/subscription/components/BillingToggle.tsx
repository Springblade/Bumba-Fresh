import React from 'react';
import { motion } from 'framer-motion';
import { BillingFrequency } from '../../../types/shared';
interface BillingToggleProps {
  billingFrequency: BillingFrequency;
  onChange: (frequency: BillingFrequency) => void;
}
export const BillingToggle = ({
  billingFrequency,
  onChange
}: BillingToggleProps) => {
  return <div className="flex justify-center mb-8">
      <div className="inline-flex items-center p-1 bg-gray-100 rounded-full">
        <motion.button onClick={() => onChange('weekly')} className={`px-6 py-2 rounded-full text-sm font-medium transition-colors relative
            ${billingFrequency === 'weekly' ? 'text-white' : 'text-gray-600 hover:text-gray-900'}`} whileTap={{
        scale: 0.95
      }}>
          Weekly
          {billingFrequency === 'weekly' && <motion.div className="absolute inset-0 bg-primary-600 rounded-full -z-10" layoutId="billingToggle" transition={{
          type: 'spring',
          bounce: 0.2,
          duration: 0.6
        }} />}
        </motion.button>
        <motion.button onClick={() => onChange('monthly')} className={`px-6 py-2 rounded-full text-sm font-medium transition-colors relative
            ${billingFrequency === 'monthly' ? 'text-white' : 'text-gray-600 hover:text-gray-900'}`} whileTap={{
        scale: 0.95
      }}>
          Monthly
          {billingFrequency === 'monthly' && <motion.div className="absolute inset-0 bg-primary-600 rounded-full -z-10" layoutId="billingToggle" transition={{
          type: 'spring',
          bounce: 0.2,
          duration: 0.6
        }} />}
        </motion.button>
      </div>
      {billingFrequency === 'monthly' && <span className="ml-3 text-sm text-success-600 font-medium">
          Save 10%
        </span>}
    </div>;
};
BillingToggle.displayName = 'BillingToggle';