import { Router } from 'express';
import StripeWebhookController from '../../controllers/api/stripeWebhook.controller';

const router = Router();

// Create checkout session for credit purchase
router.post('/create-checkout-session', StripeWebhookController.handleCreateCheckoutSession);

// Create checkout session for course purchase
router.post('/create-course-checkout-session', StripeWebhookController.handleCreateCourseCheckoutSession);

// Single Stripe webhook endpoint for all events
// IMPORTANT: Raw body parsing is handled in index.ts before this route
router.post('/webhook', StripeWebhookController.webhookHandler);

export default router;