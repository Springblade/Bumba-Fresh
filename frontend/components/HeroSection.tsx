import React, { useCallback, useEffect, useState, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import GradientText from './GradientText';
import { ArrowRightIcon, InfoIcon, KeyboardIcon } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
const content = {
  meal: {
    subtitle: 'Experience chef-crafted meals delivered to your door. Perfect for those special occasions or when you want a delicious, hassle-free meal.',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=80'
  },
  subscribe: {
    subtitle: 'Join our meal subscription service and enjoy regular deliveries of fresh, healthy meals tailored to your preferences.',
    image: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=1200&q=80'
  }
};
const HeroSection = memo(() => {
  const [activeTab, setActiveTab] = useState<'meal' | 'subscribe'>('meal');
  const navigate = useNavigate();
  const [showKeyboardTip, setShowKeyboardTip] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const pricingRef = useRef<HTMLElement | null>(null);
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key === 's' && !e.metaKey && !e.ctrlKey) {
      setActiveTab(prev => prev === 'meal' ? 'subscribe' : 'meal');
      setShowKeyboardTip(true);
      setTimeout(() => setShowKeyboardTip(false), 3000);
    }
  }, []);
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);
  const handleGetStarted = useCallback(() => {
    navigate(activeTab === 'meal' ? '/menu' : '/subscribe');
  }, [activeTab, navigate]);
  return <section className="w-full bg-gradient-to-b from-primary-50/30 to-white pt-32 pb-20 lg:py-40">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Column - Content */}
          <div className="flex-1 text-center lg:text-left max-w-3xl lg:max-w-none mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight tracking-tight">
              <GradientText variant="primary-to-secondary">
                Fresh Meals,
              </GradientText>{' '}
              <span className="text-gray-800">Your Way</span>
            </h1>
            {/* Toggle Pills with enhanced contrast */}
            <div className="inline-flex rounded-full bg-gray-100 p-1 mb-6 relative">
              {(['meal', 'subscribe'] as const).map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300
                    ${activeTab === tab ? 'bg-primary-600 text-white shadow-lg scale-105' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`} aria-pressed={activeTab === tab} role="tab">
                  {tab === 'meal' ? 'Single Meal' : 'Subscribe'}
                </button>)}
              {showKeyboardTip && <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded shadow-lg">
                  Press 'S' to toggle
                </div>}
            </div>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {content[activeTab].subtitle}
            </p>
            <div className="relative inline-block">
              <button onClick={handleGetStarted} className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full inline-flex items-center justify-center font-medium transition-all duration-300 shadow-lg shadow-primary-600/20 group hover:scale-102 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                Get Started
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Tooltip.Provider>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button className="ml-2 p-2 text-gray-400 hover:text-gray-600 transition-colors hover:scale-105" aria-label="More information">
                      <InfoIcon className="w-5 h-5" />
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm max-w-xs" sideOffset={5}>
                      Choose between one-off meals or weekly subscriptions
                      <Tooltip.Arrow className="fill-gray-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
          </div>
          {/* Right Column - Image */}
          <div className="hidden lg:block flex-1 relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
              {!imageLoaded && <div className="absolute inset-0 bg-gray-100 animate-pulse" />}
              <img srcSet={`${content[activeTab].image}&w=800&q=75 1x, ${content[activeTab].image}&w=1600&q=75 2x`} src={`${content[activeTab].image}&w=800&q=75`} alt="Fresh meal preparation" width={800} height={600} loading="eager" onLoad={() => setImageLoaded(true)} className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>;
});
HeroSection.displayName = 'HeroSection';
export default HeroSection;