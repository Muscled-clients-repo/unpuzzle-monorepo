# Vercel Deployment Guide

This guide explains how to deploy the Unpuzzle monorepo to Vercel with multiple Next.js apps under a single domain.

## Deployment Options

### Option 1: Single Project Deployment (Recommended)

Deploy all apps as a single Vercel project with path-based routing.

#### Steps:

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Root**
   ```bash
   # From the monorepo root
   vercel
   ```

4. **Configure Project Settings in Vercel Dashboard**
   - Build Command: `pnpm turbo build`
   - Output Directory: Leave empty (automatic detection)
   - Install Command: `pnpm install`
   - Root Directory: `./`

5. **Environment Variables**
   Add these in Vercel dashboard:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
   CLERK_SECRET_KEY=your_secret
   # Add other env variables as needed
   ```

### Option 2: Multi-Project Deployment

Deploy each app as a separate Vercel project.

#### For Each App:

1. **Client App (unpuzzle.com)**
   ```bash
   cd apps/client
   vercel --name unpuzzle-client
   ```
   - No basePath needed
   - Domain: unpuzzle.com

2. **Instructor App (unpuzzle.com/instructor)**
   ```bash
   cd apps/instructor
   NEXT_PUBLIC_BASE_PATH=/instructor vercel --name unpuzzle-instructor
   ```
   - Configure domain: unpuzzle.com/instructor
   - Set env: `NEXT_PUBLIC_BASE_PATH=/instructor`

3. **Student App (unpuzzle.com/student)**
   ```bash
   cd apps/student
   NEXT_PUBLIC_BASE_PATH=/student vercel --name unpuzzle-student
   ```
   - Configure domain: unpuzzle.com/student
   - Set env: `NEXT_PUBLIC_BASE_PATH=/student`

#### Configure Routing in Main Project

In your main project (client), add redirects in `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/instructor/:path*",
      "destination": "https://unpuzzle-instructor.vercel.app/instructor/:path*"
    },
    {
      "source": "/student/:path*",
      "destination": "https://unpuzzle-student.vercel.app/student/:path*"
    }
  ]
}
```

## Build Configuration

### Root package.json Scripts
```json
{
  "scripts": {
    "build": "turbo build",
    "build:client": "turbo build --filter=@unpuzzle/client",
    "build:instructor": "turbo build --filter=@unpuzzle/instructor",
    "build:student": "turbo build --filter=@unpuzzle/student"
  }
}
```

### Turbo Configuration
The `turbo.json` is already configured with proper build dependencies and caching.

## Environment Variables

### Required for All Apps:
- `NEXT_PUBLIC_API_URL` - Your API endpoint
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk auth key
- `CLERK_SECRET_KEY` - Clerk secret

### App-Specific:
- `NEXT_PUBLIC_BASE_PATH` - Set only for sub-path apps (/instructor, /student)

## Deployment Workflow

### Automatic Deployments
1. Connect your GitHub repo to Vercel
2. Set up automatic deployments on push to main
3. Configure preview deployments for PRs

### Manual Deployment
```bash
# Deploy all apps
pnpm deploy:vercel

# Deploy specific app
vercel --filter=@unpuzzle/instructor
```

## Troubleshooting

### Common Issues:

1. **404 errors on sub-paths**
   - Ensure basePath is correctly set in next.config.ts
   - Check rewrites in vercel.json

2. **Build failures**
   - Verify all dependencies are in package.json
   - Check Node version compatibility (>=18)

3. **Static assets not loading**
   - Verify assetPrefix matches basePath
   - Check image optimization settings

4. **Environment variables not working**
   - Ensure NEXT_PUBLIC_ prefix for client-side vars
   - Rebuild after adding new env vars

### Debug Commands:
```bash
# Check build locally
pnpm build

# Test production build
pnpm build && pnpm start

# Verify turbo config
pnpm turbo run build --dry-run
```

## Performance Optimization

1. **Enable ISR (Incremental Static Regeneration)**
   ```typescript
   export const revalidate = 3600; // revalidate every hour
   ```

2. **Configure Image Optimization**
   Already configured in next.config.ts

3. **Enable Turbo Remote Caching**
   ```bash
   npx turbo link
   ```

## Monitoring

1. **Vercel Analytics**
   - Enable in Vercel dashboard
   - Add `@vercel/analytics` package

2. **Error Tracking**
   - Consider Sentry integration
   - Monitor build logs in Vercel dashboard

## Cost Optimization

1. **Use Vercel's Edge Network**
   - Automatic with Vercel deployment

2. **Optimize Build Times**
   - Turbo caching reduces rebuild time
   - Use `turbo-ignore` for unchanged apps

3. **Monitor Usage**
   - Check Vercel dashboard for bandwidth/invocations
   - Set up usage alerts