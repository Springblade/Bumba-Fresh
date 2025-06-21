import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MenuIcon, X as XIcon, ShoppingCartIcon } from 'lucide-react';
import { useScrollDirection } from '../hooks/useScrollDirection';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { UserMenuDropdown } from './ui/UserMenuDropdown';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const {
    scrollDirection,
    isAtTop
  } = useScrollDirection();
  const {
    cartCount
  } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isVisible = scrollDirection === 'up' || isAtTop;

  // Animate cart icon when items are added
  useEffect(() => {
    if (cartCount > 0) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 600);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);
  // Base navigation items that appear on all pages
  const baseNavItems = [{
    label: 'Home',
    href: '/'
  }, {
    label: 'Menu',
    href: '/menu'
  }, {
    label: 'How It Works',
    href: '#how-it-works'
  }, {
    label: 'Pricing',
    href: '#pricing'
  }, {
    label: 'Testimonials',
    href: '#testimonials'
  }, {
    label: 'Blog',
    href: '#insights'
  }];
  const handleNavClick = (href: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (href.startsWith('#')) {
      if (location.pathname === '/') {
        // If we're on homepage, just scroll to the section
        document.querySelector(href)?.scrollIntoView({
          behavior: 'smooth'
        });
      } else {
        // If we're not on homepage, navigate to home and then scroll
        navigate('/' + href);
      }
    } else {
      navigate(href);
    }
    setIsMenuOpen(false);
  };
  return <header className={`sticky top-0 w-full z-50 transition-all duration-500 transform ${isVisible ? 'translate-y-0' : '-translate-y-full'} ${!isAtTop ? 'bg-white/95 backdrop-blur-lg border-b border-gray-100 header-shadow py-3' : 'bg-transparent py-5'}`}>
      <nav className="container mx-auto">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center space-x-12">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-primary-600 text-xl font-semibold tracking-tight hover:text-primary-700 transition-colors">
                Bumba
              </span>
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              {baseNavItems.map(item => <Link key={item.label} to={item.href} onClick={e => handleNavClick(item.href, e)} className={`nav-link text-gray-600 hover:text-gray-900 capitalize ${location.pathname === item.href ? 'active' : ''}`}>
                  {item.label}
                </Link>)}
            </div>
          </div>          <div className="flex items-center space-x-6">            <Link to="/cart" className={`cart-icon p-2 text-gray-600 hover:text-primary-600 transition-all duration-200 relative group ${cartBounce ? 'animate-bounce' : ''}`} aria-label="Shopping cart">
              <ShoppingCartIcon className="h-5 w-5" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center bg-secondary-500 text-white text-[10px] font-semibold rounded-full transition-transform duration-300 transform scale-100 group-hover:scale-110 animate-pulse">
                  {cartCount}
                </span>}
            </Link>
              {user ? (
              <UserMenuDropdown className="hidden md:block" />
            ) : (
              <Link to="/auth" className="hidden md:flex px-6 py-2 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 rounded-full text-sm font-medium transition-all duration-300">
                Sign In
              </Link>
            )}
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
              <MenuIcon className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>
      </nav>
      {/* Mobile menu with refined styling */}
      {isMenuOpen && <div className="md:hidden fixed inset-0 z-50 bg-white/98 backdrop-blur-lg animate-fade-in">
          <div className="p-4 flex justify-between items-center border-b border-gray-100">
            <Link to="/" className="text-xl font-semibold text-primary-600 tracking-tight" onClick={() => setIsMenuOpen(false)}>
              Bumba
            </Link>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Close menu">
              <XIcon className="h-6 w-6 text-gray-700" />
            </button>
          </div>
          <nav className="p-6">
            <ul className="space-y-4">
              {baseNavItems.map(item => <li key={item.label}>
                  <Link to={item.href} onClick={e => handleNavClick(item.href, e)} className={`block py-2 text-lg font-medium text-gray-700 hover:text-primary-600 transition-colors ${location.pathname === item.href ? 'text-primary-600' : ''}`}>
                    {item.label}
                  </Link>
                </li>)}
            </ul>            <div className="mt-8 space-y-4">
              {user ? (
                <UserMenuDropdown className="md:hidden" />
              ) : (
                <Link to="/auth" className="w-full px-6 py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 rounded-full font-medium transition-all duration-300" onClick={() => setIsMenuOpen(false)}>
                  Sign In
                </Link>
              )}
            </div>
          </nav>
        </div>}
    </header>;
};
export default Header;