# Student App - Production Ready ✅

## Changes Made

### 1. Environment Variable Updates
- ✅ Updated `UnpuzzleAiApi.ts` to use `NEXT_PUBLIC_CORE_SERVER_URL`
- ✅ Updated `videoExport.service.ts` to use `NEXT_PUBLIC_CORE_SERVER_URL`
- ✅ Updated `env.d.ts` with correct TypeScript definitions

### 2. API Configuration
- ✅ Created `/app/config/api.config.ts` with centralized API configuration
- ✅ All API URLs now use environment variables
- ✅ No more hardcoded localhost URLs

### 3. Redux Services Updated
All Redux services now use the API configuration:
- ✅ enroll.services.ts
- ✅ puzzlePieces.services.ts
- ✅ scripts.services.ts
- ✅ quizzes.services.ts
- ✅ video.services.ts
- ✅ permission.services.ts
- ✅ puzzleSolutions.services.ts
- ✅ userPermission.services.ts
- ✅ user.services.ts

### 4. Hooks Updated
- ✅ useSocket.ts now uses `SOCKET_URL` from configuration

## Environment Variables for Vercel

Add these to your Student App in Vercel Dashboard:

```bash
# Required
NEXT_PUBLIC_CORE_SERVER_URL=https://dev.nazmulcodes.org
NEXT_PUBLIC_M1_SERVER_URL=https://dev.nazmulcodes.org

# Optional - for cross-app navigation
NEXT_PUBLIC_STUDENT_APP_URL=https://unpuzzle-mono-repo-frontend.vercel.app
NEXT_PUBLIC_INSTRUCTOR_APP_URL=https://unpuzzle-mono-repo-frontend-v9qa-mceveraj4.vercel.app

# Clerk (if authentication is needed in student app)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_aG9wZWZ1bC1za2luay0xNy5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_gAzXahOCkEUgdHPOewgALZ7vCtJ8DkyKNxc1zrveva
```

## Important Reminders

1. **CORS Configuration**: Ensure your backend at `dev.nazmulcodes.org` allows:
   - `https://unpuzzle-mono-repo-frontend.vercel.app`
   - `https://*.vercel.app` (for preview deployments)

2. **API Endpoints**: All Redux services now expect endpoints at:
   - `https://dev.nazmulcodes.org/api/enroll`
   - `https://dev.nazmulcodes.org/api/puzzlepieces`
   - `https://dev.nazmulcodes.org/api/scripts`
   - etc.

3. **WebSocket Support**: If using real-time features, ensure your M1 server supports WebSocket connections from Vercel domains

## Deployment Steps

1. Commit these changes to GitHub
2. Add environment variables in Vercel
3. Trigger a new deployment
4. Test all API calls and functionality

## What's Fixed

- ✅ No more hardcoded localhost URLs
- ✅ All API calls use environment variables
- ✅ TypeScript definitions match environment variables
- ✅ Centralized API configuration for easy maintenance
- ✅ Production-ready configuration

The student app is now ready for production deployment! 🚀