import React from 'react';
import { useCart } from '../../context/CartContext';
import { CalendarIcon, CheckIcon } from 'lucide-react';
interface OrderSummaryProps {
  showItems?: boolean;
  className?: string;
}
export const OrderSummary = ({
  showItems = false,
  className = ''
}: OrderSummaryProps) => {
  const {
    items
  } = useCart();
  const subtotal = items.reduce((sum, item) => {
    if (item.type === 'meal') {
      return sum + parseFloat(item.price.replace('$', '')) * item.quantity;
    } else {
      return sum + (item.totalCost || 0);
    }
  }, 0);
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;
  return <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Order Summary
      </h2>
      {showItems && items.length > 0 && <div className="space-y-4 mb-6">
          {items.map(item => <div key={item.type === 'meal' ? item.id : item.planName} className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">
                  {item.type === 'meal' ? item.name : item.planName}
                </h4>
                {item.type === 'meal' ? <p className="text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p> : <div className="text-sm text-gray-500 flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4" />
                    <span>
                      {item.weeks} {item.weeks === 1 ? 'week' : 'weeks'} plan
                    </span>
                  </div>}
              </div>
              <div className="text-right">
                <span className="font-medium text-gray-900">
                  $
                  {item.type === 'meal' ? (parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2) : (item.totalCost || 0).toFixed(2)}
                </span>
              </div>
            </div>)}
        </div>}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900 font-medium">
            ${subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-success-600 font-medium flex items-center gap-1">
            <CheckIcon className="w-4 h-4" />
            Free
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Estimated Tax (8%)</span>
          <span className="text-gray-900 font-medium">${tax.toFixed(2)}</span>
        </div>
        <div className="my-4 border-t border-gray-100" />
        <div className="flex justify-between text-base font-medium">
          <span className="text-gray-900">Total</span>
          <span className="text-gray-900">${total.toFixed(2)}</span>
        </div>
        {showItems && items.some(item => item.type === 'subscription') && <p className="text-xs text-gray-500 mt-4">
            * Subscription plans will be automatically renewed based on your
            selected billing frequency. You can cancel or modify your
            subscription at any time.
          </p>}
      </div>
    </div>;
};