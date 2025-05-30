import React from 'react';
import { CheckIcon } from 'lucide-react';
import GradientText from './GradientText';
const PricingSection = () => {
  const plans = [{
    name: 'Starter',
    price: '$7.99',
    description: 'Perfect for individuals',
    perks: 'Everything you need to get started',
    features: ['3 meals per week', '2 servings per meal', 'Free shipping', 'Weekly delivery', 'Cancel anytime'],
    popular: false,
    accent: 'from-secondary-500 to-secondary-600'
  }, {
    name: 'Family Plan',
    price: '$6.99',
    description: 'Best for families',
    perks: 'Everything in Starter, plus',
    features: ['4 meals per week', '4 servings per meal', 'Free shipping', 'Weekly delivery', 'Flexible menu selection', 'Cancel anytime'],
    popular: true,
    accent: 'from-primary-500 to-primary-600'
  }, {
    name: 'Veggie Plan',
    price: '$7.49',
    description: 'Plant-based options',
    perks: 'Perfect for vegetarians',
    features: ['3 vegetarian meals per week', '2 servings per meal', 'Free shipping', 'Weekly delivery', 'Sustainable packaging', 'Cancel anytime'],
    popular: false,
    accent: 'from-accent-500 to-accent-600'
  }];
  return <section className="w-full py-24 bg-gradient-to-b from-white to-gray-50" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            <GradientText variant="primary">Choose Your Plan</GradientText>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Select the perfect meal plan for your lifestyle. All plans include
            free delivery and our satisfaction guarantee.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => <div key={index} className={`relative ${plan.popular ? 'md:-mt-6 md:mb-6' : ''} transition-all duration-500 hover:scale-[1.03]`}>
              {plan.popular && <div className="absolute -top-5 inset-x-0 mx-auto w-40 text-center">
                  <span className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm font-medium px-6 py-1.5 rounded-full shadow-lg">
                    Most Popular
                  </span>
                </div>}
              <div className={`h-full bg-white rounded-3xl shadow-2xl overflow-hidden ${plan.popular ? 'border-2 border-primary-500 ring-4 ring-primary-100' : 'border border-gray-100'}`}>
                <div className={`p-8 bg-gradient-to-br ${plan.accent} relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full transform -translate-x-12 translate-y-12"></div>
                  <h3 className="text-2xl font-bold text-white mb-1 relative z-10">
                    {plan.name}
                  </h3>
                  <p className="text-white/90 text-sm relative z-10">
                    {plan.description}
                  </p>
                </div>
                <div className="p-8">
                  <div className="mb-8">
                    <div className="flex items-baseline">
                      <span className="text-5xl font-bold text-gray-800">
                        {plan.price}
                      </span>
                      <span className="text-gray-500 ml-2">/ serving</span>
                    </div>
                    <p className="text-gray-600 text-sm mt-2">{plan.perks}</p>
                  </div>
                  <ul className="space-y-4 mb-10">
                    {plan.features.map((feature, i) => <li key={i} className="flex items-start">
                        <CheckIcon className="h-5 w-5 text-primary-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{feature}</span>
                      </li>)}
                  </ul>
                  <button className={`w-full py-4 rounded-xl font-medium transition-all duration-300 ${plan.popular ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-600/20 button-hover-effect' : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'}`}>
                    {plan.popular ? 'Get Started Now' : 'Choose Plan'}
                  </button>
                </div>
              </div>
            </div>)}
        </div>
        <p className="text-center text-gray-500 text-sm mt-12">
          All plans include access to our recipe library and mobile app.
          <br />
          Need help choosing?{' '}
          <a href="#" className="text-primary-600 hover:text-primary-700 font-medium underline decoration-primary-200 underline-offset-2 hover:decoration-primary-500 transition-colors">
            Contact our team
          </a>
        </p>
      </div>
    </section>;
};
export default PricingSection;