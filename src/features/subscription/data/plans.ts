import { UtensilsIcon, GlobeIcon, BoxIcon, UserIcon, SparklesIcon, HeadphonesIcon, CrownIcon, PhoneIcon } from 'lucide-react';
export type PlanFeature = {
  text: string;
  icon: typeof UtensilsIcon;
};
export type Plan = {
  name: string;
  tagline: string;
  mealsPerWeek: number;
  pricePerMeal: number;
  basePrice: string;
  weeklyTotal: number;
  popular: boolean;
  coreFeatures: PlanFeature[];
  missingFeatures: string[];
  tierColor: string;
  description: string;
};
export const plans: Plan[] = [{
  name: 'Basic',
  tagline: 'Perfect for trying out our service',
  mealsPerWeek: 3,
  pricePerMeal: 12.0,
  basePrice: '12.00',
  weeklyTotal: 38.97,
  popular: false,
  coreFeatures: [{
    text: '3 meals per week',
    icon: UtensilsIcon
  }, {
    text: 'Basic recipe selection',
    icon: GlobeIcon
  }, {
    text: 'Standard delivery',
    icon: BoxIcon
  }, {
    text: 'Basic meal customization',
    icon: UserIcon
  }],
  missingFeatures: ['Premium recipes', 'Priority support', 'Advanced meal customization', 'Premium delivery slots', 'Exclusive recipes', '24/7 concierge support'],
  tierColor: 'secondary',
  description: 'Start your culinary journey with our essential plan'
}, {
  name: 'Premium',
  tagline: 'Our most popular plan',
  mealsPerWeek: 4,
  pricePerMeal: 15.0,
  basePrice: '15.00',
  weeklyTotal: 59.96,
  popular: true,
  coreFeatures: [{
    text: '4 meals per week',
    icon: UtensilsIcon
  }, {
    text: 'Full recipe selection',
    icon: GlobeIcon
  }, {
    text: 'Priority delivery',
    icon: BoxIcon
  }, {
    text: 'Advanced meal customization',
    icon: UserIcon
  }, {
    text: 'Premium recipes',
    icon: SparklesIcon
  }, {
    text: 'Priority support',
    icon: HeadphonesIcon
  }],
  missingFeatures: ['24/7 concierge support', 'Exclusive recipes'],
  tierColor: 'primary',
  description: 'Upgrade your dining experience with premium selections'
}, {
  name: 'Signature',
  tagline: 'The ultimate culinary experience',
  mealsPerWeek: 5,
  pricePerMeal: 18.0,
  basePrice: '18.00',
  weeklyTotal: 84.95,
  popular: false,
  coreFeatures: [{
    text: '5 meals per week',
    icon: UtensilsIcon
  }, {
    text: 'Full recipe selection',
    icon: GlobeIcon
  }, {
    text: 'Premium delivery',
    icon: BoxIcon
  }, {
    text: 'Complete meal customization',
    icon: UserIcon
  }, {
    text: 'Premium recipes',
    icon: SparklesIcon
  }, {
    text: 'Priority support',
    icon: HeadphonesIcon
  }, {
    text: 'Exclusive recipes',
    icon: CrownIcon
  }, {
    text: '24/7 concierge support',
    icon: PhoneIcon
  }],
  missingFeatures: [],
  tierColor: 'accent',
  description: 'Experience the finest dining with our signature offerings'
}];