import { useCallback, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { PuzzleCheck } from "../context/PuzzleCheck";

interface PuzzleCheckData {
  completion?: any[];
  message?: string;
  error?: string;
  [key: string]: any;
}

interface PuzzleCheckInterface {
  data: PuzzleCheckData | null;
  totalScore: number;
  score: number;
  index: number;
  setLoading: (loading: boolean) => void;
  showStream: (data: string) => void;
  updateCheck: (data?: PuzzleCheckData) => void;
  onDataChange: (callback: (data: PuzzleCheckData | null) => void) => void;
  onLoadingChange: (callback: (loading: boolean) => void) => void;
  onStreamChange: (callback: (streamData: string) => void) => void;
  onScoreChange: (callback: (score: number, totalScore: number, index: number) => void) => void;
}

export function usePuzzleCheck(socketId: string | null) {
  const [data, setData] = useState<PuzzleCheckData | null>(null);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [streamData, setStreamData] = useState("");
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [index, setIndex] = useState(0);

  const socketRef = useRef<any>(null);
  const checkInterfaceRef = useRef<PuzzleCheckInterface | null>(null);
  const streamingRef = useRef(false);
  // Initialize PuzzleCheckInterface
  useEffect(() => {
    if (!checkInterfaceRef.current) {
      checkInterfaceRef.current = new PuzzleCheck();

      // Set up event listeners
      checkInterfaceRef.current.onDataChange(
        (newData: PuzzleCheckData | null) => {
          setData(newData);
        }
      );

      checkInterfaceRef.current.onLoadingChange((loading: boolean) => {
        setLoading(loading);
      });

      checkInterfaceRef.current.onStreamChange((streamData: string) => {
        setStreamData(streamData);
      });

      checkInterfaceRef.current.onScoreChange(
        (score: number, totalScore: number, index: number) => {
          setScore(score);
          setTotalScore(totalScore);
          setIndex(index);
        }
      );
    }
  }, []);

  // Setup socket connection
  useEffect(() => {
    if (!socketId || !checkInterfaceRef.current) return;

    const socket = io(window.location.origin);
    socketRef.current = socket;

    socket.on(`check-stream_${socketId}`, (data: { message: string }) => {
      if (streamingRef.current && checkInterfaceRef.current) {
        const currentData = checkInterfaceRef.current.data;
        const updatedData = {
          ...currentData,
          message: (currentData?.message || "") + data.message,
        };
        checkInterfaceRef.current.showStream(updatedData.message || "");
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [socketId]);

  // Listen for puzzle-check:generate event
  useEffect(() => {
    const handlePuzzleCheckGenerate = () => {
      getCheck();
    };

    document.addEventListener(
      "puzzle-check:generate",
      handlePuzzleCheckGenerate
    );

    return () => {
      document.removeEventListener(
        "puzzle-check:generate",
        handlePuzzleCheckGenerate
      );
    };
  }, []);

  const getCheck = useCallback(async (params?: {id:string,duration:number}) => {
    if (!checkInterfaceRef.current) return;

    const { id, duration } = params || {};
    if (!id || !duration) {
      console.error(!id ? "Video not available" : "Duration not provided");
      return;
    }

    checkInterfaceRef.current.setLoading(true);
    streamingRef.current = true;
    setStreaming(true);

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_APP_SERVER_URL
        }/api/puzzel-checks?videoId=${encodeURIComponent(
          id
        )}&endTime=${encodeURIComponent(duration)}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      streamingRef.current = false;
      setStreaming(false);
      const json = await response.json();
      const { data } = json;
      console.log("Puzzle check data:", data);

      if (checkInterfaceRef.current) {
        checkInterfaceRef.current.data = data;
        checkInterfaceRef.current.totalScore = data.completion?.length || 0;
        checkInterfaceRef.current.score = 0;
        checkInterfaceRef.current.index = 0;

        setTimeout(() => {
          checkInterfaceRef.current?.updateCheck();
        }, 100);
      }
      return data;
    } catch (error: any) {
      console.error(error);
      streamingRef.current = false;
      setStreaming(false);
      checkInterfaceRef.current?.updateCheck({ error: error.message });
      checkInterfaceRef.current?.setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    streaming,
    streamData,
    score,
    totalScore,
    index,
    getCheck,
    checkInterface: checkInterfaceRef.current,
  };
}
