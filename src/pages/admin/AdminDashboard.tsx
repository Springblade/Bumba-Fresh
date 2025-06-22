import React from 'react';
import { BarChart3, Users, ShoppingCart, DollarSign } from 'lucide-react';
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
  
  const statsConfig = [
    { 
      label: 'Total Revenue', 
      value: '$12,345', 
      icon: DollarSign, 
      change: '+12%',
      changePositive: true 
    },
    { 
      label: 'Active Customers', 
      value: '854', 
      icon: Users, 
      change: '+5%',
      changePositive: true 
    },
    { 
      label: 'Orders This Week', 
      value: '248', 
      icon: ShoppingCart, 
      change: '+18%',
      changePositive: true 
    },
    { 
      label: 'Average Order Value', 
      value: '$54.67', 
      icon: BarChart3, 
      change: '-2%',
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat, i) => (
          <AdminStatCard
            key={i}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            changePositive={stat.changePositive}
            loading={stats.isLoading}
          />
        ))}
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AdminCard 
          title="Recent Orders" 
          className="lg:col-span-2"
          action={
            <button className="text-sm text-primary-600 hover:text-primary-700">
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
        
        <AdminCard 
          title="Top Selling Meals"
          action={
            <button className="text-sm text-primary-600 hover:text-primary-700">
              View All
            </button>
          }
        >
          {stats.isLoading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-100 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 w-3/4 bg-gray-100 rounded mb-2"></div>
                    <div className="h-3 w-1/2 bg-gray-100 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-center py-8">
              Meal popularity data would go here
            </div>
          )}
        </AdminCard>
      </div>
      
      {/* Additional Dashboard Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdminCard title="Revenue Over Time">
          <div className="h-64 flex items-center justify-center text-gray-500">
            Revenue chart would go here
          </div>
        </AdminCard>
        
        <AdminCard title="Customer Growth">
          <div className="h-64 flex items-center justify-center text-gray-500">
            Customer growth chart would go here
          </div>
        </AdminCard>
      </div>
    </div>
  );
};

export default AdminDashboard;