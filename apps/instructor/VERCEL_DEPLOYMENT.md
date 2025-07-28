# Vercel Deployment Guide for Instructor App

## Environment Variables Required

To deploy the instructor app on Vercel, you need to add the following environment variables in your Vercel project settings:

### Required for Build:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
```

### Optional Clerk URLs:
```
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### API URL:
```
NEXT_PUBLIC_API_URL=https://unpuzzle-ai-backend-9ce95198fbde.herokuapp.com
```

## How to Add Environment Variables in Vercel:

1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Navigate to "Environment Variables"
4. Add each variable with its value
5. Select the environments where they should be available (Production, Preview, Development)
6. Save changes

## Getting Clerk Keys:

1. Sign up for a Clerk account at https://clerk.com
2. Create a new application
3. Go to API Keys section in your Clerk dashboard
4. Copy the Publishable Key and Secret Key
5. Add them to Vercel environment variables

## Build Configuration:

The app is configured to handle missing Clerk keys gracefully during build:
- Middleware checks for keys before initializing Clerk
- Layout component conditionally wraps with ClerkProvider
- ESLint and TypeScript errors are ignored during build

## Post-Deployment:

After deployment with proper environment variables:
1. Authentication will work correctly
2. Protected routes will require sign-in
3. User management features will be available

## Troubleshooting:

If build still fails:
1. Ensure all environment variables are added in Vercel
2. Check that variable names match exactly (case-sensitive)
3. Redeploy after adding variables
4. Check build logs for specific error messages