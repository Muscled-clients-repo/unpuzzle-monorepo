import { NextFunction, Request, Response } from "express";
import { BindMethods } from "../../utility/BindMethods";
import YoutubeTranscriptService from "../../../contexts/services/youtubeTranscript";
import VideoModel from "../../../models/supabase/video";
import ResponseHandler from "../../utility/ResponseHandler";
import { SrtToJson } from "../../utility/srtToJson";
import TranscriptModel from "../../../models/supabase/transcript";
import { Video } from "../../../types/video.type";

class TranscriptsController {
  
  constructor() {
    
  }

  uploadTranscript = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      const { videoId } = req.body;
      const filePath = req.file?.path;
      console.log(filePath);
      if (!filePath) throw new Error("File not found");
      const video = await VideoModel.getVideoById(videoId);
      if (!video) throw new Error("Video not found");
      const transcriptExists = await TranscriptModel.getTranscriptsByVideoId(videoId);
      if (transcriptExists.length > 0) throw new Error("Transcript already exists");
      const transcripts = await SrtToJson.fromFile(filePath, videoId);
      const insertedTranscripts = await TranscriptModel.bulkInsertTranscripts(transcripts);
      console.log(insertedTranscripts);
      responseHandler.success(transcripts);
    } catch (error) {
      responseHandler.error(error as Error);
    }
  }

  getTranscripts = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      const { videoId } = req.params;
      const transcripts = await YoutubeTranscriptService.getTranscripts(videoId);
      responseHandler.success(transcripts);
    } catch (error) {
      responseHandler.error(error as Error);
    }
  };

  createTranscript = async (req: Request, res: Response, next: NextFunction) => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      const { videoId } = req.body;
      // get video from db
      const video = await VideoModel.getVideoById(videoId) as unknown as Video
      if (!video) {
        throw new Error("Video not found")
      }
      const transcripts = await YoutubeTranscriptService.fetchTranscript(video.yt_video_id || "");
      responseHandler.success(transcripts);
    } catch (error) {
      responseHandler.error(error as Error);
    }
  };
}

const binding = new BindMethods(new TranscriptsController());
export default binding.bindMethods();
