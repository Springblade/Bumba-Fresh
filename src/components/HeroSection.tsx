import React from 'react';
import GradientText from './GradientText';
import { ArrowRightIcon } from 'lucide-react';
const HeroSection = () => {
  const featuredMeals = [{
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    title: 'Quinoa Buddha Bowl'
  }, {
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    title: 'Grilled Salmon Salad'
  }, {
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    title: 'Vegetarian Delight'
  }];
  return <section className="w-full bg-gradient-to-b from-primary-50 via-white to-white pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <GradientText variant="primary-to-secondary">
                Nourish Your Body,
              </GradientText>{' '}
              <span className="text-gray-800">Energize Your Life</span>
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-xl leading-relaxed">
              Experience the perfect blend of health and convenience. Fresh
              ingredients and delicious recipes delivered to your door.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center font-medium transition-all duration-300 shadow-lg shadow-primary-600/20 button-hover-effect">
                Get Started <ArrowRightIcon className="ml-2 h-5 w-5" />
              </button>
              <button className="px-8 py-4 border-2 border-gray-200 hover:border-primary-200 bg-white hover:bg-primary-50 rounded-full transition-all duration-300 text-gray-700 font-medium">
                Browse Menu
              </button>
            </div>
            <div className="mt-12 flex items-center space-x-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                    <img src={`https://randomuser.me/api/portraits/men/${i + 20}.jpg`} alt="Customer" className="w-full h-full object-cover" />
                  </div>)}
              </div>
              <div className="text-sm">
                <span className="font-semibold text-gray-900">
                  1,000+ happy customers
                </span>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map(i => <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>)}
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <div className="grid grid-cols-2 gap-6 animate-float">
              {featuredMeals.slice(0, 1).map((meal, index) => <div key={index} className="col-span-2">
                  <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
                    <div className="relative w-full h-full group">
                      <img src={meal.image} alt={meal.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      {/* Updated gradient overlay for better text contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90" />
                      <div className="absolute bottom-6 left-6 z-10">
                        <h3 className="text-2xl font-semibold text-white drop-shadow-lg mb-2">
                          {meal.title}
                        </h3>
                        <div className="mt-2 flex items-center">
                          <span className="px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">
                            Featured
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>)}
              {featuredMeals.slice(1).map((meal, index) => <div key={index} className="col-span-1">
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-xl transform hover:scale-[1.02] transition-all duration-500">
                    <div className="relative w-full h-full group">
                      <img src={meal.image} alt={meal.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      {/* Updated gradient overlay for better text contrast */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-90" />
                      <div className="absolute bottom-4 left-4 z-10">
                        <h3 className="text-xl font-semibold text-white drop-shadow-lg">
                          {meal.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;