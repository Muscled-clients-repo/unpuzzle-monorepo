import { Request, Response, NextFunction } from "express";
import { BindMethods } from "../../utility/BindMethods";
import YoutubeTranscriptService from "../../../contexts/services/youtubeTranscript";
import PuzzleCheck from "../../../contexts/agents/PuzzleCheck";
import ResponseHandler from "../../utility/ResponseHandler";

import TranscriptModel from "../../../models/supabase/transcript";
import VideoModel from "../../../models/supabase/video";
import PuzzleCheckAgent from "../../../contexts/agents/PuzzleCheck";
import PuzzleCheckModel from "../../../models/supabase/puzzleCheck.model";
import CheckModel from "../../../models/supabase/check.model";
import { ActivityLog } from "../../../types/activityLogs.type";
import activityLogsModel from "../../../models/supabase/activityLogs.model";
import ClerkUserService from "../../../contexts/services/ClerkUserService";

class PuzzleChecksController {
  constructor() {}

  generate = async (req: any, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler(res, next);
    const adjustedEndTime = 10;
    try {
      let { videoId, endTime }: any = req.query;
      const userId = req.user.id;

      // Use user ID as the socketId for consistent streaming
      req.socketId = userId;
      console.log(
        `[DEBUG] PuzzleCheck using userId for streaming: ${req.socketId}`
      );

      if (!videoId || !endTime) throw new Error("Video or EndTime is Missing");

      endTime = Number(endTime);
      if (isNaN(endTime)) {
        throw new Error("endTime must be a valid number");
      }

      // get the start time of the video
      const startTime =
        endTime - adjustedEndTime > 0 ? endTime - adjustedEndTime : 0;

      // try to get the puzzle checks from database
      const puzzleChecks = await PuzzleCheckModel.getPuzzleChecksByDuration(
        videoId,
        startTime,
        endTime
      );
      console.log("puzzleChecks: ", puzzleChecks);

      // Check if we have existing puzzle checks with checks
      if (puzzleChecks && puzzleChecks.length > 0) {
        // Get the first puzzle check with its checks
        const puzzleCheckWithChecks = await PuzzleCheckModel.getPuzzleCheckById(
          puzzleChecks[0].id!,
          true
        );

        if (
          puzzleCheckWithChecks &&
          puzzleCheckWithChecks.checks &&
          puzzleCheckWithChecks.checks.length > 0
        ) {
          const puzzleChecksData = {
            topic: puzzleCheckWithChecks.topic,
            completion: puzzleCheckWithChecks.checks.map((check: any) => ({
              question: check.question,
              choices: check.choices,
              answer: check.answer,
            })),
          };

          // create activity logs here asynchronously
          activityLogsModel
            .createActivityLog({
              title: "Puzzle Check Retrieved",
              user_id: userId,
              video_id: videoId,
              fromTime: startTime,
              toTime: endTime,
              duration: endTime,
              actionType: "puzzle_check",
            })
            .then((res: any) => {
              console.log("success", res);
            })
            .catch((error: any) =>
              console.log("error in create activity logs")
            );

          console.log("puzzleChecksData: ", puzzleChecksData);
          return responseHandler.success(puzzleChecksData);
        }
      }

      const transcripts = await TranscriptModel.getVideoWithTranscripts(
        videoId,
        startTime,
        endTime
      );

      const video = (await VideoModel.getVideoById(videoId)) as any;

      if (!video) {
        throw new Error("Video not found");
      }

      if (!transcripts || transcripts.length === 0) {
        throw new Error("No transcripts found for this video.");
      }

      const checkJson = await PuzzleCheckAgent.generateCheck(req, {
        videoId: videoId,
        topic: video.title,
        transcript: transcripts
          .map((transcript: any) => transcript.content)
          .join(" "),
      });
      console.log("checkJson: ", checkJson);
      responseHandler.success(checkJson);

      // Create Puzzle Check with all checks in background
      if (checkJson.completion && checkJson.completion.length > 0) {
        // Create the puzzle check data
        const puzzleCheckData = {
          topic: checkJson.topic,
          video_id: videoId,
          duration: endTime,
          user_id: userId,
        };

        // Extract checks data with validation
        const checksData = checkJson.completion.map((completion: any) => {
          console.log("Completion item:", JSON.stringify(completion, null, 2));

          // Ensure all fields are properly formatted
          let question = completion.question;
          let choices = completion.choices;
          let answer = completion.answer;

          // Validate and convert question to string
          if (typeof question !== "string") {
            question = String(question || "");
          }

          // Validate choices array
          if (!Array.isArray(choices)) {
            console.error("Invalid choices format:", choices);
            choices = [];
          }

          // Ensure answer is a string
          if (answer === undefined || answer === null) {
            console.error("Answer is undefined or null:", completion);
            answer = "";
          } else if (typeof answer !== "string") {
            if (answer && typeof answer === "object") {
              // If answer is an object, try to extract the correct answer
              answer = answer.correct || answer.value || String(answer);
            } else if (typeof answer === "boolean") {
              // Handle True/False questions
              answer = answer ? "True" : "False";
            } else {
              answer = String(answer);
            }
          }

          const checkData = {
            question: question,
            choices: choices,
            answer: answer,
          };

          console.log("Processed check data:", checkData);
          return checkData;
        });

        // Filter out any invalid checks
        const validChecksData = checksData.filter((check: any) => {
          const isValid =
            check.question &&
            check.answer &&
            check.choices &&
            check.choices.length > 0;
          if (!isValid) {
            console.error("Invalid check data filtered out:", check);
          }
          return isValid;
        });

        if (validChecksData.length === 0) {
          console.error("No valid checks to create");
          return;
        }

        // Create puzzle check with checks
        PuzzleCheckModel.createPuzzleCheckWithChecks(
          puzzleCheckData,
          validChecksData
        )
          .then((result) => {
            console.log("Puzzle Check created with checks:", result);

            // Create activity log
            activityLogsModel
              .createActivityLog({
                title: "Puzzle Check Generated",
                user_id: userId,
                video_id: videoId,
                fromTime: startTime,
                toTime: endTime,
                duration: endTime,
                actionType: "puzzle_check",
              })
              .then((res: any) => {
                console.log("Activity log created", res);
              })
              .catch((error: any) =>
                console.log("Error creating activity log", error)
              );
          })
          .catch((error) => {
            console.error("Error creating puzzle check:", error);
          });
      }
    } catch (error: any) {
      console.log(error);
      responseHandler.error(error);
    }
  };

  // get the MCQ From The Transcript
  getAllPuzzleChecks = async (
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

      const result = await PuzzleCheckModel.getAllPuzzleChecks(page, limit);

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

  generatePuzzleCheckForTimestamp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    console.log("generate puzzle Check for Tim esstamp hit!");
    const responseHandler = new ResponseHandler(res, next);
    try {
      let videoId = req.query.videoId || req.body.videoId;
      let startTime = req.query.startTime || req.body.startTime;
      if (!req.user) {
        throw new Error("User is Required!");
      }
      const userId = req.user.id;

      // Use user ID as the socketId for consistent streaming
      req.socketId = userId;
      console.log(
        `[DEBUG] PuzzleCheckForTimestamp using userId for streaming: ${req.socketId}`
      );

      if (!videoId || !startTime) {
        const error = new Error(
          videoId ? "StartTime is missing" : "VidoeId is Missing"
        );
        return responseHandler.error(error);
      }
      startTime = Number(startTime);
      // 1. Fetch all transcript segments for the video
      const { transcripts, ...videoMetaData } =
        await YoutubeTranscriptService.getVideoById(videoId, true);
      if (!transcripts || transcripts.length === 0) {
        const error = new Error("No transcripts found for this video.");
        return responseHandler.error(error);
      }

      // get Current Transcript
      let currentIndex = transcripts.findIndex(
        (t: any) =>
          t.start_time_sec <= startTime &&
          startTime < t.start_time_sec + t.end_time_sec - t.start_time_sec
      );
      let transcript = transcripts[currentIndex];
      const { snippet: context, ...other } =
        await YoutubeTranscriptService.getCompleteTranscriptContext(
          transcripts,
          startTime
        );

      // 2. Prepare instruction for AI
      const instruction =
        "Generate a subtle and helpful Check for the puzzle or topic described in the transcript.";

      // 3. Call PuzzleHint to generate hint using transcript text and instruction
      const Check = await PuzzleCheck.generateCheck(req, {
        topic: videoMetaData.title || "",
        transcript: transcript.text || "",
        context: context || "",
        instruction: instruction || "",
      });
      console.log("check is: ", Check);
      return responseHandler.success(Check);
    } catch (error: any) {
      return responseHandler.error(error);
    }
  };

  // CREATE PUZZLE CHECK (POST /api/puzzlechecks)
  createPuzzleCheck = async (req: any, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      const userId = req.user.id;
      const { topic, video_id, duration, checks } = req.body;

      // Validate required fields
      if (
        !topic ||
        !video_id ||
        !checks ||
        !Array.isArray(checks) ||
        checks.length === 0
      ) {
        throw new Error("topic, video_id, and checks array are required");
      }

      // Validate each check
      for (const check of checks) {
        if (!check.question || !check.choices || !check.answer) {
          throw new Error("Each check must have question, choices, and answer");
        }
      }

      const puzzleCheckData = {
        topic,
        video_id,
        duration: duration || 0,
        user_id: userId,
      };

      // Create puzzle check with related checks
      const result = await PuzzleCheckModel.createPuzzleCheckWithChecks(
        puzzleCheckData,
        checks
      );

      // Create activity log
      activityLogsModel
        .createActivityLog({
          title: "Puzzle Check Created",
          user_id: userId,
          video_id: video_id,
          fromTime: 0,
          toTime: duration || 0,
          duration: duration || 0,
          actionType: "puzzle_check",
        })
        .then((res: any) => {
          console.log("Activity log created", res);
        })
        .catch((error: any) =>
          console.log("Error creating activity log", error)
        );

      return responseHandler.success(result, 201);
    } catch (error: any) {
      console.log(error);
      return responseHandler.error(error);
    }
  };

  // SUBMIT ANSWERS (PATCH /api/puzzlechecks/:id/submit)
  submitAnswers = async (req: any, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      const { id } = req.params;
      const { answers } = req.body;
      const userId = req.user.id;

      if (!answers || typeof answers !== "object") {
        throw new Error("answers object is required");
      }

      // Submit answers and get results
      const result = await PuzzleCheckModel.submitAnswers(id, answers);

      // Create activity log
      activityLogsModel
        .createActivityLog({
          title: "Puzzle Check Answers Submitted",
          user_id: userId,
          video_id: result.video_id,
          duration: result.duration || 0,
          actionType: "puzzle_check_submit",
        })
        .then((res: any) => {
          console.log("Activity log created", res);
        })
        .catch((error: any) =>
          console.log("Error creating activity log", error)
        );

      return responseHandler.success(result);
    } catch (error: any) {
      console.log(error);
      return responseHandler.error(error);
    }
  };

  // GET PUZZLE CHECK BY ID (GET /api/puzzlechecks/:id)
  getPuzzleCheckById = async (req: any, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      const { id } = req.params;
      const includeUser =
        req.query.includeUser !== undefined
          ? req.query.includeUser === "true"
          : true;

      // Get puzzle check with checks
      const puzzleCheck = await PuzzleCheckModel.getPuzzleCheckById(id, true);

      if (!puzzleCheck) {
        throw new Error("Puzzle check not found");
      }

      // Enrich with user data if requested
      if (includeUser && (puzzleCheck as any).user_id) {
        const userData = await ClerkUserService.getUserById(
          (puzzleCheck as any).user_id
        );
        (puzzleCheck as any).user = userData;
      }

      return responseHandler.success(puzzleCheck);
    } catch (error: any) {
      return responseHandler.error(error);
    }
  };

  // UPDATE PUZZLE CHECK WITH CHECKS (PUT /api/puzzlechecks/:id)
  updatePuzzleCheck = async (req: any, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      const { id } = req.params;
      const { topic, duration, checks } = req.body;
      const userId = req.user.id;

      // Validate checks if provided
      if (checks && Array.isArray(checks)) {
        for (const check of checks) {
          if (!check.question || !check.choices || !check.answer) {
            throw new Error(
              "Each check must have question, choices, and answer"
            );
          }
        }
      }

      const puzzleCheckData: any = {};
      if (topic) puzzleCheckData.topic = topic;
      if (duration !== undefined) puzzleCheckData.duration = duration;

      let result;
      if (checks && Array.isArray(checks) && checks.length > 0) {
        // Update with new checks (replace existing)
        result = await PuzzleCheckModel.updatePuzzleCheckWithChecks(
          id,
          puzzleCheckData,
          checks
        );
      } else {
        // Update just the puzzle check data
        result = await PuzzleCheckModel.updatePuzzleCheck(id, puzzleCheckData);
      }

      // Create activity log
      activityLogsModel
        .createActivityLog({
          title: "Puzzle Check Updated",
          user_id: userId,
          video_id: result.video_id,
          duration: result.duration || 0,
          actionType: "puzzle_check_update",
        })
        .then((res: any) => {
          console.log("Activity log created", res);
        })
        .catch((error: any) =>
          console.log("Error creating activity log", error)
        );

      return responseHandler.success(result);
    } catch (error: any) {
      console.log(error);
      return responseHandler.error(error);
    }
  };

  // DELETE PUZZLE CHECK (DELETE /api/puzzlechecks/:id)
  deletePuzzleCheck = async (req: any, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Get puzzle check info for activity log before deletion
      const puzzleCheck = await PuzzleCheckModel.getPuzzleCheckById(id, false);
      if (!puzzleCheck) {
        throw new Error("Puzzle check not found");
      }

      // Delete puzzle check (this will cascade delete checks due to foreign key constraint)
      const result = await PuzzleCheckModel.deletePuzzleCheck(id);

      // Create activity log
      activityLogsModel
        .createActivityLog({
          title: "Puzzle Check Deleted",
          user_id: userId,
          video_id: (puzzleCheck as any).video_id,
          duration: (puzzleCheck as any).duration || 0,
          actionType: "puzzle_check_delete",
        })
        .then((res: any) => {
          console.log("Activity log created", res);
        })
        .catch((error: any) =>
          console.log("Error creating activity log", error)
        );

      return responseHandler.success(result);
    } catch (error: any) {
      console.log(error);
      return responseHandler.error(error);
    }
  };
}

const binding = new BindMethods(new PuzzleChecksController());
export default binding.bindMethods();
