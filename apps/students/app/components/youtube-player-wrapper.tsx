"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}
interface YouTubePlayerInterface {
  videoId: string;
}
export default function YouTubePlayer({ videoId }: YouTubePlayerInterface) {
  const playerRef = useRef<any>(null);
  const [currentTime, setCurrentTime] = useState(0);
  //   const videoId = "rmt17LVJJOU"; // Change this to your video ID

  useEffect(() => {
    // Load YouTube Iframe API script
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    // Create the player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("youtube-player", {
        videoId: videoId,
        height: "486",
        events: {
          onReady: () => {
            // Start interval to update current time
            setInterval(() => {
              const time = playerRef.current?.getCurrentTime();
              setCurrentTime(Math.floor(time));
            }, 1000);
          },
        },
      });
    };
  }, []);

  return (
    <div className="space-y-4">
      <div id="youtube-player" className="aspect-video w-full" />
      {/* <p>⏱️ Current Time: {currentTime} seconds</p> */}
    </div>
  );
}
