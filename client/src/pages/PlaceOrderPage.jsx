import React, { useContext, useEffect, useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store } from "../context/Store";
import CheckoutSteps from "../components/CheckoutSteps";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-8 px-2 sm:px-0">
      <div className="w-full max-w-5xl">
        <CheckoutSteps step1 step2 step3 step4 />
        <div className="grid md:grid-cols-3 gap-8 mt-4">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl p-6">
              <h2 className="text-2xl font-extrabold mb-4 text-primary-700 dark:text-primary-300 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-primary-500"
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
                Shipping
              </h2>
              <div className="text-gray-700 dark:text-gray-200">
                <div>
                  <span className="font-semibold">Name:</span>{" "}
                  {cart.shippingAddress.fullName || userInfo.name}
                </div>
                <div>
                  <span className="font-semibold">Address:</span>{" "}
                  {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
                  {cart.shippingAddress.postalCode},{" "}
                  {cart.shippingAddress.country}
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl p-6">
              <h2 className="text-2xl font-extrabold mb-4 text-primary-700 dark:text-primary-300 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
                Payment
              </h2>
              <div className="text-gray-700 dark:text-gray-200">
                <span className="font-semibold">Method:</span>{" "}
                {cart.paymentMethod}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl p-6">
              <h2 className="text-2xl font-extrabold mb-4 text-primary-700 dark:text-primary-300 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-primary-500"
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
                Items
              </h2>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {cart.cartItems.map((item) => (
                  <div key={item._id} className="flex items-center py-3 gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                    <div className="flex-1">
                      <Link
                        to={`/product/${item._id}`}
                        className="font-semibold text-primary-600 hover:underline"
                      >
                        {item.name}
                      </Link>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {item.qty} x ${item.price}
                      </div>
                    </div>
                    <div className="font-bold text-lg">
                      ${(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl p-6 sticky top-8">
              <h2 className="text-2xl font-extrabold mb-4 text-primary-700 dark:text-primary-300 flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-primary-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
                Order Summary
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700 dark:text-gray-200">
                  <span>Items</span>
                  <span>${cart.itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-200">
                  <span>Shipping</span>
                  <span>
                    {cart.shippingPrice === 0 ? (
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        Free
                      </span>
                    ) : (
                      `$${cart.shippingPrice.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700 dark:text-gray-200">
                  <span>Tax</span>
                  <span>${cart.taxPrice.toFixed(2)}</span>
                </div>
                <hr className="my-2 border-gray-200 dark:border-gray-700" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary-600 dark:text-primary-300">
                    ${cart.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                onClick={placeOrderHandler}
                disabled={cart.cartItems.length === 0 || loading}
                className="mt-6 w-full bg-primary-600 text-white py-3 rounded-lg font-bold text-lg shadow-md hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 disabled:bg-gray-400 transition"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
