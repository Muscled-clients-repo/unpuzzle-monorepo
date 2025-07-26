# Render Deployment Guide

## Service Types on Render

### Option 1: Web Service (Recommended)

Deploy each app as a separate **Web Service**:

#### Steps:

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Sign up/login with GitHub

2. **Create Client App Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo: `Muscled-clients-repo/unpuzzle-mono-repo-frontend`
   - Configure:
     ```
     Name: unpuzzle-client
     Environment: Node
     Build Command: cd apps/client && npm install && npm run build
     Start Command: cd apps/client && npm start
     ```

3. **Create Instructor App Service**
   - Click "New +" → "Web Service"
   - Same repo: `Muscled-clients-repo/unpuzzle-mono-repo-frontend`
   - Configure:
     ```
     Name: unpuzzle-instructor
     Environment: Node
     Build Command: cd apps/instructor && npm install && npm run build
     Start Command: cd apps/instructor && npm start
     ```

4. **Create Student App Service**
   - Click "New +" → "Web Service"
   - Same repo: `Muscled-clients-repo/unpuzzle-mono-repo-frontend`
   - Configure:
     ```
     Name: unpuzzle-student
     Environment: Node  
     Build Command: cd apps/student && npm install && npm run build
     Start Command: cd apps/student && npm start
     ```

### Option 2: Static Site (If apps are static)

If your apps can be built as static sites:

1. **Deploy as Static Sites**
   - Click "New +" → "Static Site"
   - Configure build commands to generate static files
   - Lower resource usage, faster deployment

## Recommended Configuration

### For Each Web Service:

```yaml
# Environment Variables (add in Render dashboard)
NODE_ENV=production
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
NEXT_PUBLIC_API_URL=your_api_url

# Build Settings
Build Command: pnpm install && pnpm build --filter=[app-name]
Start Command: pnpm start --filter=[app-name]
```

### Root Directory Setup:

Set these for each service:
- **Client**: Root directory = `apps/client`
- **Instructor**: Root directory = `apps/instructor`  
- **Student**: Root directory = `apps/student`

## URLs After Deployment

After deployment, you'll get:
- Client: `https://unpuzzle-client.onrender.com`
- Instructor: `https://unpuzzle-instructor.onrender.com`
- Student: `https://unpuzzle-student.onrender.com`

## Configure Custom Domain (Optional)

1. **Buy a domain** (or use free subdomain)
2. **In Render dashboard** → Settings → Custom Domains
3. **Add domain** and configure DNS
4. **Setup routing** in main app to redirect to subdomains

## Free Tier Limits

Render Free Tier includes:
- ✅ 750 hours/month per service
- ✅ Automatic SSL certificates
- ✅ Custom domains
- ✅ GitHub auto-deployments
- ❌ Apps sleep after 15 minutes of inactivity
- ❌ 512MB RAM limit

## Pro Tips

1. **Use Web Services** for dynamic Next.js apps
2. **Set proper Node version** in package.json
3. **Configure environment variables** for each service
4. **Use health checks** to prevent sleeping (paid feature)
5. **Monitor build logs** for debugging

## Alternative: Single Service with Nginx

Deploy everything as one service with Nginx routing:

```dockerfile
# Dockerfile approach
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN pnpm install && pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

## Quick Start Commands

For each service in Render:

```bash
# Build Command
pnpm install && pnpm turbo build --filter=[app-name]

# Start Command  
pnpm start --filter=[app-name]
```

Replace `[app-name]` with:
- `@unpuzzle/client`
- `unpuzzle-ai-frontend` 
- `@unpuzzle/student`