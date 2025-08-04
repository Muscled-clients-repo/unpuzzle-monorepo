import { Router } from "express";
import CourseController from "../../controllers/api/course.controller"; 
import ClerkClient from "../../middleware/ClerkClient";

const router = Router();

router.use(ClerkClient.requiredAuth)

// Get all activity logs with pagination
router.get("/", CourseController.getAllCourse);

// Get activity log by ID
router.get("/:id", CourseController.getCourseById);


// Create new activity log
router.post("/", CourseController.createCourse);

// Update activity log by ID
router.put("/:id", CourseController.updateCourse);

// Delete activity log by ID
router.delete("/:id", CourseController.deleteCourse);

export default router;
