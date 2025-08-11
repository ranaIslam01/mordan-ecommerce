import React, { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    orders: [],
  });

  useEffect(() => {
    const fetchOrders = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get(
          `${
            process.env.REACT_APP_API_URL ||
            "https://ecommerce-server-1-6mhy.onrender.com"
          }/api/orders/myorders`,
          { withCredentials: true }
        );
        // Sort orders by newest first
        const sorted = (Array.isArray(data) ? [...data] : []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        dispatch({ type: "FETCH_SUCCESS", payload: sorted });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: error.message });
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="flex flex-col px-2 md:px-0 w-full max-w-6xl mx-auto mt-8 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <h2 className="text-3xl font-extrabold mb-8 text-center md:text-left text-primary-700 dark:text-primary-300">
        My Orders
      </h2>
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 p-2 md:p-6 rounded-2xl shadow-xl dark:shadow-2xl w-full">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
                <th className="py-3 px-2">ID</th>
                <th className="py-3 px-2">DATE</th>
                <th className="py-3 px-2">TOTAL</th>
                <th className="py-3 px-2">PAID</th>
                <th className="py-3 px-2">DELIVERED</th>
                <th className="py-3 px-2">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(orders) ? orders : []).map((order) => (
                <tr
                  key={order._id}
                  className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/40 transition"
                >
                  <td className="py-2 px-2 break-all max-w-[100px] text-gray-900 dark:text-gray-100">
                    {order._id}
                  </td>
                  <td className="py-2 px-2 text-gray-700 dark:text-gray-200">
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td className="py-2 px-2 text-primary-700 dark:text-primary-300 font-semibold">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="py-2 px-2">
                    {order.isPaid ? (
                      <span className="inline-block px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold">
                        {order.paidAt.substring(0, 10)}
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold">
                        No
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-2">
                    {order.isDelivered ? (
                      <span className="inline-block px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-bold">
                        {order.deliveredAt.substring(0, 10)}
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold">
                        No
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-2">
                    <button
                      onClick={() => {
                        navigate(`/order/${order._id}`);
                      }}
                      className="px-4 py-2 rounded-lg bg-primary-600 dark:bg-primary-500 text-white font-semibold shadow hover:bg-primary-700 dark:hover:bg-primary-600 transition"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
