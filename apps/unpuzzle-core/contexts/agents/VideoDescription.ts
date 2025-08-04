import {BaseAgent} from "./BaseAgent";

class VideoDescription extends BaseAgent {

  constructor() {
    super();
  }

  prompt = (context: string) => {
    return `I have the following plain text description content:

        ${context}

        Please convert this into a clean, semantic HTML component using Tailwind CSS classes only. 
        - Remove the entire sections titled “Follow Us on Instagram”, “Subscribe”, and their content.
        - Remove all affiliate links and any text indicating affiliate links or disclaimers related to commissions.
        - Use appropriate headings (<h1>, <h2>, etc.) for sections.  
        - Format lists as bullet points.  
        - Style links with Tailwind classes to look distinct and clickable.  
        - Add spacing and typography classes for readability (like margins, font sizes, colors).  
        - Do not add external CSS, only use Tailwind classes inline.  
        - The output should be a self-contained HTML snippet that can be embedded into a webpage.
        - The output should be a valid HTML snippet.
        - Only return the HTML — no extra commentary

        Generate the complete HTML component now.`}

  
  async generate(context: string){
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: this.prompt(context) },
        ],
      });
      const html = response.choices[0].message.content;
      return html?.replace(/^```html\n/, '').replace(/\n```$/, '');
    } catch (error) {
      throw error;
    }
  }
}

export default VideoDescription;
