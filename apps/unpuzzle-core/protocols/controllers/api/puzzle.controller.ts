import { NextFunction, Request, Response } from "express";
import { randomUUID } from "crypto";
import YoutubeTranscriptService from "../../../contexts/services/youtubeTranscript";
import PuzzleHintGenerator from "../../../contexts/agents/PuzzleHint";
import PuzzleCheck from "../../../contexts/agents/PuzzleCheck";
import PuzzlePath from "../../../contexts/agents/PuzzlePath";
import { BindMethods } from "../../utility/BindMethods";
import ResponseHandler from "../../utility/ResponseHandler";
import puzzleHintModel from "../../../models/supabase/puzzleHint.model";
import puzzleCheckModel from "../../../models/supabase/puzzleCheck.model";
import puzzlePathModel from "../../../models/supabase/puzzlePath.model";

class PuzzleController {
  private YoutubeTranscriptServiceIns;
  private PuzzleHintGeneratorIns;
  private PuzzlePathIns;
  constructor() {
    this.YoutubeTranscriptServiceIns = YoutubeTranscriptService;
    this.PuzzleHintGeneratorIns = PuzzleHintGenerator;
    this.PuzzlePathIns = PuzzlePath;
  }
  // get the hint on transcript with startTime and video Id /hint
  generatePuzzleHintForTimestamp = async (req: Request, res: Response, next: NextFunction)=>{
    const responseHandler = new ResponseHandler(res, next);
    try {
      // Since this is a POST with formData, check body first, then query
      let { videoId, startTime }: any = req.body || req.query;
      const user_id = req.user?.id;
      
      if (!user_id) {
        const error = new Error("User authentication required")
        return responseHandler.error(error)
      }
      
      if (!videoId || !startTime){
        const error= new Error("VidoeId or StartTime is Missing")
        return responseHandler.error(error)
      }

      startTime = Number(startTime);
      if (isNaN(startTime)) {
        const error= new Error("startTime must be a valid number")
        return responseHandler.error(error)
      }
      // 1. Fetch all transcript segments for the video
      const { transcripts, ...videoMetaData } =
        await this.YoutubeTranscriptServiceIns.getVideoById(videoId, true);

      if (!transcripts || transcripts.length === 0) {
        const error= new Error("No transcripts found for this video.")
        return responseHandler.error(error)
      }
      const { snippet: combinedText, ...other } =
        await this.YoutubeTranscriptServiceIns.getCompleteTranscriptContext(
          transcripts,
          startTime
        );

      // 2. Prepare instruction for AI
      const instruction =
        "Generate a subtle and helpful hint for the puzzle or topic described in the transcript.";

      // 3. Call PuzzleHint to generate hint using transcript text and instruction
      const hintJson = await this.PuzzleHintGeneratorIns.generateHint(req, {
        topic: videoMetaData.title || "",
        description: videoMetaData.description || "",
        transcript: combinedText || "",
        instruction: instruction || "",
      });

      // 4. Save hint to database
      if (hintJson && hintJson.completion) {
        const hintData = {
          question: hintJson.question || "Generated hint question",
          topic: videoMetaData.title || "",
          prompt: instruction || "",
          completion: hintJson.completion || [],
          duration: 0,
          video_id: videoId,
          user_id: user_id
        };
        
        console.log("[PuzzleController] Creating hint with data:", hintData);
        console.log("[PuzzleController] user_id value:", user_id);
        console.log("[PuzzleController] req.user:", req.user);
        
        await puzzleHintModel.createPuzzleHint(hintData);
      }

      return responseHandler.success(hintJson)
    } catch (error: any) {
      return responseHandler.error(error)
    }
  };
  // get the MCQ From The Transcript
  generatePuzzleCheckForTimestamp = async (req: Request, res: Response, next: NextFunction)=>{
    const responseHandler = new ResponseHandler(res, next);
    try {
      let { videoId, startTime }: any = req.query;
      const user_id = req.user?.id;
      
      if (!user_id) {
        const error = new Error("User authentication required")
        return responseHandler.error(error)
      }
      
      if (!videoId || !startTime){
        const error= new Error("VidoeId or StartTime is Missing")
        return responseHandler.error(error)
      }
      startTime = Number(startTime);
      // 1. Fetch all transcript segments for the video
      const { transcripts, ...videoMetaData } =
        await this.YoutubeTranscriptServiceIns.getVideoById(videoId, true);
      if (!transcripts || transcripts.length === 0) {
        const error= new Error("No transcripts found for this video.")
        return responseHandler.error(error)
      }

      // get Current Transcript
      let currentIndex = transcripts.findIndex(
        (t: any) =>
          t.start_time <= startTime && startTime < t.start_time + t.duration
      );
      let transcript = transcripts[currentIndex];
      const { snippet: context, ...other } =
        await this.YoutubeTranscriptServiceIns.getCompleteTranscriptContext(
          transcripts,
          startTime
        );

      // 2. Prepare instruction for AI
      const instruction =
        "Generate a subtle and helpful Check for the puzzle or topic described in the transcript.";

      // 3. Call PuzzleCheck to generate check using transcript text and instruction
      const Check = await PuzzleCheck.generateCheck(req, {
        topic: videoMetaData.title || "",
        description: videoMetaData.description || "",
        transcript: transcript.text || "",
        context: context || "",
        instruction: instruction || "",
      });

      // 4. Save check to database
      if (Check && Check.completion) {
        for (let i = 0; i < Check.completion.length; i++) {
          const question = Check.completion[i];
          const checkData = {
            topic: videoMetaData.title || "",
            choices: question.choices || [],
            answer: question.answer || "",
            question: question.question || "",
            video_id: videoId,
            duration: 0,
            user_id: user_id
          };
          
          await puzzleCheckModel.createPuzzleCheck(checkData);
        }
      }

      return responseHandler.success(Check)
    } catch (error: any) {
      return responseHandler.error(error)
    }
  };
  //return a recomended video on stuck
  getSuggestedVideo = async (req: Request, res: Response, next: NextFunction)=>{
    const responseHandler = new ResponseHandler(res, next);
    try {
      let { videoId, logs } = req.body;
      const user_id = req.user?.id;
      
      if (!user_id) {
        const error = new Error("User authentication required")
        return responseHandler.error(error)
      }
      
      logs =
        typeof logs === "string" ? JSON.parse(req.body.logs) : req.body.logs;
      if (!videoId && !logs) {
        const error= new Error("please provide valid input!")
        return responseHandler.error(error)
      }
      const { transcripts, ...videoMetaData } =
        await this.YoutubeTranscriptServiceIns.getVideoById(videoId, true);
      const suggestedVideo = await this.PuzzlePathIns.recommendVideo({
        req,
        transcripts,
        videoId,
        logs,
        video: videoMetaData,
      });
      
      // Save puzzle path to database
      if (suggestedVideo && suggestedVideo.recommendations) {
        const pathData = {
          id: randomUUID(), // Generate UUID for required id field
          trigger_time: suggestedVideo.stuckAt || 0,
          video_id: videoId,
          user_id: user_id,
          title: `Suggested content for ${videoMetaData.title || 'video'}`,
          content_type: 'yt_video' as const,
          start_time: 0,
          end_time: 0,
          duration: 0
        };
        
        await puzzlePathModel.createPuzzlePath(pathData);
      }
      
      return responseHandler.success(suggestedVideo)
    } catch (error: any) {
      return responseHandler.error(error)
    }
  };
}

const binding = new BindMethods(new PuzzleController());
export default binding.bindMethods();
