# Vercel Dashboard Configuration

Since you're configuring via Vercel dashboard, here are the settings you need:

## For Student App (Root Landing Page)
1. **Root Directory**: `apps/student`
2. **Framework Preset**: Next.js (auto-detected)
3. **Build Command**: `npm run build:no-lint`
4. **Output Directory**: `.next` (default)
5. **Install Command**: `npm install` (default)

## For Instructor App (Separate Deployment)
1. **Root Directory**: `apps/instructor`
2. **Framework Preset**: Next.js (auto-detected)
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)
5. **Install Command**: `npm install` (default)

## For Student App (Separate Deployment)
1. **Root Directory**: `apps/student`
2. **Framework Preset**: Next.js (auto-detected)
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)
5. **Install Command**: `npm install` (default)

## Environment Variables
Each app may need its own environment variables. Check the `.env.example` files in each app directory.

## Notes
- The client app at root will link to the instructor and student apps
- Update the URLs in `apps/client/app/page.tsx` once you have the deployment URLs