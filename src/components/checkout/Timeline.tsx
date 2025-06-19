import React from 'react';
import { CheckCircleIcon, ClockIcon, PackageIcon, TruckIcon } from 'lucide-react';
interface TimelineProps {
  currentStep: number;
  estimatedDelivery: Date;
}
export const Timeline = ({
  currentStep,
  estimatedDelivery
}: TimelineProps) => {
  const steps = [{
    title: 'Order Confirmed',
    icon: CheckCircleIcon,
    status: currentStep >= 1 ? 'complete' : 'pending'
  }, {
    title: 'Meals Prepared',
    icon: ClockIcon,
    status: currentStep >= 2 ? 'complete' : currentStep === 1 ? 'current' : 'pending'
  }, {
    title: 'Shipped',
    icon: PackageIcon,
    status: currentStep >= 3 ? 'complete' : currentStep === 2 ? 'current' : 'pending'
  }, {
    title: 'Delivered',
    icon: TruckIcon,
    status: currentStep >= 4 ? 'complete' : currentStep === 3 ? 'current' : 'pending'
  }];
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };
  return <div className="py-6">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[21px] top-0 h-full w-0.5 bg-gray-200" aria-hidden="true" />
        <ul className="space-y-8">
          {steps.map((step, index) => {
          const Icon = step.icon;
          return <li key={step.title} className="relative">
                <div className="flex items-start">
                  <div className={`
                      flex h-10 w-10 items-center justify-center rounded-full
                      ${step.status === 'complete' ? 'bg-primary-600' : step.status === 'current' ? 'bg-primary-100 border-2 border-primary-600' : 'bg-gray-100'}
                    `}>
                    <Icon className={`w-5 h-5 ${step.status === 'complete' ? 'text-white' : step.status === 'current' ? 'text-primary-600' : 'text-gray-400'}`} />
                  </div>
                  <div className="ml-4">
                    <h4 className={`text-base font-medium ${step.status === 'pending' ? 'text-gray-500' : 'text-gray-900'}`}>
                      {step.title}
                    </h4>
                    {step.status === 'current' && estimatedDelivery && <p className="mt-1 text-sm text-primary-600">
                        Estimated: {formatDate(estimatedDelivery)}
                      </p>}
                  </div>
                </div>
              </li>;
        })}
        </ul>
      </div>
    </div>;
};