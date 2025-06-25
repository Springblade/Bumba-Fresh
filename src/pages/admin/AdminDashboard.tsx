import React from 'react';
import { BarChart3, Users, ShoppingCart } from 'lucide-react';
import { useAdminData } from '../../hooks/useAdminData';
import AdminPageHeader from '../../components/admin/ui/AdminPageHeader';
import AdminStatCard from '../../components/admin/ui/AdminStatCard';
import AdminCard from '../../components/admin/ui/AdminCard';

/* 
 * CHANGE: Enhanced admin dashboard using reusable components
 * DATE: 21-06-2025
 * CHANGE: Updated to use real API data instead of hardcoded values
 * DATE: 25-06-2025
 * CHANGE: Updated graph to show Jan-May as $0 and June as totalRevenue from database
 * DATE: 25-06-2025
 */
const AdminDashboard: React.FC = () => {
  const { stats } = useAdminData();
  
  // Debug logging to see what we're getting from the API
  console.log('🎯 AdminDashboard - stats object:', stats);
  console.log('🎯 AdminDashboard - stats.data:', stats.data);
  console.log('🎯 AdminDashboard - stats.isLoading:', stats.isLoading);
  console.log('🎯 AdminDashboard - stats.error:', stats.error);
  
  /* 
   * CHANGE: Updated to use real API data instead of hardcoded values
   * DATE: 25-06-2025
   */
  const statsConfig = [
    { 
      label: 'Customers', 
      value: stats.data?.activeCustomers || 0,
      icon: Users, 
      change: stats.data?.percentChange?.customers ? `${stats.data.percentChange.customers > 0 ? '+' : ''}${stats.data.percentChange.customers}%` : undefined,
      changePositive: (stats.data?.percentChange?.customers || 0) > 0
    },
    { 
      label: 'Total no. Order', 
      value: stats.data?.ordersThisWeek || 0,
      icon: ShoppingCart, 
      change: stats.data?.percentChange?.orders ? `${stats.data.percentChange.orders > 0 ? '+' : ''}${stats.data.percentChange.orders}%` : undefined,
      changePositive: (stats.data?.percentChange?.orders || 0) > 0
    },
    { 
      label: 'Average Order Value', 
      value: stats.data?.averageOrderValue ? `$${stats.data.averageOrderValue.toFixed(2)}` : '$0.00',
      icon: BarChart3, 
      change: stats.data?.percentChange?.averageOrder ? `${stats.data.percentChange.averageOrder > 0 ? '+' : ''}${stats.data.percentChange.averageOrder}%` : undefined,
      changePositive: (stats.data?.percentChange?.averageOrder || 0) > 0
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Dashboard" 
        description="Overview of your store's performance"
      />
        {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">        {statsConfig.map((stat, i) => (
          <AdminStatCard
            key={i}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            changePositive={stat.changePositive}
            loading={stats.isLoading}
          />
        ))}</div>
      {/* Additional Dashboard Widgets */}
      <div className="grid grid-cols-1 gap-6">        <AdminCard title="Revenue Over Time">
          <div className="h-64 p-4">
            {/* Simple SVG chart placeholder */}
            <svg className="w-full h-full" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid meet">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect x="40" y="20" width="340" height="160" fill="url(#grid)" />
              
              {/* Chart area background */}
              <rect x="40" y="20" width="340" height="160" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
              
              {/* Sample data points for revenue trend - Jan to May: 0, Jun: totalRevenue */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="70,180 110,180 150,180 190,180 230,180 270,60"
              />
              
              {/* Data points - properly aligned */}
              {[
                { x: 70, y: 180, label: 'Jan', value: '$0' },
                { x: 110, y: 180, label: 'Feb', value: '$0' },
                { x: 150, y: 180, label: 'Mar', value: '$0' },
                { x: 190, y: 180, label: 'Apr', value: '$0' },
                { x: 230, y: 180, label: 'May', value: '$0' },
                { x: 270, y: 60, label: 'Jun', value: `$${stats.data?.totalRevenue?.toFixed(2) || '0.00'}` },
              ].map((point, index) => (
                <g key={index}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="#10b981"
                    className="hover:fill-emerald-600"
                  />
                  {/* Tooltip on hover */}
                  <title>{point.label}: {point.value}</title>
                </g>
              ))}
              
              {/* X-axis labels - properly aligned with data points */}
              <text x="70" y="205" fontSize="12" fill="#6b7280" textAnchor="middle">Jan</text>
              <text x="110" y="205" fontSize="12" fill="#6b7280" textAnchor="middle">Feb</text>
              <text x="150" y="205" fontSize="12" fill="#6b7280" textAnchor="middle">Mar</text>
              <text x="190" y="205" fontSize="12" fill="#6b7280" textAnchor="middle">Apr</text>
              <text x="230" y="205" fontSize="12" fill="#6b7280" textAnchor="middle">May</text>
              <text x="270" y="205" fontSize="12" fill="#6b7280" textAnchor="middle">Jun</text>
              
              {/* Y-axis labels - showing revenue scale */}
              <text x="35" y="65" fontSize="12" fill="#6b7280" textAnchor="end">${Math.round((stats.data?.totalRevenue || 0) * 0.9)}</text>
              <text x="35" y="85" fontSize="12" fill="#6b7280" textAnchor="end">${Math.round((stats.data?.totalRevenue || 0) * 0.8)}</text>
              <text x="35" y="105" fontSize="12" fill="#6b7280" textAnchor="end">${Math.round((stats.data?.totalRevenue || 0) * 0.7)}</text>
              <text x="35" y="125" fontSize="12" fill="#6b7280" textAnchor="end">${Math.round((stats.data?.totalRevenue || 0) * 0.5)}</text>
              <text x="35" y="145" fontSize="12" fill="#6b7280" textAnchor="end">${Math.round((stats.data?.totalRevenue || 0) * 0.3)}</text>
              <text x="35" y="165" fontSize="12" fill="#6b7280" textAnchor="end">${Math.round((stats.data?.totalRevenue || 0) * 0.1)}</text>
              <text x="35" y="185" fontSize="12" fill="#6b7280" textAnchor="end">$0</text>
              
              {/* X and Y axis lines */}
              <line x1="40" y1="180" x2="380" y2="180" stroke="#d1d5db" strokeWidth="1"/>
              <line x1="40" y1="20" x2="40" y2="180" stroke="#d1d5db" strokeWidth="1"/>
            </svg>
          </div>
        </AdminCard>
      </div>
    </div>
  );
};

export default AdminDashboard;