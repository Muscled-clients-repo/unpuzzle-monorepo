import { useCallback, useEffect, useRef, useState } from "react";
import { PuzzleReflect } from "../context/PuzzleReflect";

interface PuzzleReflectData {
  completion?: any[];
  error?: string;
  [key: string]: any;
}

interface ReflectEventDetail {
  type: "audio" | "file" | "loom-link";
  blob?: Blob;
  file?: File;
  loomLink?: string;
  videoId?: string;
  currentTime?: number;
}

export function usePuzzleReflect() {
  const [data, setData] = useState<PuzzleReflectData | null>(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const reflectInterfaceRef = useRef<PuzzleReflect | null>(null);

  // Initialize PuzzleReflect
  useEffect(() => {
    if (!reflectInterfaceRef.current) {
      reflectInterfaceRef.current = new PuzzleReflect();

      // Set up event listeners
      reflectInterfaceRef.current.onDataChange(
        (newData: PuzzleReflectData | null) => {
          setData(newData);
        }
      );

      reflectInterfaceRef.current.onLoadingChange((loading: boolean) => {
        setLoading(loading);
      });

      reflectInterfaceRef.current.onScoreChange(
        (score: number, totalScore: number) => {
          setScore(score);
          setTotalScore(totalScore);
        }
      );

      reflectInterfaceRef.current.onReset(() => {
        setData(null);
        setScore(0);
        setTotalScore(0);
        setLoading(false);
      });
    }
  }, []);

  // Listen for puzzle-reflect:generate event
  useEffect(() => {
    const handlePuzzleReflectGenerate = async (e: Event) => {
      const customEvent = e as CustomEvent<ReflectEventDetail>;

      if (customEvent.detail.type === "audio" && customEvent.detail.blob) {
        await createAudioReflect(
          customEvent.detail.blob,
          customEvent.detail.videoId || '',
          customEvent.detail.currentTime || 0
        );
        reflectInterfaceRef.current?.resetPuzzleReflect();
      } else if (
        customEvent.detail.type === "file" &&
        customEvent.detail.file
      ) {
        // createFileReflect(customEvent.detail.file);
        
      } else if (
        customEvent.detail.type === "loom-link" &&
        customEvent.detail.loomLink
      ) {
        // createLoomLinkReflect(customEvent.detail.loomLink);
        
      }
    };

    document.addEventListener(
      "puzzle-reflect:generate",
      handlePuzzleReflectGenerate
    );

    return () => {
      document.removeEventListener(
        "puzzle-reflect:generate",
        handlePuzzleReflectGenerate
      );
    };
  }, []);

  const createAudioReflect = useCallback(async (blob: Blob,id:string,currentTime:number) => {

    // const video = (window as any).ytPlayer?.video;
    // const currentTime = (window as any).ytPlayer?.getCurrentTime();

    if (!id) {
      console.error("Video not available");
      return;
    }

    const formData = new FormData();
    formData.append("file", blob);
    formData.append("video_id", id);
    formData.append("endTime", currentTime.toString());

    try {
      const response = await fetch(`${
        process.env.NEXT_PUBLIC_APP_SERVER_URL
      }/api/puzzel-reflects/audio`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await response.json();
      
      return data;
    } catch (error: any) {
      console.error("Error creating audio reflect:", error);
      throw error;
    }
  }, []);

  // 2. Video reflect
  const createVideoReflect = useCallback(async (file: File, id: string) => {
    if (!id) {
      console.error("Video ID not provided");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("video_id", id);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_SERVER_URL}/api/puzzel-reflects/video`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error("Error creating video reflect:", error);
      throw error;
    }
  }, []);

  // 3. Loom link reflect
  const createLoomLinkReflect = useCallback(async (loom_link: string, id: string) => {
    if (!id || !loom_link) {
      console.error("Video ID or Loom link not provided");
      return;
    }
    const data={loom_link:loom_link, video_id:id};
    
    // const formData = new FormData();
    // formData.append("loom_link", loom_link);
    // formData.append("video_id", id);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_SERVER_URL}/api/puzzel-reflects/loom-link`, {
        method: "POST",
        body: JSON.stringify({loom_link:loom_link, video_id:id}),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      const data = await response.json();
      
      return data;
    } catch (error: any) {
      console.error("Error creating loom link reflect:", error);
      throw error;
    }
  }, []);

  // 4. File reflect (multiple screenshots)
  const createFileReflect = useCallback(async (files: File[], id: string) => {
    
    if (!id || !files || files.length === 0) {
      console.error("Video ID or files not provided");
      return;
    }
    const formData = new FormData();
    files.forEach((file, idx) => {
      formData.append("files", file);
    });
    formData.append("video_id", id);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_SERVER_URL}/api/puzzel-reflects/file-uploads`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error("Error creating file reflect:", error);
      throw error;
    }
  }, []);

  const getReflect = useCallback(async () => {
    if (!reflectInterfaceRef.current) return;

    // const duration = (window as any).ytPlayer?.getCurrentTime() || 0;
    // const video = (window as any).ytPlayer?.video;

    const duration = 5;
    const video = {
      title: "Dummy Video Title",
      id: "b05fdf9e-26d6-48e2-835a-54b35929fd83",
      duration: 120, // Dummy duration in seconds
      author: "Dummy Channel",
    };
    if (!video?.id) {
      console.error("Video not available");
      return;
    }
    reflectInterfaceRef.current.setLoading(true);

  try {
      const response = await fetch(
        `https://unpuzzle-ai-backend-9ce95198fbde.herokuapp.com/api/puzzel-reflects?video_id=${encodeURIComponent(
          video.id
        )}&endTime=${encodeURIComponent(duration)}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      
      if (reflectInterfaceRef.current) {
        reflectInterfaceRef.current.data = data;
        reflectInterfaceRef.current.totalScore = data.completion?.length || 0;
        reflectInterfaceRef.current.score = 0;
        reflectInterfaceRef.current.updateReflect();
      }
    } catch (error: any) {
      console.error(error);
      reflectInterfaceRef.current?.updateReflect({ error: error.message });
      reflectInterfaceRef.current?.setLoading(false);
    }
  }, []);

  // New: Get all puzzle reflects
  const getAllPuzzleReflects = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_SERVER_URL}/api/puzzel-reflects`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch all puzzle reflects");
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error("Error fetching all puzzle reflects:", error);
      throw error;
    }
  }, []);

  // New: Get puzzle reflect by ID
  const getPuzzleReflectById = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER_URL}/api/puzzel-reflects/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch puzzle reflect by id");
        }

        const data = await response.json();
        return data;
      } catch (error: any) {
        console.error("Error fetching puzzle reflect by id:", error);
        throw error;
      }
    },
    []
  );

  return {
    getReflect,
    createAudioReflect,
    createVideoReflect,
    createLoomLinkReflect,
    createFileReflect,
    reflectInterface: reflectInterfaceRef.current,
    getAllPuzzleReflects,
  };
}
