import { UtensilsIcon, GlobeIcon, BoxIcon, UserIcon, SparklesIcon, HeadphonesIcon, CrownIcon, PhoneIcon } from 'lucide-react';

export type PlanFeature = {
  text: string;
  icon: typeof UtensilsIcon;
  included: boolean;
};

export type Plan = {
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
};

export const plans: Plan[] = [{
  name: 'Basic',
  tagline: 'Perfect for trying out our service',
  mealsPerWeek: 3,
  pricePerMeal: 12.0,
  basePrice: '12.00',
  weeklyTotal: 36.0,
  monthlyTotal: 144.0,
  popular: false,
  features: [
    { text: '3 meals per week', included: true },
    { text: 'Basic recipe selection', included: true },
    { text: 'Standard delivery', included: true },
    { text: 'Basic meal customization', included: true },
    { text: 'Premium recipes', included: false },
    { text: 'Priority support', included: false },
    { text: 'Advanced meal customization', included: false },
    { text: 'Premium delivery slots', included: false },
    { text: 'Exclusive recipes', included: false },
    { text: '24/7 concierge support', included: false }
  ],
  tierColor: 'secondary',
  description: 'Start your culinary journey with our essential plan'
}, {
  name: 'Premium',
  tagline: 'Our most popular plan',
  mealsPerWeek: 4,
  pricePerMeal: 15.0,
  basePrice: '15.00',
  weeklyTotal: 60.0,
  monthlyTotal: 240.0,
  popular: true,
  features: [
    { text: '4 meals per week', included: true },
    { text: 'Full recipe selection', included: true },
    { text: 'Priority delivery', included: true },
    { text: 'Advanced meal customization', included: true },
    { text: 'Premium recipes', included: true },
    { text: 'Priority support', included: true },
    { text: '24/7 concierge support', included: false },
    { text: 'Exclusive recipes', included: false }
  ],
  tierColor: 'primary',
  description: 'Upgrade your dining experience with premium selections'
}, {
  name: 'Signature',
  tagline: 'The ultimate culinary experience',
  mealsPerWeek: 5,
  pricePerMeal: 18.0,
  basePrice: '18.00',
  weeklyTotal: 90.0,
  monthlyTotal: 360.0,
  popular: false,
  features: [
    { text: '5 meals per week', included: true },
    { text: 'Full recipe selection', included: true },
    { text: 'Premium delivery', included: true },
    { text: 'Complete meal customization', included: true },
    { text: 'Premium recipes', included: true },
    { text: 'Priority support', included: true },
    { text: 'Exclusive recipes', included: true },
    { text: '24/7 concierge support', included: true }
  ],
  tierColor: 'accent',
  description: 'Experience the finest dining with our signature offerings'
}];


