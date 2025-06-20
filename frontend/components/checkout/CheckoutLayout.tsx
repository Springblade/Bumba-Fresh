import React from 'react';
import { StepIndicator } from './StepIndicator';
interface CheckoutLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  currentStep: 'cart' | 'shipping' | 'payment' | 'confirmation';
}
export const CheckoutLayout = ({
  children,
  sidebar,
  currentStep
}: CheckoutLayoutProps) => {
  return <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Step Indicator */}
        <div className="max-w-2xl mx-auto mb-12 pt-4">
          <StepIndicator currentStep={currentStep} />
        </div>
        {/* Main Content */}
        <div className="mt-16 lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start xl:gap-x-16">
          {/* Main Content Area */}
          <div className="lg:col-span-7">
            <div className="bg-white px-4 py-6 sm:px-6 lg:px-8 rounded-xl border border-gray-200 shadow-sm">
              {children}
            </div>
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="sticky top-8">{sidebar}</div>
          </div>
        </div>
      </div>
    </div>;
};