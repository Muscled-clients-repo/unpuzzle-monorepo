import { google, youtube_v3 } from "googleapis";
import VideoModel from "../../models/supabase/video";
import { YoutubeTranscript } from "youtube-transcript";
import { Transcript } from "../../types/transcript.type";
import { Video } from "../../types/video.type";
import TranscriptModel from "../../models/supabase/transcript";
import { BindMethods } from "../../protocols/utility/BindMethods";
import youtubedl from "youtube-dl-exec"; // ✅ raw returns subprocess
import WhisperService from "./Whisper";
import { createReadStream } from "fs"; // for fs.createReadStream
import * as fs from "fs/promises";
import { Readable } from "stream"; // for stream type
import path from "path";

const ytDlpPath = path.join(
  __dirname,
  "..",
  "..",
  "node_modules",
  "youtube-dl-exec",
  "bin",
  "yt-dlp.exe"
);

class YoutubeTranscriptService {
  private youtube;

  constructor() {
    this.youtube = google.youtube({
      version: "v3",
      auth: process.env.YOUTUBE_API_KEY,
    });
  }
  // fetch transcript of youtube video using YOUTUBE
  public fetchTranscript = async (
    videoId: string,
    language = "en"
  ): Promise<any> => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    // { text: string; start: number; duration: number }[]
    try {
      if (!videoId || typeof videoId !== "string") {
        throw new Error("Invalid videoId provided.");
      }

      const transcript = await YoutubeTranscript.fetchTranscript(videoId, {
        lang: language,
      });
      console.log("transcript: ", transcript);
      if (
        !transcript ||
        !Array.isArray(transcript) ||
        transcript.length === 0
      ) {
        throw new Error(
          "Transcript not found or empty for video ID: " + videoId
        );
      }
      return transcript;
    } catch (error: any) {
      // fallback functionality download audio file
      // testing start
      const outputDir = path.join(__dirname, "..", "..", "uploads");
      const output = path.join(outputDir, "%(title)s.%(ext)s");

      try {
        const result = await youtubedl(
          url,
          {
            extractAudio: true,
            audioFormat: "mp3",
            output,
          },
          {
            // this second argument is config for youtube-dl-exec itself
            stdio: "inherit",
            shell: false,
            // executablePath: ytDlpPath, // ← ✅ proper way to specify binary path
          }
        );
        const files = await fs.readdir(outputDir);
        const mp3File = files.find((f) => f.endsWith(".mp3"));

        if (!mp3File) throw new Error("Audio file not found after download");

        const filePath = path.join(outputDir, mp3File);

        // 3. Construct a fake Multer file object to use with getTranscript
        const file: Express.Multer.File = {
          path: filePath,
          filename: mp3File,
          originalname: mp3File,
          mimetype: "audio/mpeg",
          size: 0,
          destination: output,
          fieldname: "file",
          encoding: "7bit",
          buffer: Buffer.alloc(0),
          stream: createReadStream(filePath) as Readable,
        };
        // 4. Get transcript
        const transcript = await WhisperService.getTranscript(file, language);
        console.log("transcript: ", transcript);
        // 5. Delete the downloaded file
        await fs.unlink(filePath);

        // 6. Return the transcript
        return transcript;
      } catch (err) {
        console.error("❌ Error downloading audio:", err);
        throw new Error(
          error.message || `Failed to downloadaudio for video ID "${videoId}"!`
        );
      }
      // testing end
    }
  };

  fetchTranscriptFromDb = async (videoId: string) => {
    try {
      console.log("fetch Transcript Run !");
      const includeTranscripts = true;
      if (!videoId || typeof videoId !== "string") {
        throw new Error("Invalid videoId provided.");
      }
      console.log("includeTranscripts: ", includeTranscripts);
      // Check if the video exists
      const video = await VideoModel.getVideoById(videoId, includeTranscripts);
      if (!video) {
        throw new Error(`Video not found for ID: ${videoId}`);
      }

      // Fetch transcripts for the video
      let transcripts: Transcript[] = [];
      if (video && 'transcripts' in video && Array.isArray(video.transcripts)) {
        transcripts = video.transcripts;
      }

      return transcripts;
    } catch (error: any) {
      // Wrap and throw the error with context
      throw new Error(
        error.message || `Failed to fetch transcript for video ID "${videoId}"!`
      );
    }
  };

  createVideoWithTranscripts = async (videoId: string, chapterId: string) => {
    try {
      if (
        !videoId ||
        typeof videoId !== "string" ||
        !chapterId ||
        typeof chapterId !== "string"
      ) {
        throw new Error(
          `Invalid ${videoId ? "Chpater Id" : "Video Id"}  provided.`
        );
      }

      const existingVideo = await VideoModel.getVideoById(videoId);

      if (existingVideo) {
        throw new Error(`Video with ID ${videoId} already exists.`);
      }
      const transcripts = await this.fetchTranscript(videoId);
      if (!transcripts || transcripts.length === 0) {
        throw new Error("No transcripts found for this video.");
      }
      // Fetch video details using YouTube Data API
      const response = await this.youtube.videos.list({
        part: ["snippet"],
        id: [videoId],
      });
      const videoData = response.data.items?.[0];
      if (!videoData)
        throw new Error("Video Details Not Found!");
      // Create video
      const videoURL = `https://www.youtube.com/watch?v=${videoData.id}`;

      const saveVideo = await VideoModel.createVideo({
        chapter_id: chapterId,
        title: this.decodeHtmlEntities(videoData.snippet?.title) || "",
        video_url: videoURL,
        default_source: "youtube",
        yt_video_id: videoData.id || "",
      });
      if (!saveVideo) {
        throw new Error("Failed to create video record.");
      }
      // create tanscripts
      const transcriptRecords = transcripts.map((transcript: any) => ({
        video_id: saveVideo.id,
        start_time_sec: Math.round(transcript.offset),
        end_time_sec: Math.round(
          Number(transcript.offset) + Number(transcript.duration)
        ),
        content: this.decodeHtmlEntities(transcript.text),
      }));
      const savedTranscript = await TranscriptModel.bulkInsertTranscripts(
        transcriptRecords
      );
      return { ...saveVideo, transcripts: savedTranscript };
    } catch (error: any) {
      throw new Error(error?.message || "Internal Server Problem!");
    }
  };
  getVideoById = async (videoId: string, includeTranscripts = false) => {
    try {
      if (!videoId || typeof videoId !== "string") {
        throw new Error("Invalid videoId provided.");
      }
      const video = await VideoModel.getVideoById(videoId, includeTranscripts);
      if (!video) {
        throw new Error(`Video with ID ${videoId} not Found.`);
      }
      return video;
    } catch (error: any) {
      throw new Error(error?.message || "Internal Server Problem!");
    }
  };
  // utility func to decod html form api's
  public decodeHtmlEntities = (text: String | null | undefined) => {
    if (text === null || text === undefined) return text;
    return text
      .replace(/&amp;#39;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">");
    // add more replacements here if needed
  };
  getCompleteTranscriptContext = async (
    transcripts: Array<{
      start_time_sec: number;
      end_time_sec: number;
      content: string;
    }>,
    currentTime: number,
    maxContextDuration = 20, // total seconds max
    preContextDuration = 15 // seconds before current segment
  ) => {
    if (!transcripts || transcripts.length === 0)
      return { snippet: "", startIndex: 0, endIndex: 0, totalDuration: 0 };

    // Find index of segment covering currentTime or last before it
    let currentIndex = transcripts.findIndex(
      (t) =>
        t.start_time_sec <= currentTime &&
        currentTime < t.start_time_sec + (t.end_time_sec - t.start_time_sec)
    );
    if (currentIndex === -1) {
      currentIndex = transcripts.findIndex(
        (t) => t.start_time_sec <= currentTime
      );
      if (currentIndex === -1) currentIndex = 0;
    }

    // Start with current segment + one future segment if exists
    let startIndex = currentIndex;
    let endIndex = currentIndex;
    let accumulatedDuration =
      transcripts[currentIndex]?.end_time_sec -
        transcripts[currentIndex]?.start_time_sec || 0;

    if (currentIndex + 1 < transcripts.length) {
      const nextSeg = transcripts[currentIndex + 1];
      accumulatedDuration += nextSeg.end_time_sec - nextSeg.start_time_sec || 0;
      endIndex = currentIndex + 1;
    }

    // Now expand backward to fill up remaining time (maxContextDuration - accumulatedDuration)
    let remainingDuration = maxContextDuration - accumulatedDuration;
    let startTimeOfCurrent = transcripts[startIndex]?.start_time_sec || 0;

    for (let i = currentIndex - 1; i >= 0; i--) {
      const seg = transcripts[i];
      if (!seg) break;

      const segmentStart = seg.start_time_sec || 0;
      const gap =
        startTimeOfCurrent -
        (segmentStart + (seg.end_time_sec - seg.start_time_sec || 0));

      const segDurationWithGap =
        seg.end_time_sec - seg.start_time_sec + (gap > 0 ? gap : 0);

      if (segDurationWithGap > remainingDuration) break;

      accumulatedDuration += segDurationWithGap;
      remainingDuration -= segDurationWithGap;

      startIndex = i;
      startTimeOfCurrent = segmentStart;
    }

    // Join transcript texts from startIndex to endIndex
    const snippet = transcripts
      .slice(startIndex, endIndex + 1)
      .map((t) => t.content)
      .join(" ");

    return {
      snippet,
      startIndex,
      endIndex,
      totalDuration: accumulatedDuration,
    };
  };
  // search youtube video with key word
  searchYouTubeVideo = async ({
    title,
    maxResults = 3,
  }: {
    title: string;
    maxResults: number;
  }) => {
    try {
      const response = await this.youtube.search.list({
        part: ["snippet"],
        q: title,
        type: ["video"],
        maxResults,
      });
      const items = response.data.items || [];
      return items.map((item) => ({
        videoId: item.id?.videoId || "",
        title: item.snippet?.title || "",
        description: item.snippet?.description || "",
        channelTitle: item.snippet?.channelTitle || "",
        thumbnail: item.snippet?.thumbnails?.default?.url || "",
        source: "YouTube",
      }));
    } catch (error) {
      console.error("YouTube API error:", error);
      return [];
    }
  };
}
const binding = new BindMethods(new YoutubeTranscriptService());
export default binding.bindMethods();
