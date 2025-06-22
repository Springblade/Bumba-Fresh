import React, { useState } from 'react';
import { Search, Filter, Calendar, Tag, User, Clock } from 'lucide-react';

/* 
 * CHANGE: Created admin subscriptions management page
 * DATE: 21-06-2025
 */
const AdminSubscriptions: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState('all');
  
  // Mock data - would come from API
  const subscriptions = [
    { 
      id: 'SUB-1001', 
      customer: 'John Smith', 
      email: 'john@example.com',
      plan: 'Family Plan', 
      status: 'active',
      nextDelivery: '25-06-2025',
      mealsPerWeek: 12,
      started: '10-03-2025'
    },
    { 
      id: 'SUB-1002', 
      customer: 'Emma Wilson', 
      email: 'emma@example.com',
      plan: 'Individual Plan', 
      status: 'paused',
      nextDelivery: 'Paused',
      mealsPerWeek: 5,
      started: '15-04-2025'
    },
    { 
      id: 'SUB-1003', 
      customer: 'Michael Brown', 
      email: 'michael@example.com',
      plan: 'Couple Plan', 
      status: 'active',
      nextDelivery: '23-06-2025',
      mealsPerWeek: 8,
      started: '22-05-2025'
    },
    { 
      id: 'SUB-1004', 
      customer: 'Sarah Johnson', 
      email: 'sarah@example.com',
      plan: 'Individual Plan', 
      status: 'cancelled',
      nextDelivery: 'Cancelled',
      mealsPerWeek: 5,
      started: '05-01-2025'
    },
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Active
          </span>
        );
      case 'paused':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Paused
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const filteredSubscriptions = selectedPlan === 'all' 
    ? subscriptions 
    : subscriptions.filter(sub => 
        sub.plan.toLowerCase().includes(selectedPlan.toLowerCase())
      );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Subscription Management</h1>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">
          New Subscription
        </button>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search subscriptions..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>
        
        <select 
          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          value={selectedPlan}
          onChange={e => setSelectedPlan(e.target.value)}
        >
          <option value="all">All Plans</option>
          <option value="individual">Individual Plan</option>
          <option value="couple">Couple Plan</option>
          <option value="family">Family Plan</option>
        </select>
        
        <button className="px-3 py-2 border border-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-50">
          <Filter className="w-5 h-5" />
          <span className="hidden sm:inline">More Filters</span>
        </button>
      </div>
      
      {/* Subscriptions table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Started</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meals/Week</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Delivery</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSubscriptions.map(subscription => (
              <tr key={subscription.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-primary-600">{subscription.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{subscription.customer}</div>
                  <div className="text-gray-500 text-sm">{subscription.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Tag size={16} className="text-gray-400 mr-2" />
                    <span className="text-gray-700">{subscription.plan}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar size={16} className="text-gray-400 mr-2" />
                    <span className="text-gray-700">{subscription.started}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-gray-700">{subscription.mealsPerWeek}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Clock size={16} className="text-gray-400 mr-2" />
                    <span className="text-gray-700">{subscription.nextDelivery}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(subscription.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-2">
                    <button className="text-primary-600 hover:text-primary-900">Edit</button>
                    <button className="text-gray-600 hover:text-gray-900">Details</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of{' '}
          <span className="font-medium">4</span> subscriptions
        </p>
        <div className="flex justify-center space-x-1">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50" disabled>Previous</button>
          <button className="px-3 py-1 bg-primary-600 text-white border border-primary-600 rounded-md text-sm">1</button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50" disabled>Next</button>
        </div>
      </div>
    </div>
  );
};

export default AdminSubscriptions;