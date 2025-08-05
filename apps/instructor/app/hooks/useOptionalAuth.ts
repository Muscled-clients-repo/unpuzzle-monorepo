/**
 * Custom authentication hook (Clerk removed)
 * Returns mock authenticated user data or default fallback
 */
export function useOptionalAuth() {
  // Always return mock authenticated state
  return {
    isLoaded: true,
    isSignedIn: true,
    userId: "user_001",
    user: null, // You can extend this if needed
    getToken: async () => null, // No token used
    signOut: async () => {}, // Mock function
    sessionId: "mock-session-id",
    orgId: null,
  };
}
