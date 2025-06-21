import { motion } from 'framer-motion';
import { 
  UserIcon, 
  SettingsIcon, 
  ArrowRightIcon,
  LayoutDashboardIcon,
  PackageIcon 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const AccountPreferencesWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  // Use the same menu items as UserMenuDropdown for consistency
  const preferences = [
    {
      icon: LayoutDashboardIcon,
      title: 'Dashboard',
      description: 'View account overview',
      onClick: () => navigate('/account')
    },
    {
      icon: PackageIcon,
      title: 'Order History',
      description: 'Track your orders',
      onClick: () => navigate('/account/orders')
    },
    {
      icon: SettingsIcon,
      title: 'Profile Settings',
      description: 'Update personal information',
      onClick: () => navigate('/account/settings')
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 p-6 max-w-md mx-auto"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
          <UserIcon className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Account Preferences
          </h3>
          <p className="text-sm text-gray-600">
            Welcome back, {user.firstName}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {preferences.map((preference, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={preference.onClick}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-200 rounded-lg"
          >
            <preference.icon className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{preference.title}</span>
          </motion.button>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/account')}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          <span className="text-sm font-medium">View Full Dashboard</span>
          <ArrowRightIcon className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};
