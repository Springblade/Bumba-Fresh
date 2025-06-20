import React, { Fragment } from 'react';
import { CheckIcon } from 'lucide-react';
type Step = 'cart' | 'shipping' | 'payment' | 'confirmation';
interface StepIndicatorProps {
  currentStep: Step;
}
const steps: {
  key: Step;
  label: string;
}[] = [{
  key: 'cart',
  label: 'Cart'
}, {
  key: 'shipping',
  label: 'Shipping'
}, {
  key: 'payment',
  label: 'Payment'
}, {
  key: 'confirmation',
  label: 'Confirmation'
}];
export const StepIndicator = ({
  currentStep
}: StepIndicatorProps) => {
  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.key === currentStep);
  };
  return <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
        const currentIndex = getCurrentStepIndex();
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === steps.length - 1;
        return <Fragment key={step.key}>
              <div className="flex flex-col items-center relative">
                <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    transition-all duration-200
                    ${isCompleted ? 'bg-success-600' : isCurrent ? 'bg-primary-600' : 'bg-gray-200'}
                  `}>
                  {isCompleted ? <CheckIcon className="w-5 h-5 text-white" /> : <span className={`text-sm font-medium ${isCurrent ? 'text-white' : 'text-gray-600'}`}>
                      {index + 1}
                    </span>}
                </div>
                <span className={`
                    absolute -bottom-6 text-sm whitespace-nowrap
                    ${isCompleted ? 'text-success-600' : isCurrent ? 'text-primary-600 font-medium' : 'text-gray-500'}
                  `}>
                  {step.label}
                </span>
              </div>
              {!isLast && <div className={`
                    flex-1 h-[2px] transition-all duration-200
                    ${index < currentIndex ? 'bg-success-600' : index === currentIndex ? 'bg-primary-600' : 'bg-gray-200'}
                  `} />}
            </Fragment>;
      })}
      </div>
    </div>;
};