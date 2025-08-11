import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../context/Store';
import { useWishlist } from '../context/WishlistContext';
import SearchBox from './SearchBox.jsx';
import Button from './Button.jsx';
import DarkModeToggle from './DarkModeToggle.jsx';
import AnnouncementBar from './AnnouncementBar.jsx';

const Header = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoutHandler = () => {
    ctxDispatch({ type: 'USER_LOGOUT' });
    setIsProfileDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const handleMobileSearch = () => {
    setIsMobileMenuOpen(false);
  };

  const cartItemCount = cart.cartItems.reduce((a, c) => a + c.qty, 0);

  const navigation = [
    { name: 'Home', href: '/', icon: '🏠', current: true },
    { name: 'Categories', href: '/categories', icon: '📂', current: false },
    { name: 'Deals', href: '/deals', icon: '🔥', current: false, badge: 'Hot' },
    { name: 'New Arrivals', href: '/new', icon: '✨', current: false, badge: 'New' },
    { name: 'Support', href: '/support', icon: '💬', current: false },
  ];

  const quickCategories = [
    { name: 'Electronics', href: '/category/electronics', icon: '📱' },
    { name: 'Fashion', href: '/category/fashion', icon: '👕' },
    { name: 'Home & Garden', href: '/category/home', icon: '🏠' },
    { name: 'Sports', href: '/category/sports', icon: '⚽' },
    { name: 'Books', href: '/category/books', icon: '📚' },
    { name: 'Beauty', href: '/category/beauty', icon: '💄' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/85 dark:bg-gray-900/85 backdrop-blur-xl shadow-modern-xl border-b border-gray-200/50 dark:border-gray-700/50' 
          : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-modern'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
        <div className="flex justify-between items-center h-16 lg:h-20 xl:h-24">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="flex items-center gap-3 group"
              onClick={() => { setIsMobileMenuOpen(false); setIsProfileDropdownOpen(false); }}
            >
              <div className="relative">
                <div className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transform transition-all duration-300 shadow-lg shadow-primary-500/30">
                  <svg className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="absolute -inset-0.5 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-2xl opacity-0 group-hover:opacity-50 blur transition-all duration-300"></div>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent font-serif">
                MERN
              </span>
              <span className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800 dark:text-gray-100 font-serif">
                -Shop
              </span>
              </div>
            </Link>
          </div>

          {/* Desktop SearchBox - Made Larger */}
          <div className="hidden md:flex flex-1 max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-4 lg:mx-8 xl:mx-12">
            <div className="w-full relative">
              <SearchBox />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
            {/* Notifications */}
            <div className="relative p-2.5 lg:p-3 rounded-xl hover:bg-gradient-to-br hover:from-orange-50 hover:to-yellow-50 dark:hover:from-orange-900/20 dark:hover:to-yellow-900/20 transition-all duration-300 group border border-transparent hover:border-orange-200 dark:hover:border-orange-700/50 cursor-pointer">
              <svg className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600 dark:text-gray-200 group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5-5v-5a5.99 5.99 0 00-6-6 5.99 5.99 0 00-6 6v5l-5 5h5m0 0v1a3 3 0 006 0v-1m-3-10h.01" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold rounded-full h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center animate-pulse shadow-lg text-[10px]">
                3
              </span>
            </div>

            {/* Dark Mode Toggle */}
            <div className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300">
              <DarkModeToggle size="sm" />
            </div>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2.5 lg:p-3 rounded-xl hover:bg-gradient-to-br hover:from-pink-50 hover:to-purple-50 dark:hover:from-pink-900/20 dark:hover:to-purple-900/20 transition-all duration-300 group border border-transparent hover:border-pink-200 dark:hover:border-pink-700/50"
            >
              <svg className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600 dark:text-gray-200 group-hover:text-pink-600 dark:group-hover:text-pink-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full h-5 w-5 lg:h-6 lg:w-6 flex items-center justify-center animate-pulse shadow-lg">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2.5 lg:p-3 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 transition-all duration-300 group border border-transparent hover:border-blue-200 dark:hover:border-blue-700/50"
            >
              <svg className="w-5 h-5 lg:w-6 lg:h-6 text-gray-600 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cart.cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold rounded-full h-5 w-5 lg:h-6 lg:w-6 flex items-center justify-center animate-bounce shadow-lg">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {userInfo ? (
              <div
                className="relative"
                onMouseEnter={() => setIsProfileDropdownOpen(true)}
                onMouseLeave={() => setIsProfileDropdownOpen(false)}
              >
                <button
                  className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/20 dark:hover:to-secondary-900/20 transition-all duration-300 group border border-transparent hover:border-primary-200 dark:hover:border-primary-700/50"
                >
                  <div className="relative">
                    <div className="w-8 h-8 lg:w-9 lg:h-9 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-sm lg:text-base shadow-lg">
                      {userInfo.name?.charAt(0) || 'U'}
                    </div>
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full opacity-0 group-hover:opacity-30 blur transition-all duration-300"></div>
                  </div>
                  <span className="text-gray-700 dark:text-gray-100 font-semibold text-sm lg:text-base group-hover:text-primary-600 dark:group-hover:text-primary-300 transition-colors hidden lg:block max-w-24 truncate">
                    {userInfo.name}
                  </span>
                  <svg className="w-4 h-4 text-gray-400 group-hover:text-primary-500 transition-all duration-300 transform group-hover:rotate-180 hidden lg:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  className={`absolute right-0 mt-3 w-72 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 py-3 transition-all duration-300 transform ${
                    isProfileDropdownOpen ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible -translate-y-4 scale-95'
                  }`}
                >
                  <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                        {userInfo.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-gray-50">{userInfo.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-300">{userInfo.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-5 py-3 text-gray-700 dark:text-gray-100 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 dark:hover:from-primary-900/30 dark:hover:to-primary-800/30 hover:text-primary-700 dark:hover:text-primary-200 transition-all duration-200 mx-2 rounded-xl"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile Settings
                    </Link>
                    <Link
                      to="/myorders"
                      className="flex items-center gap-3 px-5 py-3 text-gray-700 dark:text-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 dark:hover:from-blue-900/30 dark:hover:to-blue-800/30 hover:text-blue-700 dark:hover:text-blue-200 transition-all duration-200 mx-2 rounded-xl"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      My Orders
                    </Link>
                    <Link
                      to="/wishlist"
                      className="flex items-center gap-3 px-5 py-3 text-gray-700 dark:text-gray-100 hover:bg-gradient-to-r hover:from-pink-50 hover:to-pink-100 dark:hover:from-pink-900/30 dark:hover:to-pink-800/30 hover:text-pink-700 dark:hover:text-pink-200 transition-all duration-200 mx-2 rounded-xl"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Wishlist
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-700 pt-2">
                    <button
                      onClick={logoutHandler}
                      className="flex items-center gap-3 w-full px-5 py-3 text-red-600 dark:text-red-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/30 dark:hover:to-red-800/30 transition-all duration-200 mx-2 rounded-xl"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="px-4 lg:px-6 py-2 lg:py-2.5 text-sm lg:text-base font-semibold">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" className="px-4 lg:px-6 py-2 lg:py-2.5 text-sm lg:text-base font-semibold bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 shadow-lg hover:shadow-xl">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Dark Mode Toggle */}
            <DarkModeToggle />

            {/* Mobile Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cart.cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`bg-gray-700 dark:bg-gray-100 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
                <span className={`bg-gray-700 dark:bg-gray-100 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`bg-gray-700 dark:bg-gray-100 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-500 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200/50 dark:border-gray-700/50">
          {/* Mobile Search */}
          <div className="px-4 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <SearchBox onSearch={handleMobileSearch} />
          </div>

          {/* Quick Categories Section */}
          <div className="px-4 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Quick Categories</h3>
            <div className="grid grid-cols-3 gap-3">
              {quickCategories.map((category) => (
                <Link
                  key={category.name}
                  to={category.href}
                  className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/30 dark:hover:to-secondary-900/30 transition-all duration-300 hover:scale-105"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="text-2xl mb-1">{category.icon}</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-200 text-center">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="px-4 py-3 space-y-1">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Main Menu</h3>
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 dark:text-gray-100 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 dark:hover:from-primary-900/30 dark:hover:to-secondary-900/30 hover:text-primary-600 dark:hover:text-primary-200 font-semibold transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    item.badge === 'Hot'
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                      : 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Quick Actions */}
          <div className="px-4 py-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Link
                to="/wishlist"
                className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 hover:from-pink-100 hover:to-rose-100 dark:hover:from-pink-900/30 dark:hover:to-rose-900/30 transition-all duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 text-pink-600 dark:text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <div>
                  <span className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Wishlist</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{wishlistCount} items</span>
                </div>
              </Link>
              <button className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 hover:from-orange-100 hover:to-yellow-100 dark:hover:from-orange-900/30 dark:hover:to-yellow-900/30 transition-all duration-300">
                <svg className="w-5 h-5 text-orange-600 dark:text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5-5v-5a5.99 5.99 0 00-6-6 5.99 5.99 0 00-6 6v5l-5 5h5m0 0v1a3 3 0 006 0v-1m-3-10h.01" />
                </svg>
                <div>
                  <span className="block text-sm font-semibold text-gray-700 dark:text-gray-200">Notifications</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">3 new</span>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile User Section */}
          <div className="px-4 py-4 border-t border-gray-200/50 dark:border-gray-700/50">
            {userInfo ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                    {userInfo.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-gray-50">{userInfo.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-300">{userInfo.email}</p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-100 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-200 font-semibold transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile Settings
                </Link>
                <Link
                  to="/myorders"
                  className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-200 font-semibold transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Orders
                </Link>
                <Link
                  to="/wishlist"
                  className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-100 hover:bg-pink-50 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-200 font-semibold transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Wishlist
                </Link>
                <button
                  onClick={logoutHandler}
                  className="block w-full text-left px-4 py-3 rounded-xl text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 font-semibold transition-all duration-300"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="ghost" fullWidth className="py-3 font-semibold">
                    Sign In
                  </Button>
                </Link>
                <Link
                  to="/register"
                  className="block text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Button variant="primary" fullWidth className="py-3 font-semibold bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
