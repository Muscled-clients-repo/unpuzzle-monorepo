import { Router } from "express";
import UploadMiddleware from "../../middleware/UploadMiddleware";
import videosController from "../../controllers/api/videos.controller";
const router = Router();

router.get("/", videosController.getAllVideos)
router.get("/:videoId", videosController.getVideoById);
router.post("/:videoId/chapters/:chapterId", videosController.CreateVideo);

export default router;
