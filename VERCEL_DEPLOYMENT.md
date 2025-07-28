# Vercel Deployment Guide for Unpuzzle Instructor App

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- Git repository with your code

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Navigate to the instructor app:
```bash
cd apps/instructor
```

3. Run Vercel:
```bash
vercel
```

4. Follow the prompts to link your project

### Option 2: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your Git repository
3. Configure the project:
   - **Root Directory**: `apps/instructor`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### Environment Variables

Add these environment variables in Vercel dashboard:

```env
# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Optional Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Application Settings
NEXT_PUBLIC_BASE_PATH=/instructor
NODE_ENV=production
```

### Post-Deployment

1. Your app will be available at: `https://your-project.vercel.app`
2. Set up a custom domain in Vercel settings if needed
3. Monitor deployment logs in Vercel dashboard

### Troubleshooting

- If build fails, check the build logs in Vercel dashboard
- Ensure all environment variables are properly set
- The app uses Node.js 20.x, which Vercel supports by default

### Important Notes

- The `vercel.json` in the instructor directory configures the deployment
- TypeScript errors are ignored during build (see next.config.js)
- The app is configured for Vercel's serverless environment