import { Router } from "express";
import apiRoutes from "./api/index";
import pagesRoutes from "./pages/index";
import agent from "./testFolder/api/agent";
const router = Router();

// API Routes
router.use("/api", apiRoutes);
// test Routes
router.use("/test-api", agent);

// Pages Routes
router.use("/", pagesRoutes);

export default router;
