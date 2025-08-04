import { Router } from 'express';
import userController from '../../controllers/api/user.controller';

const router = Router();

// Get all users (admin endpoint)
router.get('/', userController.getAllUsers);

// Get user by ID with credit information
router.get('/:userId', userController.getUserById);

// Get user's credit information only
router.get('/:userId/credits', userController.getUserCredits);

// Get user's transaction history
router.get('/:userId/transactions', userController.getUserTransactions);

export default router;