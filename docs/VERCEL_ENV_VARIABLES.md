# Vercel Environment Variables Configuration

## Student App Environment Variables
Add these to your Student App in Vercel Dashboard:

```bash
# App URLs (update for production)
NEXT_PUBLIC_STUDENT_APP_URL=https://unpuzzle-mono-repo-frontend.vercel.app
NEXT_PUBLIC_INSTRUCTOR_APP_URL=https://unpuzzle-mono-repo-frontend-v9qa-mceveraj4.vercel.app

# API URLs
NEXT_PUBLIC_CORE_SERVER_URL=https://dev.nazmulcodes.org
NEXT_PUBLIC_M1_SERVER_URL=https://dev.nazmulcodes.org  # Update if you have a production M1 server

# Clerk Authentication (Student App)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_aG9wZWZ1bC1za2luay0xNy5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_gAzXahOCkEUgdHPOewgALZ7vCtJ8DkyKNxc1zrveva
CLERK_SIGN_IN_URL=/sign-in
CLERK_SIGN_UP_URL=/sign-up
CLERK_AFTER_SIGN_IN_URL=/dashboard  # Update based on your student app's main page
CLERK_AFTER_SIGN_UP_URL=/dashboard  # Update based on your student app's main page
```

## Instructor App Environment Variables
Add these to your Instructor App in Vercel Dashboard:

```bash
# App URLs (update for production)
NEXT_PUBLIC_STUDENT_APP_URL=https://unpuzzle-mono-repo-frontend.vercel.app
NEXT_PUBLIC_INSTRUCTOR_APP_URL=https://unpuzzle-mono-repo-frontend-v9qa-mceveraj4.vercel.app

# API URLs
NEXT_PUBLIC_CORE_SERVER_URL=https://dev.nazmulcodes.org
NEXT_PUBLIC_M1_SERVER_URL=https://dev.nazmulcodes.org  # Update if you have a production M1 server

# Clerk Authentication (Instructor App)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_aG9wZWZ1bC1za2luay0xNy5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_gAzXahOCkEUgdHPOewgALZ7vCtJ8DkyKNxc1zrveva
CLERK_SIGN_IN_URL=/sign-in
CLERK_SIGN_UP_URL=/sign-up
CLERK_AFTER_SIGN_IN_URL=/editor
CLERK_AFTER_SIGN_UP_URL=/editor
```

## How to Add in Vercel

1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Navigate to "Environment Variables" in the sidebar
4. Add each variable:
   - Enter the Key (e.g., `NEXT_PUBLIC_STUDENT_APP_URL`)
   - Enter the Value (e.g., `https://unpuzzle-mono-repo-frontend.vercel.app`)
   - Select environments: Production, Preview, Development
   - Click "Save"

## Important Notes

1. **API Compatibility**: Your code uses `NEXT_PUBLIC_CORE_SERVER_URL` instead of `NEXT_PUBLIC_API_URL`
   - Make sure your backend at `https://dev.nazmulcodes.org` is accessible
   - Update CORS settings on your backend to allow these Vercel domains

2. **Cross-App Navigation**: The app URLs will enable navigation between student and instructor apps

3. **Clerk Authentication**: Both apps are using the same Clerk application
   - This allows users to share authentication between apps
   - Consider if you need separate Clerk apps for student/instructor

4. **Production vs Development**: These are test Clerk keys (pk_test_, sk_test_)
   - For production, create production keys in Clerk dashboard

## Testing After Deployment

1. Verify API calls work: Check network tab for successful requests to `dev.nazmulcodes.org`
2. Test authentication: Sign in/up should work with Clerk
3. Test cross-app navigation: Links between student and instructor apps
4. Check console for any missing environment variables

## Update Your Code (Optional)

If you need to reference these URLs in your code:

```javascript
// For cross-app navigation
const instructorUrl = process.env.NEXT_PUBLIC_INSTRUCTOR_APP_URL;
const studentUrl = process.env.NEXT_PUBLIC_STUDENT_APP_URL;

// For API calls
const apiUrl = process.env.NEXT_PUBLIC_CORE_SERVER_URL;
```