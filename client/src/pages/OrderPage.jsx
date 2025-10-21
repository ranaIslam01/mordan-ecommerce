import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { Link, useParams } from "react-router-dom";
import { Store } from "../context/Store";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export default function OrderPage() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;

  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `${
            process.env.REACT_APP_API_URL ||
            "https://mordan-ecommerce.onrender.com"
          }/api/orders/${orderId}`,
          { withCredentials: true }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }
    };

    if (!userInfo) {
      return; // You may redirect to login here
    }
    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [order, userInfo, orderId]);

  return loading ? (
    <div className="min-h-screen flex items-center justify-center">
      <span className="text-lg text-gray-600 dark:text-gray-300">
        লোড হচ্ছে...
      </span>
    </div>
  ) : error ? (
    <div className="min-h-screen flex items-center justify-center">
      <span className="text-red-500 text-lg font-semibold">{error}</span>
    </div>
  ) : (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6"
                />
              </svg>
            </div>
            <h1 className="text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white font-serif">
              Order Details
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Order ID:{" "}
            <span className="font-mono">{order?._id || "Not Found"}</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Order Info */}
          <div className="lg:col-span-8">
            <div className="rounded-3xl p-6 xl:p-8 border border-white/20 dark:border-gray-700/60 space-y-6">
              {/* Shipping */}
              <div className="rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/70 shadow-modern-lg">
                <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2">
                  Shipping
                </h2>
                <p>
                  <strong>Name:</strong>{" "}
                  {order.shippingAddress?.fullName || order.user?.name || "N/A"}
                </p>
                <p>
                  <strong>Address: </strong>
                  {order.shippingAddress?.address},{" "}
                  {order.shippingAddress?.city},{" "}
                  {order.shippingAddress?.postalCode},{" "}
                  {order.shippingAddress?.country}
                </p>
                {order.isDelivered ? (
                  <div className="bg-green-100 text-green-700 p-2 rounded mt-2">
                    Delivered at {order.deliveredAt}
                  </div>
                ) : (
                  <div className="bg-red-100 text-red-700 p-2 rounded mt-2">
                    Not Delivered
                  </div>
                )}
              </div>

              {/* Payment */}
              <div className="rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/70 shadow-modern-lg">
                <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2">
                  Payment
                </h2>
                <p>
                  <strong>Method:</strong> {order.paymentMethod}
                </p>
                {order.isPaid ? (
                  <div className="bg-green-100 text-green-700 p-2 rounded mt-2">
                    Paid at {order.paidAt}
                  </div>
                ) : (
                  <div className="bg-red-100 text-red-700 p-2 rounded mt-2">
                    Not Paid
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/70 shadow-modern-lg">
                <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100 mb-2">
                  Items
                </h2>
                <div className="space-y-4">
                  {(order.orderItems || []).map((item) => (
                    <div
                      key={item._id}
                      className="grid grid-cols-6 items-center gap-2 rounded-xl p-3"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <Link
                        to={`/product/${item.product}`}
                        className="col-span-3 hover:underline text-gray-900 dark:text-white font-medium"
                      >
                        {item.name}
                      </Link>
                      <span className="text-gray-700 dark:text-gray-200">
                        {item.qty} x ${item.price}
                      </span>
                      <span className="text-right text-gray-900 dark:text-white font-semibold">
                        ${(item.qty * item.price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="p-0 xl:p-0 bg-transparent border-none rounded-none shadow-none sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-serif">
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Items</span>
                  <span>${(order.itemsPrice ?? 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Shipping</span>
                  <span>${(order.shippingPrice ?? 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                  <span>Tax</span>
                  <span>${(order.taxPrice ?? 0).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between">
                    <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-primary-600 dark:text-primary-300">
                      ${(order.totalPrice ?? 0).toFixed(2)}
                    </span>
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
