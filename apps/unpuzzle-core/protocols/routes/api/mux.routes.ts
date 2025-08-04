import { Router } from 'express';
import muxController from '../../controllers/api/mux.controller';

const router = Router();

// Create a new video upload
router.post('/upload', muxController.createUpload);

// Get video playback info
router.get('/playback/:id', muxController.getPlaybackInfo);

// Get video status
router.get('/status/:id', muxController.getVideoStatus);

// Delete video
router.delete('/:id', muxController.deleteVideo);

export default router; 