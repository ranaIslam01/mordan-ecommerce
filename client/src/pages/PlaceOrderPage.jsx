import React, { useContext, useEffect, useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../context/Store";
import CheckoutSteps from "../components/CheckoutSteps";
import Button from "../components/Button";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false };
    case "CREATE_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function PlaceOrderPage() {
  const navigate = useNavigate();
  const [{ loading }, dispatch] = useReducer(reducer, { loading: false });

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.qty * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart, navigate]);

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const baseUrl = (
        process.env.REACT_APP_API_URL || "https://mordan-ecommerce.onrender.com"
      ).replace(/\/?$/, "");
      const { data } = await axios.post(
        `${baseUrl}/api/orders`,
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
          withCredentials: true,
        }
      );
      ctxDispatch({ type: "CART_CLEAR" });
      dispatch({ type: "CREATE_SUCCESS" });
      localStorage.removeItem("cartItems");
      navigate(`/order/${data._id}`);
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      alert("Order creation failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero py-8 px-4 sm:px-6 lg:px-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div
          className="absolute -bottom-32 -left-40 w-80 h-80 bg-secondary-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-40 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-accent-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="mb-8">
          <CheckoutSteps step1 step2 step3 step4 />
        </div>
        
        {/* Page Header */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="mx-auto w-16 h-16 xl:w-20 xl:h-20 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow-lg animate-scale-in mb-4">
            <svg
              className="w-8 h-8 xl:w-10 xl:h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold text-white dark:text-gray-900 font-serif mb-2">
            Review Your Order
          </h1>
          <p className="text-lg text-gray-900 dark:text-gray-200 drop-shadow-sm">
            Double-check your details before placing your order
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            {/* Shipping Information */}
            <div className="glass-effect rounded-3xl p-6 xl:p-8 backdrop-blur-xl border border-white/20 dark:border-gray-700/60 bg-white/80 dark:bg-gray-800/80 animate-slide-up">
              <h2 className="text-2xl xl:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-serif flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 3H8a2 2 0 00-2 2v2h12V5a2 2 0 00-2-2z"
                    />
                  </svg>
                </div>
                Shipping Information
              </h2>
              <div className="bg-white/60 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/70">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Full Name</span>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {cart.shippingAddress.fullName || userInfo.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">Delivery Address</span>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {cart.shippingAddress.address}, {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div 
              className="glass-effect rounded-3xl p-6 xl:p-8 backdrop-blur-xl border border-white/20 dark:border-gray-700/60 bg-white/80 dark:bg-gray-800/80 animate-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              <h2 className="text-2xl xl:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-serif flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                Payment Method
              </h2>
              <div className="bg-white/60 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/70">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Payment Method</span>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                      {cart.paymentMethod}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div 
              className="glass-effect rounded-3xl p-6 xl:p-8 backdrop-blur-xl border border-white/20 dark:border-gray-700/60 bg-white/80 dark:bg-gray-800/80 animate-slide-up"
              style={{ animationDelay: "400ms" }}
            >
              <h2 className="text-2xl xl:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-serif flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                Order Items ({cart.cartItems.length})
              </h2>
              <div className="space-y-4">
                {cart.cartItems.map((item, index) => (
                  <div 
                    key={item._id} 
                    className="bg-white/60 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/70 hover:shadow-modern-lg transition-all duration-300 animate-slide-up"
                    style={{ animationDelay: `${500 + index * 100}ms` }}
                  >
                    <div className="flex items-center gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 xl:w-24 xl:h-24 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 hover:scale-105 transition-transform duration-300">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item._id}`}
                          className="text-lg xl:text-xl font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300 line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Quantity: <span className="font-semibold text-gray-700 dark:text-gray-300">{item.qty}</span>
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Price: <span className="font-semibold text-gray-700 dark:text-gray-300">${item.price}</span>
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Subtotal</p>
                        <p className="text-xl xl:text-2xl font-bold text-primary-600 dark:text-primary-300">
                          ${(item.qty * item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div 
              className="glass-effect rounded-3xl p-6 xl:p-8 backdrop-blur-xl border border-white/20 dark:border-gray-700/60 bg-white/80 dark:bg-gray-800/80 sticky top-8 animate-slide-up"
              style={{ animationDelay: "600ms" }}
            >
              <h2 className="text-2xl xl:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-serif flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                Order Summary
              </h2>
              
              {/* Price Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="bg-white/60 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/70">
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Items ({cart.cartItems.length})</span>
                      <span className="font-semibold">${cart.itemsPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Shipping</span>
                      <span className="font-semibold">
                        {cart.shippingPrice === 0 ? (
                          <span className="text-green-600 dark:text-green-400 font-bold">
                            Free
                          </span>
                        ) : (
                          `$${cart.shippingPrice.toFixed(2)}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                      <span>Tax</span>
                      <span className="font-semibold">${cart.taxPrice.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                      <div className="flex justify-between">
                        <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                          Total
                        </span>
                        <span className="text-2xl font-bold text-primary-600 dark:text-primary-300">
                          ${cart.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                onClick={placeOrderHandler}
                variant="primary"
                size="lg"
                fullWidth
                disabled={cart.cartItems.length === 0 || loading}
                className="h-14 text-lg font-semibold shadow-glow-lg hover:shadow-glow-lg transition-all duration-300 mb-4"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Placing Order...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Place Order
                  </div>
                )}
              </Button>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span>Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Easy Returns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.944l7.071 7.071-7.071 7.071-7.071-7.071 7.071-7.071z"
                      />
                    </svg>
                    <span>24/7 Support</span>
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
