import { AuthProvider } from './AuthProvider';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

export class SupabaseAuthProvider implements AuthProvider {
  private supabase: SupabaseClient;
  private jwtSecret: string;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    this.jwtSecret = process.env.SUPABASE_JWT_SECRET || process.env.JWT_SECRET || '';
    
    if (!this.jwtSecret) {
      throw new Error('SUPABASE_JWT_SECRET or JWT_SECRET must be set');
    }
  }

  async validateToken(token: string): Promise<any> {
    try {
      // First try to validate as Supabase JWT
      const { data: { user }, error } = await this.supabase.auth.getUser(token);
      
      if (!error && user) {
        return user;
      }

      // Fallback to custom JWT validation (for backward compatibility)
      const decoded = jwt.verify(token, this.jwtSecret);
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async createUser(userData: {
    email: string;
    password: string;
    metadata?: any;
  }): Promise<any> {
    const { data, error } = await this.supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      user_metadata: userData.metadata || {},
      email_confirm: true // Auto-confirm for admin creation
    });

    if (error) throw error;
    return data.user;
  }

  async getUserById(id: string): Promise<any> {
    // First try auth.users table
    const { data: authData, error: authError } = await this.supabase.auth.admin.getUserById(id);
    
    if (!authError && authData.user) {
      return authData.user;
    }

    // Fallback to custom users table for backward compatibility
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') { // Not found error
      throw error;
    }

    return data;
  }

  async refreshToken(refreshToken: string): Promise<string> {
    const { data, error } = await this.supabase.auth.refreshSession({
      refresh_token: refreshToken
    });

    if (error) throw error;
    return data.session?.access_token || '';
  }

  async signOut(userId: string): Promise<void> {
    // Sign out all sessions for the user
    const { error } = await this.supabase.auth.admin.signOut(userId);
    if (error) {
      console.error('Error signing out user:', error);
    }
  }

  async getUserByEmail(email: string): Promise<any> {
    // Try auth.users first
    const { data: authData, error: authError } = await this.supabase.auth.admin.listUsers();
    
    if (!authError) {
      const user = authData.users.find(u => u.email === email);
      if (user) return user;
    }

    // Fallback to custom users table
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  }

  async updateUser(userId: string, updateData: any): Promise<any> {
    const { data, error } = await this.supabase.auth.admin.updateUserById(
      userId,
      {
        user_metadata: updateData.metadata,
        email: updateData.email,
        password: updateData.password
      }
    );

    if (error) throw error;
    return data.user;
  }

  async verifyEmail(token: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email'
      });

      return !error;
    } catch (error) {
      return false;
    }
  }

  // Supabase-specific helper methods
  async createUserWithEmailPassword(email: string, password: string, metadata = {}): Promise<any> {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });

    if (error) throw error;
    return data.user;
  }

  async signInWithEmailPassword(email: string, password: string): Promise<any> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  async resetPassword(email: string): Promise<void> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }
}