import { Router } from "express";
import ClerkClient from "../../middleware/ClerkClient";
import ChapterController from "../../controllers/api/chapter.controller";
const router = Router();

router.use(ClerkClient.requiredAuth)

// Get all activity logs with pagination
router.get("/", ChapterController.getAllChapters);

// Get activity log by ID
router.get("/:id", ChapterController.getChapterById);


// Create new activity log
router.post("/", ChapterController.createChapter);

// Update activity log by ID
router.put("/:id", ChapterController.updateChapter);

// Delete activity log by ID
router.delete("/:id", ChapterController.deleteChapter);

export default router;
