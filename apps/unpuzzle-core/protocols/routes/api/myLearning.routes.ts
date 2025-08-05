import { Router } from "express";
import MyLearningController from "../../controllers/api/myLearning.controller"; 
import ClerkClient from "../../middleware/ClerkClient";

const router = Router();

router.use(ClerkClient.requiredAuth)

// Get enrolled courses for the authenticated user
router.get("/", MyLearningController.getMyEnrolledCourses);

export default router;