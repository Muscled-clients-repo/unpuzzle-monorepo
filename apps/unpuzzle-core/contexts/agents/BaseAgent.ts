import { Request } from "express";

import OpenAI from "openai";
import OpenAIService from "../services/openAI";

// interface
type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

interface ChatCompletionOptions {
  model?: string;
  messages: Message[];
  maxTokens?: number;
  temperature?: number;
  parseJson?: boolean;
  retryCount?: number; // optional in type because defaults exist
  maxRetries?: number; // optional in type
}

export class BaseAgent {
  public openai = OpenAIService;
  constructor() {
    // this.openai = OpenAIService;
    const apiKey = process.env.OPEN_AI_API;
    if (!apiKey || apiKey.trim() === "") {
      throw new Error("OpenAI API key is required.");
    }
    this.openai = new OpenAI({ apiKey });
  }
  getAgentResponse = async (
    req: Request,
    {
      model = "gpt-4",
      messages,
      maxTokens = 300,
      temperature = 0,
      parseJson = false,
      retryCount = 0,
      maxRetries = 3,
    }: ChatCompletionOptions
  ): Promise<any> => {
    console.log("chat Completion Run !");
    if (!messages || messages.length === 0) {
      throw new Error("Messages array is required and cannot be empty");
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: model,
        messages: messages,
        temperature: temperature,
        max_tokens: maxTokens,
        stream: true,
      });
      // const content = response.choices[0].message?.content || "";

      let content = "";
      if (process.env.NODE_ENV === "development") {
        console.log("req.io: ", req.io);
      }

      for await (const chunk of response) {
        const delta = chunk.choices?.[0]?.delta?.content;
        if (delta) {
          content += delta;
          process.stdout.write(delta);
          if (req.io && req.socketId) {
            req.io.emit(req.socketId, {
              message: delta,
            });
          } else {
            console.log(`[DEBUG] Missing req.io (${!!req.io}) or req.socketId (${req.socketId})`);
          }
        }
      }

      // req.io.close();

      if (parseJson) {
        try {
          // Clean markdown json blocks if present
          const cleaned = content
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
          const parsed = JSON.parse(cleaned);
          return parsed;
        } catch {
          if (retryCount < maxRetries) {
            console.warn(
              `JSON parse failed, retrying ${retryCount + 1}/${maxRetries}...`
            );
            return await this.getAgentResponse(req, {
              model,
              messages,
              maxTokens,
              temperature,
              parseJson,
              retryCount: retryCount + 1,
              maxRetries,
            });
          } else {
            throw new Error(
              `Failed to parse JSON from OpenAI response after ${maxRetries} attempts. Raw response:\n${content}`
            );
          }
        }
      }

      return content;
    } catch (error: any) {
      console.error("OpenAI API error:", error.message ?? error);
      throw error;
    }
  };
  chatCompletion = async (
    req: Request,
    {
      model = "gpt-4",
      messages,
      maxTokens = 300,
      temperature = 0,
      parseJson = false,
      retryCount = 0,
      maxRetries = 3,
    }: ChatCompletionOptions
  ): Promise<any> => {
    if (!messages || messages.length === 0) {
      throw new Error("Messages array is required and cannot be empty");
    }

    try {
      const config = {
        model: model,
        messages: messages,
        temperature: temperature,
        max_tokens: maxTokens,
      };
      // const response = await this.openai.chat.completions.create({
      const response = await this.getAgentResponse(req, config);
      console.log("response is:: ", response);

      const content = response;
      if (parseJson) {
        try {
          // Clean markdown json blocks if present
          const cleaned = content
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
          const parsed = JSON.parse(cleaned);
          return parsed;
        } catch {
          if (retryCount < maxRetries) {
            console.warn(
              `JSON parse failed, retrying ${retryCount + 1}/${maxRetries}...`
            );
            return this.chatCompletion(req, {
              model,
              messages,
              maxTokens,
              temperature,
              parseJson,
              retryCount: retryCount + 1,
              maxRetries,
            });
          } else {
            throw new Error(
              `Failed to parse JSON from OpenAI response after ${maxRetries} attempts. Raw response:\n${content}`
            );
          }
        }
      }

      return content;
    } catch (error: any) {
      console.log("OpenAI API error:: ", error);
      console.error("OpenAI API error:", error.message ?? error);
      throw error;
    }
  };
}
