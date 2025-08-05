import { Router } from "express";
import puzzzleReflects from "./puzzleReflects.routes";
import puzzleRequests from "./puzzelRequests.routes";
import recommendAgent from "./recommendAgent.routes";
import puzzleChecks from "./puzzleChecks.routes";
import activityLogs from "./activityLogs.routes";
import transcripts from "./transcripts.routes";
import puzzleHint from "./puzzleHint.routes";
import webhookRoutes from "./webhook.routes";
import whisperRoutes from "./whisper.routes";
import puzzlePath from "./puzzelPath.routes";
import healthRoutes from "./health.routes";
import chapters from "../api/chapters";
import muxRoutes from "./mux.routes";
import videos from "./videos.routes";
import ordersRoutes from "./orders.routes";
import { errorHandler } from "../../utility/errorHandler";
import productRoutes from "./product.routes";
import courseRoutes from "./course.routes";
import myLearningRoutes from "./myLearning.routes";
import userAuthRoutes from "./userAuth.routes";
import stripeRoutes from "./stripe.routes";
import userRoutes from "./user.routes";

const router = Router();

// router.use("/puzzle", puzzleRoutes);
// router.use("/yt", ytRoutes);

router.use("/orders", ordersRoutes);
router.use("/products", productRoutes);

router.use("/activity-logs", activityLogs);
router.use("/courses", courseRoutes);
router.use("/my-learning", myLearningRoutes);
router.use("/chapters", chapters);

router.use("/health", healthRoutes);

router.use("/mux", muxRoutes);

router.use("/user-auth", userAuthRoutes);
router.use("/user", userRoutes);


router.use("/puzzel-reflects", puzzzleReflects);
router.use("/puzzel-request", puzzleRequests);
router.use("/puzzel-checks", puzzleChecks);
router.use("/puzzel-path", puzzlePath);
router.use("/puzzle-hint", puzzleHint);

router.use("/recommend-agent", recommendAgent);

router.use("/transcripts", transcripts);

router.use("/videos", videos);

router.use("/whisper", whisperRoutes);
router.use("/webhook", webhookRoutes);
router.use("/stripe", stripeRoutes);
router.use(errorHandler);
export default router;
