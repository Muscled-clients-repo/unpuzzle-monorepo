import { useContext } from "react";
import { UserActivityContext } from "../context/UserActivityContext";

export const useUserActivityContext = () => {
  const context = useContext(UserActivityContext);
  if (!context) {
    throw new Error("useUserActivityContext must be used within UserActivityProvider");
  }
  return context;
}; 