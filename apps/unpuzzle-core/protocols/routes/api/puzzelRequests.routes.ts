import { Router } from "express";
import UploadMiddleware from "../../middleware/UploadMiddleware";
import puzzleRequestsController from "../../controllers/api/puzzleRequests.controller";
const router = Router();

router.get("/", puzzleRequestsController.getPuzzleRequest);

export default router;
