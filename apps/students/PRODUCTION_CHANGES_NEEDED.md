# Production Changes Needed for Student App

## 🚨 Critical Issues Found

### 1. Environment Variable Mismatch
**Issue**: The app uses `NEXT_PUBLIC_API_URL` but your .env.local has `NEXT_PUBLIC_CORE_SERVER_URL`

**Files affected**:
- `/app/context/UnpuzzleAiApi.ts` (line 17)
- `/app/services/videoExport.service.ts` (line 121)

**Fix Required**: Either:
- Option A: Update your code to use `NEXT_PUBLIC_CORE_SERVER_URL`
- Option B: Add `NEXT_PUBLIC_API_URL` to your environment variables in Vercel

### 2. Hardcoded Localhost URLs
**Issue**: Multiple Redux services have hardcoded `http://localhost:3001` URLs

**Files with hardcoded URLs**:
- `/app/redux/services/enroll.services.ts` (line 5)
- `/app/redux/services/puzzlePieces.services.ts` (line 5)
- `/app/redux/services/scripts.services.ts` (line 5)
- `/app/redux/services/userPermission.services.ts` (line 3)
- `/app/redux/services/user.services.ts` (line 3)
- `/app/hooks/useSocket.ts` (line 5)
- `/app/redux/services/quizzes.services.ts` (line 5)
- `/app/redux/services/video.services.ts` (line 5)
- `/app/redux/services/permission.services.ts` (line 6)
- `/app/redux/services/puzzleSolutions.services.ts` (line 5)

## 📋 Required Environment Variables for Vercel

Based on your current setup, add these to Vercel:

```bash
# Option 1: Add this to match your code
NEXT_PUBLIC_API_URL=https://dev.nazmulcodes.org

# Option 2: Keep your existing variables and update code
NEXT_PUBLIC_CORE_SERVER_URL=https://dev.nazmulcodes.org
NEXT_PUBLIC_M1_SERVER_URL=https://dev.nazmulcodes.org  # or your M1 server URL

# For cross-app navigation (optional)
NEXT_PUBLIC_INSTRUCTOR_APP_URL=https://unpuzzle-mono-repo-frontend-v9qa-mceveraj4.vercel.app
NEXT_PUBLIC_STUDENT_APP_URL=https://unpuzzle-mono-repo-frontend.vercel.app

# Clerk authentication (if used in student app)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_aG9wZWZ1bC1za2luay0xNy5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_gAzXahOCkEUgdHPOewgALZ7vCtJ8DkyKNxc1zrveva
```

## 🔧 Quick Fix Script

To fix all hardcoded URLs, run these commands:

```bash
# Create a base URL configuration file
cat > app/config/api.config.ts << 'EOF'
export const API_BASE_URL = process.env.NEXT_PUBLIC_CORE_SERVER_URL || process.env.NEXT_PUBLIC_API_URL || 'https://dev.nazmulcodes.org';
export const M1_BASE_URL = process.env.NEXT_PUBLIC_M1_SERVER_URL || API_BASE_URL;
EOF

# Update all Redux services to use the config
# You'll need to import { API_BASE_URL } from '@/config/api.config' in each service
# and replace hardcoded URLs with API_BASE_URL
```

## ⚠️ Important Notes

1. **localhost:3001 vs dev.nazmulcodes.org**: Verify that all endpoints available on localhost:3001 are also available on your production server

2. **CORS Configuration**: Ensure your backend at `dev.nazmulcodes.org` allows requests from:
   - `https://unpuzzle-mono-repo-frontend.vercel.app`
   - `https://*.vercel.app` (for preview deployments)

3. **WebSocket Support**: The `useSocket.ts` hook uses localhost:3001. Ensure your production server supports WebSocket connections

4. **No Cross-App Navigation Found**: The student app doesn't seem to have explicit links to the instructor app. You may want to add navigation if needed.

## 🚀 Deployment Checklist

- [ ] Decide on environment variable strategy (Option A or B)
- [ ] Add all required environment variables to Vercel
- [ ] Fix hardcoded localhost URLs in Redux services
- [ ] Verify CORS is configured on backend
- [ ] Test WebSocket connections in production
- [ ] Add cross-app navigation if needed
- [ ] Redeploy after changes