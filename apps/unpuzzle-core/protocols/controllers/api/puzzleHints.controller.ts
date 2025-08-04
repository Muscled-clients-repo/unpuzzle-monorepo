import { NextFunction, Response } from "express";
import { BindMethods } from "../../utility/BindMethods";
import YoutubeTranscriptService from "../../../contexts/services/youtubeTranscript";
import PuzzleHintGenerator from "../../../contexts/agents/PuzzleHint";
import TranscriptModel from "../../../models/supabase/transcript";
import VideoModel from "../../../models/supabase/video";
import ResponseHandler from "../../utility/ResponseHandler";
import PuzzleHintModel from "../../../models/supabase/puzzleHint.model";
import { Server as SocketIOServer } from "socket.io";
import activityLogsModel from "../../../models/supabase/activityLogs.model";
import { ActivityLog } from "../../../types/activityLogs.type";
import { Video } from "../../../types/video.type";
import ClerkUserService from "../../../contexts/services/ClerkUserService";

class PuzzleHintController {
  constructor() {}
  createActivityLog = async (log: ActivityLog) => {
    try {
      const data = await activityLogsModel.createActivityLog(log);
      if (data) {
        return data;
      }
      throw new Error("Failed to Create Activty logs!");
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  // get the hint on transcript with endTime and video Id /hint
  async getPuzzleHint(req: any, res: Response, next: NextFunction) {
    const responseHandler = new ResponseHandler(res, next);
    const adjustedEndTime = 10;

    try {
      let { videoId, endTime }: any = req.query;
      const userId = req.user.id;

      // Use user ID as the socketId for consistent streaming
      req.socketId = userId;

      console.log(`[DEBUG] Using userId for streaming: ${req.socketId}`);

      if (!videoId || !endTime) throw new Error("Video or EndTime is Missing");

      endTime = Number(endTime);
      if (isNaN(endTime)) {
        throw new Error("endTime must be a valid number");
      }
      const startTime =
        endTime - adjustedEndTime > 0 ? endTime - adjustedEndTime : 0;
      // Try to get the hint from database
      const puzzleHintData = await PuzzleHintModel.getPuzzleHintByDuration(
        videoId,
        startTime,
        endTime
      );

      // create activity logs here asyncrunasly
      activityLogsModel
        .createActivityLog({
          title: "Puzzle Hint Generated",
          user_id: userId,
          video_id: videoId,
          fromTime: startTime,
          toTime: endTime,
          duration: endTime,
          actionType: "puzzle_hint",
        })
        .then((res: any) => {
          console.log("success", res);
        })
        .catch((error: any) =>
          console.log("error in create activity logs", error)
        );

      if (puzzleHintData) {
        return responseHandler.success(puzzleHintData);
      }

      const transcripts = await TranscriptModel.getVideoWithTranscripts(
        videoId,
        startTime,
        endTime
      );

      const video = (await VideoModel.getVideoById(
        videoId
      )) as unknown as Video;

      if (!video) {
        throw new Error("Video not found");
      }

      if (!transcripts || transcripts.length === 0) {
        throw new Error("No transcripts found for this video.");
      }

      const hintJson = await PuzzleHintGenerator.generateHint(req, {
        videoId: videoId,
        topic: video?.title || "",
        transcript: transcripts
          .map((transcript: any) => transcript.content)
          .join(" "),
      });
      hintJson["duration"] = endTime;
      hintJson["video_id"] = videoId;
      hintJson["user_id"] = userId;
      // Add status if provided in query params
      if (
        req.query.status &&
        ["still confused", "got it"].includes(req.query.status)
      ) {
        hintJson["status"] = req.query.status;
      }

      const puzzleHint = await PuzzleHintModel.createPuzzleHint(hintJson);
      // create activity logs here asyncrunasly

      return responseHandler.success(hintJson);
    } catch (error: any) {
      console.log(error);
      responseHandler.error(error);
    }
  }

  getAllPuzzleHints = async (req: any, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const includeUser =
        req.query.includeUser !== undefined
          ? req.query.includeUser === "true"
          : true;

      const result = await PuzzleHintModel.getAllPuzzleHints(page, limit);

      // If includeUser is true, enrich with Clerk data
      if (includeUser && result.data) {
        const enrichedData = await ClerkUserService.enrichRecordsWithUserData(
          result.data
        );
        return responseHandler.success({
          data: enrichedData,
          count: result.count,
          total_page: result.total_page,
        });
      }

      return responseHandler.success({
        data: result.data,
        count: result.count,
        total_page: result.total_page,
      });
    } catch (error: any) {
      return responseHandler.error(error);
    }
  };

  // get the hint on transcript with startTime and video Id /hint
  generatePuzzleHintForTimestamp = async (
    req: any,
    res: Response,
    next: NextFunction
  ) => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      console.log("Generating Puzzle Hint for Timestamp");
      let { videoId, startTime }: any = req.query;
      if (!videoId || !startTime)
        throw new Error("VidoeId or StartTime is Missing");

      startTime = Number(startTime);
      if (isNaN(startTime)) {
        throw new Error("startTime must be a valid number");
      }
      // 1. Fetch all transcript segments for the video
      const { transcripts, ...videoMetaData } =
        await YoutubeTranscriptService.getVideoById(videoId, true);

      if (!transcripts || transcripts.length === 0) {
        throw new Error("No transcripts found for this video.");
      }

      const { snippet: combinedText, ...other } =
        await YoutubeTranscriptService.getCompleteTranscriptContext(
          transcripts,
          startTime
        );
      // 2. Prepare instruction for AI
      const instruction =
        "Generate a subtle and helpful hint for the puzzle or topic described in the transcript.";

      // 3. Call PuzzleHint to generate hint using transcript text and instruction
      const hintJson = await PuzzleHintGenerator.generateHint(req, {
        videoId: videoId,
        topic: videoMetaData.title || "",
        transcript: combinedText || "",
        instruction: instruction || "",
      });

      return responseHandler.success(hintJson);
    } catch (error: any) {
      console.log(error);
      responseHandler.error(error);
    }
  };

  // Manual creation of puzzle hint with status
  createPuzzleHint = async (req: any, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      const userId = req.user.id;
      const { question, topic, video_id, duration, status } = req.body;

      // Validate required fields
      if (!question) {
        throw new Error("Question is required");
      }

      // Validate status if provided
      if (status && !["still confused", "got it"].includes(status)) {
        throw new Error("Invalid status. Must be 'still confused' or 'got it'");
      }

      const hintData = {
        question,
        topic: topic || "",
        video_id: video_id || null,
        duration: duration || 0,
        user_id: userId,
        status: status || null,
      };

      const puzzleHint = await PuzzleHintModel.createPuzzleHint(hintData);

      // Create activity log
      if (video_id) {
        activityLogsModel
          .createActivityLog({
            title: "Puzzle Hint Created Manually",
            user_id: userId,
            video_id: video_id,
            duration: duration || 0,
            actionType: "puzzle_hint",
          })
          .then((res: any) => {
            console.log("Activity log created", res);
          })
          .catch((error: any) =>
            console.log("Error creating activity log", error)
          );
      }

      return responseHandler.success(puzzleHint);
    } catch (error: any) {
      console.log(error);
      return responseHandler.error(error);
    }
  };

  // GET PUZZLE HINT BY ID (GET /api/puzzle-hint/:id)
  getPuzzleHintById = async (req: any, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      const { id } = req.params;
      const includeUser =
        req.query.includeUser !== undefined
          ? req.query.includeUser === "true"
          : true;

      // Get puzzle hint with video
      const puzzleHint = await PuzzleHintModel.getPuzzleHintById(id, true);

      if (!puzzleHint) {
        throw new Error("Puzzle hint not found");
      }

      // Enrich with user data if requested
      if (includeUser && (puzzleHint as any).user_id) {
        const userData = await ClerkUserService.getUserById(
          (puzzleHint as any).user_id
        );
        (puzzleHint as any).user = userData;
      }

      return responseHandler.success(puzzleHint);
    } catch (error: any) {
      return responseHandler.error(error);
    }
  };
}

const binding = new BindMethods(new PuzzleHintController());
export default binding.bindMethods();
