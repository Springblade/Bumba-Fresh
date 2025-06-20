import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import MealCategories from '../components/MealCategories';
import Testimonials from '../components/Testimonials';
import HealthyInsights from '../components/HealthyInsights';
const HomePage = () => {
  return <div className="flex flex-col w-full">
      <HeroSection />
      <FeaturesSection />
      <MealCategories />
      <Testimonials />
      <HealthyInsights />
    </div>;
};
export default HomePage;