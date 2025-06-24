import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, ShoppingCart } from 'lucide-react';
import { useAdminData } from '../../hooks/useAdminData';
import AdminPageHeader from '../../components/admin/ui/AdminPageHeader';
import AdminStatCard from '../../components/admin/ui/AdminStatCard';
import AdminCard from '../../components/admin/ui/AdminCard';

/* 
 * CHANGE: Enhanced admin dashboard using reusable components
 * DATE: 21-06-2025
 */
const AdminDashboard: React.FC = () => {
  const { stats } = useAdminData();
  const navigate = useNavigate();
  
  const statsConfig = [
    { 
      label: 'Customers', 
      value: 12,
      icon: Users, 
      changePositive: true 
    },
    { 
      label: 'Total no. Order', 
      value: 20,
      icon: ShoppingCart, 
      changePositive: true 
    },
    { 
      label: 'Average Order Value', 
      value: 57.935,
      icon: BarChart3, 
      changePositive: false 
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader 
        title="Dashboard" 
        description="Overview of your store's performance"
      />
        {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsConfig.map((stat, i) => (
          <AdminStatCard
            key={i}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            changePositive={stat.changePositive}
            loading={stats.isLoading}
          />
        ))}
      </div>
        {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AdminCard 
          title="Recent Orders" 
          className="lg:col-span-3"
          action={
            <button 
              onClick={() => navigate('/admin/orders')}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              View All
            </button>
          }
        >
          {stats.isLoading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-12 bg-gray-100 rounded"></div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              Order data visualization would go here
            </div>
          )}
        </AdminCard>
      </div>      {/* Additional Dashboard Widgets */}
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
              
              {/* Sample data points for revenue trend - aligned with months */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="70,160 110,140 150,120 190,100 230,80 270,90 310,70 350,60"
              />
              
              {/* Data points - properly aligned */}
              {[
                { x: 70, y: 0, label: 'Jan', value: '' },
                { x: 110, y: 0, label: 'Feb', value: '' },
                { x: 150, y: 0, label: 'Mar', value: '' },
                { x: 190, y: 0, label: 'Apr', value: '' },
                { x: 230, y: 0, label: 'May', value: '' },
                { x: 270, y: 150, label: 'Jun', value: '$300' },
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
              
              {/* Y-axis labels - properly positioned */}
              <text x="35" y="65" fontSize="12" fill="#6b7280" textAnchor="end">$</text>
              <text x="35" y="85" fontSize="12" fill="#6b7280" textAnchor="end">$</text>
              <text x="35" y="105" fontSize="12" fill="#6b7280" textAnchor="end">$</text>
              <text x="35" y="125" fontSize="12" fill="#6b7280" textAnchor="end">$</text>
              <text x="35" y="145" fontSize="12" fill="#6b7280" textAnchor="end">$</text>
              <text x="35" y="165" fontSize="12" fill="#6b7280" textAnchor="end">$</text>
              <text x="35" y="185" fontSize="12" fill="#6b7280" textAnchor="end">$</text>
              
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