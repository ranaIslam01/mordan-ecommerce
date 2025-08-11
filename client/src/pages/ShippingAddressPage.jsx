import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../context/Store";
import CheckoutSteps from "../components/CheckoutSteps";

export default function ShippingAddressPage() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress },
  } = state;

  const [fullName, setFullName] = useState(shippingAddress.fullName || "");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ""
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  useEffect(() => {
    if (!userInfo) {
      navigate("/login?redirect=/shipping");
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, city, postalCode, country },
    });
    localStorage.setItem(
      "shippingAddress",
      JSON.stringify({ fullName, address, city, postalCode, country })
    );
    navigate("/payment");
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-8 px-2 sm:px-0">
      <div className="w-full max-w-2xl">
        <CheckoutSteps step1 step2 />
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-4">
          <h1 className="text-3xl font-extrabold mb-8 text-center text-primary-700 flex items-center justify-center gap-2">
            <svg
              className="w-7 h-7 text-primary-500"
              <div className="w-full max-w-2xl">
                <CheckoutSteps step1 step2 />
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl p-8 mt-4">
                  <h1 className="text-3xl font-extrabold mb-8 text-center text-primary-700 dark:text-primary-300 flex items-center justify-center gap-2">
                    <svg
                      className="w-7 h-7 text-primary-500 dark:text-primary-300"
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
                    Shipping Address
                  </h1>
                  <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                      <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">
                        Full Name
                      </label>
                      <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none transition bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">
                        Address
                      </label>
                      <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none transition bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">
                          City
                        </label>
                        <input
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none transition bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">
                          Postal Code
                        </label>
                        <input
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          required
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none transition bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-200">
                          Country
                        </label>
                        <input
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          required
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-300 focus:outline-none transition bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold text-lg shadow-md hover:bg-primary-700 transition dark:bg-primary-500 dark:hover:bg-primary-600">Continue</button>
                  </form>
                </div>
              </div>
  );
}
