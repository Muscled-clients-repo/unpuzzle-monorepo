# Stripe Integration Setup Guide

## Environment Variables Required

### Backend (unpuzzle-core)

Add these to your `.env` file:

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_live_xxxxx  # Your Stripe secret key (starts with sk_)
STRIPE_WEBHOOK_SECRET=whsec_xxxxx  # Webhook signing secret from Stripe Dashboard
```

### Frontend Apps (students & instructor)

Add these to your `.env.local` file:

```bash
# Stripe Publishable Key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx  # Your Stripe publishable key (starts with pk_)
```

## Getting Your Keys

### 1. API Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API Keys**
3. Copy:
   - **Publishable key** (pk_live_xxx or pk_test_xxx)
   - **Secret key** (sk_live_xxx or sk_test_xxx)

### 2. Webhook Secret
1. Go to **Developers** → **Webhooks**
2. Add endpoint URL: `https://your-domain.com/api/stripe/course-webhook`
3. Select events:
   - `checkout.session.completed`
4. Copy the **Signing secret** (whsec_xxx)

## Important Notes

⚠️ **Security Best Practices:**
- Never commit keys to version control
- Use test keys for development (`sk_test_`, `pk_test_`)
- Use live keys for production (`sk_live_`, `pk_live_`)
- Keep secret keys (`sk_`) only on the server
- Publishable keys (`pk_`) can be used on the client

## Webhook Endpoints

The following webhook endpoints are available:

1. **Course Purchase Webhook**
   - URL: `/api/stripe/course-webhook`
   - Events: `checkout.session.completed`
   - Purpose: Handles course enrollments after payment

2. **Credit Purchase Webhook**
   - URL: `/api/stripe/credit-webhook`
   - Events: `checkout.session.completed`
   - Purpose: Handles credit balance updates after payment

## Testing

For local development and testing:

1. Use Stripe CLI for webhook testing:
```bash
stripe listen --forward-to localhost:3001/api/stripe/course-webhook
```

2. Use test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

## Package Usage

The Stripe integration is available as a shared package:

```typescript
import { 
  StripeProvider, 
  StripeCheckoutForm, 
  useStripeCheckout 
} from '@unpuzzle/stripe-integration';
```

## Current Issue to Fix

⚠️ **IMPORTANT**: The keys in `unpuzzle-core/.env` are currently swapped:
- `STRIPE_SECRET_KEY` contains a publishable key (pk_)
- `STRIPE_PUBLIC_KEY` contains a secret key (sk_)

Please update them to:
```bash
STRIPE_SECRET_KEY=sk_live_xxxxx  # Your actual secret key here
STRIPE_WEBHOOK_SECRET=whsec_xxxxx  # Get from Stripe Dashboard
```