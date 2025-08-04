import { Router } from 'express';
import WebhookClerkController from "../../controllers/api/webhook.clerk.controller"


const router = Router();

router.post('/clerk', WebhookClerkController.webhookClerk)

export default router; 