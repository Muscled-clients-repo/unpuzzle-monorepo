# Current Domain Setup

## Active Domains
- **Student App (Primary)**: https://unpuzzle-mono-repo-frontend.vercel.app
- **Instructor App**: https://unpuzzle-mono-repo-frontend-v9qa-mceveraj4.vercel.app

## Environment Variable Updates

### Student App Configuration
Update the following in your Vercel project settings for the student app:

```bash
NEXT_PUBLIC_API_URL=https://unpuzzle-ai-backend-9ce95198fbde.herokuapp.com
NEXT_PUBLIC_INSTRUCTOR_URL=https://unpuzzle-mono-repo-frontend-v9qa-mceveraj4.vercel.app
```

### Instructor App Configuration
Update the following in your Vercel project settings for the instructor app:

```bash
NEXT_PUBLIC_API_URL=https://unpuzzle-ai-backend-9ce95198fbde.herokuapp.com
NEXT_PUBLIC_STUDENT_URL=https://unpuzzle-mono-repo-frontend.vercel.app
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_aG9wZWZ1bC1za2luay0xNy5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_gAzXahOCkEUgdHPOewgALZ7vCtJ8DkyKNxc1zrveva
```

## Cross-App Navigation

To enable navigation between the apps, you'll need to update any navigation links:

### In Student App
```javascript
// Navigation to instructor portal
<a href="https://unpuzzle-mono-repo-frontend-v9qa-mceveraj4.vercel.app">
  Go to Instructor Portal
</a>
```

### In Instructor App
```javascript
// Navigation to student portal
<a href="https://unpuzzle-mono-repo-frontend.vercel.app">
  Go to Student Portal
</a>
```

## Quick Links for Testing
- Student App: https://unpuzzle-mono-repo-frontend.vercel.app
- Instructor App: https://unpuzzle-mono-repo-frontend-v9qa-mceveraj4.vercel.app

## Next Steps
1. Add the environment variables to both Vercel projects
2. Redeploy both apps to pick up the new environment variables
3. Test cross-app navigation
4. Verify authentication works on the instructor app with the Clerk keys

## Future Domain Migration
When you're ready to use unpuzzle.co:
1. Keep these Vercel URLs as fallbacks
2. Follow the DOMAIN_CONFIGURATION.md guide
3. Update environment variables with new domain URLs