import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPuzzleReflectsLoading,
  setCurrentReflectData,
  setReflectScore,
  resetPuzzleReflect,
  setPuzzleReflectsError,
} from "../redux/features/puzzleAgents/puzzleAgentsSlice";
import { RootState } from "../redux/store";
import { apiClient } from "../utils/apiClient";

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
  const dispatch = useDispatch();
  const {
    currentData: data,
    loading,
    score,
    totalScore,
  } = useSelector((state: RootState) => state.puzzleAgents.reflects);
  // Token is now handled automatically by apiClient

  // Listen for puzzle-reflect:generate event
  useEffect(() => {
    const handlePuzzleReflectGenerate = async (e: Event) => {
      const customEvent = e as CustomEvent<ReflectEventDetail>;
      console.log(customEvent.detail);

      if (customEvent.detail.type === "audio" && customEvent.detail.blob) {
        await createAudioReflect(
          customEvent.detail.blob,
          customEvent.detail.videoId || "",
          customEvent.detail.currentTime || 0
        );
        dispatch(resetPuzzleReflect());
      } else if (
        customEvent.detail.type === "file" &&
        customEvent.detail.file
      ) {
        // createFileReflect(customEvent.detail.file);
        console.log("File reflect not implemented yet");
      } else if (
        customEvent.detail.type === "loom-link" &&
        customEvent.detail.loomLink
      ) {
        // createLoomLinkReflect(customEvent.detail.loomLink);
        console.log("Loom link reflect not implemented yet");
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

  const createAudioReflect = useCallback(
    async (blob: Blob, id: string, currentTime: number) => {
      console.log("createAudioReflect", blob.type);

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
        const data = await apiClient({
          url: "/api/puzzel-reflects/audio",
          method: "POST",
          body: formData,
          isJson: false,
        });

        console.log(data);
        return data;
      } catch (error: any) {
        console.error("Error creating audio reflect:", error);
        throw error;
      }
    },
    []
  );

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
      const data = await apiClient({
        url: "/api/puzzel-reflects/video",
        method: "POST",
        body: formData,
        isJson: false,
      });
      return data;
    } catch (error: any) {
      console.error("Error creating video reflect:", error);
      throw error;
    }
  }, []);

  // 3. Loom link reflect
  const createLoomLinkReflect = useCallback(
    async (loom_link: string, id: string) => {
      if (!id || !loom_link) {
        console.error("Video ID or Loom link not provided");
        return;
      }
      const data = { loom_link: loom_link, video_id: id };
      console.log("input Data: ", data);
      try {
        const data = await apiClient({
          url: "/api/puzzel-reflects/loom-link",
          method: "POST",
          body: { loom_link: loom_link, video_id: id },
          isJson: true,
        });
        return data;
      } catch (error: any) {
        console.error("Error creating loom link reflect:", error);
        throw error;
      }
    },
    []
  );

  // 4. File reflect (multiple screenshots)
  const createFileReflect = useCallback(async (files: File[], id: string) => {
    console.log("files: ", files);
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
      const data = await apiClient({
        url: "/api/puzzel-reflects/file-uploads",
        method: "POST",
        body: formData,
        isJson: false,
      });
      console.log("data is :", data);
      return data;
    } catch (error: any) {
      console.error("Error creating file reflect:", error);
      throw error;
    }
  }, []);

  const getReflect = useCallback(async () => {
    console.log("getReflect");
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
    dispatch(setPuzzleReflectsLoading(true));

    try {
      const data = await apiClient({
        url: `/api/puzzel-reflects?video_id=${encodeURIComponent(
          video.id
        )}&endTime=${encodeURIComponent(duration)}`,
        method: "GET",
      });
      console.log("data : ", data);
      dispatch(setCurrentReflectData(data));
      dispatch(
        setReflectScore({
          score: 0,
          totalScore: data.completion?.length || 0,
        })
      );
      dispatch(setPuzzleReflectsLoading(false));
    } catch (error: any) {
      console.error(error);
      dispatch(setCurrentReflectData({ error: error.message }));
      dispatch(setPuzzleReflectsError(error.message));
      dispatch(setPuzzleReflectsLoading(false));
    }
  }, [dispatch]);

  // New: Get all puzzle reflects
  const getAllPuzzleReflects = useCallback(
    async () => {
      try {
        const data = await apiClient({
          url: "/api/puzzel-reflects",
          method: "GET",
        });

        return data;
      } catch (error: any) {
        console.error("Error fetching all puzzle reflects:", error);
        throw error;
      }
    },
    []
  );

  // New: Get puzzle reflect by ID
  const getPuzzleReflectById = useCallback(
    async (id: string) => {
      try {
        const data = await apiClient({
          url: `/api/puzzel-reflects/${id}`,
          method: "GET",
        });

        return data;
      } catch (error: any) {
        console.error("Error fetching puzzle reflect by id:", error);
        throw error;
      }
    },
    []
  );

  return {
    data,
    loading,
    score,
    totalScore,
    getReflect,
    createAudioReflect,
    createVideoReflect,
    createLoomLinkReflect,
    createFileReflect,
    getAllPuzzleReflects,
    getPuzzleReflectById,
  };
}
