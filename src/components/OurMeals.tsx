import React, { useEffect, useState } from 'react';
import { HeartIcon, ClockIcon, SearchIcon, UtensilsIcon, LeafIcon, FlameIcon, SparklesIcon, UserIcon, CheckIcon, FilterIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import GradientText from './GradientText';
import FilterModal from './FilterModal';
type Meal = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  prepTime: string;
  calories: string;
  tags: string[];
  category: string[];
  overlayBadge?: 'Popular' | 'New' | 'Bestseller' | 'Limited Time';
  isNew?: boolean;
};
const meals: Meal[] = [{
  id: 1,
  name: 'Herb-Roasted Chicken',
  description: 'Tender chicken roasted with fresh herbs and seasonal vegetables',
  image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6',
  price: '$12.99',
  prepTime: '25 min',
  calories: '480 cal',
  tags: ['High Protein', 'Gluten Free'],
  category: ['popular', 'high-protein'],
  overlayBadge: 'Popular'
}, {
  id: 2,
  name: 'Mediterranean Bowl',
  description: 'Quinoa base with roasted vegetables, feta, and tahini dressing',
  image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
  price: '$10.99',
  prepTime: '15 min',
  calories: '380 cal',
  tags: ['Vegetarian', 'Mediterranean'],
  category: ['vegetarian'],
  overlayBadge: 'New',
  isNew: true
}, {
  id: 3,
  name: 'Teriyaki Salmon',
  description: 'Wild-caught salmon with teriyaki glaze and stir-fried vegetables',
  image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
  price: '$14.99',
  prepTime: '20 min',
  calories: '450 cal',
  tags: ['Omega-3', 'High Protein'],
  category: ['popular', 'high-protein'],
  overlayBadge: 'Bestseller'
}, {
  id: 4,
  name: 'Spicy Tofu Stir-fry',
  description: 'Crispy tofu cubes with fresh vegetables in a spicy ginger-garlic sauce',
  image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26',
  price: '$11.99',
  prepTime: '20 min',
  calories: '320 cal',
  tags: ['Vegan', 'Spicy', 'High Protein'],
  category: ['vegetarian', 'high-protein']
}, {
  id: 5,
  name: 'Quinoa Power Bowl',
  description: 'Fresh quinoa bowl with roasted chickpeas and avocado',
  image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061',
  price: '$11.99',
  prepTime: '15 min',
  calories: '420 cal',
  tags: ['Vegetarian', 'High Protein'],
  category: ['vegetarian', 'new'],
  overlayBadge: 'New',
  isNew: true
}, {
  id: 6,
  name: 'Grilled Steak Bowl',
  description: 'Premium grilled steak with roasted vegetables',
  image: 'https://images.unsplash.com/photo-1544025162-d76694265947',
  price: '$16.99',
  prepTime: '25 min',
  calories: '520 cal',
  tags: ['High Protein'],
  category: ['bestseller'],
  overlayBadge: 'Bestseller'
}, {
  id: 7,
  name: 'Buddha Bowl',
  description: 'Nutritious mix of grains, vegetables, and tahini dressing',
  image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
  price: '$12.99',
  prepTime: '20 min',
  calories: '380 cal',
  tags: ['Vegetarian', 'Vegan'],
  category: ['vegetarian', 'new'],
  overlayBadge: 'New',
  isNew: true
}, {
  id: 8,
  name: 'Pesto Pasta',
  description: 'Fresh basil pesto with whole grain pasta and cherry tomatoes',
  image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601',
  price: '$13.99',
  prepTime: '20 min',
  calories: '450 cal',
  tags: ['Vegetarian'],
  category: ['popular'],
  overlayBadge: 'Popular'
}, {
  id: 9,
  name: 'Spicy Sriracha Salmon',
  description: 'Wild-caught salmon with a spicy sriracha glaze and Asian slaw',
  image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
  price: '$16.99',
  prepTime: '20 min',
  calories: '450 cal',
  tags: ['High Protein', 'Spicy'],
  category: ['new'],
  isNew: true,
  overlayBadge: 'New'
}, {
  id: 10,
  name: 'Truffle Mushroom Risotto',
  description: 'Creamy Arborio rice with wild mushrooms and truffle oil',
  image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371',
  price: '$14.99',
  prepTime: '30 min',
  calories: '520 cal',
  tags: ['Vegetarian', 'Gluten Free'],
  category: ['bestseller'],
  overlayBadge: 'Bestseller'
}, {
  id: 11,
  name: 'Summer Berry Salad',
  description: 'Mixed greens with seasonal berries and honey-lime dressing',
  image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af',
  price: '$11.99',
  prepTime: '10 min',
  calories: '280 cal',
  tags: ['Vegetarian', 'Low Calorie'],
  category: ['new'],
  isNew: true
}];
const SkeletonLoader = () => <>
    {[1, 2, 3, 4].map(i => <div key={i} className="bg-white rounded-xl shadow-md animate-pulse h-[500px]">
        <div className="bg-gray-200 aspect-[4/3] rounded-t-xl" />
        <div className="p-6 space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 rounded w-20" />
            <div className="h-6 bg-gray-200 rounded w-20" />
          </div>
        </div>
      </div>)}
  </>;
const OurMeals = () => {
  const {
    addToCart
  } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuickFilter, setActiveQuickFilter] = useState('all');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [likedMeals, setLikedMeals] = useState<number[]>([]);
  const [recentlyAdded, setRecentlyAdded] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(8);
  const quickFilters = [{
    id: 'all',
    label: 'All Meals',
    icon: UtensilsIcon
  }, {
    id: 'new',
    label: 'New',
    icon: SparklesIcon
  }, {
    id: 'popular',
    label: 'Most Popular',
    icon: SparklesIcon
  }, {
    id: 'bestseller',
    label: 'Bestsellers',
    icon: UserIcon
  }];
  const handleAddToCart = (meal: Meal) => {
    addToCart(meal);
    setRecentlyAdded(prev => [...prev, meal.id]);
    setTimeout(() => {
      setRecentlyAdded(prev => prev.filter(id => id !== meal.id));
    }, 1500);
  };
  const toggleLike = (id: number) => {
    setLikedMeals(current => current.includes(id) ? current.filter(mealId => mealId !== id) : [...current, id]);
  };
  const getBadgeStyle = (badge: string) => {
    switch (badge) {
      case 'Popular':
        return 'bg-secondary-500';
      case 'New':
        return 'bg-blue-500';
      case 'Bestseller':
        return 'bg-yellow-500';
      case 'Limited Time':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };
  useEffect(() => {
    setIsLoading(true);
    setItemsToShow(8); // Reset items to show when filter changes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [activeQuickFilter, selectedFilters]);
  const filteredMeals = meals.filter(meal => {
    // First apply the quick filter
    const matchesQuickFilter = activeQuickFilter === 'all' || activeQuickFilter === 'new' && meal.isNew ||
    // Updated to use isNew property
    meal.category.includes(activeQuickFilter);
    // Then apply the detailed filters
    const matchesDetailedFilters = selectedFilters.length === 0 || selectedFilters.every(filter => meal.tags.includes(filter));
    // Finally apply the search query
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesQuickFilter && matchesDetailedFilters && matchesSearch;
  });
  const visibleMeals = filteredMeals.slice(0, itemsToShow);
  const hasMore = itemsToShow < filteredMeals.length;
  return <section className="w-full py-20 bg-gradient-to-b from-primary-50/70 to-transparent">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Our{' '}
            <GradientText variant="primary">Delicious</GradientText> Selection
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Choose from our wide selection of chef-crafted meals, prepared fresh
            daily
          </p>
        </div>
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative mb-8">
            <input type="text" placeholder="Search meals by name or ingredients..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full px-6 py-4 pl-12 rounded-full border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 text-lg" />
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {quickFilters.map(filter => {
            const Icon = filter.icon;
            return <button key={filter.id} onClick={() => setActiveQuickFilter(filter.id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all
                    ${activeQuickFilter === filter.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>
                  <Icon className="w-4 h-4" />
                  {filter.label}
                </button>;
          })}
            <button onClick={() => setIsFilterModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all bg-white text-gray-600 hover:bg-gray-50 border border-gray-200">
              <FilterIcon className="w-4 h-4" />
              Filter
              {selectedFilters.length > 0 && <span className="ml-1 px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full text-xs">
                  {selectedFilters.length}
                </span>}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? <SkeletonLoader /> : filteredMeals.length === 0 ? <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <div className="text-gray-400 mb-2">
                <UtensilsIcon className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No meals found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters or search criteria
              </p>
            </div> : visibleMeals.map(meal => <div key={meal.id} className="group flex flex-col h-full bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-500">
                <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl">
                  <img src={meal.image} alt={meal.name} className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110" />
                  {meal.overlayBadge && <div className={`absolute top-3 left-3 ${getBadgeStyle(meal.overlayBadge)} text-white text-xs font-semibold px-2 py-1 rounded-md uppercase z-10`}>
                      {meal.overlayBadge}
                    </div>}
                  <button onClick={() => toggleLike(meal.id)} className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-sm hover:shadow-md transition-all" aria-label={likedMeals.includes(meal.id) ? 'Remove from favorites' : 'Add to favorites'}>
                    <HeartIcon className={`w-5 h-5 ${likedMeals.includes(meal.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
                  </button>
                </div>
                <div className="flex flex-col flex-grow p-7">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900">
                    {meal.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-2">
                    {meal.description}
                  </p>
                  <div className="flex items-center gap-4 mb-5 text-sm text-gray-500">
                    <div className="flex items-center">
                      <ClockIcon className="w-4 h-4 mr-1 text-gray-400" />
                      {meal.prepTime}
                    </div>
                    <div className="flex items-center">
                      <FlameIcon className="w-4 h-4 mr-1 text-gray-400" />
                      {meal.calories}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {meal.tags.map(tag => <span key={tag} className="px-3 py-1.5 bg-gray-50 text-gray-700 rounded-full text-xs font-medium border border-gray-100 shadow-sm transition-colors duration-200 hover:bg-gray-100">
                        {tag}
                      </span>)}
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-2xl font-black text-gray-900">
                      {meal.price}
                    </span>
                    <button onClick={() => handleAddToCart(meal)} className={`flex items-center px-4 py-2 text-sm rounded-lg font-medium transition-all duration-300 
                        ${recentlyAdded.includes(meal.id) ? 'bg-green-500 text-white' : 'bg-primary-600 text-white hover:bg-primary-700'}`}>
                      {recentlyAdded.includes(meal.id) ? <>
                          <CheckIcon className="w-4 h-4 mr-2" />
                          Added
                        </> : <>
                          <span className="mr-2">Add to Cart</span>
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 12H18M18 12L13 7M18 12L13 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </>}
                    </button>
                  </div>
                </div>
              </div>)}
        </div>
        {hasMore && <div className="mt-12 text-center">
            <button onClick={() => setItemsToShow(prev => prev + 8)} className="px-8 py-4 bg-primary-600 text-white rounded-full font-medium transition-all duration-300 hover:bg-primary-700 shadow-lg shadow-primary-600/20">
              View More Meals
            </button>
          </div>}
        <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} selectedFilters={selectedFilters} onFilterChange={setSelectedFilters} onReset={() => setSelectedFilters([])} />
      </div>
    </section>;
};
export default OurMeals;