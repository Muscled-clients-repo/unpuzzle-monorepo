import { OpenAI } from "openai";
import { ReadStream } from "fs";
import MuxService from "./Mux";
import fs from "fs";
import { BindMethods } from "../../protocols/utility/BindMethods";

class WhisperService {
  // private apiKey: string;
  private openai: OpenAI;
  constructor() {
    // this.apiKey = apiKey;
    this.openai = new OpenAI({
      apiKey: process.env.OPEN_AI_API,
    });
  }

  // Upload file and get transcript
  public getTranscript = async (
    file: Express.Multer.File,
    language: string
  ): Promise<string> => {
    // Logic to upload the file to Whisper API
    const transcript = await this.sendFileToAPI(file, language);
    return transcript;
  };

  // Handle file upload to Whisper API
  private sendFileToAPI = async (
    file: Express.Multer.File,
    language: string
  ): Promise<any> => {
    const response = await this.openai.audio.transcriptions.create({
      file: fs.createReadStream(file.path),
      model: "whisper-1",
      language: language || "en",
    });
    // get subtitle code
    // const response = await this.openai.audio.transcriptions.create({
    //   file: fs.createReadStream(file.path),
    //   model: "whisper-1",
    //   language: language || "en",
    //   response_format: "srt", // or "vtt"
    // });
    // console.log("response: ", response);
    // return response;

    return response.text;
  };
}

const binding = new BindMethods(new WhisperService());
export default binding.bindMethods();
