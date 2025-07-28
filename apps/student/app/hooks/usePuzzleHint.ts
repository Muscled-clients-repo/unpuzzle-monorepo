import { useCallback, useEffect, useRef, useState } from "react";
import { PuzzleHint } from "../context/PuzzleHint";
import { useAuth } from "@clerk/nextjs";

interface PuzzleHintData {
  message?: string;
  error?: string;
  [key: string]: any;
}

export function usePuzzleHint(socketId: string | null) {
  const [data, setData] = useState<PuzzleHintData | null>(null);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [streamData, setStreamData] = useState("");

  const socketRef = useRef<any>(null);
  const hintInterfaceRef = useRef<PuzzleHint | null>(null);
  const streamingRef = useRef(false);
  const dataRef = useRef("");
  const { getToken } = useAuth();

  // Initialize PuzzleHint
  useEffect(() => {
    if (!hintInterfaceRef.current) {
      hintInterfaceRef.current = new PuzzleHint();

      // Set up event listeners
      hintInterfaceRef.current.onDataChange(
        (newData: PuzzleHintData | null) => {
          setData(newData);
        }
      );

      hintInterfaceRef.current.onLoadingChange((loading: boolean) => {
        setLoading(loading);
      });

      hintInterfaceRef.current.onStreamChange((streamData: string) => {
        setStreamData(streamData);
      });
    }
  }, []);

  // Setup socket connection
  useEffect(() => {
    if (!socketId || !hintInterfaceRef.current) return;

    const socket = io(window.location.origin);
    socketRef.current = socket;

    socket.on(`hint-stream_${socketId}`, (data: { message: string }) => {
      if (streamingRef.current && hintInterfaceRef.current) {
        dataRef.current += data.message;
        hintInterfaceRef.current.showStream(dataRef.current);
        hintInterfaceRef.current.setLoading(false);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [socketId]);

  // Listen for puzzle-hint:generate event
  useEffect(() => {
    const handlePuzzleHintGenerate = () => {
      dataRef.current = "";
      // getHint();
    };

    document.addEventListener("puzzle-hint:generate", handlePuzzleHintGenerate);

    return () => {
      document.removeEventListener(
        "puzzle-hint:generate",
        handlePuzzleHintGenerate
      );
    };
  }, []);

  const getHint = useCallback(async ({id,duration}:{id:string,duration:number}) => {
    if (!hintInterfaceRef.current) return;
    const token = await getToken();
    
    if (!id || !token) {
      console.error(id ? "token Not Provided" : "Video not available");
      return;
    }

    hintInterfaceRef.current.setLoading(true);
    streamingRef.current = true;
    setStreaming(true);

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_APP_SERVER_URL
        }/api/puzzle-hint?videoId=${encodeURIComponent(
          id
        )}&endTime=${encodeURIComponent(duration)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      streamingRef.current = false;
      setStreaming(false);
      
      const  {data}  = await response.json();
      
      // const {data}=response
      setTimeout(() => {
        hintInterfaceRef.current?.updateHint(data);
      }, 100);
      
      return data;
    } catch (error: any) {
      console.error("error: ",error);
      streamingRef.current = false;
      setStreaming(false);
      hintInterfaceRef.current?.updateHint({ error: error.message });
      hintInterfaceRef.current?.setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    streaming,
    streamData,
    getHint,
    hintInterface: hintInterfaceRef.current,
  };
}
