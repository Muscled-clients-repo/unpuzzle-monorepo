import { NextFunction, Router } from "express";
import UploadMiddleware from "../../middleware/UploadMiddleware";
import puzzleReflectsController from "../../controllers/api/puzzleReflects.controller";
import { errorHandler } from "../../utility/errorHandler";
const router = Router();

router.post(
  "/audio",
  UploadMiddleware.singleFileUpload("file"),
  puzzleReflectsController.createAudioReflect
);
router.post(
  "/file-uploads",
  UploadMiddleware.multipleFileUpload("files"),
  puzzleReflectsController.createFileReflect
);
router.post("/loom-link", puzzleReflectsController.createLoomLinkReflect);

router.get("/all", puzzleReflectsController.getPuzzleReflects);
router.get("/:id", puzzleReflectsController.getPuzzleReflectById);

export default router;
