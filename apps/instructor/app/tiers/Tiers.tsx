"use client";
import React from "react";
import Modal from "./Model";
import FreeTierContent from "./FreeTierContent";
import PaidTierContent from "./PaidTierContent";
import { useOptionalAuth } from "../hooks/useOptionalAuth";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe - replace with your actual publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

interface TiersProps {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

const Tiers: React.FC<TiersProps> = ({ modalOpen, setModalOpen }) => {
  const [tier, setTier] = React.useState("free");
  const [selectedPlan, setSelectedPlan] = React.useState("paid");
  const [isLoading, setIsLoading] = React.useState(false);
  const { userId } = useOptionalAuth();

  // Get server URL from environment variable
  const serverUrl =
    process.env.NEXT_PUBLIC_APP_SERVER_URL || "http://localhost:3001";

  const creditPackages = {
    free: {
      name: "Free",
      creditAmount: 0,
      priceInCents: 0,
    },
    paid: {
      name: "Early Adopter",
      creditAmount: 1000,
      priceInCents: 3000, // $30.00 in cents
    },
  };

  const handleBuyNow = async () => {
    if (selectedPlan === "free") {
      toast.info("Free tier does not require purchase");
      return;
    }

    if (!userId) {
      toast.error("Please sign in to purchase credits");
      return;
    }

    setIsLoading(true);

    try {
      const currentPackage =
        creditPackages[selectedPlan as keyof typeof creditPackages];

      const response = await fetch(
        `${serverUrl}/api/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            creditAmount: currentPackage.creditAmount,
            priceInCents: currentPackage.priceInCents,
            successUrl: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancelUrl: `${window.location.origin}/payment/cancel`,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("response: ", data);

      if (data.success) {
        // Redirect to Stripe checkout
        toast.success("Redirecting to checkout...");

        // Small delay to show the toast
        setTimeout(() => {
          window.location.href = data.body.checkoutUrl;
        }, 500);
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error("Payment creation failed:", error);

      if (error.message?.includes("Missing required fields")) {
        toast.error("Please check your information and try again.");
      } else if (error.message?.includes("positive numbers")) {
        toast.error("Invalid credit amount or price.");
      } else {
        toast.error("Failed to create payment session. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      {/* Removed the Video Model button here */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="flex flex-col md:flex-row gap-8 w-full">
          {/* Left: Summary */}
          <div className="flex-1 bg-white p-6 rounded-lg">
            <h2 className="text-[#1D1D1D] font-inter text-3xl font-semibold leading-normal mb-4">
              Upgrade your plan
            </h2>
            <p className="text-[#55565B] font-inter text-base font-normal leading-[24px] mb-8">
              Choose a plan that works best for you and start using Unpuzzle AI
            </p>

            {/* Selected Plan Summary */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Selected Plan</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-medium">
                    {
                      creditPackages[
                        selectedPlan as keyof typeof creditPackages
                      ].name
                    }
                  </span>
                </div>
                {selectedPlan === "paid" && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Credits:</span>
                      <span className="font-medium">
                        {creditPackages.paid.creditAmount} credits
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">
                        ${(creditPackages.paid.priceInCents / 100).toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              disabled={isLoading}
              className="cursor-pointer w-full flex h-[44px] p-[14px] justify-center items-center rounded-[8px] bg-[#1D1D1D] text-white text-sm font-bold leading-normal hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Processing..."
                : selectedPlan === "free"
                ? "Continue with Free"
                : "Buy Now"}
            </button>

            <p className="text-xs text-gray-500 mt-4">
              {selectedPlan === "paid"
                ? "You will be redirected to Stripe Checkout to complete your purchase securely."
                : "Start using Unpuzzle AI with limited features. Upgrade anytime."}
            </p>
          </div>
          {/* Right: Pricing Plans */}
          <div className="flex-1 flex flex-col gap-4 bg-[#F4F6F8] rounded-[20px] p-6">
            <h3 className="text-[#1D1D1D] font-inter text-2xl font-semibold leading-normal pb-2">
              Pricing Plan
            </h3>
            <div className={`mb-2`}>
              <FreeTierContent
                selected={selectedPlan === "free"}
                onSelect={() => setSelectedPlan("free")}
              />
            </div>
            <div>
              <PaidTierContent
                selected={selectedPlan === "paid"}
                onSelect={() => setSelectedPlan("paid")}
              />
            </div>
            {/* Total section below the cards */}
            <div className="mt-4 mb-4 block w-full h-[2px] bg-[#DEE2EA]"></div>
            <div className="flex justify-between items-center px-2">
              <span className="text-[#1D1D1D] font-inter text-4xl font-bold leading-normal">
                Total
              </span>
              {selectedPlan === "paid" ? (
                <span className="text-[#1D1D1D] font-inter text-4xl font-bold leading-normal">
                  ${(creditPackages.paid.priceInCents / 100).toFixed(2)}
                </span>
              ) : (
                <span className="text-[#1D1D1D] font-inter text-4xl font-bold leading-normal">
                  Free
                </span>
              )}
            </div>
            <p className="text-[#55565B] font-inter text-base font-normal leading-normal mt-2">
              roin feugiat congue est, et elementum justo finibus vel. Sed eget
              porta ligula. Donec molestie at diam sed congue.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Tiers;
