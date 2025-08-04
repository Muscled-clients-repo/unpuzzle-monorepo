import { Request, Response, NextFunction } from "express";
import ActivityLogsModel from "../../models/supabase/activityLogs.model";
import { BindMethods } from "../utility/BindMethods";

interface LogInput {
  action: string;
  duration?: string;
  from?: string;
  to?: string;
}

class ActivityLogsMiddleware {
  private isValidLog = (log: LogInput): boolean => {
    const validActions = ["play", "pause", "seek"];
    if (!log.action || !validActions.includes(log.action)) return false;

    if (log.action === "seek" && (!log.from || !log.to)) return false;
    if ((log.action === "play" || log.action === "pause") && !log.duration)
      return false;

    return true;
  };

  private timeToMilliseconds = (time: string): number => {
    const [min, sec] = time.split(":").map(Number);
    return (min * 60 + sec) * 1000;
  };

  private storeLog = async (payload: any) => {
    const { error } = await ActivityLogsModel.createActivityLog(payload);
    return error ? { success: false, error } : { success: true };
  };

  public createActivityLogs = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      (req as any).user = { userId: "user_2yb08C8E0QiPuu2L0q5Y6B5CD7X" };
      console.log("createActivityLogs run! ");
      const user = (req as any).user;
      if (!user?.userId) {
        return next({
          statusCode: 401,
          message: "User not authenticated",
        });
      }

      const userId = user.userId;
      const videoId = req.body?.video?.videoId;
      const logs: LogInput[] = req.body.logs || [];

      for (const log of logs) {
        if (!this.isValidLog(log)) {
          return next({
            statusCode: 400,
            message: `Invalid log structure for action "${log.action}"`,
          });
        }

        const payload: any = {
          userId,
          videoId,
          actionType: log.action,
        };

        if (log.action === "seek") {
          payload.fromTime = this.timeToMilliseconds(log.from!);
          payload.toTime = this.timeToMilliseconds(log.to!);
          payload.duration = Math.abs(payload.toTime - payload.fromTime);
        } else if (log.duration) {
          payload.duration = this.timeToMilliseconds(log.duration);
        }
        console.log("store Logs Run!");
        const result = await this.storeLog(payload);
        if (!result.success) {
          return next({
            statusCode: 500,
            message: "Failed to store log",
            error: result.error,
          });
        }
      }

      next(); // All logs processed successfully
    } catch (error: any) {
      console.log("catch BLock Run !");
      next({
        statusCode: 500,
        message: "Unexpected error in activity logging",
        error: error.message || error,
      });
    }
  };
}
const binding = new BindMethods(new ActivityLogsMiddleware());
export default binding.bindMethods();
