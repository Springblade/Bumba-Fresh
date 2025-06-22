import React from 'react';
import { Bell, Menu, Search } from 'lucide-react';
import { User } from '../../types/shared';

/* 
 * CHANGE: Fixed header overflow by adjusting position and width
 * DATE: 22-06-2025
 */
interface AdminHeaderProps {
  user: User | null;
  onMenuClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ user, onMenuClick }) => {
  return (
    <header className="fixed top-0 right-0 z-10 bg-white border-b border-gray-200 lg:pl-0 lg:left-64">
      <div className="h-16 px-4 md:px-6 lg:px-8 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={onMenuClick}
            className="p-1.5 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu size={22} />
          </button>
          
          <div className="hidden md:block relative w-64">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search size={18} />
            </div>
          </div>
        </div>
        
        {/* Right side */}
        <div className="flex items-center space-x-4">
          <button className="relative p-1.5 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none">
            <Bell size={22} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary-600 rounded-full"></span>
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="bg-primary-100 text-primary-800 h-9 w-9 rounded-full flex items-center justify-center font-medium">
              {user?.firstName?.charAt(0) || ''}{user?.lastName?.charAt(0) || ''}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-700">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;