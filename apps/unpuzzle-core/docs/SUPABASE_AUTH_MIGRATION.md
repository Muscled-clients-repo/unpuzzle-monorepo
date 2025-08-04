# Migration from Clerk to Supabase Auth

## Overview
This document outlines the migration strategy from Clerk to Supabase Auth while maintaining the existing cross-domain authentication architecture.

## Migration Strategy: Abstract Authentication Layer

### Current Architecture Benefits
The authentication system is designed with abstraction in mind:
- **Provider-agnostic cookie management**
- **Centralized authentication logic**
- **Modular middleware structure**
- **Client-side auth utilities**

### Migration Steps

#### Phase 1: Create Authentication Abstraction Layer

```typescript
// protocols/auth/AuthProvider.ts
export interface AuthProvider {
  validateToken(token: string): Promise<any>;
  createUser(userData: any): Promise<any>;
  getUserById(id: string): Promise<any>;
  refreshToken(token: string): Promise<string>;
  signOut(userId: string): Promise<void>;
}

// protocols/auth/ClerkAuthProvider.ts (current)
export class ClerkAuthProvider implements AuthProvider {
  async validateToken(token: string) {
    // Current Clerk validation logic
  }
  
  async createUser(userData: any) {
    // Clerk user creation
  }
  
  // ... other methods
}

// protocols/auth/SupabaseAuthProvider.ts (new)
export class SupabaseAuthProvider implements AuthProvider {
  private supabase: SupabaseClient;
  
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }
  
  async validateToken(token: string) {
    const { data: { user }, error } = await this.supabase.auth.getUser(token);
    if (error) throw new Error('Invalid token');
    return user;
  }
  
  async createUser(userData: any) {
    const { data, error } = await this.supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      user_metadata: userData.metadata
    });
    if (error) throw error;
    return data.user;
  }
  
  async getUserById(id: string) {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }
  
  async refreshToken(refreshToken: string) {
    const { data, error } = await this.supabase.auth.refreshSession({
      refresh_token: refreshToken
    });
    if (error) throw error;
    return data.access_token;
  }
  
  async signOut(userId: string) {
    // Implement Supabase signout logic
    await this.supabase.auth.admin.signOut(userId);
  }
}
```

#### Phase 2: Update Authentication Factory

```typescript
// protocols/auth/AuthFactory.ts
import { AuthProvider } from './AuthProvider';
import { ClerkAuthProvider } from './ClerkAuthProvider';
import { SupabaseAuthProvider } from './SupabaseAuthProvider';

export class AuthFactory {
  static createProvider(): AuthProvider {
    const authType = process.env.AUTH_PROVIDER || 'clerk';
    
    switch (authType) {
      case 'clerk':
        return new ClerkAuthProvider();
      case 'supabase':
        return new SupabaseAuthProvider();
      default:
        throw new Error(`Unsupported auth provider: ${authType}`);
    }
  }
}
```

#### Phase 3: Update Middleware to Use Abstraction

```typescript
// protocols/middleware/AuthMiddleware.ts
import { AuthFactory } from '../auth/AuthFactory';
import { CookieManager } from '../utility/cookieManager';

class AuthMiddleware {
  private authProvider: AuthProvider;
  
  constructor() {
    this.authProvider = AuthFactory.createProvider();
  }
  
  async getUser(req: Request, res: Response, next: NextFunction) {
    const token = CookieManager.getAuthCookie(req);
    
    try {
      if (token) {
        const user = await this.authProvider.validateToken(token);
        req.user = user;
      }
      return next();
    } catch (error) {
      // Clear invalid token
      CookieManager.clearAuthCookie(res);
      return next();
    }
  }
  
  async requireAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    next();
  }
}
```

### Supabase Auth Implementation Details

#### Environment Variables Update
```env
# Add to .env
AUTH_PROVIDER=supabase
SUPABASE_JWT_SECRET=your-supabase-jwt-secret
SUPABASE_AUTH_URL=https://your-project.supabase.co/auth/v1
```

#### Client-Side Authentication (React/JS)
```javascript
// public/js/auth/SupabaseAuthClient.js
import { createClient } from '@supabase/supabase-js';

export class SupabaseAuthClient {
  constructor() {
    this.supabase = createClient(
      window.SUPABASE_URL,
      window.SUPABASE_ANON_KEY
    );
  }
  
  async signIn(email, password) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    // Set cross-domain cookie via API call
    await this.setCrossDomainToken(data.session.access_token);
    
    return data;
  }
  
  async signUp(email, password, metadata = {}) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    
    if (error) throw error;
    return data;
  }
  
  async signOut() {
    await this.supabase.auth.signOut();
    
    // Clear cross-domain cookies
    await fetch('/api/auth/logout', { method: 'POST' });
  }
  
  async setCrossDomainToken(token) {
    // Call your backend to set the cross-domain cookie
    await fetch('/api/auth/set-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
  }
  
  onAuthStateChange(callback) {
    return this.supabase.auth.onAuthStateChange(callback);
  }
}
```

#### Database Schema Migration
```sql
-- Supabase users table (usually auto-created)
-- You might need to migrate existing user data from your current users table

-- Migration script example
INSERT INTO auth.users (
  id,
  email,
  email_confirmed_at,
  created_at,
  updated_at
)
SELECT 
  id,
  email,
  created_at,
  created_at,
  updated_at
FROM public.users
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE auth.users.id = public.users.id
);
```

### Migration Timeline

#### Week 1: Preparation
- [ ] Create abstraction layer
- [ ] Implement Supabase auth provider
- [ ] Set up Supabase project
- [ ] Create migration scripts

#### Week 2: Dual Provider Support
- [ ] Deploy abstraction layer
- [ ] Test both providers work
- [ ] Create user migration tools
- [ ] Update documentation

#### Week 3: User Migration
- [ ] Migrate user accounts
- [ ] Update client-side auth
- [ ] Test cross-domain functionality
- [ ] Monitor for issues

#### Week 4: Cleanup
- [ ] Remove Clerk dependencies
- [ ] Clean up old code
- [ ] Update environment variables
- [ ] Final testing

### Key Benefits of This Approach

1. **Zero Downtime Migration**: Switch providers with environment variable
2. **Preserved Architecture**: Cross-domain setup remains unchanged
3. **Easy Rollback**: Can revert to Clerk if needed
4. **Future-Proof**: Easy to add other providers later

### Comparison: Clerk vs Supabase Auth

| Feature | Clerk | Supabase Auth |
|---------|-------|---------------|
| Setup Complexity | Low | Medium |
| Customization | Medium | High |
| Pricing | Higher | Lower |
| Multi-tenant | Excellent | Good |
| Social Auth | Excellent | Good |
| Custom UI | Good | Excellent |
| Database Integration | External | Native |
| Real-time Features | No | Yes |

### Recommended Migration Strategy

1. **Start with abstraction layer** - This gives you flexibility
2. **Gradual migration** - Move users in batches
3. **Feature parity first** - Ensure all features work before switching
4. **Monitor closely** - Watch for authentication issues
5. **Keep rollback plan** - Always have a way back

### Client-Side Auth Manager Update

```javascript
// Update the existing AuthManager for Supabase
export class AuthManager {
  constructor() {
    this.authClient = this.createAuthClient();
    // ... rest of existing code
  }
  
  createAuthClient() {
    const authProvider = window.AUTH_PROVIDER || 'clerk';
    
    switch (authProvider) {
      case 'clerk':
        return new ClerkAuthClient();
      case 'supabase':
        return new SupabaseAuthClient();
      default:
        throw new Error(`Unknown auth provider: ${authProvider}`);
    }
  }
  
  // Rest of the methods remain the same
  // The abstraction handles provider differences
}
```

## Conclusion

This migration strategy:
- **Preserves your cross-domain architecture**
- **Minimizes code changes**
- **Allows gradual migration**
- **Maintains security standards**
- **Future-proofs your authentication system**

The key is the abstraction layer that makes your application auth-provider agnostic while keeping all the cross-domain benefits we've implemented.