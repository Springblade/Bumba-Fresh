import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Timeline } from '../ui/Timeline';
interface OrderDetailsProps {
  orderId: string;
}
interface Address {
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode: string;
}
export const OrderDetails = ({
  orderId
}: OrderDetailsProps) => {
  const navigate = useNavigate();
  // Mock data - replace with real data
  const order = {
    id: orderId,
    date: '2024-02-15',
    status: 'shipped',
    items: [{
      id: 1,
      name: 'Grilled Salmon Bowl',
      quantity: 2,
      price: 29.98,
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288'
    }],
    shipping: {
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105'
    },
    subtotal: 59.96,
    shipping_cost: 0,
    discount: 0,
    total: 59.96,
    timeline: [{
      status: 'Order Confirmed',
      date: '2024-02-15T10:00:00',
      completed: true
    }, {
      status: 'Preparing Meals',
      date: '2024-02-15T14:00:00',
      completed: true
    }, {
      status: 'Shipped',
      date: '2024-02-16T09:00:00',
      completed: true
    }, {
      status: 'Delivered',
      date: '2024-02-17T15:00:00',
      completed: false
    }]
  };
  return <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/account/orders')} className="text-gray-600">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Orders
        </Button>
      </div>
      {/* Order Timeline */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-6">Order Status</h2>
        <Timeline steps={order.timeline} />
      </div>
      {/* Order Items */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-6">Order Items</h2>
        <div className="divide-y divide-gray-200">
          {order.items.map(item => <div key={item.id} className="py-4 flex items-center">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
              <div className="ml-4 flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>
              <p className="font-medium">${item.price.toFixed(2)}</p>
            </div>)}
        </div>
      </div>
      {/* Order Details Grid */}
      <div className="grid grid-cols-2 gap-8">
        {/* Shipping Address */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
          <div className="text-gray-600">
            <p>{order.shipping.address}</p>
            <p>
              {order.shipping.city}, {order.shipping.state} {order.shipping.zip}
            </p>
          </div>
        </div>
        {/* Cost Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>
                {order.shipping_cost === 0 ? 'Free' : `$${order.shipping_cost.toFixed(2)}`}
              </span>
            </div>
            {order.discount > 0 && <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>}
            <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>;
};