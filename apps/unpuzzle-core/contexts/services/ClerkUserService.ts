import { clerkClient } from "@clerk/express";
import { BindMethods } from "../../protocols/utility/BindMethods";

interface UserData {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string;
}

class ClerkUserService {
  /**
   * Fetch user data from Clerk by user ID
   */
  async getUserById(userId: string): Promise<UserData | null> {
    try {
      const user = await clerkClient.users.getUser(userId);
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses?.[0]?.emailAddress,
      };
    } catch (error) {
      console.error(`Error fetching user from Clerk: ${error}`);
      return null;
    }
  }

  /**
   * Fetch multiple users from Clerk by user IDs
   */
  async getUsersByIds(userIds: string[]): Promise<Map<string, UserData>> {
    const userMap = new Map<string, UserData>();
    
    // Remove duplicates
    const uniqueUserIds = Array.from(new Set(userIds));
    
    // Fetch users in parallel with error handling for each
    const userPromises = uniqueUserIds.map(async (userId) => {
      try {
        const userData = await this.getUserById(userId);
        if (userData) {
          userMap.set(userId, userData);
        }
      } catch (error) {
        console.error(`Error fetching user ${userId}:`, error);
      }
    });
    
    await Promise.all(userPromises);
    return userMap;
  }

  /**
   * Enrich records with user data from Clerk
   */
  async enrichRecordsWithUserData<T extends { user_id?: string | null }>(
    records: T[]
  ): Promise<(T & { user?: UserData | null })[]> {
    // Extract unique user IDs
    const userIds = records
      .map(record => record.user_id)
      .filter((id): id is string => id !== null && id !== undefined);
    
    if (userIds.length === 0) {
      return records.map(record => ({ ...record, user: null }));
    }
    
    // Fetch user data
    const userMap = await this.getUsersByIds(userIds);
    
    // Enrich records with user data
    return records.map(record => ({
      ...record,
      user: record.user_id ? userMap.get(record.user_id) || null : null
    }));
  }
}

const binding = new BindMethods(new ClerkUserService());
export default binding.bindMethods();