import React from 'react';
import { ArrowUpIcon } from 'lucide-react';
import GradientText from '../GradientText';
const FinalCTA = () => {
  const handleGetStartedClick = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <section className="w-full bg-gradient-to-b from-white to-primary-50/30 py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <GradientText variant="primary">
              Ready to Start Your Journey?
            </GradientText>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of happy customers enjoying fresh, healthy meals
            every week.
          </p>
          <button onClick={handleGetStartedClick} className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full text-lg font-medium transition-all duration-300 shadow-lg shadow-primary-600/20 group hover:scale-105">
            Choose Your Plan
            <ArrowUpIcon className="ml-2 h-5 w-5 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>;
};
export default FinalCTA;