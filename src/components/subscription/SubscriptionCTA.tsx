import React from 'react';
import { ArrowRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import GradientText from '../GradientText';
const SubscriptionCTA = () => {
  return <section className="w-full bg-gradient-to-b from-white to-primary-50/30 py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <GradientText variant="primary">
              Ready for Effortless Healthy Eating?
            </GradientText>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of happy customers enjoying fresh, healthy meals
            delivered weekly. Save time, eat well, feel great.
          </p>
          <Link to="/subscribe" className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full text-lg font-medium transition-all duration-300 shadow-lg shadow-primary-600/20 group hover:scale-105">
            Start Your Journey
            <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>;
};
export default SubscriptionCTA;