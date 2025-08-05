import React from "react";

/**
 * Mock authentication-aware components
 * Used when authentication is disabled/removed
 */

export function OptionalSignedIn({ children }: { children: React.ReactNode }) {
  // Always show content as if user is signed in
  return <>{children}</>;
}

export function OptionalSignedOut({ children }: { children: React.ReactNode }) {
  // Never show signed-out content since auth is removed
  return null;
}

export function OptionalUserButton(props?: any) {
  // Always show mock user button
  return (
    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
      TU
    </div>
  );
}

export function OptionalSignInButton({ children, ...props }: any) {
  // Do not show sign-in button
  return null;
}

export function OptionalSignUpButton({ children, ...props }: any) {
  // Do not show sign-up button
  return null;
}

export function OptionalRedirectToSignIn() {
  // Do not redirect since auth is removed
  return null;
}
