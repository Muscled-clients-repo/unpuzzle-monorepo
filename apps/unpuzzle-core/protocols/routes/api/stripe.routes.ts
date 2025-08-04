import { Router } from 'express';
import express from 'express';
import StripeWebhookController from '../../controllers/api/stripeWebhook.controller';

const router = Router();

// Create checkout session for credit purchase
router.post('/create-checkout-session', StripeWebhookController.handleCreateCheckoutSession);

// Create checkout session for course purchase
router.post('/create-course-checkout-session', StripeWebhookController.handleCreateCourseCheckoutSession);

// Stripe webhook endpoint for credit purchases
// IMPORTANT: This route must use express.raw() middleware to preserve the raw body
// for Stripe signature verification
router.post(
  '/credit-webhook',
  express.raw({ type: 'application/json' }),
  StripeWebhookController.creditWebhook
);

// Stripe webhook endpoint for course purchases
router.post(
  '/course-webhook',
  express.raw({ type: 'application/json' }),
  StripeWebhookController.courseWebhook
);

export default router;