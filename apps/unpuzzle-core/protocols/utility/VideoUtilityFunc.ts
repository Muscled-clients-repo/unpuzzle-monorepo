// utils/YouTubeHelper.ts (or .js if not using TypeScript)

import { BindMethods } from "./BindMethods";

export class videoUtilityFunc {
  // Method to extract the video ID from a YouTube URL
  extractVideoId = (url: string): string | null => {
    try {
      const parsedUrl = new URL(url);

      // Case 1: Standard URL like https://www.youtube.com/watch?v=abc123
      if (parsedUrl.hostname.includes("youtube.com")) {
        return parsedUrl.searchParams.get("v");
      }

      // Case 2: Shortened URL like https://youtu.be/abc123
      if (parsedUrl.hostname === "youtu.be") {
        return parsedUrl.pathname.slice(1);
      }

      // Case 3: Embed URL like https://www.youtube.com/embed/abc123
      if (parsedUrl.pathname.startsWith("/embed/")) {
        return parsedUrl.pathname.split("/embed/")[1];
      }

      return null;
    } catch (error) {
      console.error("Invalid YouTube URL:", error);
      return null;
    }
  };

  // You can add more reusable YouTube-related functions here later
}

const binding = new BindMethods(new videoUtilityFunc());
export default binding.bindMethods();
