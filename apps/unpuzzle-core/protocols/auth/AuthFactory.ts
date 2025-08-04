import { AuthProvider } from './AuthProvider';
import { ClerkAuthProvider } from './ClerkAuthProvider';
import { SupabaseAuthProvider } from './SupabaseAuthProvider';

export class AuthFactory {
  private static instance: AuthProvider | null = null;

  /**
   * Create or get singleton auth provider instance
   * @returns AuthProvider instance
   */
  static createProvider(): AuthProvider {
    if (this.instance) {
      return this.instance;
    }

    const authType = process.env.AUTH_PROVIDER?.toLowerCase() || 'clerk';
    
    switch (authType) {
      case 'clerk':
        this.instance = new ClerkAuthProvider();
        break;
      case 'supabase':
        this.instance = new SupabaseAuthProvider();
        break;
      default:
        throw new Error(`Unsupported auth provider: ${authType}. Supported providers: clerk, supabase`);
    }

    return this.instance;
  }

  /**
   * Reset the singleton instance (useful for testing)
   */
  static reset(): void {
    this.instance = null;
  }

  /**
   * Get current auth provider type
   */
  static getProviderType(): string {
    return process.env.AUTH_PROVIDER?.toLowerCase() || 'clerk';
  }
}