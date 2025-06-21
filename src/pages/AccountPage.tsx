import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboardIcon, 
  UserIcon, 
  PackageIcon, 
  SettingsIcon, 
  ArrowLeftIcon 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AccountDashboard } from '../components/account/AccountDashboard';
import { ProfileSettings } from '../components/account/ProfileSettings';
import { OrderHistory } from '../components/account/OrderHistory';
import { SubscriptionManagement } from '../components/subscription/SubscriptionManagement';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboardIcon,
    component: AccountDashboard
  },
  {
    id: 'profile',
    label: 'Profile Settings',
    icon: UserIcon,
    component: ProfileSettings
  },
  {
    id: 'orders',
    label: 'Order History',
    icon: PackageIcon,
    component: OrderHistory
  },
  {
    id: 'subscription',
    label: 'Subscription',
    icon: SettingsIcon,
    component: SubscriptionManagement
  }
];

export const AccountPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current tab from URL params or default to dashboard
  const getCurrentTab = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('tab') || 'dashboard';
  };
  
  const [activeTab, setActiveTab] = useState(getCurrentTab());

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    navigate(`/account?tab=${tabId}`, { replace: true });
  };

  const currentTabData = navigationItems.find(item => item.id === activeTab) || navigationItems[0];
  const CurrentComponent = currentTabData.component;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Please log in to access your account.</p>
          <button 
            onClick={() => navigate('/auth')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to Home
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user.firstName}!</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${
                      activeTab === item.id ? 'text-primary-600' : 'text-gray-400'
                    }`} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl border border-gray-200 min-h-[600px]">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {currentTabData.label}
                  </h2>
                </div>
                
                {/* Render the current component */}
                <CurrentComponent />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
