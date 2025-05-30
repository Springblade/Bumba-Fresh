import React from 'react';
import { useCart } from '../../context/CartContext';
interface OrderSummaryProps {
  showItems?: boolean;
  className?: string;
}
export const OrderSummary = ({
  showItems = true,
  className = ''
}: OrderSummaryProps) => {
  const {
    items
  } = useCart();
  const subtotal = items.reduce((sum, item) => sum + parseFloat(item.price.replace('$', '')) * item.quantity, 0);
  const deliveryFee = 5.99;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + deliveryFee + tax;
  return <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Order Summary
        </h3>
        {showItems && items.length > 0 && <div className="space-y-3 mb-6">
            {items.map(item => <div key={item.id} className="flex justify-between text-sm text-gray-600">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium">
                  $
                  {(parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2)}
                </span>
              </div>)}
          </div>}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Delivery Fee</span>
            <span className="font-medium">${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Tax</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
          <span className="text-base font-semibold text-gray-900">Total</span>
          <span className="text-xl font-bold text-primary-600">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>;
};