import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight as ChevronRightIcon, UtensilsIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';
interface Order {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: number;
}
const statusStyles: Record<OrderStatus, {
  bg: string;
  text: string;
  label: string;
}> = {
  processing: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    label: 'Processing'
  },
  shipped: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    label: 'Shipped'
  },
  delivered: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    label: 'Delivered'
  },
  cancelled: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    label: 'Cancelled'
  }
};
// Mock data - replace with real data
const orders: Order[] = [{
  id: 'BUMBA-12345',
  date: '2024-02-15',
  total: 89.97,
  status: 'delivered',
  items: 3
}, {
  id: 'BUMBA-12346',
  date: 'processing',
  total: 59.98,
  status: 'processing',
  items: 2
}];
export const OrderHistory = () => {
  const navigate = useNavigate();
  if (orders.length === 0) {
    return <EmptyState icon={<UtensilsIcon className="w-12 h-12" />} title="No orders yet" description="You haven't placed any orders yet. Start exploring our delicious meals!" action={<Button onClick={() => navigate('/menu')} size="lg">
            Start Shopping
          </Button>} />;
  }
  return <div className="space-y-4">
      {orders.map(order => <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">{order.id}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-sm text-gray-500">Date Placed</p>
              <p className="font-medium">
                {new Date(order.date).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-medium">${order.total.toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Status</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                  ${statusStyles[order.status].bg} 
                  ${statusStyles[order.status].text}
                `}>
                {statusStyles[order.status].label}
              </span>
            </div>
            <Button onClick={() => navigate(`/account/orders/${order.id}`)} variant="outline" className="ml-4">
              View Details
              <ChevronRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>)}
    </div>;
};