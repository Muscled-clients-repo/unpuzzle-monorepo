import { useCallback, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import {
  setPuzzleChecksLoading,
  setCurrentCheckData,
  setCheckStreamData,
  setCheckScore,
  setPuzzleChecksError,
} from "../redux/features/puzzleAgents/puzzleAgentsSlice";
import { RootState } from "../redux/store";
import { apiClient } from "../utils/apiClient";

interface PuzzleCheckData {
  completion?: any[];
  message?: string;
  error?: string;
  [key: string]: any;
}

export function usePuzzleCheck(socketId: string | null) {
  const dispatch = useDispatch();
  const {
    currentData: data,
    loading,
    streamData,
    score,
    totalScore,
    index,
  } = useSelector((state: RootState) => state.puzzleAgents.checks);

  const socketRef = useRef<any>(null);
  const streamingRef = useRef(false);

  // Setup socket connection
  useEffect(() => {
    if (!socketId) return;

    const socket = io(window.location.origin);
    socketRef.current = socket;

    socket.on(`check-stream_${socketId}`, (socketData: { message: string }) => {
      if (streamingRef.current) {
        const currentMessage = (data?.message || "") + socketData.message;
        dispatch(setCheckStreamData(currentMessage));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [socketId]);

  // Listen for puzzle-check:generate event
  useEffect(() => {
    const handlePuzzleCheckGenerate = () => {
      // getCheck needs parameters, so this event handler should be updated
      console.log("puzzle-check:generate event received");
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

  const getCheck = useCallback(
    async ({ id, duration }: { id: string; duration: number }) => {
      if (!id) {
        console.error("Video not available");
        return;
      }

      dispatch(setPuzzleChecksLoading(true));
      streamingRef.current = true;

      try {
        // const response = await fetch(
        //   `${
        //     process.env.NEXT_PUBLIC_APP_SERVER_URL
        //   }/api/puzzel-checks?videoId=${encodeURIComponent(
        //     id
        //   )}&endTime=${encodeURIComponent(duration)}`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //       "Content-Type": "application/json",
        //     },
        //   }
        // );
        // streamingRef.current = false;
        // const json = await response.json();
        // const { data } = json;
        const url = `${
          process.env.NEXT_PUBLIC_APP_SERVER_URL
        }/api/puzzel-checks?videoId=${encodeURIComponent(
          id
        )}&endTime=${encodeURIComponent(duration)}`;

        const data = await apiClient({
          url,
          method: "GET",
          isJson: true,
        });

        dispatch(setCurrentCheckData(data));
        dispatch(
          setCheckScore({
            score: 0,
            totalScore: data.completion?.length || 0,
            index: 0,
          })
        );
        dispatch(setPuzzleChecksLoading(false));
        return data;
      } catch (error: any) {
        console.error(error);
        streamingRef.current = false;
        dispatch(setCurrentCheckData({ error: error.message }));
        dispatch(setPuzzleChecksError(error.message));
        dispatch(setPuzzleChecksLoading(false));
      }
    },
    [dispatch]
  );

  return {
    data,
    loading,
    streaming: streamingRef.current,
    streamData,
    score,
    totalScore,
    index,
    getCheck,
  };
}
