import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { DarkModeProvider } from './context/DarkModeContext.jsx';
import PerformanceOptimizer from './utils/PerformanceOptimizer';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Breadcrumb from './components/Breadcrumb.jsx';
import ProjectVibeHomePage from './pages/ProjectVibeHomePage.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import CartPage from './pages/CartPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ShippingAddressPage from './pages/ShippingAddressPage.jsx';
import PaymentMethodPage from './pages/PaymentMethodPage.jsx';
import PlaceOrderPage from './pages/PlaceOrderPage.jsx';
import OrderPage from './pages/OrderPage.jsx';
import MyOrdersPage from './pages/MyOrdersPage.jsx';

function App() {
  // Initialize Performance Optimization for Core Web Vitals
  useEffect(() => {
    const performanceOptimizer = new PerformanceOptimizer();

    // Report metrics after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        performanceOptimizer.reportMetrics();
      }, 3000);
    });

    return () => {
      performanceOptimizer.destroy();
    };
  }, []);

  return (
    <DarkModeProvider>
      <WishlistProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <Header />
            <Breadcrumb />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<ProjectVibeHomePage />} />
                <Route path="/classic" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/shipping" element={<ShippingAddressPage />} />
                  <Route path="/payment" element={<PaymentMethodPage />} />
                  <Route path="/placeorder" element={<PlaceOrderPage />} />
                  <Route path="/order/:id" element={<OrderPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/myorders" element={<MyOrdersPage />} />
                </Route>
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </WishlistProvider>
    </DarkModeProvider>
  );
}

export default App;
