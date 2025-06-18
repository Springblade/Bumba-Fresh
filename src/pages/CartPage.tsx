import React, { useState, Component } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeftIcon, Minus as MinusIcon, Plus as PlusIcon, Trash2Icon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { EmptyState } from '../components/ui/EmptyState';

const CartPage = () => {
  const {
    items,
    removeFromCart,
    incrementQuantity,
    decrementQuantity
  } = useCart();
  const {
    user
  } = useAuth();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center">
          <EmptyState 
            title="Your cart is empty"
            description="Looks like you haven't added any meals to your cart yet."
          />
          <Button 
            variant="primary" 
            className="mt-4"
            onClick={() => navigate('/menu')}
          >
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  // Calculate line item total
  const calculateLineTotal = (price: string, quantity: number) => {
    const priceNumber = parseFloat(price.replace('$', ''));
    return priceNumber * quantity;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Your Cart</h1>
            <Link to="/menu" className="text-primary-600 hover:text-primary-700 inline-flex items-center">
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="space-y-4">
              {items.map(item => <div key={item.type === 'meal' ? item.id : item.planName} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                  {item.type === 'meal' ? <div className="flex items-start space-x-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Unit Price: {item.price}
                        </p>
                        <div className="mt-4 flex items-center space-x-4">
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button onClick={() => decrementQuantity(item.id)} className="p-2 hover:bg-gray-50 text-gray-600 transition-colors" aria-label="Decrease quantity">
                              <MinusIcon className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-medium text-gray-900">
                              {item.quantity}
                            </span>
                            <button onClick={() => incrementQuantity(item.id)} className="p-2 hover:bg-gray-50 text-gray-600 transition-colors" aria-label="Increase quantity">
                              <PlusIcon className="w-4 h-4" />
                            </button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="p-2 text-gray-400 hover:text-error-500 transition-colors" aria-label="Remove item">
                            <Trash2Icon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-semibold text-gray-900">
                          $
                          {calculateLineTotal(item.price, item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div> : <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.planName}
                        </h3>
                        <p className="text-gray-600">
                          {item.weeks}-Week Subscription
                        </p>
                      </div>
                      <button onClick={() => removeFromCart(item.planName)} className="p-2 text-gray-400 hover:text-error-500 transition-colors" aria-label="Remove subscription">
                        <Trash2Icon className="w-5 h-5" />
                      </button>
                    </div>}
                </div>)}
            </div>
          </div>
          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              <OrderSummary />
              <div className="mt-4">
                <Button onClick={() => navigate('/checkout/payment')} className="w-full" size="lg" disabled={items.length === 0}>
                  {user ? 'Proceed to Checkout' : 'Sign in to Checkout'}
                </Button>
                {!user && <p className="mt-4 text-sm text-gray-600 text-center">
                    Please{' '}
                    <Link to={`/auth?next=${encodeURIComponent('/checkout/payment')}`} className="text-primary-600 hover:text-primary-700 font-medium">
                      sign in
                    </Link>{' '}
                    to complete your purchase
                  </p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;