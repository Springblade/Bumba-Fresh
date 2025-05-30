import React from 'react';
import { ChevronRightIcon } from 'lucide-react';
import GradientText from './GradientText';
const MealCategories = () => {
  const categories = [{
    title: 'High-Protein Meals',
    description: 'Perfect for fitness enthusiasts',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435',
    gradient: 'from-secondary-500 to-secondary-600',
    tag: 'Popular'
  }, {
    title: 'Family Meals',
    description: 'Delicious options for everyone',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554',
    gradient: 'from-primary-500 to-primary-600',
    tag: 'Best Value'
  }, {
    title: 'Vegetarian Meals',
    description: 'Plant-based and delicious',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    gradient: 'from-accent-500 to-accent-600',
    tag: 'Healthy'
  }];
  return <section className="w-full bg-white py-24" id="meals">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">
          <GradientText variant="primary">
            Explore Our Meal Categories
          </GradientText>
        </h2>
        <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto text-lg">
          Discover meals tailored to your preferences and dietary needs.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {categories.map((category, index) => <div key={index} className="group relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="aspect-[4/3] w-full">
                <img src={category.image} alt={category.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                {/* Updated gradient overlay for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-90" />
              </div>
              {/* Tag positioned above the gradient */}
              <div className="absolute top-4 right-4 z-20">
                <span className="px-3 py-1 bg-white text-primary-600 text-xs font-bold rounded-full shadow-lg">
                  {category.tag}
                </span>
              </div>
              {/* Content positioned above the gradient */}
              <div className="absolute bottom-0 left-0 right-0 p-8 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-semibold text-white drop-shadow-lg mb-3">
                  {category.title}
                </h3>
                <p className="text-white text-base drop-shadow-md mb-4 opacity-90">
                  {category.description}
                </p>
                <button className="flex items-center text-sm font-medium text-white group">
                  <span className="drop-shadow-md">Explore meals</span>
                  <ChevronRightIcon className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>)}
        </div>
        <div className="text-center">
          <button className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-medium transition-all duration-300 shadow-lg shadow-primary-600/20 button-hover-effect">
            View All Categories
            <ChevronRightIcon className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>;
};
export default MealCategories;