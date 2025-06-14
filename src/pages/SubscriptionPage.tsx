import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlanCard } from '../components/subscription/PlanCard';
import WhySubscribe from '../components/subscription/WhySubscribe';
import FAQ from '../components/subscription/FAQ';
import GradientText from '../components/GradientText';
import { plans } from '../data/subscriptionPlans';
const SubscriptionPage = () => {
  const navigate = useNavigate();
  const handleSelectPlan = (planName: string) => {
    navigate(`/configure-subscription?plan=${encodeURIComponent(planName)}`);
  };
  return <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-32 bg-gradient-to-b from-primary-50/50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your{' '}
              <GradientText variant="primary">Perfect Plan</GradientText>
            </h1>
            <p className="text-xl text-gray-600">
              Flexible meal plans designed to fit your lifestyle. Save more with
              our subscription options.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map(plan => <PlanCard key={plan.name} {...plan} onSelect={() => handleSelectPlan(plan.name)} />)}
          </div>
        </div>
      </section>
      {/* Why Subscribe Section */}
      <WhySubscribe />
      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            <GradientText variant="primary">
              Frequently Asked Questions
            </GradientText>
          </h2>
          <div className="max-w-3xl mx-auto">
            <FAQ />
          </div>
        </div>
      </section>
    </div>;
};
export default SubscriptionPage;