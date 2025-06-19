import React, { memo } from 'react';
import GradientText from '../../../components/GradientText';
interface PricingHeaderProps {
  title?: string;
  description?: string;
}
export const PricingHeader = memo(() => {
  return <div className="text-center mb-12">
      <h2 className="text-3xl sm:text-4xl font-bold mb-4">
        Choose Your <GradientText variant="primary">Meal Plan</GradientText>
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Select a plan that fits your lifestyle. All plans include free delivery,
        access to our recipe library, and the flexibility to pause or cancel
        anytime.
      </p>
    </div>;
});
PricingHeader.displayName = 'PricingHeader';