# Domain Configuration for unpuzzle.co

## Current Setup
- Student App: https://unpuzzle-mono-repo-frontend.vercel.app
- Instructor App: https://unpuzzle-mono-repo-frontend-v9qa-mceveraj4.vercel.app

## Desired Setup
- Student App (Primary): https://unpuzzle.co
- Instructor App: https://instructor.unpuzzle.co

## Step-by-Step Configuration

### 1. Configure Student App (Primary Domain)

1. Go to your **Student App** project in Vercel Dashboard
2. Navigate to **Settings** → **Domains**
3. Add `unpuzzle.co` as a domain
4. Follow Vercel's instructions to update your DNS records:
   - Add an A record pointing to `76.76.21.21`
   - Or add a CNAME record pointing to `cname.vercel-dns.com`

### 2. Configure Instructor App (Subdomain)

1. Go to your **Instructor App** project in Vercel Dashboard
2. Navigate to **Settings** → **Domains**
3. Add `instructor.unpuzzle.co` as a domain
4. Update DNS records:
   - Add a CNAME record for `instructor` pointing to `cname.vercel-dns.com`

### 3. DNS Configuration (at your domain registrar)

Add these DNS records at your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.):

```
Type    Name        Value
A       @           76.76.21.21
CNAME   instructor  cname.vercel-dns.com
```

### 4. Update Environment Variables

After domain configuration, update the API URLs in both apps:

**Student App (.env):**
```
NEXT_PUBLIC_API_URL=https://unpuzzle-ai-backend-9ce95198fbde.herokuapp.com
NEXT_PUBLIC_INSTRUCTOR_URL=https://instructor.unpuzzle.co
```

**Instructor App (.env):**
```
NEXT_PUBLIC_API_URL=https://unpuzzle-ai-backend-9ce95198fbde.herokuapp.com
NEXT_PUBLIC_STUDENT_URL=https://unpuzzle.co
```

### 5. Cross-Domain Navigation

To enable navigation between apps, update any links:

**In Student App:**
```javascript
// Link to instructor app
<a href="https://instructor.unpuzzle.co">Go to Instructor Portal</a>
```

**In Instructor App:**
```javascript
// Link to student app
<a href="https://unpuzzle.co">Go to Student Portal</a>
```

## Alternative: Path-Based Routing (Single Deployment)

If you prefer path-based routing (unpuzzle.co/instructor), you can:

1. Deploy both apps from the monorepo root
2. Use Next.js rewrites in the root next.config.js:

```javascript
module.exports = {
  async rewrites() {
    return [
      {
        source: '/instructor/:path*',
        destination: '/apps/instructor/:path*',
      },
      {
        source: '/:path*',
        destination: '/apps/students/:path*',
      },
    ];
  },
};
```

## SSL Certificates

Vercel automatically provisions SSL certificates for custom domains. No additional configuration needed.

## Verification Steps

1. Wait for DNS propagation (5-30 minutes)
2. Test domains:
   - https://unpuzzle.co → Student App
   - https://instructor.unpuzzle.co → Instructor App
3. Verify SSL certificates are active
4. Test cross-app navigation

## Troubleshooting

- **Domain not working**: Check DNS propagation with `dig unpuzzle.co`
- **SSL errors**: Wait for Vercel to provision certificates (can take up to 24 hours)
- **Wrong app loading**: Verify domain is added to correct Vercel project