import React, { useMemo, memo } from 'react';
import { CheckIcon, ChevronRightIcon, XIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
interface PlanFeature {
  text: string;
  included: boolean;
}
interface PlanProps {
  name: string;
  mealsPerWeek: number;
  pricePerMeal: number;
  description: string;
  features: string[];
  missingFeatures: string[];
  isPopular?: boolean;
  tierColor?: string;
  onSelect: () => void;
  billingFrequency?: 'weekly' | 'monthly';
}
export const PlanCard = memo(({
  name,
  mealsPerWeek,
  pricePerMeal,
  description,
  features,
  missingFeatures,
  isPopular,
  tierColor = 'primary',
  onSelect,
  billingFrequency = 'weekly'
}: PlanProps) => {
  // Memoized calculations
  const {
    finalTotal,
    monthlyDiscount
  } = useMemo(() => {
    const weeklyTotal = mealsPerWeek * pricePerMeal;
    const monthlyTotal = weeklyTotal * 4;
    const discountedMonthlyTotal = billingFrequency === 'monthly' ? monthlyTotal * 0.9 : monthlyTotal;
    
    return {
      finalTotal: discountedMonthlyTotal,
      monthlyDiscount: billingFrequency === 'monthly' ? '10%' : null
    };
  }, [mealsPerWeek, pricePerMeal, billingFrequency]);
  // Memoized class names
  const cardClasses = useMemo(() => `h-full flex flex-col rounded-2xl border-2 transition-all duration-300 hover:border-${tierColor}-500
        ${isPopular ? `border-${tierColor}-500 shadow-xl shadow-${tierColor}-100/50` : 'border-gray-200'}`, [isPopular, tierColor]);
  const headerClasses = useMemo(() => `flex-none p-8 bg-${tierColor}-50 rounded-t-2xl`, [tierColor]);
  return <motion.div className={`relative h-full ${isPopular ? 'md:-mt-8' : ''}`} initial={false} whileHover={{
    y: -4,
    transition: {
      duration: 0.2
    }
  }}>
        {isPopular && <div className="absolute -top-5 left-0 right-0 flex justify-center">
            <span className="bg-accent-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </span>
          </div>}
        <div className={cardClasses}>
          {/* Header Section */}
          <div className={headerClasses}>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
            <p className="text-gray-600 mb-4">{description}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-gray-900">
                ${finalTotal.toFixed(2)}
              </span>
              <span className="text-gray-600">/month</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              ${pricePerMeal.toFixed(2)} per meal
            </p>
            {monthlyDiscount && <p className="text-sm text-success-600 mt-2">
                Save {monthlyDiscount} with monthly billing
              </p>}
          </div>
          {/* Content Section */}
          <div className="flex-1 flex flex-col p-8">
            {/* Features List */}
            <div className="flex-1">
              <ul className="space-y-4">
                {features.map((feature, index) => <li key={index} className="flex items-start gap-3">
                    <CheckIcon className={`w-5 h-5 text-${tierColor}-500 flex-shrink-0`} />
                    <span className="text-gray-700">{feature}</span>
                  </li>)}
                {missingFeatures.map((feature, index) => <li key={`missing-${index}`} className="flex items-start gap-3">
                    <XIcon className="w-5 h-5 text-gray-300 flex-shrink-0" />
                    <span className="text-gray-400 line-through">
                      {feature}
                    </span>
                  </li>)}
              </ul>
            </div>
            {/* Button Section */}
            <div className="flex-none mt-8">
              <Button onClick={onSelect} variant={isPopular ? 'primary' : 'outline'} size="lg" className="w-full group">
                Choose Plan
                <ChevronRightIcon className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>;
});
PlanCard.displayName = 'PlanCard';




