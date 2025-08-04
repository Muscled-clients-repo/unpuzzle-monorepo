import axios from 'axios';

/**
 * @class GeminiService
 * @description Provides a service to interact with the Google Gemini API for content generation.
 */

export class GeminiService {
  private apiKey: string;
  private baseUrl: string;

  constructor(model = 'gemini-2.0-flash') {
    
    this.apiKey = process.env.GEMINI_API_KEY || "";
    this.baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  }


  async generateContent(promptText: string): Promise<any> {
    if (!promptText) {
      throw new Error('Prompt text is required to generate content.');
    }

    const payload = {
      contents: [
        {
          parts: [
            {
              text: promptText,
            },
          ],
        },
      ],
    };

    try {
      const response = await axios.post(this.baseUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
        params: {
          key: this.apiKey,
        },
      });
      const data = response.data.candidates[0].content.parts[0].text;
      return JSON.parse(data.replace("```json", "").replace("```", "").trim());;
    } catch (error: any) {
      console.error('Error generating content from Gemini API:', error.response ? error.response.data : error.message);
      throw new Error(`Failed to generate content: ${error.response ? error.response.statusText : error.message}`);
    }
  }
}