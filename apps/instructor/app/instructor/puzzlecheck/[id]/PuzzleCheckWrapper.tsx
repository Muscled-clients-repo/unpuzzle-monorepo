"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/shared/Loading";
import { AlertCircle } from "lucide-react";
import { useOptionalUser } from "@/app/hooks/useOptionalUser";
import { useGetPuzzleCheckByIdQuery } from "@/app/redux/hooks/useAuthenticatedPuzzleAgentsApi";
import PuzzleCheckClient from "./PuzzleCheckClient";

interface PuzzleCheckWrapperProps {
  puzzleCheckId: string;
}

const PuzzleCheckWrapper: React.FC<PuzzleCheckWrapperProps> = ({ puzzleCheckId }) => {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useOptionalUser();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in");
    }
  }, [isSignedIn, isLoaded, router]);

  // Use Redux RTK Query to fetch puzzle check data
  const { data, isLoading, isError, error } = useGetPuzzleCheckByIdQuery(
    { id: puzzleCheckId },
    { skip: !puzzleCheckId }
  );

  // Show loading while Clerk is initializing
  if (!isLoaded || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Loading />
      </div>
    );
  }

  // Don't render anything if not signed in (will redirect)
  if (!isSignedIn) {
    return null;
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-200">Error Loading Puzzle Check</h3>
              <p className="text-red-700 dark:text-red-300 mt-1">
                {error?.data?.message || error?.message || "Failed to load puzzle check data. Please try again later."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const puzzleCheckData = data?.body;

  if (!puzzleCheckData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Not Found</h3>
              <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                The requested puzzle check could not be found.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <PuzzleCheckClient puzzleCheckData={puzzleCheckData} />;
};

export default PuzzleCheckWrapper;