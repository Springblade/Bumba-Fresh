import React, { useMemo } from 'react';
import { Check, X, ChevronRight } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { motion } from 'framer-motion';
import { BillingFrequency } from '../../../types/shared';

// Define the SubscriptionPlan type locally or add it to shared.ts
interface SubscriptionPlan {
  name: string;
  tagline: string;
  mealsPerWeek: number;
  pricePerMeal: number;
  basePrice: string;
  weeklyTotal: number;
  monthlyTotal: number;
  popular: boolean;
  features: Array<{
    text: string;
    included: boolean;
  }>;
  tierColor: string;
  description: string;
}

interface PlanCardProps {
  plan: SubscriptionPlan;
  billingFrequency: BillingFrequency;
  onSelect: () => void;
}

export const PlanCard = ({
  plan,
  billingFrequency,
  onSelect,
}: PlanCardProps) => {
  // Calculate price based on billing frequency
  const price =
    billingFrequency === 'weekly'
      ? plan.weeklyTotal
      : plan.monthlyTotal;

  // Memoized class names
  const cardClasses = useMemo(
    () =>
      `h-full flex flex-col rounded-2xl border-2 transition-all duration-300 hover:border-${plan.tierColor}-500
      ${plan.popular ? `border-${plan.tierColor}-500 shadow-xl shadow-${plan.tierColor}-100/50` : 'border-gray-200'}`,
    [plan.popular, plan.tierColor]
  );
  const headerClasses = useMemo(
    () => `flex-none p-8 bg-${plan.tierColor}-50 rounded-t-2xl`,
    [plan.tierColor]
  );
  return (
    <motion.div
      className={`relative h-full ${plan.popular ? 'md:-mt-8' : ''}`}
      initial={false}
      whileHover={{
        y: -4,
        transition: {
          duration: 0.2,
        },
      }}
    >
      {plan.popular && (
        <div className="absolute -top-5 left-0 right-0 flex justify-center">
          <span className="bg-accent-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      <div className={cardClasses}>
        {/* Header Section */}
        <div className={headerClasses}>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {plan.name}
          </h3>
          <p className="text-gray-600 mb-4">{plan.description}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
            <span className="text-gray-600">/{billingFrequency}</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            ${plan.pricePerMeal.toFixed(2)} per meal
          </p>
          {billingFrequency === 'monthly' && (
            <p className="text-sm text-success-600 mt-2">
              Save 10% with monthly billing
            </p>
          )}
        </div>
        {/* Content Section */}
        <div className="flex-1 flex flex-col p-8">
          <div className="flex-1">
            <div className="mt-4 space-y-3">
              {plan.features.map((feature, index: number) => (
                <div key={index} className="flex items-start">
                  {feature.included ? (
                    <Check className="mr-2 h-5 w-5 text-primary-500" />
                  ) : (
                    <X className="mr-2 h-5 w-5 text-gray-300" />
                  )}
                  <span
                    className={
                      feature.included
                        ? 'text-gray-900'
                        : 'text-gray-400'
                    }
                  >
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Button Section */}
          <div className="flex-none mt-8">
            <Button
              onClick={onSelect}
              variant="primary"
              className="mt-5 w-full"
            >
              Select Plan
              <ChevronRight className="ml-1 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};