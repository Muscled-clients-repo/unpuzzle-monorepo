import { Router } from "express";
import whisperController from "../../controllers/api/whisper.controller";
import uploadMiddleware from "../../middleware/UploadMiddleware";
const router = Router();

// Transcribe audio file
router.post(
  "/transcribe",
  uploadMiddleware.singleFileUpload("audioFile"),
  whisperController.transcribeAudio
);

// Get transcription status
router.get("/status/:id", whisperController.getTranscriptionStatus);

export default router;
