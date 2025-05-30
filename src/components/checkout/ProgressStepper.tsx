import React from 'react';
import { ShoppingCartIcon, CreditCardIcon, CheckCircleIcon } from 'lucide-react';
export type CheckoutStep = 'cart' | 'payment' | 'confirmation';
interface ProgressStepperProps {
  currentStep: CheckoutStep;
}
const steps = [{
  id: 'cart',
  label: 'Cart',
  icon: ShoppingCartIcon
}, {
  id: 'payment',
  label: 'Payment',
  icon: CreditCardIcon
}, {
  id: 'confirmation',
  label: 'Confirmation',
  icon: CheckCircleIcon
}] as const;
export const ProgressStepper = ({
  currentStep
}: ProgressStepperProps) => {
  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep);
  };
  const getStepStatus = (stepIndex: number) => {
    const currentStepIndex = getCurrentStepIndex();
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'upcoming';
  };
  return <nav aria-label="Checkout progress" className="w-full max-w-4xl mx-auto">
      <ol className="flex items-center">
        {steps.map((step, index) => {
        const status = getStepStatus(index);
        const Icon = step.icon;
        const isLast = index === steps.length - 1;
        return <li key={step.id} className={`flex items-center ${isLast ? 'flex-1' : 'flex-1'}`}>
              <div className="relative flex flex-col items-center flex-1 group">
                {/* Step indicator */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200
                    ${status === 'completed' ? 'bg-primary-600' : status === 'current' ? 'bg-primary-600' : 'bg-gray-200'}
                    ${status === 'upcoming' ? 'text-gray-400' : 'text-white'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {/* Step label */}
                <span className={`mt-2 text-sm font-medium
                    ${status === 'completed' ? 'text-primary-600' : status === 'current' ? 'text-primary-600' : 'text-gray-500'}`}>
                  {step.label}
                </span>
                {/* Connector line */}
                {!isLast && <div className={`absolute top-4 left-0 -translate-y-1/2 w-full h-0.5 transition-colors duration-200
                      ${status === 'completed' ? 'bg-primary-600' : 'bg-gray-200'}`} style={{
              left: '50%',
              width: '100%'
            }} />}
              </div>
            </li>;
      })}
      </ol>
    </nav>;
};