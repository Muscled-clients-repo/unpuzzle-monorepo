import { AuthProvider } from './AuthProvider';
import UserModel from '../../models/supabase/user.model';
import jwt from 'jsonwebtoken';

export class ClerkAuthProvider implements AuthProvider {
  private jwtSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || '';
    if (!this.jwtSecret) {
      throw new Error('JWT_SECRET is not set');
    }
  }

  async validateToken(token: string): Promise<any> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async createUser(userData: any): Promise<any> {
    // This would typically be handled by Clerk's webhook
    // But we can create users in our database here
    return await UserModel.createUser(userData);
  }

  async getUserById(id: string): Promise<any> {
    return await UserModel.getUserById(id);
  }

  async refreshToken(refreshToken: string): Promise<string> {
    // For Clerk, we generate new JWT tokens
    // In a real implementation, you'd validate the refresh token first
    const user = await this.validateToken(refreshToken);
    return jwt.sign(user, this.jwtSecret);
  }

  async signOut(userId: string): Promise<void> {
    // Clerk handles signout on their end
    // We might want to invalidate sessions in our database
    console.log(`User ${userId} signed out via Clerk`);
  }

  async getUserByEmail(email: string): Promise<any> {
    return await UserModel.getUserByEmail(email);
  }

  async updateUser(userId: string, updateData: any): Promise<any> {
    return await UserModel.updateUser(userId, updateData);
  }

  async verifyEmail(token: string): Promise<boolean> {
    // Clerk handles email verification
    // This would be a webhook callback in real implementation
    return true;
  }
}