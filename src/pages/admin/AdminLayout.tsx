import React from 'react';
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  ShoppingBag, 
  Users, 
  UtensilsCrossed, 
  CalendarRange, 
  Settings, 
  LogOut,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/* 
 * CHANGE: Restructured admin layout to match MyAccountPageLayout styling
 * DATE: 22-06-2025
 */
const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Redirect if not admin
  if (!user || !user.isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  const navigation = [
    { name: 'Dashboard', to: '/admin', icon: LayoutGrid },
    { name: 'Orders', to: '/admin/orders', icon: ShoppingBag },
    { name: 'Customers', to: '/admin/customers', icon: Users },
    { name: 'Meal Management', to: '/admin/meals', icon: UtensilsCrossed },
    { name: 'Subscriptions', to: '/admin/subscriptions', icon: CalendarRange },
    { name: 'Nutrition Chat', to: '/admin/dietitian-messaging', icon: MessageCircle },
    { name: 'Settings', to: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar with sticky positioning */}
      <aside className="sticky top-32 h-[calc(100vh-8rem)] self-start w-64 bg-white border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-700 font-medium">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">Administrator</p>
            </div>
          </div>
        </div>
        
        <nav className="p-4 space-y-1">
          {navigation.map(item => (
            <NavLink 
              key={item.to} 
              to={item.to} 
              end={item.to === '/admin'} 
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 
                ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`
              }
            >
              <item.icon className={`w-5 h-5 mr-3 ${
                location.pathname === item.to ? 'text-primary-600' : 'text-gray-400'
              }`} />
              {item.name}
            </NavLink>
          ))}
          
          <button 
            onClick={logout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-150 mt-4"
          >
            <LogOut className="w-5 h-5 mr-3 text-gray-400" />
            Logout
          </button>
        </nav>
      </aside>
      
      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-8 px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;