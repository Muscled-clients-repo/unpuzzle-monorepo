import { BindMethods } from "../../protocols/utility/BindMethods";
import { BaseAgent } from "./BaseAgent";
import { GeminiService } from "../services/GeminiService";

export class PuzzleHintGenerator extends BaseAgent {
  constructor() {
    super();
  }
  setPrompt(topic: string, transcript: string) {
    return `You are an expert tutor helping learners understand how to solve a specific problem.
      Given the question:
      "${transcript}"
      Video Title:
      "${topic}"
      Generate a small concise and informative topic title summarizing the main issue.
      Then, generate a detailed step-by-step guide to solve the problem.
      For each step, include:
      - What to do (instruction)
      - Complete the guide within 4-5 steps.
      Format your answer exactly as JSON with these fields:
      {
        "question": <question>,
        "topic": "<generate a short, clear topic title here>",
        "prompt": "<generate a short, clear prompt here>",
        "completion": [
          {
            "step_number": 1,
            "instruction": "string",
          },
          {
            "step_number": 2,
            "instruction": "string",
          }
          ...add more steps as needed
        ]
      }
      - Do NOT include any explanations, comments, or additional text.
      - Ensure the JSON is valid and parsable.
      `
  }

  
  // function to generate  the hint on instruction and transcript
  generateHint = async (
    req: any,
    params: {
      topic: string;
      transcript: string;
      description?: string;
    },
    retryCount = 0,
    maxRetries = 3
  ): Promise<Array<{ prompt: string; completion: string }>> => {
    const geminiService = new GeminiService();

    const { topic, description, transcript } = params;

    // Build prompt for the model combining transcript and instructions
    // Set the socketId for streaming with hint prefix
    req.socketId = `hint-stream_${req.socketId}`;
    const response = await this.chatCompletion(req,{
      model: "gpt-4", // or "gpt-3.5-turbo" for cost savings
      messages: [
        {
          role: "system",
          content: this.setPrompt(topic, transcript),
        }
      ],
      maxTokens: 1000,
      temperature: 0.7,
      parseJson: true,
    });
    // const response = await geminiService.generateContent(this.setPrompt(topic, transcript));
    // console.log("response: ", response);
    return response;
  };


  // utility to clean the Json String From Open AI
  cleanStringJson = (rawText: string) => {
    let cleaned = rawText.trim();

    // If starts and ends with quotes, treat as JSON string
    if (
      (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
      (cleaned.startsWith('"') && cleaned.endsWith('"'))
    ) {
      // Remove outer quotes
      cleaned = cleaned.slice(1, -1);
    }

    return cleaned;
  };
}

const binding = new BindMethods(new PuzzleHintGenerator());
export default binding.bindMethods();
