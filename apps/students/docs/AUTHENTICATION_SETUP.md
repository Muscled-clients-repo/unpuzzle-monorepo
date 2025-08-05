# Student App Authentication Setup

## Overview
The student app uses a custom authentication system via the `@unpuzzle/auth` package instead of external services like Clerk.

## What's Been Implemented

### 1. Custom Authentication System
- **Auth Package**: Uses `@unpuzzle/auth` for authentication logic
- **Backend Integration**: Connects to the core backend API for user management
- **State Management**: Integrated with Redux for user state persistence

### 2. Home Page (`/`)
A modern, attractive landing page featuring:
- Hero section with clear value proposition
- Feature highlights (Interactive Learning, AI Assistance, Collaboration)
- Statistics section showing platform metrics
- Popular courses preview
- Call-to-action sections
- Responsive navigation with authentication state handling
- Footer with important links

### 3. Route Protection
Authentication is handled through:
- Custom AuthProvider wrapping the app
- Protected routes automatically redirect to login when needed
- User state persistence across page refreshes
- Seamless integration with the backend API

### 4. Layout Integration
- AuthProvider wraps the entire app in the layout
- Authentication state is synchronized across components
- User profile information displayed in dashboard
- Conditional rendering based on auth state

## Environment Variables Required

The student app only needs backend API configuration:

```bash
# API Configuration
NEXT_PUBLIC_CORE_SERVER_URL=your_backend_api_url
NEXT_PUBLIC_M1_SERVER_URL=your_m1_server_url
NEXT_PUBLIC_STUDENT_APP_URL=your_student_app_url
NEXT_PUBLIC_INSTRUCTOR_APP_URL=your_instructor_app_url

# Stripe Payment (Optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## User Flow

### New User Journey:
1. Lands on home page (`/`)
2. Clicks "Get Started" → Redirected to registration
3. Creates account via backend API → Redirected to `/dashboard`
4. Can access all protected routes

### Returning User Journey:
1. Lands on home page (`/`)
2. Clicks "Sign In" → Uses backend authentication
3. Signs in → Redirected to `/dashboard` or original destination
4. Can access all protected routes

### Protected Route Access:
1. User tries to access protected route (e.g., `/dashboard`)
2. If not authenticated → Redirected to sign-in
3. After sign-in → Redirected back to original route

## Authentication Hook Usage

```tsx
import { useAuth } from '@unpuzzle/auth';

function Component() {
  const { user, isLoading, login, logout } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.first_name}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={login}>Login</button>
      )}
    </div>
  );
}
```

## Benefits of Custom Authentication

### 1. **Simplified Architecture**
- No external service dependencies
- Direct integration with existing backend
- Consistent user data across all apps

### 2. **Cost Effective**
- No third-party authentication service fees
- Full control over user management
- Scalable without per-user costs

### 3. **Maintainable**
- Custom logic can be modified as needed
- No vendor lock-in
- Consistent with instructor app architecture

### 4. **Security**
- Direct control over security policies
- Custom session management
- Integration with existing user database

## Testing Checklist

- [ ] Home page loads without authentication
- [ ] Registration flow creates new account
- [ ] Sign in flow authenticates existing users
- [ ] Protected routes redirect to sign-in when not authenticated
- [ ] User profile shows correct user info in dashboard
- [ ] Sign out clears user state and returns to home page
- [ ] Navigation updates based on auth state
- [ ] User state persists across page refreshes

## Next Steps

1. **Profile Management**: Enhance user profile editing capabilities
2. **Password Reset**: Implement forgot password functionality
3. **Email Verification**: Add email verification if needed
4. **Role-Based Access**: Implement student-specific permissions
5. **Social Login**: Add OAuth integration if required

## Deployment Notes

When deploying:
1. Ensure all environment variables are configured
2. Verify backend API endpoints are accessible
3. Test authentication flow in staging environment
4. Monitor backend logs for authentication errors
5. Ensure CORS is properly configured for the student app domain