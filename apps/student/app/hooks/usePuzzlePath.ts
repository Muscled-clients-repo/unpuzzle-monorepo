import { useCallback, useEffect, useRef, useState } from "react";
import { PuzzlePath } from "../context/PuzzlePath";
import { useAuth } from "@clerk/nextjs";

interface VideoData {
  id?: string;
  puzzlePaths?: any[];
  error?: string;
  [key: string]: any;
}

export function usePuzzlePath() {
  const [data, setData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const pathInterfaceRef = useRef<PuzzlePath | null>(null);

  // Initialize PuzzlePath
  useEffect(() => {
    if (!pathInterfaceRef.current) {
      pathInterfaceRef.current = new PuzzlePath();

      // Set up event listeners
      pathInterfaceRef.current.onDataChange((newData: VideoData | null) => {
        setData(newData);
      });

      pathInterfaceRef.current.onLoadingChange((loading: boolean) => {
        setLoading(loading);
      });
    }
  }, []);

  // Listen for puzzle-path:generate event
  useEffect(() => {
    const handlePuzzlePathGenerate = () => {
      // getPath();
    };

    document.addEventListener("puzzle-path:generate", handlePuzzlePathGenerate);

    return () => {
      document.removeEventListener(
        "puzzle-path:generate",
        handlePuzzlePathGenerate
      );
    };
  }, []);

  const getPath = useCallback(async ({video,duration}:{video:any,duration:number}) => {

    if (!pathInterfaceRef.current) return;

    // Get current time and video info (you'll need to adapt this for your React app)
    // const duration = (window as any).ytPlayer?.getCurrentTime() || 0;
    // const video = (window as any).ytPlayer?.video;
    // const duration = 5;
    // const video = {
    //   title: "Dummy Video Title",
    //   id: "b05fdf9e-26d6-48e2-835a-54b35929fd83",
    //   duration: 120, // Dummy duration in seconds
    //   author: "Dummy Channel",
    // };

    const token = await getToken();

    if (!video?.id && token) {
      console.error(video?.id ? "token Not Provided" : "Video not available");
      return;
    }

    if (!video?.id) {
      console.error("Video not available");
      return;
    }

    pathInterfaceRef.current.setLoading(true);

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_APP_SERVER_URL
        }/api/puzzel-path?videoId=${encodeURIComponent(
          video.id
        )}&endTime=${encodeURIComponent(duration)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const { data } = await response.json();
        
        const newData = { ...video, puzzlePaths: data };
        pathInterfaceRef.current.updatePath(newData);
      } else {
        throw new Error("Failed to fetch puzzle path data");
      }
    } catch (error: any) {
      console.error(error);
      pathInterfaceRef.current.updatePath({ id: video?.id || '', error: error?.message });
      pathInterfaceRef.current.setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    getPath,
    pathInterface: pathInterfaceRef.current,
  };
}
