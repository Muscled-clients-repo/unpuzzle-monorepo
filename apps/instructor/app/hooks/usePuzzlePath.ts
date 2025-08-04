import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPuzzlePathsLoading,
  setCurrentPathData,
  setPuzzlePathsError,
} from "../redux/features/puzzleAgents/puzzleAgentsSlice";
import { RootState } from "../redux/store";
import { apiClient } from "../utils/apiClient";

interface PuzzlePathData {
  error?: string;
  [key: string]: any;
}

interface VideoData {
  id: string;
  puzzlePaths?: any[];
  error?: string;
  [key: string]: any;
}

export function usePuzzlePath() {
  const dispatch = useDispatch();
  const { currentData: data, loading } = useSelector(
    (state: RootState) => state.puzzleAgents.paths
  );

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

  const getPath = useCallback(
    async ({ video, duration }: { video: any; duration: number }) => {
      console.log("getPath run !");

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

      console.log("video: ", video);
      if (!video?.id) {
        console.error("Video not available");
        return;
      }

      dispatch(setPuzzlePathsLoading(true));

      try {
        const url = `${
          process.env.NEXT_PUBLIC_APP_SERVER_URL
        }/api/puzzel-path?videoId=${encodeURIComponent(
          video.id
        )}&endTime=${encodeURIComponent(duration)}`;

        const data = await apiClient({
          url,
          method: "GET",
        });

        const newData = { ...video, puzzlePaths: data };
        dispatch(setCurrentPathData(newData));
        dispatch(setPuzzlePathsLoading(false));
        // if (response.ok) {
        //   const { data } = await response.json();
        //   console.log("data: ",data);
        // } else {
        //   throw new Error("Failed to fetch puzzle path data");
        // }
      } catch (error: any) {
        console.error(error);
        dispatch(setCurrentPathData({ id: "", error: error?.message }));
        dispatch(setPuzzlePathsError(error.message));
        dispatch(setPuzzlePathsLoading(false));
      }
    },
    [dispatch]
  );

  return {
    data,
    loading,
    getPath,
  };
}
