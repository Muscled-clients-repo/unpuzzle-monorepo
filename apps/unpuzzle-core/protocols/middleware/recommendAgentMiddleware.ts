import { Request, Response, NextFunction } from "express";
import { BaseAgent } from "../../contexts/agents/BaseAgent";
import { recommendedAgentPrompt } from "../prompts/prompts";
import { BindMethods } from "../utility/BindMethods";
import VideoModel from "../../models/supabase/video";
import activityLogsModel from "../../models/supabase/activityLogs.model";
import ResponseHandler from "../utility/ResponseHandler";
class RecommendAgent extends BaseAgent {
  convertLogsToSimplifiedFormat = async (logs: any[]) => {
    return logs.map((log) => {
      const action = log.actionType;

      if (action === "seek") {
        return {
          action,
          from: log.fromTime ? Math.floor(log.fromTime / 1000) : 0,
          to: log.toTime ? Math.floor(log.toTime / 1000) : 0,
        };
      }

      return {
        action,
        duration: log.duration ? Math.floor(log.duration / 1000) : 0,
      };
    });
  };

  async decideAgent(req: any, res: Response, next: NextFunction) {
    try {
      const responseHandler = new ResponseHandler(res, next);

      console.log("User: ", req.user);

      if (!req.user) {
        return responseHandler.error(new Error("User not found"), 404);
      }

      const { videoId } = req.body;
      const userId = req.user.id;
      const activityLogs = await activityLogsModel.getLatestActivityLogs(
        userId,
        videoId
      );
      // console.log(activityLogs);
      if (!activityLogs.success || activityLogs.data.length === 0){
        
        return responseHandler.success({
          puzzleHint: true,
          puzzleChecks: false,
          puzzlePath: false,
          puzzleReflect: false,
        });
      }

      // let logs = await this.convertLogsToSimplifiedFormat(activityLogs?.data);
      req.body.logs = activityLogs?.data;
      // const logs = req.body.logs;

      const video = await VideoModel.getVideoById(videoId);
      if (!video) {
        return next(new Error("Invalid Video Id is Provided!"));
      }
      req.body.video = video;
      const duration: number = req.body?.video?.duration;

      console.log("logs: ", activityLogs?.data);

      const prompt = recommendedAgentPrompt(activityLogs?.data, duration);
      const response = await this.chatCompletion(req, {
        messages: [{ role: "user", content: prompt }],
        parseJson: true,
        model: "gpt-4", // or "gpt-3.5-turbo" for cost savings
      });

      const agent = response.agent.toLowerCase();
      req.body.strugglePeriods = response.strugglePeriods || 0;

      if (
        agent === "puzzlehint" ||
        agent === "puzzlechecks" ||
        agent === "puzzlepath" ||
        agent === "puzzlereflect"
      ) {
        req.body.recommendedAgent = {
          puzzleHint: agent == "puzzlehint",
          puzzleChecks: agent == "puzzlechecks",
          puzzlePath: agent == "puzzlepath",
          puzzleReflect: agent == "puzzlereflect",
        };
        return next();
      } else {
        throw new Error(
          `Invalid agent recommendation from AI: ${agent}. Expected one of: puzzlehint, puzzlechecks, puzzlepath`
        );
      }
    } catch (error: any) {
      return next(new Error(error.message || "Invalid agent recommendation from AI"));
    }
  }
}
const binding = new BindMethods(new RecommendAgent());
export default binding.bindMethods();
