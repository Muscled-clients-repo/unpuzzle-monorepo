import { NextFunction, Request, Response } from "express";
import YoutubeTranscriptService from "../../../contexts/services/youtubeTranscript";
import VideoUtilityFunc from "../../utility/VideoUtilityFunc";
import PuzzlePath from "../../../contexts/agents/PuzzlePath";
import PuzzlePathModel from "../../../models/supabase/puzzlePath.model";
import { BindMethods } from "../../utility/BindMethods";
import ResponseHandler from "../../utility/ResponseHandler";
import activityLogsModel from "../../../models/supabase/activityLogs.model";
import ClerkUserService from "../../../contexts/services/ClerkUserService";

class PuzzlePathController {
  private YoutubeTranscriptServiceIns;

  constructor() {
    this.YoutubeTranscriptServiceIns = YoutubeTranscriptService;
  }

  getPuzzlePath = async (req: any, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler(res, next);
    const adjustedEndTime = 10;
    try {
      let { videoId, endTime }: any = req.query;
      const userId = req.user.id;
      
      // Use user ID as the socketId for consistent streaming
      req.socketId = userId;
      console.log(`[DEBUG] PuzzlePath using userId for streaming: ${req.socketId}`);
      
      if (!videoId || !endTime) throw new Error("Video or EndTime is Missing");

      // try to fetch the puzzle path from db if exist
      let puzzlePaths = await PuzzlePathModel.getPuzzlePathsByVideo(videoId);
      const startTime =
        endTime - adjustedEndTime > 0 ? endTime - adjustedEndTime : 0;
      // create activity logs here asyncrunasly
      activityLogsModel
        .createActivityLog({
          title: "Puzzle Path Generated",
          user_id: userId,
          video_id: videoId,
          fromTime: startTime,
          toTime: endTime,
          duration: endTime,
          actionType: "puzzle_path",
        })
        .then((res: any) => {
          console.log("success", res);
        })
        .catch((error: any) => console.log("error in create activity logs"));

      return responseHandler.success(puzzlePaths);
    } catch (error: any) {
      return responseHandler.error(error);
    }
  };

  getAllPuzzlePaths = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const includeUser =
        req.query.includeUser !== undefined
          ? req.query.includeUser === "true"
          : true;

      const result = await PuzzlePathModel.getAllPuzzlePaths(page, limit);

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

  getPuzzlePathById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      const { id } = req.params;
      const includeUser =
        req.query.includeUser !== undefined
          ? req.query.includeUser === "true"
          : true;

      const result = await PuzzlePathModel.getPuzzlePathById(id);
      
      if (!result) {
        return responseHandler.error(new Error("No puzzle path found"));
      }

      // If includeUser is true, enrich with Clerk data
      if (includeUser && result) {
        const enrichedData = await ClerkUserService.enrichRecordsWithUserData([result]);
        return responseHandler.success(enrichedData[0]);
      }

      return responseHandler.success(result);
    } catch (error: any) {
      return responseHandler.error(error);
    }
  };

  //return a recomended video on stuck
  getSuggestedVideo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      let { videoId, logs } = req.body;
      logs = typeof logs === "string" ? JSON.parse(req.body.logs) : logs;
      if (!videoId && !logs) {
        return responseHandler.error(new Error("please provide valid input!"));
      }
      const { transcripts, ...videoMetaData } =
        await this.YoutubeTranscriptServiceIns.getVideoById(videoId, true);
      const youtubeVideoId = VideoUtilityFunc.extractVideoId(
        videoMetaData.video_url
      );
      const suggestedVideo = await PuzzlePath.recommendVideo({
        req,
        transcripts,
        videoId: youtubeVideoId,
        logs,
        video: videoMetaData,
      });
      return responseHandler.success(suggestedVideo);
    } catch (error: any) {
      return responseHandler.error(error);
    }
  };
}

const binding = new BindMethods(new PuzzlePathController());
export default binding.bindMethods();
