import { useCallback, useEffect, useState, memo } from 'react';
import { Utensils as UtensilsIcon, Sparkles as SparklesIcon, User as UserIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import FilterModal from './FilterModal';
import MealCard from '../features/meals/components/MealCard';
import GradientText from './GradientText';
import { useMealFilter } from '../hooks/useMealFilter';
import { FilterSystem } from './meals/FilterSystem';
import { BaseMeal } from '../types/shared';
import { MealCardSkeleton } from './ui/MealCardSkeleton';

type Meal = BaseMeal & {
  prepTime: string;
  calories: string;
  category: string[]; // Make sure this is not optional
};

export const meals: Meal[] = [{
  id: 1,
  name: 'Herb-Roasted Chicken',
  description: 'Tender chicken roasted with fresh herbs and seasonal vegetables',
  image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6',
  price: '$14.99',
  prepTime: '25 min',
  calories: '480 cal',
  tags: ['High Protein', 'Gluten Free', 'Premium'],
  category: ['popular', 'high-protein'],
  overlayBadge: 'Popular'
}, {
  id: 2,
  name: 'Mediterranean Bowl',
  description: 'Quinoa base with roasted vegetables, feta, and tahini dressing',
  image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
  price: '$11.99',
  prepTime: '15 min',
  calories: '380 cal',
  tags: ['Vegetarian', 'Mediterranean', 'Basic'],
  category: ['vegetarian'],
  overlayBadge: 'New',
  isNew: true
}, {
  id: 3,
  name: 'Grilled Salmon',
  description: 'Wild-caught salmon with teriyaki glaze and stir-fried vegetables',
  image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
  price: '$17.99',
  prepTime: '20 min',
  calories: '450 cal',
  tags: ['Omega-3', 'High Protein', 'Signature'],
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
}, {
  id: 12,
  name: 'Asian Glazed Salmon',
  description: 'Wild-caught salmon with sweet soy glaze and Asian vegetables',
  image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
  price: '$15.99',
  prepTime: '20 min',
  calories: '460 cal',
  tags: ['High Protein', 'Omega-3', 'Gluten Free'],
  category: ['popular', 'high-protein'],
  overlayBadge: 'Popular'
}, {
  id: 13,
  name: 'Rainbow Grain Bowl',
  description: 'Colorful mix of quinoa, roasted vegetables, and tahini dressing',
  image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
  price: '$12.99',
  prepTime: '15 min',
  calories: '380 cal',
  tags: ['Vegan', 'High Fiber', 'Gluten Free'],
  category: ['vegetarian'],
  overlayBadge: 'New',
  isNew: true
}, {
  id: 14,
  name: 'Grilled Chicken Caesar',
  description: 'Classic Caesar salad with grilled chicken and homemade dressing',
  image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
  price: '$13.99',
  prepTime: '18 min',
  calories: '420 cal',
  tags: ['High Protein', 'Low Carb'],
  category: ['popular', 'high-protein']
}, {
  id: 15,
  name: 'Mexican Street Bowl',
  description: 'Chipotle-spiced rice, black beans, and grilled vegetables',
  image: 'https://images.unsplash.com/photo-1543353071-873f17a7a088',
  price: '$11.99',
  prepTime: '20 min',
  calories: '450 cal',
  tags: ['Vegetarian', 'Spicy', 'High Fiber'],
  category: ['vegetarian', 'bestseller'],
  overlayBadge: 'Bestseller'
}, {
  id: 16,
  name: 'Mediterranean Shrimp',
  description: 'Garlic shrimp with herb-roasted vegetables and couscous',
  image: 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62',
  price: '$16.99',
  prepTime: '22 min',
  calories: '410 cal',
  tags: ['High Protein', 'Mediterranean'],
  category: ['high-protein', 'new'],
  overlayBadge: 'New',
  isNew: true
}, {
  id: 17,
  name: 'Tempeh Power Bowl',
  description: 'Marinated tempeh with sweet potato and kale',
  image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38',
  price: '$13.99',
  prepTime: '20 min',
  calories: '440 cal',
  tags: ['Vegan', 'High Protein', 'Gluten Free'],
  category: ['vegetarian', 'high-protein']
}, {
  id: 18,
  name: 'Citrus Glazed Cod',
  description: 'Fresh cod with citrus glaze and roasted vegetables',
  image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
  price: '$15.99',
  prepTime: '25 min',
  calories: '380 cal',
  tags: ['Low Calorie', 'High Protein', 'Gluten Free'],
  category: ['popular'],
  overlayBadge: 'Popular'
}, {
  id: 19,
  name: 'Moroccan Chickpea Stew',
  description: 'Aromatic chickpea stew with ancient grains and vegetables',
  image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd',
  price: '$12.99',
  prepTime: '20 min',
  calories: '390 cal',
  tags: ['Vegan', 'High Fiber', 'Mediterranean'],
  category: ['vegetarian']
}, {
  id: 20,
  name: 'Teriyaki Tofu Bowl',
  description: 'Crispy tofu with teriyaki sauce and stir-fried vegetables',
  image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38',
  price: '$13.99',
  prepTime: '18 min',
  calories: '420 cal',
  tags: ['Vegetarian', 'High Protein'],
  category: ['vegetarian', 'bestseller'],
  overlayBadge: 'Bestseller'
}, {
  id: 21,
  name: 'Pesto Chicken Pasta',
  description: 'Whole grain pasta with basil pesto and grilled chicken',
  image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856',
  price: '$14.99',
  prepTime: '22 min',
  calories: '520 cal',
  tags: ['High Protein', 'Mediterranean'],
  category: ['popular', 'high-protein'],
  overlayBadge: 'Limited Time'
}];

const OurMeals = () => {
  const { addToCart } = useCart();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState<number[]>([]);
  const [likedMeals, setLikedMeals] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('likedMeals');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading liked meals:', error);
      return [];
    }
  });

  // Use the custom hook for filtering
  const {
    paginatedMeals,
    totalPages,
    totalResults,
    searchQuery,
    setSearchQuery,
    activeQuickFilter,
    setActiveQuickFilter,
    selectedFilters,
    setSelectedFilters,
    page,
    setPage,
    isLoading
  } = useMealFilter(meals, 12);

  // Memoize handlers
  const handleAddToCart = useCallback((meal: any) => {
    addToCart(meal);
    setRecentlyAdded(prev => [...prev, meal.id]);
    setTimeout(() => {
      setRecentlyAdded(prev => prev.filter(id => id !== meal.id));
    }, 1500);
  }, [addToCart]);

  const toggleLike = useCallback((id: number) => {
    setLikedMeals(current => current.includes(id) ? current.filter(mealId => mealId !== id) : [...current, id]);
  }, []);

  // Save liked meals to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('likedMeals', JSON.stringify(likedMeals));
    } catch (error) {
      console.error('Error saving liked meals:', error);
    }
  }, [likedMeals]);

  return (
    <section className="w-full pt-16 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" role="heading">
            Discover Our{' '}
            <GradientText variant="primary">Delicious</GradientText> Selection
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Choose from our wide selection of chef-crafted meals
          </p>
        </div>
        <FilterSystem 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilter={activeQuickFilter}
          onFilterChange={setActiveQuickFilter}
          selectedFilters={selectedFilters}
          onOpenDetailedFilters={() => setIsFilterModalOpen(true)}
          quickFilters={[{
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
        }]}
          totalResults={totalResults} 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {isLoading ? <MealCardSkeleton /> : paginatedMeals.map(meal => (
            <MealCard 
              key={meal.id} 
              meal={meal} 
              onAddToCart={handleAddToCart} 
              onLike={toggleLike} 
              isLiked={likedMeals.includes(meal.id)} 
              recentlyAdded={recentlyAdded.includes(meal.id)} 
            />
          ))}
        </div>
        {/* Pagination */}
        {totalPages > 1 && <div className="flex justify-center gap-2">
            {Array.from({
          length: totalPages
        }, (_, i) => i + 1).map(pageNum => <button key={pageNum} onClick={() => setPage(pageNum)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${page === pageNum ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>
                {pageNum}
              </button>)}
          </div>}
        <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} selectedFilters={selectedFilters} onFilterChange={setSelectedFilters} onReset={() => setSelectedFilters([])} />
      </div>
    </section>
  );
};

export default memo(OurMeals);








