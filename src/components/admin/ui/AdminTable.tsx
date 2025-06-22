import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* 
 * CHANGE: Created reusable admin table component with pagination
 * DATE: 21-06-2025
 */
interface Column {
  key: string;
  header: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

interface AdminTableProps {
  columns: Column[];
  data: any[];
  pagination?: PaginationProps;
  isLoading?: boolean;
}

const AdminTable: React.FC<AdminTableProps> = ({ 
  columns, 
  data,
  pagination,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-100"></div>
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-16 bg-gray-50 border-t border-gray-200"></div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(column => (
              <th 
                key={column.key} 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map(column => (
                <td key={`${rowIndex}-${column.key}`} className="px-6 py-4 whitespace-nowrap">
                  {column.render 
                    ? column.render(row[column.key], row)
                    : row[column.key]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {pagination && (
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{(pagination.currentPage - 1) * pagination.pageSize + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)}
            </span>{' '}
            of <span className="font-medium">{pagination.totalItems}</span> items
          </p>
          <div className="flex justify-center space-x-1">
            <button 
              className={`px-3 py-1 border border-gray-300 rounded-md text-sm ${
                pagination.currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(page => {
                // Show first page, last page, current page, and pages around current page
                const isFirstPage = page === 1;
                const isLastPage = page === pagination.totalPages;
                const isCurrentPage = page === pagination.currentPage;
                const isNearCurrentPage = 
                  Math.abs(page - pagination.currentPage) <= 1;
                
                return isFirstPage || isLastPage || isCurrentPage || isNearCurrentPage;
              })
              .map((page, i, filteredPages) => {
                // Add ellipsis between non-consecutive pages
                const prevPage = filteredPages[i - 1];
                const showEllipsis = prevPage && page - prevPage > 1;
                
                return (
                  <React.Fragment key={page}>
                    {showEllipsis && (
                      <span className="px-3 py-1 text-sm text-gray-500">...</span>
                    )}
                    <button 
                      className={`px-3 py-1 border rounded-md text-sm ${
                        page === pagination.currentPage 
                          ? 'bg-primary-600 text-white border-primary-600' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => pagination.onPageChange(page)}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}
            
            <button 
              className={`px-3 py-1 border border-gray-300 rounded-md text-sm ${
                pagination.currentPage >= pagination.totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= pagination.totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTable;