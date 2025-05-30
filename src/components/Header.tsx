import React, { useState } from 'react';
import { MenuIcon, X as XIcon, ShoppingCartIcon } from 'lucide-react';
import { useScrollDirection } from '../hooks/useScrollDirection';
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    scrollDirection,
    isAtTop
  } = useScrollDirection();
  const isVisible = scrollDirection === 'up' || isAtTop;
  const navItems = [{
    label: 'Home',
    href: '#'
  }, {
    label: 'Menu',
    href: '#meals'
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
  return <header className={`sticky top-0 w-full z-50 transition-all duration-500 transform ${isVisible ? 'translate-y-0' : '-translate-y-full'} ${!isAtTop ? 'bg-white/95 backdrop-blur-lg border-b border-gray-100 header-shadow py-3' : 'bg-transparent py-5'}`}>
      <nav className="container mx-auto">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center space-x-12">
            <a href="#" className="flex items-center space-x-2">
              <span className="text-primary-600 text-xl font-semibold tracking-tight hover:text-primary-700 transition-colors">
                Bumba
              </span>
            </a>
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map(item => <a key={item.label} href={item.href} className="nav-link text-gray-600 hover:text-gray-900 capitalize">
                  {item.label}
                </a>)}
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <button className="p-2 text-gray-600 hover:text-primary-600 transition-all duration-200 relative group" aria-label="Shopping cart">
              <ShoppingCartIcon className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center bg-secondary-500 text-white text-[10px] font-semibold rounded-full transition-transform duration-300 transform scale-100 group-hover:scale-110">
                2
              </span>
            </button>
            <button className="hidden md:flex px-6 py-2 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 rounded-full text-sm font-medium transition-all duration-300">
              Sign In
            </button>
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
              <MenuIcon className="h-6 w-6 text-gray-700" />
            </button>
          </div>
        </div>
      </nav>
      {/* Mobile menu with refined styling */}
      {isMenuOpen && <div className="md:hidden fixed inset-0 z-50 bg-white/98 backdrop-blur-lg animate-fade-in">
          <div className="p-4 flex justify-between items-center border-b border-gray-100">
            <a href="#" className="text-xl font-semibold text-primary-600 tracking-tight">
              Bumba
            </a>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Close menu">
              <XIcon className="h-6 w-6 text-gray-700" />
            </button>
          </div>
          <nav className="p-6">
            <ul className="space-y-4">
              {navItems.map(item => <li key={item.label}>
                  <a href={item.href} onClick={e => {
              e.preventDefault();
              const target = item.href.substring(1);
              document.querySelector(`#${target}`)?.scrollIntoView({
                behavior: 'smooth'
              });
              setIsMenuOpen(false);
            }} className="block py-2 text-lg font-medium text-gray-700 hover:text-primary-600 transition-colors">
                    {item.label}
                  </a>
                </li>)}
            </ul>
            <div className="mt-8 space-y-4">
              <button className="w-full px-6 py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 rounded-full font-medium transition-all duration-300">
                Sign In
              </button>
            </div>
          </nav>
        </div>}
    </header>;
};
export default Header;