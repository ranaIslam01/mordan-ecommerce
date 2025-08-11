import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../context/Store";
import CheckoutSteps from "../components/CheckoutSteps";

export default function PaymentMethodPage() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || "PayPal"
  );

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethodName });
    localStorage.setItem("paymentMethod", paymentMethodName);
    navigate("/placeorder");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-8 px-2 sm:px-0">
      <div className="w-full max-w-2xl">
        <CheckoutSteps step1 step2 step3 />
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
            Payment Method
          </h1>
          <form onSubmit={submitHandler} className="space-y-6">
            <div className="flex flex-col gap-4">
              <label className="font-semibold text-gray-700 dark:text-gray-200">
                Select Payment Method
              </label>
              <div className="flex flex-col gap-3">
                <label
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${
                    paymentMethodName === "PayPal"
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30"
                      : "border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900/60"
                  }`}
                  htmlFor="PayPal"
                >
                  <input
                    type="radio"
                    id="PayPal"
                    value="PayPal"
                    checked={paymentMethodName === "PayPal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  <span className="font-medium">PayPal</span>
                </label>
                <label
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${
                    paymentMethodName === "Stripe"
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30"
                      : "border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900/60"
                  }`}
                  htmlFor="Stripe"
                >
                  <input
                    type="radio"
                    id="Stripe"
                    value="Stripe"
                    checked={paymentMethodName === "Stripe"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  <span className="font-medium">Stripe</span>
                </label>
                <label
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition ${
                    paymentMethodName === "CashOnDelivery"
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/30"
                      : "border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900/60"
                  }`}
                  htmlFor="CashOnDelivery"
                >
                  <input
                    type="radio"
                    id="CashOnDelivery"
                    value="CashOnDelivery"
                    checked={paymentMethodName === "CashOnDelivery"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  <span className="font-medium">Cash On Delivery</span>
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-bold text-lg shadow-md hover:bg-primary-700 transition dark:bg-primary-500 dark:hover:bg-primary-600"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
