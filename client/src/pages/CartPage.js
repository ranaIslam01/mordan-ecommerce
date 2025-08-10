import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from '../context/Store';
import Button from '../components/Button';

export default function CartPage() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, qty) => {
    if (item.countInStock < qty) {
      alert('Sorry. Product is out of stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, qty },
    });
  };

  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };
  
  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  const subtotal = cartItems.reduce((a, c) => a + c.price * c.qty, 0);
  const itemCount = cartItems.reduce((a, c) => a + c.qty, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Empty Cart Illustration */}
            <div className="mx-auto w-32 h-32 xl:w-40 xl:h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-8 animate-scale-in">
              <svg className="w-16 h-16 xl:w-20 xl:h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            
            <h1 className="text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-4 font-serif">
              Your Cart is Empty
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. Start shopping to fill it up!
            </p>
            
            <Link to="/">
              <Button variant="primary" size="lg" className="px-8 py-4 text-lg shadow-glow">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                  Continue Shopping
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white font-serif">
              Shopping Cart
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="glass-effect rounded-3xl p-6 xl:p-8 backdrop-blur-xl border border-white/20">
              <div className="space-y-6">
                {cartItems.map((item, index) => (
                  <div 
                    key={item._id} 
                    className="group bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-modern-lg transition-all duration-300 animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 xl:w-32 xl:h-32 rounded-2xl overflow-hidden bg-gray-100 group-hover:scale-105 transition-transform duration-300">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                          <div className="flex-1">
                            <Link 
                              to={`/product/${item._id}`}
                              className="text-lg xl:text-xl font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300 line-clamp-2"
                            >
                              {item.name}
                            </Link>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Brand: {item.brand || 'Generic'}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                ${item.price}
                              </span>
                              <span className="text-sm text-gray-500">each</span>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex flex-col items-end gap-4">
                            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                              <button
                                onClick={() => updateCartHandler(item, item.qty - 1)}
                                disabled={item.qty === 1}
                                className="w-10 h-10 rounded-lg bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-primary-50 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                </svg>
                              </button>
                              <span className="w-12 text-center font-semibold text-gray-900 dark:text-white">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => updateCartHandler(item, item.qty + 1)}
                                disabled={item.qty === item.countInStock}
                                className="w-10 h-10 rounded-lg bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-primary-50 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="text-sm text-gray-500 dark:text-gray-400">Subtotal</p>
                              <p className="text-xl font-bold text-gray-900 dark:text-white">
                                ${(item.price * item.qty).toFixed(2)}
                              </p>
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeItemHandler(item)}
                              className="flex items-center gap-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium transition-colors duration-200"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="glass-effect rounded-3xl p-6 xl:p-8 backdrop-blur-xl border border-white/20 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-serif">
                Order Summary
              </h2>

              {/* Items Summary */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Items ({itemCount})</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={checkoutHandler}
                variant="primary"
                size="lg"
                fullWidth
                disabled={cartItems.length === 0}
                className="h-14 text-lg font-semibold shadow-glow-lg hover:shadow-glow-lg transition-all duration-300 mb-4"
              >
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Proceed to Checkout
                </div>
              </Button>

              {/* Continue Shopping */}
              <Link to="/">
                <Button variant="ghost" size="md" fullWidth className="text-primary-600 hover:text-primary-700">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                    Continue Shopping
                  </div>
                </Button>
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Secure Checkout
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Easy Returns
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
