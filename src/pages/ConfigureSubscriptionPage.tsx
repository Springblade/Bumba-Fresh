import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckIcon, ChevronRightIcon, AlertCircleIcon, XIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from '../components/ui/Button';
import GradientText from '../components/GradientText';
import { getAllMeals, Meal } from '../services/meals';
import { plans } from '../data/subscriptionPlans';

// Types
type Week = 1 | 2 | 3 | 4;
type WeeklyMeals = Record<Week, number[]>;

// Extended meal type for frontend display
type DisplayMeal = Omit<Meal, 'price' | 'calories' | 'category'> & {
  image: string;
  prepTime: string;
  calories: string;
  tags: string[];
  category: string[];
  price: string;
};

const ConfigureSubscriptionPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addSubscriptionItem } = useCart();
  
  const planName = searchParams.get('plan');
  const billingFrequency = searchParams.get('billing') || 'weekly';

  // Get plan details from plans data
  const planDetails = useMemo(() => {
    const plan = plans.find(p => p.name === planName);
    if (!plan) return null;
    
    const weeklyTotal = plan.mealsPerWeek * plan.pricePerMeal;
    const monthlyTotal = weeklyTotal * 4 * (billingFrequency === 'monthly' ? 0.9 : 1); // 10% discount for monthly
    
    return {
      ...plan,
      weeklyTotal,
      monthlyTotal,
      finalTotal: billingFrequency === 'monthly' ? monthlyTotal : weeklyTotal
    };
  }, [planName, billingFrequency]);
  // State
  const [activeWeek, setActiveWeek] = useState<Week>(1);
  const [selectedMeals, setSelectedMeals] = useState<WeeklyMeals>({
    1: [],
    2: [],
    3: [],
    4: []
  });
  const [meals, setMeals] = useState<DisplayMeal[]>([]);
  const [isLoadingMeals, setIsLoadingMeals] = useState(true);
  // Fetch meals from API
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setIsLoadingMeals(true);
        const apiMeals = await getAllMeals();
        
        // Transform API meals to include frontend properties
        const transformedMeals = apiMeals.map(meal => ({
          ...meal,
          image: meal.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
          price: `$${(typeof meal.price === 'number' ? meal.price : parseFloat(meal.price) || 0).toFixed(2)}`,
          calories: meal.calories ? `${meal.calories} cal` : '400 cal',
          prepTime: meal.prep_time || '20 min',
          tags: meal.tags || ['Fresh', 'Healthy'],
          category: meal.category ? [meal.category.toLowerCase()] : ['popular']
        }));
        
        setMeals(transformedMeals);
      } catch (error) {
        console.error('Error fetching meals for subscription configuration:', error);
        setMeals([]);
      } finally {
        setIsLoadingMeals(false);
      }
    };

    fetchMeals();
  }, []);

  useEffect(() => {
    if (!planName) {
      navigate('/subscribe');
    }
  }, [planName, navigate]);

  // Handlers
  const handleMealSelection = (week: Week, mealId: number) => {
    setSelectedMeals(prev => {
      const weeklyMeals = prev[week];
      const isSelected = weeklyMeals.includes(mealId);
      
      if (isSelected) {
        return {
          ...prev,
          [week]: weeklyMeals.filter(id => id !== mealId)
        };
      }
      
      // Add null check for planDetails
      if (!planDetails || weeklyMeals.length >= planDetails.mealsPerWeek) return prev;
      
      return {
        ...prev,
        [week]: [...weeklyMeals, mealId]
      };
    });
  };

  const handleProceedToCheckout = () => {
    if (!planDetails) return;
    
    const isComplete = Object.values(selectedMeals).every(meals => 
      meals.length === planDetails.mealsPerWeek
    );
    
    if (!isComplete) return;
    
    const mealsByWeek = Object.values(selectedMeals).map(mealIds => 
      mealIds.map(id => {
        const meal = meals.find(m => m.id === id);
        return meal?.name || '';
      })
    );
    
    // Fix: Match the expected type for addSubscriptionItem
    addSubscriptionItem({
      planName: planName || '',
      weeks: billingFrequency === 'monthly' ? 4 : 1,
      mealsByWeek,
      totalCost: planDetails.finalTotal,
      // Remove billingFrequency if it's not in the expected type
      // or use the proper property name as expected by the function
    });
    
    navigate('/cart');
  };

  // Computed values with null checks
  const isWeekComplete = (week: Week) => 
    planDetails ? selectedMeals[week].length === planDetails.mealsPerWeek : false;
    
  const isAllWeeksComplete = planDetails ? 
    Object.values(selectedMeals).every(meals => meals.length === planDetails.mealsPerWeek) : 
    false;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8">
          {/* Main Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                <GradientText variant="primary">
                  Configure Your {planName}
                </GradientText>
              </h1>
              <p className="text-gray-600">
                Select {planDetails?.mealsPerWeek} meals for each week of your
                plan
              </p>
            </div>
            
            {/* Week Tabs */}
            <div className="flex space-x-2 border-b border-gray-200">
              {([1, 2, 3, 4] as Week[]).map(week => (
                <button 
                  key={week}
                  onClick={() => setActiveWeek(week)}
                  className={`
                    px-6 py-3 font-medium rounded-t-lg transition-colors
                    ${activeWeek === week ? 'bg-white border-b-2 border-primary-600 text-primary-600' : 'text-gray-600 hover:text-gray-900'}
                    ${isWeekComplete(week) ? 'text-green-600' : ''}
                  `}
                >
                  Week {week}
                  {isWeekComplete(week) && <CheckIcon className="inline-block ml-2 w-4 h-4" />}
                </button>
              ))}
            </div>
              {/* Meal Grid */}
            {isLoadingMeals ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-gray-200 animate-pulse rounded-xl h-32"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {meals.map(meal => {
                const isSelected = selectedMeals[activeWeek].includes(meal.id);
                const isSelectionDisabled = !isSelected && 
                  (planDetails ? selectedMeals[activeWeek].length >= planDetails.mealsPerWeek : true);
                
                return (
                  <motion.div 
                    key={meal.id}
                    className={`
                      relative rounded-xl border transition-all cursor-pointer
                      ${isSelected ? 'border-primary-600 ring-2 ring-primary-100' : 'border-gray-200 hover:border-gray-300'}
                      ${isSelectionDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    onClick={() => !isSelectionDisabled && handleMealSelection(activeWeek, meal.id)}
                    whileHover={!isSelectionDisabled ? { scale: 1.02 } : {}}
                  >
                    <div className="p-6">
                      <div className="flex gap-4">
                        <img 
                          src={meal.image} 
                          alt={meal.name} 
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {meal.name}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                            {meal.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {meal.tags && meal.tags.map(tag => (
                              <span key={tag} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                                {tag}
                              </span>
                            ))}                            {/* Replace dietaryInfo with the correct property name from your meals data */}
                            {meal.category && meal.category.map((info: string) => (
                              <span key={info} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                                {info}
                              </span>
                            ))}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="absolute top-4 right-4">
                            <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                              <CheckIcon className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>                  </motion.div>
                );
              })}
              </div>
            )}
          </div>
          
          {/* Sticky Sidebar */}
          <div className="lg:sticky lg:top-8 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6">
                Subscription Summary
              </h2>
              
              {/* Current Week Summary */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">
                  Week {activeWeek} Selections
                </h3>
                <div className="space-y-2">
                  {selectedMeals[activeWeek].map(mealId => {
                    const meal = meals.find(m => m.id === mealId);
                    if (!meal) return null;
                    
                    return (
                      <div key={mealId} className="flex items-center justify-between text-sm">
                        <span>{meal.name}</span>
                        <button 
                          onClick={() => handleMealSelection(activeWeek, mealId)} 
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Cost Breakdown */}
              <div className="space-y-3 border-t border-gray-100 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {billingFrequency === 'monthly' ? 'Monthly' : 'Weekly'}{' '}
                    Price
                  </span>
                  <span className="font-medium">
                    ${planDetails?.finalTotal.toFixed(2) || '0.00'}
                  </span>
                </div>
                
                {billingFrequency === 'monthly' && (
                  <div className="flex justify-between text-sm text-success-600">
                    <span>Monthly Discount</span>
                    <span>-10%</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Price per meal</span>
                  <span>${planDetails?.pricePerMeal.toFixed(2) || '0.00'}</span>
                </div>
              </div>
              
              {/* Action Button */}
              <Button 
                className="w-full mt-6" 
                onClick={handleProceedToCheckout} 
                disabled={!isAllWeeksComplete}
              >
                {isAllWeeksComplete ? (
                  <>
                    Proceed to Checkout
                    <ChevronRightIcon className="ml-2 w-4 h-4" />
                  </>
                ) : (
                  <>
                    <AlertCircleIcon className="w-4 h-4 mr-2" />
                    Complete All Weeks
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigureSubscriptionPage;