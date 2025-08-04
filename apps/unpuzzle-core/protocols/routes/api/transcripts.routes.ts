import { Router } from "express";
import UploadMiddleware from "../../middleware/UploadMiddleware";
import transcriptsController from "../../controllers/api/transcripts.controller";
const router = Router();

router.get("/", transcriptsController.getTranscripts);
router.post("/", transcriptsController.createTranscript);
router.post("/upload", UploadMiddleware.singleFileUpload("srtFile"), transcriptsController.uploadTranscript);

export default router;
