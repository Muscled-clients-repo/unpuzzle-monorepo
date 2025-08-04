import { Router } from "express";
import UploadMiddleware from "../../middleware/UploadMiddleware";
import puzzlePathController from "../../controllers/api/puzzlePath.controller";
const router = Router();

router.get(
  "/",
  puzzlePathController.getPuzzlePath
);

router.get("/all", puzzlePathController.getAllPuzzlePaths);

router.get("/:id", puzzlePathController.getPuzzlePathById);

router.post(
  "/suggested-video",
  UploadMiddleware.formData(),
  puzzlePathController.getSuggestedVideo
);



export default router;
