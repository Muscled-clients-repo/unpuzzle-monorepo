import { NextFunction, Request, Response } from "express";
import YoutubeTranscriptService from "../../../contexts/services/youtubeTranscript";
import PuzzleHintGenerator from "../../../contexts/agents/PuzzleHint";
import ResponseHandler from "../../utility/ResponseHandler";

class YoutubeTranscriptController {
  private YoutubeTranscriptServiceIns;
  private PuzzleHintGeneratorIns;
  constructor() {
    this.YoutubeTranscriptServiceIns = YoutubeTranscriptService;
    this.PuzzleHintGeneratorIns = PuzzleHintGenerator;
  }
  getTranscript = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      const { videoId } = req.params;
      if (!videoId) throw new Error("Pls Provide Valid Video Id!");
      const transcripts =
        await this.YoutubeTranscriptServiceIns.fetchTranscriptFromDb(videoId);
      return responseHandler.success(transcripts)
    } catch (error: any) {
      return responseHandler.error(error)
    }
  };
  public CreateVideo = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      const { videoId } = req.params;
      console.log("videoId: ", videoId);
      if (!videoId) throw new Error("Pls Provide Valid Video Id!");
      const videoWithTranscript =
        await this.YoutubeTranscriptServiceIns.createVideoWithTranscripts(
          videoId
        );
      return responseHandler.success(videoWithTranscript)
    } catch (error: any) {
      return responseHandler.error(error)
    }
  };
  public getVideoById = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      const { videoId } = req.params;
      if (!videoId) throw new Error("Please provide a valid Video ID!");

      // Optional query param to include transcripts, defaults to false
      const includeTranscripts = req.query.includeTranscripts === "true";
      const video = await this.YoutubeTranscriptServiceIns.getVideoById(
        videoId,
        includeTranscripts
      );

      if (!video) {
        return responseHandler.error(new Error("Video not found"))
      }

      return responseHandler.success(video)
    } catch (error: any) {
      return responseHandler.error(error)
    }
  };
}

export default new YoutubeTranscriptController();
