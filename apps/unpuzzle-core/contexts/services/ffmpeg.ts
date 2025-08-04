import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";

class VideoConverter {
  private inputFilePath: string;
  private outputFilePath: string;

  constructor(inputFilePath: string) {
    this.inputFilePath = inputFilePath;
    this.outputFilePath = `uploads/${Date.now()}_audio.mp3`;
  }

  // Method to check if the file extension is a video
  public isVideo(): boolean {
    const videoExtensions = [".mp4", ".mov", ".avi", ".mkv", ".flv", ".webm"];
    const extname = path.extname(this.inputFilePath).toLowerCase();
    return videoExtensions.includes(extname);
  }

  // Method to convert video to audio (MP3)
  public convertToAudio(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.isVideo()) {
        return reject(new Error("File is not a video"));
      }

      ffmpeg(this.inputFilePath)
        .output(this.outputFilePath)
        .audioCodec("libmp3lame") // Use MP3 codec
        .audioBitrate("192k") // Set bitrate
        .on("end", () => {
          console.log("Video conversion to audio complete.");
          this.deleteVideo(); // Delete the video file after conversion
          resolve(this.outputFilePath); // Return the audio file path
        })
        .on("error", (err: any) => {
          console.error("Error during conversion:", err);
          reject(new Error(`Conversion failed: ${err.message}`)); // Reject the promise in case of an error
        })
        .run(); // Start the conversion process
    });
  }

  // Method to delete the video file after conversion
  private deleteVideo(): void {
    fs.unlink(this.inputFilePath, (err) => {
      if (err) {
        console.error("Error deleting video file:", err);
      } else {
        console.log("Video file deleted.");
      }
    });
  }
}

export default VideoConverter;
