import React, { useMemo } from 'react';
import { CheckIcon, ChevronRightIcon, XIcon } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { motion } from 'framer-motion';
import { SubscriptionPlan, BillingFrequency } from '../types';
interface PlanCardProps {
  plan: SubscriptionPlan;
  onSelect: () => void;
  billingFrequency: BillingFrequency;
}
export const PlanCard = ({
  plan,
  onSelect,
  billingFrequency
}: PlanCardProps) => {
  // Memoized calculations
  const {
    finalTotal,
    monthlyDiscount
  } = useMemo(() => {
    const weeklyTotal = plan.mealsPerWeek * plan.pricePerMeal;
    const monthlyTotal = billingFrequency === 'monthly' ? weeklyTotal * 4 * 0.9 : weeklyTotal * 4;
    return {
      finalTotal: billingFrequency === 'monthly' ? monthlyTotal / 4 : weeklyTotal,
      monthlyDiscount: billingFrequency === 'monthly' ? '10%' : null
    };
  }, [plan.mealsPerWeek, plan.pricePerMeal, billingFrequency]);
  // Memoized class names
  const cardClasses = useMemo(() => `h-full flex flex-col rounded-2xl border-2 transition-all duration-300 hover:border-${plan.tierColor}-500
      ${plan.popular ? `border-${plan.tierColor}-500 shadow-xl shadow-${plan.tierColor}-100/50` : 'border-gray-200'}`, [plan.popular, plan.tierColor]);
  const headerClasses = useMemo(() => `flex-none p-8 bg-${plan.tierColor}-50 rounded-t-2xl`, [plan.tierColor]);
  return <motion.div className={`relative h-full ${plan.popular ? 'md:-mt-8' : ''}`} initial={false} whileHover={{
    y: -4,
    transition: {
      duration: 0.2
    }
  }}>
      {plan.popular && <div className="absolute -top-5 left-0 right-0 flex justify-center">
          <span className="bg-accent-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>}
      <div className={cardClasses}>
        {/* Header Section */}
        <div className={headerClasses}>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
          <p className="text-gray-600 mb-4">{plan.description}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900">
              ${finalTotal.toFixed(2)}
            </span>
            <span className="text-gray-600">/{billingFrequency}</span>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            ${plan.pricePerMeal.toFixed(2)} per meal
          </p>
          {monthlyDiscount && <p className="text-sm text-success-600 mt-2">
              Save {monthlyDiscount} with monthly billing
            </p>}
        </div>
        {/* Content Section */}
        <div className="flex-1 flex flex-col p-8">
          <div className="flex-1">
            <ul className="space-y-4">
              {plan.features.map((feature, index) => <li key={index} className="flex items-start gap-3">
                  {feature.included ? <>
                      <CheckIcon className={`w-5 h-5 text-${plan.tierColor}-500 flex-shrink-0`} />
                      <span className="text-gray-700">{feature.text}</span>
                    </> : <>
                      <XIcon className="w-5 h-5 text-gray-300 flex-shrink-0" />
                      <span className="text-gray-400 line-through">
                        {feature.text}
                      </span>
                    </>}
                </li>)}
            </ul>
          </div>
          {/* Button Section */}
          <div className="flex-none mt-8">
            <Button onClick={onSelect} variant={plan.popular ? 'primary' : 'outline'} size="lg" className="w-full group">
              Choose Plan
              <ChevronRightIcon className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>;
};