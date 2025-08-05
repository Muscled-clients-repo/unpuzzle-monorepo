import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import {
  setPuzzleHintsLoading,
  setCurrentHintData,
  setHintStreamData,
  setPuzzleHintsError,
} from "../redux/features/puzzleAgents/puzzleAgentsSlice";
import { RootState } from "../redux/store";
import { apiClient } from "../utils/apiClient";

interface PuzzleHintData {
  message?: string;
  error?: string;
  [key: string]: any;
}

export function usePuzzleHint(socketId: string | null) {
  const dispatch = useDispatch();
  const {
    currentData: data,
    loading,
    streamData,
  } = useSelector((state: RootState) => state.puzzleAgents.hints);

  const socketRef = useRef<any>(null);
  const streamingRef = useRef(false);
  const dataRef = useRef("");

  // Setup socket connection
  useEffect(() => {
    if (!socketId) return;

    const socket = io(window.location.origin);
    socketRef.current = socket;

    socket.on(`hint-stream_${socketId}`, (data: { message: string }) => {
      if (streamingRef.current) {
        dataRef.current += data.message;
        dispatch(setHintStreamData(dataRef.current));
        dispatch(setPuzzleHintsLoading(false));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [socketId]);

  // Listen for puzzle-hint:generate event
  // useEffect(() => {
  //   const handlePuzzleHintGenerate = () => {
  //     dataRef.current = "";
  //     // getHint();
  //   };

  //   document.addEventListener("puzzle-hint:generate", handlePuzzleHintGenerate);

  //   return () => {
  //     document.removeEventListener(
  //       "puzzle-hint:generate",
  //       handlePuzzleHintGenerate
  //     );
  //   };
  // }, [getHint]);

  const getHint = useCallback(
    async ({ id, duration }: { id: string; duration: number }) => {
      if (!id) {
        console.error("Video not available");
        return;
      }

      dispatch(setPuzzleHintsLoading(true));
      streamingRef.current = true;

      try {
        const data = await apiClient({
          url: `${
            process.env.NEXT_PUBLIC_APP_SERVER_URL
          }/api/puzzle-hint?videoId=${encodeURIComponent(
            id
          )}&endTime=${encodeURIComponent(duration)}`,
          method: "GET",
        });
        streamingRef.current = false;
        // console.log("response is: ", response);
        // const { data } = await response.json();
        console.log("data: ", data);
        dispatch(setCurrentHintData(data));
        dispatch(setPuzzleHintsLoading(false));
        console.log("data: ", data);
        return data;
      } catch (error: any) {
        console.error("error: ", error);
        streamingRef.current = false;
        dispatch(setCurrentHintData({ error: error.message }));
        dispatch(setPuzzleHintsError(error.message));
        dispatch(setPuzzleHintsLoading(false));
      }
    },
    [dispatch]
  );

  return {
    data,
    loading,
    streaming: streamingRef.current,
    streamData,
    getHint,
  };
}
