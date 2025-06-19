export const plans = [{
  name: 'Basic Plan',
  mealsPerWeek: 3,
  pricePerMeal: 12.0,
  description: 'Perfect for trying out our service',
  tierColor: 'secondary',
  features: ['3 meals per week', 'Basic recipe selection', 'Standard delivery', 'Basic meal customization'],
  missingFeatures: ['Premium recipes', 'Priority support', 'Advanced customization', 'Premium delivery slots']
}, {
  name: 'Premium Plan',
  mealsPerWeek: 4,
  pricePerMeal: 15.0,
  description: 'Our most popular plan',
  isPopular: true,
  tierColor: 'primary',
  features: ['4 meals per week', 'Full recipe selection', 'Priority delivery', 'Advanced meal customization', 'Premium recipes', 'Priority support'],
  missingFeatures: ['24/7 concierge support', 'Exclusive recipes']
}, {
  name: 'Signature Plan',
  mealsPerWeek: 5,
  pricePerMeal: 18.0,
  description: 'The ultimate culinary experience',
  tierColor: 'accent',
  features: ['5 meals per week', 'Full recipe selection', 'Premium delivery', 'Complete meal customization', 'Exclusive recipes', '24/7 concierge support'],
  missingFeatures: []
}];