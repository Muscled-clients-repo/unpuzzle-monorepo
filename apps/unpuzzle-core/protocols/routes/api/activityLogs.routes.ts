import { Router } from "express";
import ActivityLogsController from "../../controllers/api/activityLogs.controller"; // Adjust path as needed

const router = Router();

// Get all activity logs with pagination
router.get("/", ActivityLogsController.getAllActivityLogs);

// Get activity log by ID
router.get("/:id", ActivityLogsController.getActivityLogById);

// Get latest
router.get(
  "/latest-log/:videoId/:userId",
  ActivityLogsController.getLatestActivityLog
);

// Create new activity log
router.post("/", ActivityLogsController.createActivityLog);

// Update activity log by ID
router.put("/:id", ActivityLogsController.updateActivityLog);

// Delete activity log by ID
router.delete("/:id", ActivityLogsController.deleteActivityLog);

export default router;
