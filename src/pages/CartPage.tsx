import React from 'react';
import { useCart } from '../context/CartContext';
import { CheckoutLayout } from '../components/checkout/CheckoutLayout';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { CartItem } from '../components/checkout/CartItem';
import { ShoppingCartIcon, ShoppingBagIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const {
    items,
    cartCount
  } = useCart();
  const navigate = useNavigate();
  
  // Empty cart state
  if (items.length === 0) {
    return <CheckoutLayout currentStep="cart">
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <ShoppingCartIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button onClick={() => navigate('/menu')} leftIcon={<ShoppingBagIcon className="w-5 h-5" />}>
            Browse Menu
          </Button>
        </div>
      </CheckoutLayout>;
  }

  return <CheckoutLayout 
    currentStep="cart" 
    sidebar={<>
      <OrderSummary />
      <Button className="w-full mt-4" onClick={() => navigate('/checkout/payment')}>
        Proceed to Checkout ({cartCount} item{cartCount !== 1 ? 's' : ''})
      </Button>
    </>}
  >
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Shopping Cart ({cartCount} item{cartCount !== 1 ? 's' : ''})
        </h1>
        <Button variant="outline" onClick={() => navigate('/menu')}>
          Continue Shopping
        </Button>
      </div>
        <div className="space-y-4">
        {items.map(item => (
          item.type === 'meal' ? (
            <CartItem 
              key={item.id} 
              id={item.id}
              name={item.name}
              price={item.price}
              quantity={item.quantity}
              image={item.image || ''}            />
          ) : null
        ))}
      </div>
    </div>
  </CheckoutLayout>;
};

export default CartPage;