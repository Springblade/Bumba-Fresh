import React from 'react';
import { ArrowDownIcon } from 'lucide-react';
import GradientText from '../GradientText';
const SubscriptionHero = () => {
  const handleExploreClick = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <section className="w-full bg-gradient-to-b from-primary-50/30 to-white pt-32 pb-20 lg:py-40">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            <GradientText variant="primary-to-secondary">
              Healthy Eating,
            </GradientText>{' '}
            <br className="hidden sm:block" />
            <span className="text-gray-900">Effortlessly Delivered</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Fresh, chef-crafted meals delivered to your door. Save time and eat
            well with our flexible subscription plans designed for your
            lifestyle.
          </p>
          <button onClick={handleExploreClick} className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full text-lg font-medium transition-all duration-300 shadow-lg shadow-primary-600/20 group hover:scale-105">
            Explore Our Plans
            <ArrowDownIcon className="ml-2 h-5 w-5 animate-bounce" />
          </button>
        </div>
      </div>
    </section>;
};
export default SubscriptionHero;