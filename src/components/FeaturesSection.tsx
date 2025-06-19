import React from 'react';
import { ClockIcon, HeartIcon, UtensilsIcon, ArrowRightIcon } from 'lucide-react';
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
  const steps = [{
    number: '01',
    title: 'Choose Your Plan',
    description: 'Select between single meals or weekly subscription'
  }, {
    number: '02',
    title: 'Customize Your Meals',
    description: 'Pick your favorite dishes from our rotating menu'
  }, {
    number: '03',
    title: 'Enjoy Fresh Delivery',
    description: 'Get your meals delivered right to your doorstep'
  }];
  return <section className="w-full bg-white py-24" id="features">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Features Column */}
          <div>
            <h2 className="text-3xl font-bold mb-12">Why Choose Bumba</h2>
            <div className="space-y-12">
              {features.map((feature, index) => <div key={index} className="flex items-start space-x-6">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} text-white`}>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>)}
            </div>
          </div>
          {/* How It Works Column */}
          <div>
            <h2 className="text-3xl font-bold mb-12">How It Works</h2>
            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute left-[29px] top-[45px] bottom-[45px] w-0.5 bg-gray-100"></div>
              <div className="space-y-12">
                {steps.map((step, index) => <div key={index} className="flex items-start space-x-6">
                    <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-lg border-4 border-white relative z-10">
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-gray-900">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>)}
              </div>
            </div>
            <div className="mt-12">
              <a href="/menu" className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors text-decoration-line underline underline-offset-4 hover:underline-offset-2">
                Browse our menu
                <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default FeaturesSection;