import { useCallback, useEffect, useState, memo } from 'react';
import { Utensils as UtensilsIcon, Sparkles as SparklesIcon, Leaf as LeafIcon, Zap as ZapIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import FilterModal from './FilterModal';
import MealCard from '../features/meals/components/MealCard';
import GradientText from './GradientText';
import { useMealFilter } from '../hooks/useMealFilter';
import { FilterSystem } from './meals/FilterSystem';
import { BaseMeal } from '../types/shared';
import { MealCardSkeleton } from './ui/MealCardSkeleton';
import { getAllMeals } from '../services/meals';
import ApiStatus from './debug/ApiStatus';
import { formatCurrency } from '../utils/priceUtils';
import { useFavorites } from '../hooks/useFavorites';

type Meal = BaseMeal & {
  prepTime: string;
  calories: string;
  category: string[]; // Make sure this is not optional
};

const OurMeals = () => {
  const { addToCart } = useCart();
  const { likedMeals, toggleFavorite } = useFavorites();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState<number[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoadingMeals, setIsLoadingMeals] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch meals from API
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setIsLoadingMeals(true);
        setErrorMessage(null);
        console.log(' Fetching meals from API...');
        
        // Check if we can reach the API first
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
        console.log(' Using API URL:', apiUrl);
        
        const apiMeals = await getAllMeals();
        console.log(' Meals fetched successfully:', apiMeals.length, 'meals');
        
        // Transform API data to frontend format
        const transformedMeals: Meal[] = apiMeals.map((apiMeal) => ({
          id: apiMeal.id,
          name: apiMeal.name,
          description: apiMeal.description,
          image: apiMeal.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
          price: formatCurrency(apiMeal.price),
          prepTime: apiMeal.prep_time || '20 min',
          calories: apiMeal.calories ? `${apiMeal.calories} cal` : '400 cal',
          tags: apiMeal.tags || ['Fresh', 'Healthy'],
          category: apiMeal.category ? [apiMeal.category.toLowerCase()] : ['popular'],
          overlayBadge: apiMeal.category === 'popular' ? 'Popular' as const : undefined,
          isNew: false
        }));
        
        console.log(' Meals transformed:', transformedMeals.length, 'meals ready for display');
        setMeals(transformedMeals);
      } catch (error) {
        console.error(' Error fetching meals:', error);
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
        
        // Provide more specific error messages
        let errorMsg = 'Failed to load meals. ';
        if (error instanceof Error) {
          if (error.message.includes('fetch')) {
            errorMsg += 'Cannot connect to the backend server. Make sure it\'s running on port 8000.';
          } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
            errorMsg += 'Network connection error. Check if the backend server is running.';
          } else {
            errorMsg += error.message;
          }
        } else {
          errorMsg += 'Please try again later.';
        }
        
        setErrorMessage(errorMsg);
        setMeals([]); // Fallback to empty array
      } finally {
        setIsLoadingMeals(false);
      }
    };

    fetchMeals();
  }, []);

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
    setRecentlyAdded((prev: number[]) => [...prev, meal.id]);
    setTimeout(() => {
      setRecentlyAdded((prev: number[]) => prev.filter((id: number) => id !== meal.id));
    }, 1500);
  }, [addToCart]);

  // Show error state
  if (errorMessage) {
    return (
      <section className="w-full pt-16 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Our{' '}
              <GradientText variant="primary">Delicious</GradientText> Selection
            </h1>
            <div className="max-w-2xl mx-auto">
              <ApiStatus onRetry={() => window.location.reload()} />
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-800">{errorMessage}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

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
        }]}
          totalResults={totalResults} 
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {isLoadingMeals || isLoading ? (
            // Show loading skeletons
            Array.from({ length: 8 }).map((_, index) => (
              <MealCardSkeleton key={index} />
            ))
          ) : (
            paginatedMeals.map((meal: Meal) => (              <MealCard 
                key={meal.id} 
                meal={meal} 
                onAddToCart={handleAddToCart} 
                onLike={toggleFavorite} 
                isLiked={likedMeals.includes(meal.id)} 
                recentlyAdded={recentlyAdded.includes(meal.id)} 
              />
            ))
          )}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${page === pageNum 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
              >
                {pageNum}
              </button>
            ))}
          </div>
        )}
        <FilterModal 
          isOpen={isFilterModalOpen} 
          onClose={() => setIsFilterModalOpen(false)} 
          selectedFilters={selectedFilters} 
          onFilterChange={setSelectedFilters} 
          onReset={() => setSelectedFilters([])} 
        />
      </div>
    </section>
  );
};

export default memo(OurMeals);
