import React, { useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import HowItWorks from '../components/HowItWorks';
import MealCategories from '../components/MealCategories';
import PricingSection from '../components/PricingSection';
import Testimonials from '../components/Testimonials';
import HealthyInsights from '../components/HealthyInsights';
const HomePage = () => {
  useEffect(() => {
    // Implement scroll spy
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const observerOptions = {
      rootMargin: '-20% 0px -80% 0px'
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${entry.target.id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, observerOptions);
    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return <div className="flex flex-col w-full">
      <HeroSection />
      <FeaturesSection />
      <MealCategories />
      <HowItWorks />
      <PricingSection />
      <Testimonials />
      <HealthyInsights />
    </div>;
};
export default HomePage;