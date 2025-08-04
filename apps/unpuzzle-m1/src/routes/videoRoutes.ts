import { Router } from "express";
import multer from "multer";
import VideoController from "../controller/videoController";

const router = Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/temp/',
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  }
});

router.get("/upload", VideoController.getUploadId)

// Upload video chunk
router.post("/upload", upload.single('file'), VideoController.streamUpload);

// Get upload status
router.get("/status/:fileId", VideoController.getUploadStatus);

export default router;