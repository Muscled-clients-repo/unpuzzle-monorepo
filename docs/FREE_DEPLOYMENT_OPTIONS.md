# Free Deployment Options for Monorepo

Since Vercel requires a Pro plan for monorepo deployments, here are several free alternatives:

## Option 1: Deploy Each App Separately on Vercel (FREE)

Deploy each app as individual Vercel projects and use routing:

### Steps:

1. **Deploy Client App**
   ```bash
   cd apps/client
   vercel --name unpuzzle-client
   ```
   - Gets URL: `unpuzzle-client.vercel.app`

2. **Deploy Instructor App** 
   ```bash
   cd apps/instructor
   vercel --name unpuzzle-instructor
   ```
   - Gets URL: `unpuzzle-instructor.vercel.app`

3. **Deploy Student App**
   ```bash
   cd apps/student  
   vercel --name unpuzzle-student
   ```
   - Gets URL: `unpuzzle-student.vercel.app`

4. **Configure Routing in Client App**
   Add to `apps/client/vercel.json`:
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

## Option 2: Netlify (FREE)

Netlify supports monorepos on free tier with build plugins:

### Setup:
1. Connect GitHub repo to Netlify
2. Configure build settings:
   ```
   Build command: npm run build
   Publish directory: apps/client/.next
   ```
3. Use Netlify redirects for routing

## Option 3: Railway (FREE Tier)

Railway offers generous free tier for monorepos:

### Steps:
1. Connect GitHub to Railway
2. Deploy each app as separate service
3. Configure custom domains/subdomains

## Option 4: Render (FREE)

### Setup:
1. Create separate Render services for each app
2. Configure build commands per app
3. Use Render's routing features

## Option 5: Self-Hosted (FREE)

Deploy on free VPS providers:

### Providers:
- **Oracle Cloud** (Always Free tier)
- **Google Cloud** ($300 credit)
- **AWS** (12 months free tier)
- **Digital Ocean** ($200 credit)

### Setup:
```bash
# Install Docker & Docker Compose
# Use provided docker-compose.yml
docker-compose up -d

# Or use PM2
npm install -g pm2
pm2 start ecosystem.config.js
```

## Option 6: GitHub Pages + GitHub Actions

For static deployments:

### Setup:
1. Configure GitHub Actions for build
2. Deploy to GitHub Pages
3. Use GitHub Pages routing

## Recommended Approach for Free Deployment

### Strategy: Separate Vercel Apps + Custom Domain

1. **Deploy 3 separate Vercel apps** (all free)
2. **Get a free domain** from:
   - Freenom (.tk, .ml, .ga domains)
   - GitHub Student Pack (if student)
   - Or buy cheap domain ($1-10/year)

3. **Configure DNS routing**:
   - `unpuzzle.com` → Client app
   - `unpuzzle.com/instructor` → Instructor app (via rewrites)
   - `unpuzzle.com/student` → Student app (via rewrites)

### Benefits:
- ✅ Completely free
- ✅ Each app deploys independently
- ✅ Vercel's performance and CDN
- ✅ Auto-deployments from GitHub
- ✅ Custom domain support

### Drawbacks:
- 🔸 Slightly more complex routing setup
- 🔸 3 separate deployments to manage
- 🔸 Need to coordinate updates across apps

## Quick Start: Separate Vercel Deployments

Let's set this up right now:

```bash
# 1. Deploy client app
cd apps/client
vercel

# 2. Deploy instructor app  
cd ../instructor
vercel

# 3. Deploy student app
cd ../student
vercel
```

Each will get its own domain, then configure routing in the main app.

## Cost Comparison

| Platform | Monorepo Support | Free Tier | Pro Cost |
|----------|------------------|-----------|----------|
| Vercel | Pro plan only | No | $20/month |
| Netlify | Yes | Yes | $19/month |
| Railway | Yes | 500 hours/month | $5/month |
| Render | Yes | 750 hours/month | $7/month |
| Self-hosted | Yes | Yes (VPS needed) | $5-20/month |

**Recommendation**: Start with separate Vercel apps (free) or try Railway/Render for true monorepo support.