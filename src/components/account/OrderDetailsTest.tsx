import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../ui/Button';

export const OrderDetailsTest = () => {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();

  console.log('OrderDetailsTest: Component rendered with orderId:', orderId);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Order Details Test Component</h1>
      <div className="bg-gray-100 p-4 rounded mb-4">
        <p><strong>Order ID from URL params:</strong> {orderId || 'Not provided'}</p>
        <p><strong>Current time:</strong> {new Date().toISOString()}</p>
        <p><strong>Component status:</strong> Rendered successfully</p>
      </div>
      
      <div className="space-y-4">
        <Button onClick={() => navigate('/account/orders')} variant="outline">
          Back to Orders
        </Button>
        
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-semibold text-blue-800">Debug Information:</h3>
          <pre className="text-sm mt-2 text-blue-700">
            {JSON.stringify({
              orderId,
              pathname: window.location.pathname,
              search: window.location.search,
              timestamp: Date.now()
            }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
