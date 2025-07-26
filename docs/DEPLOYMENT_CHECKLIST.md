# Deployment Checklist

## Pre-Deployment Steps

### 1. **Environment Setup**
- [ ] Create `.env.local` files for each app with required variables:
  ```
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
  CLERK_SECRET_KEY=
  NEXT_PUBLIC_API_URL=
  ```

### 2. **Fix Build Issues**
- [ ] Fix TypeScript errors in instructor app
- [ ] Run `pnpm build` successfully
- [ ] Test with `pnpm start` after build

### 3. **Prepare Repository**
- [ ] Push code to GitHub
- [ ] Ensure `.gitignore` excludes sensitive files
- [ ] Add README with setup instructions

## Vercel Deployment

### Option 1: Single Project (Recommended)

1. **Connect to Vercel**
   ```bash
   vercel login
   vercel
   ```

2. **Configure in Vercel Dashboard**
   - Framework Preset: `Next.js`
   - Build Command: `pnpm turbo build`
   - Install Command: `pnpm install`
   - Root Directory: `./`

3. **Add Environment Variables**
   Go to Project Settings > Environment Variables and add:
   - All variables from `.env.local`
   - Set for Production, Preview, and Development

4. **Deploy**
   ```bash
   vercel --prod
   ```

### Option 2: Separate Projects

Deploy each app as a separate Vercel project:

1. **Client App**
   ```bash
   cd apps/client
   vercel --name unpuzzle-client
   ```

2. **Instructor App**
   ```bash
   cd apps/instructor
   vercel --name unpuzzle-instructor
   ```
   Set env: `NEXT_PUBLIC_BASE_PATH=/instructor`

3. **Student App**
   ```bash
   cd apps/student
   vercel --name unpuzzle-student
   ```
   Set env: `NEXT_PUBLIC_BASE_PATH=/student`

## Domain Configuration

### For Custom Domain (unpuzzle.com):

1. **Add Domain in Vercel**
   - Go to Project Settings > Domains
   - Add your domain

2. **Configure DNS**
   - Add CNAME record pointing to `cname.vercel-dns.com`
   - Or use Vercel nameservers

3. **Setup Routing**
   The `vercel.json` already handles path routing

## Post-Deployment

### 1. **Verify Deployment**
- [ ] Check main site: `https://your-domain.vercel.app`
- [ ] Check instructor: `https://your-domain.vercel.app/instructor`
- [ ] Check student: `https://your-domain.vercel.app/student`

### 2. **Monitor**
- [ ] Enable Vercel Analytics
- [ ] Setup error tracking (Sentry)
- [ ] Check logs in Vercel dashboard

### 3. **Optimize**
- [ ] Enable ISR where appropriate
- [ ] Configure caching headers
- [ ] Monitor Core Web Vitals

## Troubleshooting

### Common Issues:

1. **404 on sub-paths**: Check `basePath` in next.config.js
2. **Missing env vars**: Verify all required variables are set
3. **Build failures**: Check Node version (needs 18+)
4. **API errors**: Verify API_URL is correct for production

## Quick Deploy Commands

```bash
# Build locally first
pnpm build

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment
vercel ls
```