import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { AdminCustomer } from '../../types/shared';

/* 
 * CHANGE: Created admin customers management page
 * DATE: 21-06-2025
 */
const AdminCustomers: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Mock data - would come from API
  const customers: AdminCustomer[] = [
    { 
      id: '1', 
      firstName: 'John',
      lastName: 'Smith',
      email: 'john@example.com',
      subscribed: true,
      ordersCount: 12,
      joinedDate: '10-03-2025'
    },
    { 
      id: '2', 
      firstName: 'Emma',
      lastName: 'Wilson',
      email: 'emma@example.com',
      subscribed: true,
      ordersCount: 8,
      joinedDate: '15-04-2025'
    },
    { 
      id: '3', 
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael@example.com',
      subscribed: false,
      ordersCount: 3,
      joinedDate: '22-05-2025'
    },
    { 
      id: '4', 
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah@example.com',
      subscribed: false,
      ordersCount: 1,
      joinedDate: '05-06-2025'
    },
    { 
      id: '5', 
      firstName: 'Robert',
      lastName: 'Davis',
      email: 'robert@example.com',
      subscribed: true,
      ordersCount: 5,
      joinedDate: '12-05-2025'
    },
  ];

  const filteredCustomers = selectedFilter === 'all' 
    ? customers 
    : selectedFilter === 'subscribed' 
      ? customers.filter(customer => customer.subscribed)
      : customers.filter(customer => !customer.subscribed);

  return (    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search customers..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>
        
        <select 
          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          value={selectedFilter}
          onChange={e => setSelectedFilter(e.target.value)}
        >
          <option value="all">All Customers</option>
          <option value="subscribed">Subscribers</option>
          <option value="non-subscribed">Non-Subscribers</option>
        </select>
      </div>
      
      {/* Customers table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">            {filteredCustomers.map(customer => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{customer.firstName} {customer.lastName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{customer.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">{customer.joinedDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-gray-500">{customer.ordersCount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {customer.subscribed ? (
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Subscribed
                    </span>
                  ) : (
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      Non-Subscriber
                    </span>
                  )}
                </td>                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
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
          Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
          <span className="font-medium">25</span> customers
        </p>
        <div className="flex justify-center space-x-1">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">Previous</button>
          <button className="px-3 py-1 bg-primary-600 text-white border border-primary-600 rounded-md text-sm">1</button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">2</button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">3</button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">Next</button>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;