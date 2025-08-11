import React from "react";

const steps = [
  { label: "Sign-In", key: "step1" },
  { label: "Shipping", key: "step2" },
  { label: "Payment", key: "step3" },
  { label: "Place Order", key: "step4" },
];

export default function CheckoutSteps(props) {
  // Find the current step index
  const currentStep =
    steps.findIndex((step, idx) => !props[step.key]) === -1
      ? steps.length - 1
      : steps.findIndex((step, idx) => !props[step.key]) - 1;

  return (
    <div className="flex justify-center mb-8">
      <div className="w-full max-w-2xl">
        <div className="flex items-center text-xs sm:text-sm">
          {steps.map((step, idx) => {
            const isActive = props[step.key];
            const isCompleted = steps.slice(0, idx).every((s) => props[s.key]);
            return (
              <React.Fragment key={step.key}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2 mb-1
                      ${
                        isActive
                          ? "bg-primary-500 border-primary-500 text-white shadow-lg"
                          : isCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : "bg-gray-200 border-gray-300 text-gray-400"
                      }`}
                  >
                    {isCompleted ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span
                    className={`font-medium ${
                      isActive || isCompleted
                        ? "text-primary-600"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-1 sm:mx-2 rounded-full ${
                      steps.slice(0, idx + 1).every((s) => props[s.key])
                        ? "bg-primary-500"
                        : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
