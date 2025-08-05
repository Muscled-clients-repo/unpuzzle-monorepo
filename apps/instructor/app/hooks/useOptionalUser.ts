/**
 * Custom user hook with hardcoded user data
 * Returns a mock authenticated user
 */
export function useOptionalUser() {
  // Always return mock user data
  return {
    isLoaded: true,
    isSignedIn: true,
    user: {
      id: "user_001",
      firstName: "Muhammad",
      lastName: "Rehman",
      email: "muhammadrehmanmusharafali@gmail.com",
      role: "user",
      imageUrl: "https://via.placeholder.com/150", // Replace with actual image if needed
    },
  };
}
