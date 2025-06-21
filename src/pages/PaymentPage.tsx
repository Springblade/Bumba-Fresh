import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckoutLayout } from '../components/checkout/CheckoutLayout';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { Button } from '../components/ui/Button';
import { ShippingForm } from '../components/checkout/ShippingForm';
import { PaymentMethodSelector } from '../components/checkout/PaymentMethodSelector';
import { LockIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService, type ShippingInfo, type OrderItem } from '../services/orderService';

interface ShippingFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
}

const PaymentPage = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('PaymentPage: Form submitted');
    console.log('PaymentPage: User:', user);
    console.log('PaymentPage: Shipping data:', shippingData);
    console.log('PaymentPage: Cart items:', items);
    
    setError(null);
    
    // Check if user is logged in
    if (!user) {
      console.error('User not logged in');
      setError('Please log in to place an order.');
      navigate('/auth');
      return;
    }
    
    if (!shippingData) {
      console.error('Shipping data is required');
      setError('Please complete all shipping information fields.');
      return;
    }
    
    if (items.length === 0) {
      console.error('No items in cart');
      setError('Your cart is empty. Please add items before placing an order.');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      console.log('PaymentPage: Starting order creation...');
      
      // Calculate total amount
      const totalAmount = items.reduce((total, item) => {
        if (item.type === 'meal') {
          return total + (parseFloat(item.price.replace('$', '')) * item.quantity);
        }
        return total;
      }, 0);

      console.log('PaymentPage: Total amount calculated:', totalAmount);

      // Convert cart items to order items
      const orderItems: OrderItem[] = items
        .filter(item => item.type === 'meal')
        .map(item => ({
          mealId: item.id,
          quantity: item.quantity,
          price: parseFloat(item.price.replace('$', ''))
        }));

      console.log('PaymentPage: Order items:', orderItems);

      // Create order and delivery record using orderService
      console.log('PaymentPage: Calling orderService.createOrder...');
      const result = await orderService.createOrder({
        totalAmount,
        items: orderItems,
        shippingInfo: shippingData as ShippingInfo
      });

      console.log('PaymentPage: Order created successfully:', result);

      // Clear cart and navigate to confirmation
      clearCart();
      navigate('/checkout/confirmation');
    } catch (error) {
      console.error('Order creation failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to create order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };const isShippingDataComplete = shippingData && 
    shippingData.firstName.trim() && 
    shippingData.lastName.trim() && 
    shippingData.email.trim() && 
    shippingData.phone.trim() && 
    shippingData.address.trim() && 
    shippingData.city.trim() && 
    shippingData.zipCode.trim();
  return (
    <CheckoutLayout 
      currentStep="payment" 
      sidebar={        <div className="space-y-4">
          <OrderSummary showItems={false} />
          <Button 
            className="w-full" 
            type="submit"
            form="payment-form"
            isLoading={isProcessing}
            disabled={!isShippingDataComplete}
          >
            {isProcessing ? 'Processing...' : 'Place Order'}
          </Button>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          {!isShippingDataComplete && shippingData && (
            <p className="text-sm text-orange-600 text-center">
              Please complete all shipping information fields
            </p>
          )}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <LockIcon className="w-4 h-4" />
            <span>Secure payment processing</span>
          </div>
        </div>
      }
    >
      <form id="payment-form" onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Shipping Information
            </h2>
            <ShippingForm onShippingDataChange={setShippingData} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Payment Method
            </h2>
            <PaymentMethodSelector />
          </div>
        </div>
      </form>
    </CheckoutLayout>
  );
};

export default PaymentPage;