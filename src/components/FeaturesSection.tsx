import React from 'react';
import { ClockIcon, HeartIcon, UtensilsIcon } from 'lucide-react';
const FeaturesSection = () => {
  const features = [{
    icon: <ClockIcon className="h-8 w-8" />,
    title: 'Simple Steps to Enjoy',
    description: 'Quick and easy meal preparation with pre-portioned ingredients.',
    gradient: 'from-secondary-500 to-secondary-600'
  }, {
    icon: <HeartIcon className="h-8 w-8" />,
    title: 'Premium Quality',
    description: 'Fresh ingredients sourced from trusted local suppliers.',
    gradient: 'from-primary-500 to-primary-600'
  }, {
    icon: <UtensilsIcon className="h-8 w-8" />,
    title: 'Chef-Crafted',
    description: 'Delicious recipes developed by expert chefs.',
    gradient: 'from-accent-500 to-accent-600'
  }];
  return <section className="w-full bg-white py-24" id="features">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => <div key={index} className="group flex flex-col items-center text-center feature-card">
              <div className={`feature-icon ${feature.gradient}`}>
                {feature.icon}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>)}
        </div>
        <div className="mt-24 bg-primary-50 rounded-3xl p-8 md:p-12 lg:p-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Ready to transform your mealtime?
              </h2>
              <p className="text-gray-600 mb-0 md:pr-12">
                Join thousands who have revolutionized their dining experience
                with Bumba's convenient meal delivery service.
              </p>
            </div>
            <div className="md:w-1/3 flex justify-center md:justify-end">
              <button className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-medium transition-all duration-300 shadow-lg shadow-primary-600/20 transform hover:translate-y-[-2px] button-hover-effect">
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default FeaturesSection;