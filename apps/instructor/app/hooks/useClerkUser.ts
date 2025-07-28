export function useClerkUser() {
  // Return mock data since we're removing Clerk authentication
  return {
    user: {
      id: 'mock-user-id',
      firstName: 'Instructor',
      lastName: 'User',
      emailAddresses: [{ emailAddress: 'instructor@example.com' }],
      imageUrl: '/assets/default-avatar.png',
    },
    isLoaded: true,
    isSignedIn: true,
    getToken: async () => null,
  };
} 