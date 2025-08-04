import { Router } from 'express';
import ordersController from '../../controllers/api/orders.controller';

const router = Router();

// Create payment intent
// router.post('/create-intent', ordersController.createPaymentIntent);
router.post('/', ordersController.createOrder);

export default router; 