# Single Domain Setup for Multiple Apps

## The Challenge
You want `unpuzzle-mono-repo-frontend.vercel.app` to serve:
- Student app at `/` (root)
- Instructor app at `/instructor`

## Solution: Use Vercel's Monorepo Support

### Step 1: Update Root vercel.json
Create this configuration in your root directory:

```json
{
  "rewrites": [
    {
      "source": "/instructor",
      "destination": "https://unpuzzle-mono-repo-frontend-v9qa-mceveraj4.vercel.app"
    },
    {
      "source": "/instructor/:match*",
      "destination": "https://unpuzzle-mono-repo-frontend-v9qa-mceveraj4.vercel.app/:match*"
    }
  ]
}
```

### Step 2: Configure in Vercel Dashboard

1. **Keep your current setup** with two projects
2. **In the Student App project**, add the vercel.json rewrites
3. This will proxy requests from `/instructor` to the instructor app

### Alternative: True Single Deployment (Complex)

To truly serve both apps from one deployment, you would need to:

1. **Create a custom server** using Express or similar
2. **Build both apps** during deployment
3. **Route requests** based on path

This is complex and not recommended for Next.js apps.

## Recommended Solution: Subdomains

The cleanest approach is using subdomains:
- `app.unpuzzle.co` → Student app
- `instructor.unpuzzle.co` → Instructor app

Or:
- `unpuzzle.co` → Student app  
- `teach.unpuzzle.co` → Instructor app

## Why Path-Based Routing is Challenging

1. **Next.js apps are isolated**: Each Next.js app expects to be at the root
2. **Asset conflicts**: Both apps have their own `_next` directories
3. **Routing conflicts**: Middleware and routing from both apps would conflict
4. **Build complexity**: Would need custom build process

## Current Best Option

Use the rewrites in vercel.json to proxy `/instructor` routes to your instructor app. This gives the appearance of a single domain while keeping the apps separate.

## Implementation Steps

1. Delete the files listed in DELETE_THESE_FILES.txt
2. Update vercel.json with the rewrites above
3. Deploy the student app
4. Test accessing `/instructor`

The rewrites will make it appear as one domain while maintaining separate deployments.