import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutGrid, 
  ShoppingBag, 
  Users, 
  UtensilsCrossed, 
  Settings, 
  LogOut, 
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/* 
 * CHANGE: Removed duplicate footer from sidebar
 * DATE: 22-06-2025
 * CHANGE: Removed Subscriptions navigation item (component removed)
 * DATE: 25-06-2025
 */
interface AdminSidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
  collapsed = false,
  onToggle 
}) => {
  const { logout } = useAuth();
    const navItems = [
    { name: 'Dashboard', icon: <LayoutGrid size={20} />, path: '/admin' },
    { name: 'Orders', icon: <ShoppingBag size={20} />, path: '/admin/orders' },
    { name: 'Customers', icon: <Users size={20} />, path: '/admin/customers' },
    { name: 'Meal Management', icon: <UtensilsCrossed size={20} />, path: '/admin/meals' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' }
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header with logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        <NavLink to="/" className="flex items-center">
          <span className="text-xl font-semibold text-primary-600">Bumba Fresh</span>
        </NavLink>
        
        {onToggle && (
          <button 
            onClick={onToggle}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>
      
      {/* Navigation links */}
      <nav className="flex-1 overflow-y-auto pt-5 pb-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) => `
                  flex items-center px-3 py-2.5 rounded-md text-sm font-medium
                  ${isActive 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
                `}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Logout button - NO FOOTER HERE */}
      <div className="px-4 py-3 border-t border-gray-200">
        <button 
          onClick={() => logout()}
          className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
        >
          <LogOut size={20} className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;