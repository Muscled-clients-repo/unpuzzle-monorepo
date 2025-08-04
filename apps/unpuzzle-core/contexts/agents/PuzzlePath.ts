import { Request } from "express";
import { BindMethods } from "../../protocols/utility/BindMethods";
import OpenAIService from "../services/openAI";
import YoutubeTranscriptService from "../services/youtubeTranscript";
import { Transcript } from "../../types/transcript.type";
import { Video } from "../../types/video.type";
import { youtubeVideoSearchTitle } from "../../protocols/prompts/prompts";
// model

import VideoModel from "../../models/supabase/video";
import { response } from "express";
import { BaseAgent } from "./BaseAgent";
import { recommendedTitlePrompt } from "../../protocols/prompts/prompts";

interface LogEntry {
  action: "pause" | "play" | "seek";
  duration?: string;
  from?: string;
  to?: string;
}

class PuzzlePath extends BaseAgent {
  // private openai?: any;
  private YoutubeTranscriptServiceIns;
  constructor() {
    super();
    // this.openai = OpenAIService;
    this.YoutubeTranscriptServiceIns = YoutubeTranscriptService;
  }

  private timeToSeconds(t?: string | number): number {
    if (typeof t === "number") return t;
    if (!t) return NaN;
    const parts = t.split(":").map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return NaN;
  }

  private validateLogs(logs: LogEntry[]): boolean {
    console.log("Logs type:", typeof logs);

    console.log("logs: ", logs, " Array.isArray(logs)", Array.isArray(logs));
    if (!Array.isArray(logs)) return false;
    console.log("logs: ", logs);
    // return logs.every((l) =>
    //   l.action
    //     ? ["pause", "play"].includes(l.action)
    //       ? typeof l.duration === "string" && l.duration.length > 0
    //       : l.action === "seek"
    //       ? typeof l.from === "string" && typeof l.to === "string"
    //       : true
    //     : false
    // );
    return logs.every(
      (l) =>
        l.action &&
        (["pause", "play"].includes(l.action)
          ? typeof l.duration === "number"
          : l.action === "seek"
          ? typeof l.from === "number" && typeof l.to === "number"
          : false)
    );
  }

  async recommendVideo(params: {
    req: Request;
    transcripts: Transcript[];
    videoId: string;
    logs: LogEntry[];
    video: Video;
  }): Promise<any> {
    const { req, transcripts, videoId, logs, video } = params;
    if (!this.validateLogs(logs)) throw new Error("Invalid logs input");

    // Detect stuck (2+ pauses or rewind)
    const pauses = logs.filter((l) => l.action === "pause").length;
    const rewinds = logs.filter(
      (l) =>
        l.action === "seek" &&
        this.timeToSeconds(l.from) > this.timeToSeconds(l.to)
    ).length;

    if (pauses < 2 && rewinds < 2)
      return { message: "User not stuck", recommendations: [] };

    // Find stuck timestamp (last pause preferred)
    let stuckTime = NaN;
    for (let i = logs.length - 1; i >= 0; i--) {
      const l = logs[i];
      if (l.action === "pause") {
        stuckTime = this.timeToSeconds(l.duration);
        break;
      }
      if (
        l.action === "seek" &&
        this.timeToSeconds(l.from) > this.timeToSeconds(l.to) &&
        isNaN(stuckTime)
      ) {
        stuckTime = this.timeToSeconds(l.from);
      }
    }
    if (isNaN(stuckTime))
      return { message: "No stuck timestamp found", recommendations: [] };

    // Merge transcript texts ±10 sec around stuckTime
    const mergedText = transcripts
      .filter(({ start_time_sec, end_time_sec }) => {
        const end = start_time_sec + end_time_sec;
        return end >= stuckTime - 10 && start_time_sec <= stuckTime + 10;
      })
      .map((s) => s.content)
      .join(" ");
    if (!mergedText)
      return { message: "No relevant transcript found", recommendations: [] };

    // Get keywords using OpenAI or fallback to simple extraction
    let title: string = "";
    if (this.openai && mergedText.length > 20) {
      const prompt = youtubeVideoSearchTitle(video.title, mergedText);

      try {
        // Set the socketId for streaming with path prefix
        req.socketId = `path-stream_${req.socketId}`;
        const response = await this.chatCompletion(req, {
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant. Generate a valid, concise, point-based answer strictly based on the provided transcript and context. You need to Analyze Transcript If any Question Listed Answer That Question and Answer Should b an Array. Do not add any information not present in the transcript.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          // max_tokens: 300,
          temperature: 0,
          parseJson: true,
        });

        title = response.title;
      } catch (error) {
        console.error("OpenAI error:", error);
      }
    }
    try {
      let ytVideos = await this.YoutubeTranscriptServiceIns.searchYouTubeVideo({
        title,
        maxResults: 5,
      });

      // exclude the xisting videos
      if (ytVideos.length > 0) {
        ytVideos = ytVideos
          .filter((value: any) => value.videoId !== videoId)
          .map((value: any) => ({
            videoId: value.videoId,
            youtubeUrl: value.youtubeUrl,
            title: value.title,
          }));
      }
      if (ytVideos.length) {
        return {
          source: "YouTube",
          stuckAt: stuckTime,
          topicText: mergedText,
          recommendations: [ytVideos[0], ytVideos[1], ytVideos[2]],
        };
      }
    } catch (e: any) {
      console.error("YouTube API error:", e.message);
    }

    return { message: "No recommendations found", recommendations: [] };
  }
}

const binding = new BindMethods(new PuzzlePath());
export default binding.bindMethods();
