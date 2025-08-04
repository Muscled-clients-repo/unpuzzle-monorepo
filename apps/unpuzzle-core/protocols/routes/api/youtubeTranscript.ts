import { Router } from "express";
import youtubeTranscriptController from "../../controllers/api/youtubeTranscript.controller";
const router = Router();

router.get("/:videoId", youtubeTranscriptController.getVideoById);
router.post("/:videoId", youtubeTranscriptController.CreateVideo);

export default router;
