import React, { memo, Component } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCartIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useScrollDirection } from '../hooks/useScrollDirection';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { UserMenuDropdown } from './ui/UserMenuDropdown';
const Header = () => {
  const {
    scrollDirection,
    isAtTop
  } = useScrollDirection();
  const {
    cartCount
  } = useCart();
  const {
    user
  } = useAuth();
  const location = useLocation();
  const isVisible = scrollDirection === 'up' || isAtTop;
  const headerBg = !isAtTop ? 'bg-white/95 backdrop-blur-lg shadow-md' : 'bg-transparent';
  const authRedirectUrl = `/auth?next=${encodeURIComponent(location.pathname)}`;
  return <header className={`
        sticky top-0 w-full z-50 
        transition-all duration-500 transform
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
        ${headerBg}
        ${isAtTop ? 'py-5' : 'py-3'}
      `} role="banner">
      <nav className="container mx-auto">
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center space-x-12">
            <Link to="/" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 text-xl font-semibold tracking-tight transition-colors">
              <span>Bumba</span>
            </Link>
            <div className="flex space-x-8">
              <Link to="/menu" className={`text-gray-700 hover:text-gray-900 transition-colors ${location.pathname === '/menu' ? 'text-primary-600' : ''}`}>
                Menu
              </Link>
              <Link to="/subscribe" className={`text-gray-700 hover:text-gray-900 transition-colors ${location.pathname === '/subscribe' ? 'text-primary-600' : ''}`}>
                Subscribe
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/cart" className="cart-icon p-2 text-gray-600 hover:text-primary-600 transition-all duration-200 relative group" aria-label="Shopping cart">
              <motion.div initial={false} animate={cartCount > 0 ? {
              scale: [1.2, 1]
            } : {}} transition={{
              type: 'spring',
              stiffness: 500,
              damping: 15
            }}>
                <ShoppingCartIcon className="h-5 w-5" />
                {cartCount > 0 && <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center bg-secondary-500 text-white text-[10px] font-semibold rounded-full">
                    {cartCount}
                  </span>}
              </motion.div>
            </Link>
            {user ? <UserMenuDropdown /> : <Link to={authRedirectUrl} className="px-6 py-2 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 rounded-full text-sm font-medium transition-all duration-300">
                Sign In
              </Link>}
          </div>
        </div>
      </nav>
    </header>;
};
export default memo(Header);