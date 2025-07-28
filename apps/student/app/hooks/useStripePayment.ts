import { useContext } from "react";
import { StripePaymentContext } from "../context/StripePaymentContext";

export const useStripePayment = () => {
  const context = useContext(StripePaymentContext);
  if (!context) {
    throw new Error("useStripePayment must be used within StripePaymentProvider");
  }
  return context;
}; 