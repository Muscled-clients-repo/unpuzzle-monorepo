import { Router } from "express";
import activityLogsModel from "../../../../models/supabase/activityLogs.model"; // Adjust path as needed
import { randomUUID } from "crypto";

const router = Router();

// Get all activity logs with pagination
router.get("/", async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  try {
    const result = await activityLogsModel.getAllActivityLogs(page, limit);
    if (!result.success) return res.status(500).json({ error: result.error });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!" });
  }
});

// Get activity log by ID
router.get("/:id", async (req, res) => {
  try {
    const result = await activityLogsModel.getActivityLogById(req.params.id);
    if (!result.success) return res.status(404).json({ error: result.error });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!" });
  }
});

// Create new activity log
router.post("/", async (req, res) => {
  try {
    let activityLogData = req.body;
    activityLogData = { id: randomUUID(), ...activityLogData }; // Add UUID to activity log data

    // Insert the new activity log
    const result = await activityLogsModel.createActivityLog(activityLogData);
    if (!result.success) return res.status(400).json({ error: result.error });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!" });
  }
});

// Update activity log by ID
router.put("/:id", async (req, res) => {
  try {
    const updates = req.body;
    const result = await activityLogsModel.updateActivityLog(
      req.params.id,
      updates
    );
    if (!result.success) return res.status(400).json({ error: result.error });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!" });
  }
});

// Delete activity log by ID
router.delete("/:id", async (req, res) => {
  try {
    const result = await activityLogsModel.deleteActivityLog(req.params.id);
    if (!result.success) return res.status(400).json({ error: result.error });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong!" });
  }
});

export default router;
