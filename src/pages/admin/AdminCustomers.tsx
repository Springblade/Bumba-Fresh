import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useAdminData, usePagination } from '../../hooks/useAdminData';

/* 
 * CHANGE: Created admin customers management page
 * DATE: 21-06-2025
 * CHANGE: Updated to use real API data from backend
 * DATE: 25-06-2025
 * CHANGE: Added functional pagination with usePagination hook
 * DATE: 25-06-2025
 */
const AdminCustomers: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { customers } = useAdminData();
  
  // Filter customers based on subscription status
  const statusFilteredCustomers = selectedFilter === 'all' 
    ? (customers.data || [])
    : selectedFilter === 'subscribed' 
      ? (customers.data || []).filter(customer => customer.subscribed)
      : (customers.data || []).filter(customer => !customer.subscribed);

  // Filter customers based on search term
  const filteredCustomers = statusFilteredCustomers.filter(customer => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      customer.firstName.toLowerCase().includes(search) ||
      customer.lastName.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search) ||
      `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(search)
    );
  });

  // Use pagination hook with 10 items per page
  const pagination = usePagination(filteredCustomers, 10);

  return (    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
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
      {customers.isLoading ? (
        <div className="bg-white rounded-lg shadow p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : customers.error ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-red-600 mb-2">Failed to load customers</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-primary-600 underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow"><table className="min-w-full divide-y divide-gray-200">
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
          <tbody className="bg-white divide-y divide-gray-200">            {pagination.currentData.map(customer => (
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
            ))}          </tbody>
        </table>
      </div>
      )}
        {/* Pagination */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{pagination.startIndex}</span> to <span className="font-medium">{pagination.endIndex}</span> of{' '}
          <span className="font-medium">{pagination.totalItems}</span> customers
        </p>
        <div className="flex justify-center space-x-1">
          <button 
            onClick={pagination.goToPrevious}
            disabled={!pagination.hasPrevious}
            className={`px-3 py-1 border border-gray-300 rounded-md text-sm ${
              pagination.hasPrevious 
                ? 'hover:bg-gray-50 text-gray-700' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            Previous
          </button>
          
          {/* Generate page number buttons */}
          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === pagination.currentPage;
            
            return (
              <button
                key={pageNum}
                onClick={() => pagination.goToPage(pageNum)}
                className={`px-3 py-1 border rounded-md text-sm ${
                  isActive
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button 
            onClick={pagination.goToNext}
            disabled={!pagination.hasNext}
            className={`px-3 py-1 border border-gray-300 rounded-md text-sm ${
              pagination.hasNext 
                ? 'hover:bg-gray-50 text-gray-700' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomers;