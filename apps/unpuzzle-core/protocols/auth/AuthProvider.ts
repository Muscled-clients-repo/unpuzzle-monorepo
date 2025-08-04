export interface AuthProvider {
  /**
   * Validate an authentication token
   * @param token - The token to validate
   * @returns Promise<any> - User data if valid
   * @throws Error if token is invalid
   */
  validateToken(token: string): Promise<any>;

  /**
   * Create a new user
   * @param userData - User registration data
   * @returns Promise<any> - Created user data
   */
  createUser(userData: any): Promise<any>;

  /**
   * Get user by ID
   * @param id - User ID
   * @returns Promise<any> - User data
   */
  getUserById(id: string): Promise<any>;

  /**
   * Refresh an authentication token
   * @param refreshToken - Current refresh token
   * @returns Promise<string> - New access token
   */
  refreshToken(refreshToken: string): Promise<string>;

  /**
   * Sign out a user
   * @param userId - User ID to sign out
   * @returns Promise<void>
   */
  signOut(userId: string): Promise<void>;

  /**
   * Get user by email
   * @param email - User email
   * @returns Promise<any> - User data or null
   */
  getUserByEmail(email: string): Promise<any>;

  /**
   * Update user data
   * @param userId - User ID
   * @param updateData - Data to update
   * @returns Promise<any> - Updated user data
   */
  updateUser(userId: string, updateData: any): Promise<any>;

  /**
   * Verify email address
   * @param token - Verification token
   * @returns Promise<boolean> - Success status
   */
  verifyEmail(token: string): Promise<boolean>;
}