import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard as DashboardIcon, Package as PackageIcon, RefreshCw as SubscriptionIcon, Settings as SettingsIcon, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
const navigation = [{
  name: 'Dashboard',
  to: '/account',
  icon: DashboardIcon
}, {
  name: 'Order History',
  to: '/account/orders',
  icon: PackageIcon
}, {
  name: 'My Subscription',
  to: '/account/subscription',
  icon: SubscriptionIcon
}, {
  name: 'Profile Settings',
  to: '/account/settings',
  icon: SettingsIcon
}];
export const MyAccountPageLayout = () => {
  const {
    user
  } = useAuth();
  const location = useLocation();
  return <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar with sticky positioning */}
      <aside className="sticky top-32 h-[calc(100vh-8rem)] self-start w-64 bg-white border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          {navigation.map(item => <NavLink key={item.to} to={item.to} end={item.to === '/account'} className={({
          isActive
        }) => `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 
                ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}>
              <item.icon className={`w-5 h-5 mr-3 ${location.pathname === item.to ? 'text-primary-600' : 'text-gray-400'}`} />
              {item.name}
            </NavLink>)}
        </nav>
      </aside>
      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-8 px-8">
          <Outlet />
        </div>
      </main>
    </div>;
};