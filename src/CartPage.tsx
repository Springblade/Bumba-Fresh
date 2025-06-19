import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Utensils as UtensilsIcon, Check as CheckIcon } from 'lucide-react';
import { MealSelectionModal } from './components/MealSelectionModal';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import { Button } from './components/ui/Button';
import { CheckoutLayout } from './components/checkout/CheckoutLayout';
import { OrderSummary } from './components/checkout/OrderSummary';
import { CartItem } from './components/checkout/CartItem';

interface SubscriptionItem {
  id?: number;
  planName: string;
  weeks: number;
  mealsByWeek: string[][];
  totalCost: number;
  type: 'subscription';
}

const CartPage = () => {
  const {
    items,
    addSubscriptionItem
  } = useCart();
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSubscription, setActiveSubscription] = useState<SubscriptionItem | null>(null);
  
  const handleCustomizeMeals = (subscription: SubscriptionItem) => {
    setActiveSubscription(subscription);
    setIsModalOpen(true);
  };
  
  const handleSaveMealSelections = (selectedMeals: string[]) => {
    if (!activeSubscription) return;
    // Update the subscription with selected meals
    const updatedSubscription = {
      ...activeSubscription,
      mealsByWeek: [selectedMeals, selectedMeals, selectedMeals, selectedMeals]
    };
    // Update cart context
    addSubscriptionItem(updatedSubscription);
    setIsModalOpen(false);
    setActiveSubscription(null);
  };
  
  const handleCheckout = () => {
    navigate('/checkout/payment');
  };
  
  // ... existing empty cart check
  return <>
      <CheckoutLayout currentStep="cart" sidebar={<div className="space-y-4">
            <OrderSummary />
            <Button className="w-full" onClick={handleCheckout}>
              {user ? 'Proceed to Checkout' : 'Sign in to Checkout'}
            </Button>
            {!user && <p className="text-sm text-gray-600 text-center">
                You must{' '}
                <Link to={`/auth?next=/checkout/payment`} className="text-primary-600 hover:text-primary-700 font-medium">
                  sign in
                </Link>{' '}
                to complete your purchase
              </p>}
          </div>}>
        <div className="space-y-4">
          {items.map((item: any) => <div key={item.id || item.planName}>
              {item.type === 'subscription' ? <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{item.planName}</h3>
                      <p className="text-gray-600">4-Week Subscription</p>
                    </div>
                    <Button onClick={() => handleCustomizeMeals(item)} variant={item.mealsByWeek[0].length === 0 ? 'primary' : 'outline'} className="relative">
                      <UtensilsIcon className="w-4 h-4 mr-2" />
                      {item.mealsByWeek[0].length === 0 ? <>
                          Customize Your Meals
                          {/* Add a pulsing dot to draw attention */}
                          <span className="absolute -top-1 -right-1 h-3 w-3 bg-secondary-500 rounded-full animate-ping" />
                          <span className="absolute -top-1 -right-1 h-3 w-3 bg-secondary-500 rounded-full" />
                        </> : 'Modify Selections'}
                    </Button>
                  </div>
                  {item.mealsByWeek[0].length > 0 && <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Selected Meals:
                      </h4>
                      <ul className="space-y-1">
                        {item.mealsByWeek[0].map((meal: string, index: number) => <li key={index} className="text-sm text-gray-600 flex items-center">
                              <CheckIcon className="w-4 h-4 mr-2 text-success-500" />
                              {meal}
                            </li>)}
                      </ul>
                    </div>}
                </div> : <CartItem {...item} />}
            </div>)}
        </div>
      </CheckoutLayout>
      {activeSubscription && <MealSelectionModal isOpen={isModalOpen} onClose={() => {
      setIsModalOpen(false);
      setActiveSubscription(null);
    }} onSave={handleSaveMealSelections} mealsPerWeek={activeSubscription.planName === 'Family Plan' ? 4 : 3} currentSelections={activeSubscription.mealsByWeek[0]} planName={activeSubscription.planName} />}
    </>;
};

export default CartPage;