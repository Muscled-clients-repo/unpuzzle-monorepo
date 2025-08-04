// prompts.ts
export const generateCheckPrompt = (prompt: string) => `
You are an AI trained to generate multiple-choice questions (MCQs) based on the given video transcript and its context.
Using ONLY the provided information below, generate clear and relevant 1 MCQ only with 4 answer options and indicate the correct answer.

${prompt}

Respond ONLY with a JSON array of questions in this format:

[
  {
    "question": "Question text",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "answer": "Correct Option"
  }
]

Make sure to generate questions strictly based on the transcript and context without adding any information.
`;
export const puzzleHintPrompt = () =>
  `
You are a smart assistant that reads a topic and transcript and returns a structured JSON array with three keys:

1. "question" — the full transcript prefixed with "Transcript:\\n"
2. "prompt" — the cleaned-up question extracted from the transcript
3. "completion" — an array of 2–5 clear and brief, helpful steps answering the question
NOTE: You Need to Read Transcript and Extract Question from it and then generate the Answer in Steps 
Your response **must** be a valid JSON array in this format and You Don't Need To Include Any Extra Text Rather Then This Format And This Should B Valid JSON:

[
  {
    "question": "Transcript:\\n[original transcript]",
    "prompt": "[natural language question]",
    "completion": [
      "Step 1 answer",
      "Step 2 answer",
      "Step 3 answer"
    ]
  }
]

Rules:
- All strings must use double quotes
- Escape all newlines as \\n
- Don't add trailing commas
- Only return the JSON array — no extra commentary or formatting

Example input:
Transcript:
Question the video is explaining how to add a custom animation in your product page?

Expected Output:
"[
  {
    "question": "Transcript:\\ the video is explaining how to add a custom animation in your product page?",
    "prompt": "the video is explaining how to add a custom animation in your product page?",
    "completion": [
   "Go to theme editor"
   "Add a new asset file"
   "Create a new snippet and add the asset file there"
    ]
  }
]"

Now generate a response for this Topic , Description Of Video And More Specifically Focus ON The Particular Time Span Transcript For The Conetxt only:\n
`.trim();

export const recommendedAgentPrompt = (logs: any[], duration: number) => `
You are given user video interaction logs. Your task is to:

1. Determine which AI agent should assist the user based on struggle severity:
   - "puzzleHint" for low struggle (unless more than 5 hints were generated within 2 minutes)
   - "puzzleChecks" for moderate struggle (unless more than 5 checks were generated within 2 minutes)
   - "puzzlePath" for high struggle
   - "puzzleReflect" if the user watches more than 80% of the video. Here is the complete video duration: ${duration}

2. Identify all periods of struggle in the logs. and find the start and end time where user most struggle and also the duration where the most struggle happend and return this:
   - startTime (seconds)
   - endTime (seconds)
   - duration (seconds) as watched duration of the video

  ### Instructions:
- If **more than 5 hints** are generated within **2 minutes**, do not use 'puzzleHint' and fallback to 'puzzleChecks'.
- If **more than 5 checks** are generated within **2 minutes**, do not use 'puzzleChecks' and fallback to 'puzzlePath'.
- If the user watches more than **80%** of the video, return 'puzzleReflect' as the agent.
- If none of the above conditions are met, return 'puzzlePath' as the agent.

STRICTLY follow the below instructions:

- Respond ONLY with a single JSON object matching this exact schema:
{
  "agent": "puzzleHint" | "puzzleChecks" | "puzzlePath" | "puzzleReflect",
  "strugglePeriods":{ "startTime": number, "endTime": number, "duration": number }
}

- Do NOT include any explanations, comments, or additional text.
- Ensure the JSON is valid and parsable.

Logs: ${JSON.stringify(logs)}
`;

export const recommendedTitlePrompt = (title: string) => {
  return `You are an AI assistant trained to help users find related videos on YouTube.

Based only on the video title below, generate:
- One **concise and helpful video title** that a user might search for to find a related or alternative explanation of the same topic.

The new title should be similar in style and meaning to the original, but offer a fresh or helpful perspective.

Respond ONLY in this JSON format — no explanations, no extra text:

{
  "title": "Generated similar and helpful video title"
}

Video Title: ${title}
`;
};
export const youtubeVideoSearchTitle = (
  title: string,
  mergedText: string
) => `You are an AI assistant trained to optimize content for searchability on platforms like YouTube.

The transcript provided below is from a **specific point in the video where the user got stuck** — this is the core focus. 
Your task is to generate:
- One **concise, catchy, and helpful title** that reflects the issue or topic at this **stuck point** in the transcript (as if it were its own standalone video).
- Five **relevant keywords** that users might search to find a solution to this stuck point.

Use the **video title and description only for general context** — but focus primarily on the transcript to generate useful metadata for search and recommendation purposes.

Respond ONLY in this JSON format — no explanations, no extra text:

{
  "title": "Your generated title here",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}

Video Title: ${title}

Transcript (user's stuck point):
${mergedText}
`;
