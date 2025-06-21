import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, UserIcon, LayoutDashboardIcon, PackageIcon, SettingsIcon, LogOutIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
interface UserMenuDropdownProps {
  className?: string;
}
export const UserMenuDropdown = ({
  className = ''
}: UserMenuDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    user,
    logout
  } = useAuth();
  const navigate = useNavigate();  const menuItems = [{
    icon: LayoutDashboardIcon,
    label: 'Dashboard',
    href: '/account'
  }, {
    icon: PackageIcon,
    label: 'Order History',
    href: '/account/orders'
  }, {
    icon: SettingsIcon,
    label: 'Profile Settings',
    href: '/account/settings'
  }];
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleNavigate = (href: string) => {
    setIsOpen(false);
    navigate(href);
  };
  const handleLogout = () => {
    setIsOpen(false);
    logout();
  };
  if (!user) return null;
  return <div className={`relative ${className}`} ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200" aria-expanded={isOpen} aria-haspopup="true">
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
          <UserIcon className="w-4 h-4 text-primary-600" />
        </div>
        <span className="text-sm font-medium text-gray-700">
          Welcome, {user.firstName}
        </span>
        <motion.div animate={{
        rotate: isOpen ? 180 : 0
      }} transition={{
        duration: 0.2
      }}>
          <ChevronDownIcon className="w-4 h-4 text-gray-500" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && <motion.div initial={{
        opacity: 0,
        scale: 0.95,
        y: -10
      }} animate={{
        opacity: 1,
        scale: 1,
        y: 0
      }} exit={{
        opacity: 0,
        scale: 0.95,
        y: -10
      }} transition={{
        duration: 0.2,
        ease: 'easeOut'
      }} className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
            <div className="py-2">
              {menuItems.map(item => <button key={item.href} onClick={() => handleNavigate(item.href)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors duration-200">
                  <item.icon className="w-4 h-4 text-gray-400" />
                  <span>{item.label}</span>
                </button>)}
              <div className="h-px bg-gray-200 my-2" />
              <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-error-50 hover:text-error-600 flex items-center space-x-3 transition-colors duration-200 group">
                <LogOutIcon className="w-4 h-4 text-gray-400 group-hover:text-error-500" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>}
      </AnimatePresence>
    </div>;
};