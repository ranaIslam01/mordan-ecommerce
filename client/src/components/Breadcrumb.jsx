import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Custom breadcrumb labels
  const breadcrumbLabels = {
    '': 'Home',
    'categories': 'Categories',
    'category': 'Category',
    'electronics': 'Electronics',
    'fashion': 'Fashion',
    'home': 'Home & Garden',
    'sports': 'Sports',
    'books': 'Books',
    'beauty': 'Beauty',
    'deals': 'Deals',
    'new': 'New Arrivals',
    'cart': 'Shopping Cart',
    'wishlist': 'Wishlist',
    'profile': 'Profile',
    'myorders': 'My Orders',
    'login': 'Sign In',
    'register': 'Sign Up',
    'support': 'Support',
    'search': 'Search Results',
    'product': 'Product',
  };

  // Don't show breadcrumb on home page or certain pages
  if (pathnames.length === 0 || ['login', 'register'].includes(pathnames[0])) {
    return null;
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 py-3 mt-16 lg:mt-20 xl:mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center space-x-2 text-sm">
          {/* Home Link */}
          <Link
            to="/"
            className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 9l6 6m0-6l-6 6" />
            </svg>
            Home
          </Link>

          {/* Dynamic Breadcrumbs */}
          {pathnames.map((pathname, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const label = breadcrumbLabels[pathname] || pathname.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

            return (
              <React.Fragment key={pathname}>
                {/* Separator */}
                <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>

                {/* Breadcrumb Item */}
                {isLast ? (
                  <span className="text-gray-900 dark:text-gray-100 font-semibold">
                    {label}
                  </span>
                ) : (
                  <Link
                    to={routeTo}
                    className="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
                  >
                    {label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;
