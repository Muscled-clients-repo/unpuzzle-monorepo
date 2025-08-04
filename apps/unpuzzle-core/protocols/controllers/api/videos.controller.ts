import { NextFunction, Request, Response } from "express";
import { BindMethods } from "../../utility/BindMethods";
import youtubeTranscriptService from "../../../contexts/services/youtubeTranscript";
import VideoModel from "../../../models/supabase/video";
import ResponseHandler from "../../utility/ResponseHandler";

class VideoController {
  constructor() {}
  public getAllVideos = async (req: Request, res: Response, next:NextFunction): Promise<void> =>{
    const responseHandler = new ResponseHandler(res, next);
    try {
      const { chapter_id } = req.query;
      if (!chapter_id) throw new Error("Pls Provide Valid Video Id!");
      const transcripts = await VideoModel.getAllVideos(chapter_id as string);
      return responseHandler.success(transcripts)
    } catch (error: any) {
      return responseHandler.error(error)
    }
  }
  public getTranscript = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      const { videoId } = req.params;
      if (!videoId) throw new Error("Pls Provide Valid Video Id!");
      const transcripts = await youtubeTranscriptService.fetchTranscriptFromDb(
        videoId
      );
      return responseHandler.success(transcripts)
    } catch (error: any) {
      return responseHandler.error(error)
    }
  };
  public CreateVideo = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      const { videoId, chapterId } = req.params;
      if (!videoId || !chapterId)
        throw new Error(
          `Pls Provide Valid ${videoId ? "Chapter" : "Video"} Id!`
        );
      const videoWithTranscript =
        await youtubeTranscriptService.createVideoWithTranscripts(
          videoId,
          chapterId
        );
      return responseHandler.success(videoWithTranscript)
    } catch (error: any) {
      return responseHandler.error(error)
    }
  };
  public getVideoById = async (req: Request, res: Response, next:NextFunction): Promise<void> => {
    const responseHandler = new ResponseHandler(res, next);
    console.log("getVideoById: ", req.params);
    try {
      const { videoId } = req.params;
      if (!videoId) throw new Error("Please provide a valid Video ID!");

      // Optional query param to include transcripts, defaults to false
      const includeTranscripts = req.query.includeTranscripts === "true";
      const video = await VideoModel.getVideoById(videoId, includeTranscripts);

      console.log(video)

      if (!video) {
        return responseHandler.error(new Error("Video not found"))
      }

      return responseHandler.success(video)
    } catch (error: any) {
      return responseHandler.error(error)
    }
  };
}

const binding = new BindMethods(new VideoController());
export default binding.bindMethods();
