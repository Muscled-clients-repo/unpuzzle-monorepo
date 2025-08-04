import OpenAI from "openai";
import { BindMethods } from "../../protocols/utility/BindMethods";
import { Request } from "express";

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

class OpenAIService {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPEN_AI_API;
    if (!apiKey || apiKey.trim() === "") {
      throw new Error("OpenAI API key is required.");
    }
    this.openai = new OpenAI({ apiKey });
  }

  async chatCompletion(
    req: Request,
    {
      model = "gpt-4",
      messages,
      maxTokens = 1000,
      temperature = 0,
      parseJson = false,
      retryCount = 0,
      maxRetries = 3,
    }: ChatCompletionOptions
  ): Promise<any> {
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
      // console.log("req.io: ", req.io);

      for await (const chunk of response) {
        const delta = chunk.choices?.[0]?.delta?.content;
        if (delta) {
          content += delta;
          process.stdout.write(delta);
          if (req.io && req.socketId) {
            req.io.emit(req.socketId, {
              message: delta,
            });
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
      console.error("OpenAI API error:", error.message ?? error);
      throw error;
    }
  }
}

const binding = new BindMethods(new OpenAIService());
export default binding.bindMethods();
