import React, { useState } from "react";
import { X } from "lucide-react"; // Import the cross icon from Lucide

interface PaymentCardProps {
  plans: any;
  isCardVisible: boolean;
  setIsCardVisible: (value: boolean) => void;
}

const PaymentCard = ({
  plans,
  isCardVisible,
  setIsCardVisible,
}: PaymentCardProps) => {
  // Function to handle closing the PaymentCard
  const handleCloseCard = () => {
    setIsCardVisible(false);
  };

  // State for selected payment method
  const [paymentMethod, setPaymentMethod] = useState<"Card" | "Stripe">("Card");

  return (
    <div className="relative">
      {/* Conditionally render Payment Card */}
      {isCardVisible && (
        <div
          className="payment-card fixed top-0 left-0 right-0 bottom-0 bg-opacity-50 bg-gray-700 flex justify-center items-center"
          onClick={handleCloseCard} // Close on click outside
        >
          {/* Inner card content */}
          <div
            className="bg-white p-8 rounded-lg shadow-lg w-1/3 relative"
            onClick={(e) => e.stopPropagation()} // Prevent click inside card from closing the card
          >
            {/* Close Icon */}
            <div
              className="absolute top-2 right-2 text-gray-600 cursor-pointer"
              onClick={handleCloseCard}
            >
              <X size={24} />
            </div>

            <h2 className="text-xl font-bold mb-4">Payment Method</h2>

            {/* Plan Selection */}
            <div className="flex justify-between mb-4">
              {plans.map((value: any, index: number) => {
                return (
                  <div className="flex items-center" key={index}>
                    <label
                      htmlFor="earlyAdopter"
                      className="ml-2 font-bold cursor-pointer"
                    >
                      {value?.heading}
                    </label>
                  </div>
                );
              })}
            </div>

            {/* Payment Method Section */}
            <div className="mb-4">
              <label
                htmlFor="paymentMethod"
                className="block text-sm font-semibold"
              >
                Pay With:
              </label>
              <div className="flex">
                <div className="mr-4">
                  <input
                    type="radio"
                    id="card"
                    name="paymentMethod"
                    checked={paymentMethod === "Card"}
                    onChange={() => setPaymentMethod("Card")}
                  />
                  <label htmlFor="card" className="ml-2">
                    Card
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="stripe"
                    name="paymentMethod"
                    checked={paymentMethod === "Stripe"}
                    onChange={() => setPaymentMethod("Stripe")}
                  />
                  <label htmlFor="stripe" className="ml-2">
                    Stripe
                  </label>
                </div>
              </div>
            </div>

            {/* Card Number Field */}
            <div className="mb-4">
              <label
                htmlFor="cardNumber"
                className="block text-sm font-semibold"
              >
                Card Number
              </label>
              <input
                type="text"
                id="cardNumber"
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="1234 5678 9101 1121"
              />
            </div>

            {/* Expiration Date Field */}
            <div className="mb-4 flex justify-between">
              <div className="w-1/2 pr-2">
                <label
                  htmlFor="expiryDate"
                  className="block text-sm font-semibold"
                >
                  Expiration Date
                </label>
                <input
                  type="text"
                  id="expiryDate"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="MM/YY"
                />
              </div>
              {/* CVV Field */}
              <div className="w-1/2 pl-2">
                <label htmlFor="cvv" className="block text-sm font-semibold">
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="123"
                />
              </div>
            </div>

            {/* Save Card Details Checkbox */}
            <div className="mb-4 flex items-center">
              <input type="checkbox" id="saveCardDetails" className="mr-2" />
              <label htmlFor="saveCardDetails" className="text-sm">
                Save card details
              </label>
            </div>

            {/* Pay Button */}
            <button className="w-full bg-[#00AFF0] text-white py-2 rounded-lg">
              Pay USD30
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentCard;
