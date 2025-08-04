import { BindMethods } from "../../protocols/utility/BindMethods";
import { BaseAgent } from "./BaseAgent";

class PuzzleCheck extends BaseAgent {
  constructor() {
    super();
  }
  setPrompt(topic: string, transcript: string) {
    return `You are an AI trained to generate multiple-choice questions (MCQs) and True/False questions based on the given video transcript and its context.

      Given the transcript:
      ${transcript}

      Video Title:
      ${topic}

      #Instruction
        - Generate 1-3 MCQs with 4 answer options each, indicating the correct answer.
        - Generate 1-2 True/False questions with 'True' and 'False' choices, indicating the correct answer.
        - Make sure questions are relevant, clear, and concise.
        - Avoid very easy or very hard questions.
        - Avoid repeating similar questions.
        - Make sure the questions are not too long or too short.
        
      Respond ONLY with a JSON object in this format:

      {
        completion: [
          {
            question: <MCQ question>,
            answer: <correct answer>,
            choices: [
              <choice1>,
              <choice2>,
              <choice3>,
              <choice4>
            ]
          },
          {
            question: <True/False question>,
            answer: <True or False>,
            choices: [
              True,
              False
            ]
          }
        ],
        topic: <topic>
      }`;
  }

  // function to generate  the hint on instruction and transcript
  generateCheck = async (
    req: any,
    params: {
      topic: string;
      transcript: string;
      description?: string;
    },
    retryCount = 0,
    maxRetries = 3
  ): Promise<Array<{ prompt: string; completion: string }>> => {
    const { topic, description, transcript } = params;

    // Build prompt for the model combining transcript and instructions
    req.socketId = `check-stream_${req.socketId}`;
    const response = await this.chatCompletion(req, {
      model: "gpt-4", // or "gpt-3.5-turbo" for cost savings
      messages: [
        {
          role: "system",
          content: this.setPrompt(topic, transcript),
        },
      ],
      maxTokens: 1000,
      temperature: 0.7,
      parseJson: true,
    });
    return response;
  };

  // utility to clean the Json String From Open AI
  cleanStringJson = (rawText: string) => {
    let cleaned = rawText.trim();

    // If starts and ends with quotes, treat as JSON string
    if (
      (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
      (cleaned.startsWith("“") && cleaned.endsWith("”"))
    ) {
      // Remove outer quotes
      cleaned = cleaned.slice(1, -1);
    }

    return cleaned;
  };
}
const binding = new BindMethods(new PuzzleCheck());
export default binding.bindMethods();
