import { Request, Response, RequestHandler, NextFunction } from "express";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import WhisperService from "../../../contexts/services/Whisper";
import VideoConverter from "../../../contexts/services/ffmpeg";
import MuxService from "../../../contexts/services/Mux";
import ResponseHandler from "../../utility/ResponseHandler";
import { BindMethods } from "../../utility/BindMethods";

// interface
interface CustomFile extends Express.Multer.File {
  path: string;
  filename: string;
}

class WhisperController {
  private muxService;

  constructor() {
    if (process.env.MUX_TOKEN_ID && process.env.MUX_TOKEN_SECRET)
      this.muxService = new MuxService(
        process.env.MUX_TOKEN_ID,
        process.env.MUX_TOKEN_SECRET
      );
  }
  // Transcribe audio file
  transcribeAudio: RequestHandler = async (req: Request, res: Response, next:NextFunction) => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      let audioFile = req.file;
      const { language } = req.body;
      if (!audioFile) {
        return responseHandler.error(new Error("Audio file is required"))
      }

      // if(video) convert into audio
      const inputFilePath = audioFile.path;
      const videoConverter = new VideoConverter(inputFilePath);
      const duration: number | undefined = await this.getMediaDuration(
        inputFilePath
      );
      if (duration == undefined) throw new Error("Video Duration undefined!");
      else if (duration > 60)
        throw new Error("More then 60 minutes Video is not Allowed!");
      if (videoConverter.isVideo() && req.file) {
        const audioFilePath = await videoConverter.convertToAudio();
        audioFile = req.file = {
          ...req.file,
          path: audioFilePath,
          filename: path.basename(audioFilePath), // Set the filename to the audio file's basename
        };
      }

      // generate transcript
      // const apiKey = String(process.env.OPEN_AI_API);
      // if (!apiKey) throw new Error("API Key Not Found!");
      // const WhisperClient = new WhisperService();
      const transcript = await WhisperService.getTranscript(
        audioFile,
        language
      );
      let muxUpload;
      if (this.muxService) {
        muxUpload = await this.muxService.uploadVideo(audioFile.path);
      }
      this?.muxService?.deleteLocalFile(audioFile.path);
      // TODO: Implement actual Whisper API call

      return responseHandler.success(transcript)
    } catch (error:any) {
      return responseHandler.error(error)
    }
  };

  // Get transcription status
  getTranscriptionStatus: RequestHandler = async (req: Request,res: Response,next:NextFunction) => {
    const responseHandler = new ResponseHandler(res, next);
    try {
      const { id } = req.params;

      if (!id) {
        return responseHandler.error(new Error("Transcription ID is required"))
      }

      // TODO: Implement actual status check
      const status = {
        id,
        status: "completed",
        progress: 100,
        error: null,
      };

      return responseHandler.success(status)
    } catch (error:any) {
      return responseHandler.error(error)
    }
  };
  // get duration of file
  getMediaDuration = async (filePath: string): Promise<number | undefined> => {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          reject(err);
        } else {
          const duration = metadata.format.duration; // in seconds
          resolve(duration);
        }
      });
    });
  };
}

const binding = new BindMethods(new WhisperController());
export default binding.bindMethods();

// export default new WhisperController();
