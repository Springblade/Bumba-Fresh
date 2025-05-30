import React from 'react';
import { CalendarIcon, ShoppingBagIcon, TruckIcon, UtensilsIcon } from 'lucide-react';
import GradientText from './GradientText';
const HowItWorks = () => {
  const steps = [{
    icon: <CalendarIcon className="h-8 w-8" />,
    title: 'Choose Your Plan',
    description: 'Select the plan that best fits your lifestyle and dietary preferences.',
    gradient: 'from-secondary-500 to-secondary-600'
  }, {
    icon: <ShoppingBagIcon className="h-8 w-8" />,
    title: 'Select Your Meals',
    description: 'Browse our weekly menu and pick your favorite recipes.',
    gradient: 'from-primary-500 to-primary-600'
  }, {
    icon: <TruckIcon className="h-8 w-8" />,
    title: 'Get Your Delivery',
    description: 'We deliver pre-portioned ingredients right to your doorstep.',
    gradient: 'from-accent-500 to-accent-600'
  }, {
    icon: <UtensilsIcon className="h-8 w-8" />,
    title: 'Cook & Enjoy',
    description: 'Follow our simple recipe cards and prepare delicious meals.',
    gradient: 'from-secondary-500 to-accent-500'
  }];
  return <section className="w-full py-24 bg-gradient-to-b from-white to-primary-50" id="how-it-works">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold mb-6">
            <GradientText variant="primary">How It Works</GradientText>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Getting fresh, healthy meals delivered to your door has never been
            easier. Just follow these simple steps.
          </p>
        </div>
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-100 transform -translate-y-1/2 z-0"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {steps.map((step, index) => <div key={index} className="group flex flex-col items-center text-center relative z-10 bg-white p-6 rounded-2xl shadow-soft">
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl font-bold text-gray-400 border border-gray-100">
                  {index + 1}
                </div>
                <div className={`mb-6 p-5 rounded-2xl bg-gradient-to-br ${step.gradient} text-white transform transition-all duration-500 group-hover:scale-110 shadow-lg`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>)}
          </div>
        </div>
        <div className="mt-20 text-center">
          <button className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-medium transition-all duration-300 shadow-lg shadow-primary-600/20 transform hover:-translate-y-1 button-hover-effect">
            Start Your Journey
          </button>
        </div>
      </div>
    </section>;
};
export default HowItWorks;