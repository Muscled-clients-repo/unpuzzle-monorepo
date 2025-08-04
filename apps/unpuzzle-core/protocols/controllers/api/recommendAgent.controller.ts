import { NextFunction, Request, Response } from "express";
import { BaseAgent } from "../../../contexts/agents/BaseAgent";
import { BindMethods } from "../../utility/BindMethods";
import puzzleChecksController from "./puzzleChecks.controller";
import ResponseHandler from "../../utility/ResponseHandler";
import puzzleHintController from "./puzzleHints.controller";
import puzzlePathController from "./puzzlePath.controller";

class RecommendAgentController extends BaseAgent {
  constructor() {
    super();
  }
  // function to generate  the hint on instruction and transcript
  generateSolution = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      const { recommendedAgent, logs, videoId, strugglePeriods } = req.body;

      if (!recommendedAgent || !logs || !videoId || !strugglePeriods) {
        return res.status(400).json({
          success: false,
          message: "Invalid Input!",
        });
      }

      return responseHandler.success(recommendedAgent);
    } catch (error: any) {
      return responseHandler.error(error);
    }
  };
}

const binding = new BindMethods(new RecommendAgentController());
export default binding.bindMethods();
