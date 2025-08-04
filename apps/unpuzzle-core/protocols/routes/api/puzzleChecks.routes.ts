import { Router } from "express";
import UploadMiddleware from "../../middleware/UploadMiddleware";
import puzzleChecksController from "../../controllers/api/puzzleChecks.controller";
const router = Router();

// Existing routes (keep for backward compatibility)
router.get("/", puzzleChecksController.generate);
router.get("/all", puzzleChecksController.getAllPuzzleChecks);

// New CRUD routes for the new schema
router.post("/", puzzleChecksController.createPuzzleCheck);
router.get("/:id", puzzleChecksController.getPuzzleCheckById);
router.put("/:id", puzzleChecksController.updatePuzzleCheck);
router.delete("/:id", puzzleChecksController.deletePuzzleCheck);
router.patch("/:id/submit", puzzleChecksController.submitAnswers);

export default router;
