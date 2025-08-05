"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/features/user/userSlice";

/**
 * Initializes authentication state when Clerk is disabled
 * Sets up hardcoded user data for development
 */
export function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize hardcoded user when authentication is skipped
    if (process.env.NEXT_PUBLIC_SKIP_AUTH === "true") {
      console.log(
        "[AuthInitializer] Setting up hardcoded user for development"
      );

      const hardcodedUser = {
        id: "user_2yb08C8E0QiPuu2L0q5Y6B5CD7X",
        firstName: "Muhammad",
        lastName: "Rehman",
        email: "muhammadrehmanmusharafali@gmail.com",
        role: "user",
        imageUrl:
          "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yeWIwOERYZWhsNjlxdGs0cjkzaFRGUmhVUGUifQ",
      };

      dispatch(
        loginSuccess({
          user: hardcodedUser,
          token: true, // Indicate user is "authenticated"
        })
      );
    }
  }, [dispatch]);

  return null; // This component doesn't render anything
}
