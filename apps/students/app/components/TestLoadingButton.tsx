"use client";

import { useNavigationLoading } from "@/app/context/NavigationLoadingContext";

export function TestLoadingButton() {
  const { isNavigating, startNavigation, stopNavigation } = useNavigationLoading();

  const handleTestLoading = () => {
    console.log("Test loading clicked");
    startNavigation();
    // Stop after 3 seconds to test
    setTimeout(() => {
      stopNavigation();
    }, 3000);
  };

  return (
    <button
      onClick={handleTestLoading}
      className="fixed bottom-4 right-4 z-[90000] px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Test Loading (Current: {isNavigating ? 'ON' : 'OFF'})
    </button>
  );
}