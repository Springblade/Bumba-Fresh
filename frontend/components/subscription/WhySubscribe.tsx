import React from 'react';
import { Sparkles as SparklesIcon, Truck as TruckIcon, Star as StarIcon, Clock as ClockIcon, Shuffle as ShuffleIcon, Calendar as CalendarIcon, Award as AwardIcon, CheckCircle2 as CheckCircle2Icon } from 'lucide-react';
import GradientText from '../GradientText';
const WhySubscribe = () => {
  const subscriptionBenefits = [{
    icon: SparklesIcon,
    title: 'Save up to 15%',
    description: 'Enjoy significant savings on every meal'
  }, {
    icon: TruckIcon,
    title: 'Free Weekly Delivery',
    description: 'Never pay for delivery with your subscription'
  }, {
    icon: StarIcon,
    title: 'Priority Access',
    description: 'Be first to try new seasonal meals'
  }, {
    icon: ClockIcon,
    title: 'Set & Forget Convenience',
    description: 'Automated weekly deliveries'
  }];
  const singleMealBenefits = [{
    icon: ShuffleIcon,
    title: 'Maximum Flexibility',
    description: 'Order what you want, when you want'
  }, {
    icon: CalendarIcon,
    title: 'No Commitment',
    description: 'Perfect for occasional orders'
  }, {
    icon: AwardIcon,
    title: 'Special Occasions',
    description: 'Ideal for one-off celebrations'
  }];
  return <section className="w-full bg-gradient-to-b from-white to-primary-50/30 py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <GradientText variant="primary">Why Subscribe?</GradientText>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Choose the plan that best fits your lifestyle
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Subscribe Column */}
          <div className="flex">
            <div className="flex flex-col w-full h-full p-8 bg-white rounded-2xl border-2 border-primary-100 shadow-xl relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Recommended
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Subscribe & Save
              </h3>
              <div className="flex-grow space-y-6">
                {subscriptionBenefits.map((benefit, index) => <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                      <benefit.icon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>)}
              </div>
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-primary-600">
                  <CheckCircle2Icon className="w-5 h-5" />
                  <span className="font-medium">
                    Best value for regular customers
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Single Meals Column */}
          <div className="flex">
            <div className="flex flex-col w-full h-full p-8 bg-white rounded-2xl border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Single Meals
              </h3>
              <div className="flex-grow space-y-6">
                {singleMealBenefits.map((benefit, index) => <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center">
                      <benefit.icon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>)}
              </div>
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle2Icon className="w-5 h-5" />
                  <span className="font-medium">
                    Great for occasional orders
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default WhySubscribe;