import React, { useState } from 'react';
import { Search, Check, Clock, Truck, X } from 'lucide-react';
import { useAdminData, usePagination } from '../../hooks/useAdminData';

/* 
 * CHANGE: Created admin orders management page
 * DATE: 21-06-2025
 * CHANGE: Updated to use real API data from backend
 * DATE: 25-06-2025
 */
const AdminOrders: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { orders } = useAdminData({ status: filterStatus !== 'all' ? filterStatus : undefined });

  // Filter orders based on search term
  const filteredOrders = (orders.data || []).filter(order => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      order.id.toString().includes(search) ||
      order.customer.toLowerCase().includes(search) ||
      order.email.toLowerCase().includes(search)
    );
  });

  // Use pagination hook with 10 items per page
  const pagination = usePagination(filteredOrders, 10);

  // Status badge component
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'delivered':
        return (
          <span className="px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            <Check size={14} className="mr-1" /> Delivered
          </span>
        );
      case 'processing':
        return (
          <span className="px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            <Clock size={14} className="mr-1" /> Processing
          </span>
        );
      case 'shipped':
        return (
          <span className="px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            <Truck size={14} className="mr-1" /> Shipped
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            <X size={14} className="mr-1" /> Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-64 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>
        
        <select 
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
        >
          <option value="all">All Statuses</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      
      {/* Orders table */}
      {orders.isLoading ? (
        <div className="bg-white rounded-lg shadow p-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : orders.error ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-error-600 mb-2">Failed to load orders</p>
          <button 
            onClick={() => window.location.reload()}
            className="text-primary-600 underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pagination.currentData.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-primary-600">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{order.customer}</div>
                    <div className="text-gray-500 text-sm">{order.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{order.items} items</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{order.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(order.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Pagination */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">{pagination.startIndex}</span> to <span className="font-medium">{pagination.endIndex}</span> of{' '}
          <span className="font-medium">{pagination.totalItems}</span> orders
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

export default AdminOrders;