import { Router } from "express";
import puzzleController from "../../controllers/api/puzzle.controller";
import UploadMiddleware from "../../middleware/UploadMiddleware";
import ClerkClient from "../../middleware/ClerkClient";
const router = Router();

// Apply authentication middleware to all routes
router.use(ClerkClient.getUser);
router.use(ClerkClient.requiredAuth);

// Get puzzle state
router.get("/state", (req, res) => {
  res.json({ message: "Puzzle state endpoint" });
});

// Submit puzzle solution
router.post("/solve", (req, res) => {
  res.json({ message: "Puzzle solution endpoint" });
});

// Get puzzle hint
router.post(
  "/hint",
  UploadMiddleware.formData(),
  puzzleController.generatePuzzleHintForTimestamp
);
// Get puzzle Check
router.get("/check", puzzleController.generatePuzzleCheckForTimestamp);
// Get puzzle video Suggestion
router.post(
  "/suggested-video",
  UploadMiddleware.formData(),
  puzzleController.getSuggestedVideo
);
export default router;
