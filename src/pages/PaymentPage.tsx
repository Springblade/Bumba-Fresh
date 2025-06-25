import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockIcon, AlertCircleIcon, MapPinIcon, CreditCardIcon, WalletIcon, ShieldCheckIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CheckoutLayout } from '../components/checkout/CheckoutLayout';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { Button } from '../components/ui/Button';
import { ShippingForm } from '../components/checkout/ShippingForm';
import { completeOrder, CompleteOrderRequest } from '../services/orders';
import { createSubscription } from '../services/subscriptions';

type CheckoutStep = 'shipping' | 'payment';
type PaymentMethod = 'credit-card' | 'paypal';

// Define local shipping address interface
interface ShippingAddress {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
}

const paymentMethods = [{
  id: 'credit-card' as PaymentMethod,
  name: 'Credit Card',
  description: 'Pay securely with your credit or debit card',
  icon: CreditCardIcon,
  securityText: 'Encrypted and secure payments'
}, {
  id: 'paypal' as PaymentMethod,
  name: 'PayPal',
  description: 'Fast and secure checkout with PayPal',
  icon: WalletIcon,
  securityText: 'PayPal purchase protection'
}];

const PaymentPage = () => {
  const navigate = useNavigate();
  const {
    items,
    clearCart
  } = useCart();
  const {
    user
  } = useAuth();
  
  // Component state
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('credit-card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  
  // Calculate order totals
  const subtotal = items.reduce((sum, item) => {
    if (item.type === 'meal') {
      return sum + parseFloat(item.price.replace('$', '')) * item.quantity;
    }
    return sum + item.totalCost;
  }, 0);
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;  // Initialize with user's saved address if available
  useEffect(() => {
    if (user?.address) {
      // Map the existing Address fields to the ShippingForm Address format
      const userAddress = {
        fullName: user.firstName + " " + user.lastName || "",
        phoneNumber: "",  // Set empty string since phoneNumber doesn't exist in user.address
        email: user.email || "",  // Add user email
        address: user.address.street || "",
        city: user.address.city || "",
        postalCode: user.address.zip || ""
      };
      setShippingAddress(userAddress);
      setCurrentStep('payment');
    }
  }, [user]);  // Handle shipping form submission
  const handleShippingSubmit = (address: { fullName: string; phoneNumber: string; email?: string; address: string; city: string; postalCode: string; }) => {
    if (!address.fullName || !address.phoneNumber || !address.email || !address.address || !address.city || !address.postalCode) {
      setFormError('Please fill in all address fields');
      return;
    }
    
    const shippingAddr: ShippingAddress = {
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      email: address.email,
      address: address.address,
      city: address.city,
      postalCode: address.postalCode
    };
    
    setShippingAddress(shippingAddr);
    setCurrentStep('payment');
  };
    // Handle payment form submission
  const handlePaymentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setIsProcessing(true);
    
    try {
      if (!shippingAddress) {
        setFormError('Shipping address is required');
        return;
      }
      
      // Check if cart has items (either meals or subscriptions)
      const hasItems = items.length > 0;
      if (!hasItems) {
        setFormError('Your cart is empty');
        return;
      }
      
      // Process subscription if present
      const subscriptionItems = items.filter(item => item.type === 'subscription');
      if (subscriptionItems.length > 0) {
        // Process subscription
        const subscriptionItem = subscriptionItems[0]; // Assuming one subscription at a time
        
        console.log('Processing subscription:', subscriptionItem);
        
        // Calculate expiration date based on plan
        const today = new Date();
        let expirationDate = new Date();
        
        if (subscriptionItem.billingFrequency === 'weekly') {
          expirationDate.setDate(today.getDate() + 7);
        } else {
          expirationDate.setMonth(today.getMonth() + 1);
        }
        
        // Create subscription
        const subscriptionRequest = {
          subscriptionPlan: subscriptionItem.planName.toLowerCase().split(' ')[0] as 'basic' | 'premium' | 'signature',
          timeExpired: expirationDate.toISOString()
        };
        
        console.log('Sending subscription request:', subscriptionRequest);
        
        const subscriptionResponse = await createSubscription(subscriptionRequest);
        
        console.log('Subscription response received:', subscriptionResponse);
        
        // Create subscription details for confirmation page
        const subscriptionDetails = {
          subscriptionNumber: subscriptionResponse.subscriptionNumber,
          planName: subscriptionItem.planName,
          billingFrequency: subscriptionItem.billingFrequency,
          selectedMeals: subscriptionItem.mealsByWeek,
          subtotal,
          shipping,
          tax,
          total,
          shippingAddress,
          paymentMethod: selectedPaymentMethod,
          startDate: new Date(),
          nextBillingDate: expirationDate
        };
        
        // Navigate with subscription details in state
        navigate('/checkout/confirmation', {
          state: {
            subscription: subscriptionDetails
          }
        });
        
        // Clear cart after successful payment
        clearCart();
        return;
      }
      
      // Process meal orders if present
      const mealItems = items.filter(item => item.type === 'meal');
      if (mealItems.length > 0) {
        // Process meal orders
        // Existing code for meal orders...
      } else {
        setFormError('No items in cart to complete order');
        return;
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setFormError(`Payment processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <CheckoutLayout 
      currentStep="payment" 
      sidebar={
        <div className="space-y-4">
          <OrderSummary showItems={true} />
          {currentStep === 'payment' && (
            <>
              <Button 
                type="submit" 
                form="payment-form" 
                className="w-full" 
                isLoading={isProcessing} 
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
              </Button>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <LockIcon className="w-4 h-4" />
                <span>Secure payment processing</span>
              </div>
            </>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        {/* Shipping Step */}
        {currentStep === 'shipping' ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPinIcon className="w-6 h-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Shipping Address
                </h2>
              </div>              <ShippingForm 
                initialAddress={shippingAddress} 
                onSubmit={handleShippingSubmit} 
                isSubmitting={false} 
                error={formError} 
              />
            </div>
          </div>
        ) : (
          /* Payment Step */
          <div className="space-y-6">
            {/* Address Summary */}
            {shippingAddress && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Shipping to:
                      </h3>
                      <div className="text-sm text-gray-600 mt-1 space-y-1">
                        <p>{shippingAddress.fullName}</p>
                        <p>{shippingAddress.phoneNumber}</p>
                        <p>{shippingAddress.address}</p>
                        <p>
                          {shippingAddress.city}, {shippingAddress.postalCode}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" onClick={() => setCurrentStep('shipping')}>
                    Change
                  </Button>
                </div>
              </div>
            )}
            
            {/* Payment Method Selection */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <form id="payment-form" onSubmit={handlePaymentSubmit}>
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCardIcon className="w-6 h-6 text-primary-600" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Payment Method
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {paymentMethods.map(method => {
                      const Icon = method.icon;
                      const isSelected = selectedPaymentMethod === method.id;
                      return (
                        <label 
                          key={method.id} 
                          className={`
                            relative flex flex-col p-4 border-2 rounded-lg cursor-pointer
                            transition-all duration-200
                            ${isSelected ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}
                          `}
                        >
                          <input 
                            type="radio" 
                            name="payment-method" 
                            value={method.id} 
                            checked={isSelected} 
                            onChange={() => setSelectedPaymentMethod(method.id)} 
                            className="sr-only" 
                          />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-gray-100 rounded-lg">
                                <Icon className="w-6 h-6 text-gray-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {method.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {method.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="w-5 h-5 border-2 rounded-full flex items-center justify-center">
                                {isSelected && <div className="w-3 h-3 bg-primary-600 rounded-full" />}
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="mt-4 flex items-center gap-2 text-sm text-primary-700">
                              <ShieldCheckIcon className="w-4 h-4" />
                              <span>{method.securityText}</span>
                            </div>
                          )}
                        </label>
                      );
                    })}
                  </div>
                  {formError && (
                    <div 
                      className="p-4 rounded-lg bg-error-50 border border-error-200 text-error-700 text-sm flex items-start gap-2" 
                      role="alert"
                    >
                      <AlertCircleIcon className="w-5 h-5 flex-shrink-0" />
                      <p>{formError}</p>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </CheckoutLayout>
  );
};

export default PaymentPage;
