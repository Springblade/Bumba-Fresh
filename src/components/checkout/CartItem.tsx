import React from 'react';
import { Minus, Plus, Trash2Icon } from 'lucide-react';
import { useCart } from '../../context/CartContext';
interface CartItemProps {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
}
export const CartItem = ({
  id,
  name,
  price,
  quantity,
  image
}: CartItemProps) => {
  const {
    removeFromCart,
    incrementQuantity,
    decrementQuantity
  } = useCart();
  
  const handleIncrement = () => {
    incrementQuantity(id);
  };
  
  const handleDecrement = () => {
    if (quantity === 1) {
      removeFromCart(id);
    } else {
      decrementQuantity(id);
    }
  };
  return <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Image */}
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-base font-medium text-gray-900 truncate">{name}</h4>
        <div className="mt-1 text-sm font-medium text-gray-900">{price}</div>
      </div>      {/* Quantity controls */}
      <div className="flex items-center gap-2">
        <button onClick={handleDecrement} className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center text-sm font-medium">{quantity}</span>
        <button onClick={handleIncrement} className="p-1 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {/* Remove button */}
      <button onClick={() => removeFromCart(id)} className="p-2 text-gray-400 hover:text-error-500 transition-colors" aria-label="Remove item">
        <Trash2Icon className="w-5 h-5" />
      </button>
    </div>;
};