# Fix for Redirect Issue

## Problem
The `/courses` route was redirecting to the instructor app domain instead of staying on the student app.

## Cause
The redirects in `apps/students/next.config.ts` were interfering with normal routing.

## Solution Applied
1. **Removed the redirects** from `apps/students/next.config.ts`
2. **Kept only the Vercel rewrites** in the root `vercel.json`

## How It Works Now
- `/courses` and other student routes → Stay on student app
- `/instructor` → Proxied to instructor app (via Vercel rewrites)
- `/instructor/*` → Proxied to instructor app with path preserved

## Files Changed
- `apps/students/next.config.ts` - Removed the `redirects()` function

## Files to Delete
Please delete these if they exist:
- `/apps/students/app/instructor-redirect/` directory
- Any root-level Next.js files created earlier

## Testing
After deployment:
1. `/courses` should stay on the student app
2. `/instructor` should show the instructor app (but keep the same domain)
3. All student routes should work normally

## Next Steps
1. Delete the files listed above
2. Commit and push the changes
3. The Vercel deployment will automatically update