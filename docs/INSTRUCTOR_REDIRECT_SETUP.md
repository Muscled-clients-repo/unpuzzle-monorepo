# Instructor App Redirect Setup

## Problem
You want `https://unpuzzle-mono-repo-frontend.vercel.app/instructor` to redirect to the instructor app.

## Solution Implemented
I've added redirects in the student app's `next.config.ts` that will:
1. Redirect `/instructor` → Instructor app home page
2. Redirect `/instructor/*` → Corresponding path in instructor app

## How It Works
When someone visits:
- `https://unpuzzle-mono-repo-frontend.vercel.app/instructor` 
  → Redirects to `https://unpuzzle-mono-repo-frontend-v9qa-mceveraj4.vercel.app`

- `https://unpuzzle-mono-repo-frontend.vercel.app/instructor/courses`
  → Redirects to `https://unpuzzle-mono-repo-frontend-v9qa-mceveraj4.vercel.app/courses`

## Files Modified
1. **apps/students/next.config.ts**: Added redirect configuration
2. **apps/students/app/instructor-redirect/page.tsx**: Created fallback redirect page

## Important Notes
1. **Delete vercel.json** if it exists in the root - it will conflict with the Next.js configuration
2. After deployment, the redirects will work automatically
3. The redirects use the `NEXT_PUBLIC_INSTRUCTOR_APP_URL` environment variable if set

## Testing
After deployment:
1. Visit `https://unpuzzle-mono-repo-frontend.vercel.app/instructor`
2. You should be redirected to the instructor app
3. Any subpaths like `/instructor/settings` will also redirect properly

## Alternative Solutions

### Option A: Subdomain Approach (Recommended for production)
Instead of path-based routing, use:
- Student: `https://unpuzzle.co`
- Instructor: `https://instructor.unpuzzle.co`

### Option B: Single Deployment (Complex)
Deploy both apps from monorepo root with custom routing, but this requires significant configuration changes.

## Next Steps
1. Commit and push these changes
2. Deploy to Vercel
3. Test the redirect functionality
4. Consider implementing subdomain approach for cleaner URLs