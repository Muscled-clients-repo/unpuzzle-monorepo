# Railway Deployment Guide

Railway offers excellent monorepo support and will deploy all 3 apps simultaneously.

## Quick Setup

### Step 1: Connect to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose: `Muscled-clients-repo/unpuzzle-mono-repo-frontend`

### Step 2: Automatic Detection
Railway will automatically:
- ✅ Detect the `railway.toml` configuration
- ✅ Create 3 services (client, instructor, student)
- ✅ Configure environment variables
- ✅ Set up proper build commands
- ✅ Deploy all apps simultaneously

### Step 3: Your Live URLs
After deployment:
- **Client**: `https://unpuzzle-client-production.up.railway.app`
- **Instructor**: `https://unpuzzle-instructor-production.up.railway.app/instructor`
- **Student**: `https://unpuzzle-student-production.up.railway.app/student`

## Configuration Details

### Environment Variables (Pre-configured)
All environment variables are set in `railway.toml`:
- Clerk authentication keys
- API endpoints
- Server configurations

### Build Process
Each service builds independently:
```bash
npm ci && npm run build
npm start
```

### Free Tier Limits
- ✅ 500 hours/month execution time
- ✅ $5 credit per month
- ✅ Automatic SSL certificates
- ✅ Custom domains
- ✅ No sleeping (unlike Render)

## Manual Configuration (if needed)

If railway.toml doesn't work automatically:

### Client Service
```
Name: unpuzzle-client
Root Directory: apps/client
Build Command: npm ci && npm run build
Start Command: npm start
```

### Instructor Service
```
Name: unpuzzle-instructor
Root Directory: apps/instructor
Build Command: npm ci && npm run build
Start Command: npm start
```

### Student Service
```
Name: unpuzzle-student
Root Directory: apps/student
Build Command: npm ci && npm run build
Start Command: npm start
```

## Benefits over Render

1. **True monorepo support** - detects multiple services automatically
2. **No sleeping** - apps stay alive
3. **Better build detection** - works with npm workspaces
4. **Simpler configuration** - one file deploys everything
5. **More reliable** - fewer build failures

## Troubleshooting

### If deployment fails:
1. Check Railway dashboard logs
2. Verify Node.js version (should use 20.x)
3. Check environment variables
4. Ensure all package-lock.json files exist

### Common Issues:
- **Build timeout**: Railway has generous timeouts, should work
- **Memory limits**: Each service gets 512MB by default
- **Port configuration**: Railway auto-assigns ports

## Custom Domains

To use custom domains:
1. Go to each service settings
2. Add custom domain
3. Configure DNS records
4. Railway provides automatic SSL

## Cost Optimization

Free tier should be sufficient for development:
- All 3 apps consume ~150-200 hours/month combined
- Upgrade to Pro ($5/month) if needed

Railway is the best choice for Next.js monorepos! 🚂