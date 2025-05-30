import React, { useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorks from './components/HowItWorks';
import MealCategories from './components/MealCategories';
import PricingSection from './components/PricingSection';
import Testimonials from './components/Testimonials';
import HealthyInsights from './components/HealthyInsights';
import Footer from './components/Footer';
export function App() {
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
  return <div className="relative flex flex-col w-full min-h-screen bg-white">
      {/* Simplified background decoration */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-primary-50/70 to-transparent" />
      <div className="fixed top-1/4 right-0 w-96 h-96 bg-primary-100 rounded-full filter blur-3xl opacity-20 animate-float"></div>
      <div className="relative z-10 flex flex-col w-full">
        <Header />
        <main className="flex-grow w-full">
          <div className="flex flex-col w-full">
            <HeroSection />
            <FeaturesSection />
            <MealCategories />
            <HowItWorks />
            <PricingSection />
            <Testimonials />
            <HealthyInsights />
          </div>
        </main>
        <Footer />
      </div>
    </div>;
}