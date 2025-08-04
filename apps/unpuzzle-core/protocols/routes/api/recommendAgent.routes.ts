import { Router } from "express";
import recommendAgentController from "../../controllers/api/recommendAgent.controller";
import UploadMiddleware from "../../middleware/UploadMiddleware";
import activityLogsMiddleware from "../../middleware/activityLogsMiddleware";
import recommendAgentMiddleware from "../../middleware/recommendAgentMiddleware";
import { errorHandler } from "../../utility/errorHandler";
const router = Router();

router.post(
  "/solution",
  UploadMiddleware.formData(),
  // activityLogsMiddleware.createActivityLogs,
  recommendAgentMiddleware.decideAgent,
  recommendAgentController.generateSolution
);
router.use(errorHandler);
export default router;
