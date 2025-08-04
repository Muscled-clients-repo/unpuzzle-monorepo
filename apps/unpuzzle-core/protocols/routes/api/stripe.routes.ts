import { Router } from 'express';
import express from 'express';
import StripeWebhookController from '../../controllers/api/stripeWebhook.controller';

const router = Router();

// Create checkout session for credit purchase
router.post('/create-checkout-session', StripeWebhookController.handleCreateCheckoutSession);

// Stripe webhook endpoint for credit purchases
// IMPORTANT: This route must use express.raw() middleware to preserve the raw body
// for Stripe signature verification
router.post(
  '/credit-webhook',
  express.raw({ type: 'application/json' }),
  StripeWebhookController.creditWebhook
);

export default router;