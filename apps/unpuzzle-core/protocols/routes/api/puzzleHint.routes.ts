import { Router } from "express";
import UploadMiddleware from "../../middleware/UploadMiddleware";
import puzzleHintsController from "../../controllers/api/puzzleHints.controller";
const router = Router();

router.post("/", puzzleHintsController.generatePuzzleHintForTimestamp);
router.post("/create", puzzleHintsController.createPuzzleHint);
router.get("/", puzzleHintsController.getPuzzleHint);
router.get("/all", puzzleHintsController.getAllPuzzleHints);
router.get("/:id", puzzleHintsController.getPuzzleHintById);

export default router;
