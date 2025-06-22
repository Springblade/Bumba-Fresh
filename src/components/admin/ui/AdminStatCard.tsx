import React from 'react';
import { LucideIcon } from 'lucide-react';

/* 
 * CHANGE: Created reusable admin stat card component for dashboard metrics
 * DATE: 21-06-2025
 */
interface AdminStatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changePositive?: boolean;
  loading?: boolean;
}

const AdminStatCard: React.FC<AdminStatCardProps> = ({ 
  label, 
  value, 
  icon: Icon, 
  change, 
  changePositive = true,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
        <div className="flex justify-between items-start">
          <div className="rounded-lg p-3 bg-gray-100 w-12 h-12"></div>
          <div className="w-16 h-6 bg-gray-100 rounded-full"></div>
        </div>
        <div className="mt-4">
          <div className="h-4 w-20 bg-gray-100 rounded mb-2"></div>
          <div className="h-8 w-24 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="rounded-lg p-3 bg-primary-50">
          <Icon className="w-6 h-6 text-primary-600" />
        </div>
        {change && (
          <span 
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              changePositive 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}
          >
            {change}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
};

export default AdminStatCard;