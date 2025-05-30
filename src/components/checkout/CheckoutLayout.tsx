import React from 'react';
import { ProgressStepper, CheckoutStep } from './ProgressStepper';
interface CheckoutLayoutProps {
  children: React.ReactNode;
  currentStep: CheckoutStep;
  sidebar?: React.ReactNode;
}
export const CheckoutLayout = ({
  children,
  currentStep,
  sidebar
}: CheckoutLayoutProps) => {
  return <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <ProgressStepper currentStep={currentStep} />
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1">{children}</div>
          {/* Sidebar */}
          {sidebar && <div className="w-full lg:w-[380px] sticky top-8 h-fit">
              {sidebar}
            </div>}
        </div>
      </div>
    </div>;
};