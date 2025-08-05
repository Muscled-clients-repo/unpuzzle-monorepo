import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";

interface VideoData {
  yt_video_id: string;
  start_time: number;
  end_time: number;
  id: string;
}

interface PlayerState {
  PLAYING: number;
  PAUSED: number;
  ENDED: number;
  BUFFERING: number;
  CUED: number;
}

interface YoutubePlayerContextType {
  // State
  player: any;
  videoId: string;
  startTime: number;
  endTime: number;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  isLoaded: boolean;
  isMuted: boolean;
  volume: number;
  playbackRate: number;
  loading: boolean;
  error: string | null;

  // Methods
  initializePlayer: (elementId: string, videoData: VideoData) => Promise<void>;
  play: () => void;
  pause: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (volume: number) => void;
  mute: () => void;
  unMute: () => void;
  changeVideo: (
    videoId: string,
    options: { startTime?: number; endTime?: number }
  ) => void;
  requestFullscreen: (callback?: (success: boolean) => void) => void;
  exitFullscreen: (callback?: (success: boolean) => void) => void;
  setPlaybackRate: (rate: number) => void;
  setCCEnabled: (enabled: boolean) => void;
  setCCLanguage: (langCode: string) => void;
  getFormattedTime: (time: number) => string;
  getCurrentTime: () => number | null;
  getDuration: () => number | null;
  getVolume: () => number;
  getPlaybackRate: () => number;
  checkIsMuted: () => boolean;
  getAvailableCCLanguages: () => any[];
  getCurrentCCLanguage: () => string | null;
  updateProgressBar: (percent: number) => void;
  resetPlayer: () => void;
}

const YoutubePlayerContext = createContext<
  YoutubePlayerContextType | undefined
>(undefined);

export const YoutubePlayerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [player, setPlayer] = useState<any>(null);
  const [videoId, setVideoId] = useState<string>("");
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(100);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef<number>(0);
  const maxRetriesRef = useRef<number>(3);
  const isDraggingRef = useRef<boolean>(false);
  const elementIdRef = useRef<string>("");

  // YouTube API state
  const YTRef = useRef<any>(window.YT || { loading: 0, loaded: 0 });
  const YTConfigRef = useRef<any>(
    window.YTConfig || { host: "https://www.youtube.com" }
  );

  const createTrustedScriptURL = useCallback((url: string): string => {
    try {
      const ttPolicy = (window as any).trustedTypes?.createPolicy(
        "youtube-widget-api",
        {
          createScriptURL: (x: string) => x,
        }
      );
      return ttPolicy?.createScriptURL(url) || url;
    } catch (e) {
      console.error("Error in createTrustedScriptURL", e);
      return url;
    }
  }, []);

  const loadYouTubeScript = useCallback(() => {
    const scriptUrl =
      "https://www.youtube.com/s/player/b2858d36/www-widgetapi.vflset/www-widgetapi.js";
    const trustedUrl = createTrustedScriptURL(scriptUrl);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "www-widgetapi-script";
    script.src = trustedUrl;
    script.async = true;

    const currentScript = document.currentScript;
    if (currentScript) {
      const nonce = currentScript.nonce || currentScript.getAttribute("nonce");
      if (nonce) script.setAttribute("nonce", nonce);
    }

    const firstScript = document.getElementsByTagName("script")[0];
    firstScript.parentNode?.insertBefore(script, firstScript);
  }, [createTrustedScriptURL]);

  const initializeYouTubeAPI = useCallback(() => {
    if (YTRef.current.loading === 0) {
      YTRef.current.loading = 1;
      (window as any).yt_embedsEnableIframeApiSendFullEmbedUrl = true;
      (window as any).yt_embedsEnableAutoplayAndVisibilitySignals = true;

      // Set up YouTube API ready callback
      (window as any).onYTReady = () => {
        YTRef.current.loaded = 1;
        document.dispatchEvent(new CustomEvent("YTReady"));
      };

      // Expose YT and YTConfig on window
      (window as any).YT = YTRef.current;
      (window as any).YTConfig = YTConfigRef.current;

      loadYouTubeScript();
      (window as any).onYTReady();
    }
  }, [loadYouTubeScript]);

  // Move all utility hooks above any hook that uses them
  // 1. getFormattedTime
  const getFormattedTime = useCallback((time: number): string => {
    if (time === null || isNaN(time) || time <= 0) return "00:00";

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    return `${hours > 0 ? `${hours.toString().padStart(2, "0")}:` : ""}${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  // 2. getCurrentTime
  const getCurrentTime = useCallback((): number | null => {
    if (player && typeof player.getCurrentTime === "function") {
      return player.getCurrentTime();
    }
    return null;
  }, [player]);

  // 3. getDuration
  const getDuration = useCallback((): number | null => {
    if (player && typeof player.getDuration === "function") {
      if (endTime > 0 && endTime - startTime > 0) {
        return endTime - startTime;
      }
      return player.getDuration() - startTime;
    }
    return null;
  }, [player, endTime, startTime]);

  const onPlayerReady = useCallback(() => {
    if (!player) return;

    let duration = getDuration();
    if (duration <= 0) {
      duration = 0;
    }
    if (endTime <= 0 || endTime < startTime) {
      setEndTime(duration);
    }

    // Update duration display
    const totalDurationElements = document.querySelectorAll(".total-duration");
    totalDurationElements.forEach((element) => {
      (element as HTMLElement).innerHTML = getFormattedTime(duration);
    });

    // Handle resume from localStorage
    const getCurrentDuration =
      window.localStorage.getItem(`duration_${videoId}`) || "0";
    if (
      parseInt(getCurrentDuration) > startTime &&
      parseInt(getCurrentDuration) < endTime - 20
    ) {
      seekTo(parseInt(getCurrentDuration));
    } else {
      seekTo(startTime);
    }

    // Remove loading class
    const element = document.getElementById(elementIdRef.current);
    if (element) {
      element.classList.remove("loading");
    }

    setIsLoaded(true);
  }, [
    player,
    duration,
    endTime,
    startTime,
    videoId,
    getDuration,
    getFormattedTime,
    seekTo,
  ]);

  const onPlayerStateChange = useCallback(
    (event: any) => {
      const YT = (window as any).YT;
      if (!YT) return;

      switch (event.data) {
        case YT.PlayerState.PLAYING:
          document.dispatchEvent(new CustomEvent("video:playing"));
          setIsPlaying(true);

          if (playbackIntervalRef.current) {
            clearInterval(playbackIntervalRef.current);
          }
          playbackIntervalRef.current = setInterval(() => {
            onVideoPlayback();
          }, 300);
          break;

        case YT.PlayerState.PAUSED:
          setIsPlaying(false);
          if (playbackIntervalRef.current) {
            clearInterval(playbackIntervalRef.current);
            playbackIntervalRef.current = null;
          }

          const currentTime = getCurrentTime();
          const event = new CustomEvent("video:paused", {
            detail: {
              currentTime: currentTime,
              formattedTime: getFormattedTime(currentTime || 0),
            },
          });
          document.dispatchEvent(event);
          break;

        case YT.PlayerState.ENDED:
          document.dispatchEvent(new CustomEvent("video:ended"));
          setIsPlaying(false);
          if (playbackIntervalRef.current) {
            clearInterval(playbackIntervalRef.current);
            playbackIntervalRef.current = null;
          }
          break;

        case YT.PlayerState.BUFFERING:
          break;

        case YT.PlayerState.CUED:
          setIsPlaying(false);
          setIsLoaded(false);
          if (playbackIntervalRef.current) {
            clearInterval(playbackIntervalRef.current);
          }
          break;
      }
    },
    [getCurrentTime, getFormattedTime]
  );

  const onPlayerError = useCallback(
    (event: any) => {
      console.log("YouTube Player Error:", event);
      if (retryCountRef.current < maxRetriesRef.current) {
        retryCountRef.current++;
        console.log(
          `Retrying initialization (${retryCountRef.current}/${maxRetriesRef.current})...`
        );
        setTimeout(() => {
          initializePlayer(elementIdRef.current, {
            yt_video_id: videoId,
            start_time: startTime,
            end_time: endTime,
            id: videoId,
          });
        }, 1000 * retryCountRef.current);
      } else {
        console.error(
          "Failed to initialize YouTube player after multiple attempts"
        );
        setError("Failed to load video. Please refresh the page.");
        const elem = document.getElementById(elementIdRef.current);
        if (elem) {
          elem.innerHTML =
            '<div class="error-message">Failed to load video. Please refresh the page.</div>';
        }
      }
    },
    [videoId, startTime, endTime]
  );

  const onVideoPlayback = useCallback(() => {
    const storageTime = parseInt(
      window.localStorage.getItem(`duration_${videoId}`) || "0"
    );
    const currentTime = getCurrentTime();
    const actualCurrentTime =
      currentTime && currentTime > storageTime
        ? currentTime
        : !isLoaded
        ? storageTime
        : currentTime || 0;

    window.localStorage.setItem(
      `duration_${videoId}`,
      actualCurrentTime.toString()
    );
    setCurrentTime(actualCurrentTime);

    if (endTime > 0 && actualCurrentTime >= endTime) {
      player?.stopVideo();
      window.localStorage.setItem(`duration_${videoId}`, "0");
      document.dispatchEvent(new CustomEvent("video:ended"));
    }

    // Update progress bar
    const totalTime = endTime - startTime;
    if (totalTime > 0) {
      const percent = (actualCurrentTime - startTime) / totalTime;
      updateProgressBar(percent);
    } else {
      updateProgressBar(0);
    }

    // Update playback time display
    const videoPlaybackTimeElements = document.querySelectorAll(
      ".video-playback-time"
    );
    videoPlaybackTimeElements.forEach((element) => {
      (element as HTMLElement).innerHTML = getFormattedTime(
        actualCurrentTime - startTime
      );
    });
  }, [
    videoId,
    endTime,
    isLoaded,
    getCurrentTime,
    getFormattedTime,
    startTime,
    player,
    updateProgressBar,
  ]);

  const initializePlayer = useCallback(
    async (elementId: string, videoData: VideoData) => {
      setLoading(true);
      setError(null);
      retryCountRef.current = 0;
      elementIdRef.current = elementId;

      setVideoId(videoData.yt_video_id);
      setStartTime(videoData.start_time || 0);
      setEndTime(videoData.end_time || 0);

      // Initialize YouTube API if not already done
      if (!YTRef.current.loaded) {
        initializeYouTubeAPI();
      }

      // Wait for YouTube API to be ready
      if (!YTRef.current.loaded) {
        document.addEventListener(
          "YTReady",
          () => {
            createPlayer();
          },
          { once: true }
        );
      } else {
        createPlayer();
      }
    },
    [initializeYouTubeAPI]
  );

  const createPlayer = useCallback(() => {
    const isCCEnabled = localStorage.getItem("ccEnabled") === "true" ? 1 : 0;

    const newPlayer = new YTRef.current.Player(elementIdRef.current, {
      height: "360",
      width: "640",
      videoId: videoId,
      playerVars: {
        controls: 0,
        rel: 0,
        cc_load_policy: isCCEnabled,
        cc_lang_pref: "",
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: onPlayerError,
      },
    });

    setPlayer(newPlayer);
    setLoading(false);
  }, [videoId, onPlayerReady, onPlayerStateChange, onPlayerError]);

  const play = useCallback(() => {
    if (player && typeof player.playVideo === "function") {
      player.playVideo();
    }
  }, [player]);

  const pause = useCallback(() => {
    if (player && typeof player.pauseVideo === "function") {
      player.pauseVideo();
    }
  }, [player]);

  const seekTo = useCallback(
    (seconds: number) => {
      if (player && typeof player.seekTo === "function") {
        player.seekTo(seconds, true);
        const videoPlaybackTimeElements = document.querySelectorAll(
          ".video-playback-time"
        );
        videoPlaybackTimeElements.forEach((element) => {
          (element as HTMLElement).innerHTML = getFormattedTime(
            seconds - startTime
          );
        });
      }
    },
    [player, startTime, getFormattedTime]
  );

  const setPlayerVolume = useCallback(
    (volume: number) => {
      if (player && typeof player.setVolume === "function") {
        const clampedVolume = Math.max(0, Math.min(100, volume));
        player.setVolume(clampedVolume);
        setVolume(clampedVolume);
      }
    },
    [player]
  );

  const mute = useCallback(() => {
    if (player && typeof player.mute === "function") {
      player.mute();
      setIsMuted(true);
    }
  }, [player]);

  const unMute = useCallback(() => {
    if (player && typeof player.unMute === "function") {
      player.unMute();
      setIsMuted(false);
    }
  }, [player]);

  const changeVideo = useCallback(
    (
      newVideoId: string,
      options: { startTime?: number; endTime?: number } = {}
    ) => {
      if (player && typeof player.cueVideoById === "function") {
        setVideoId(newVideoId);
        setStartTime(options.startTime || 0);
        setEndTime(options.endTime || 0);
        player.cueVideoById(newVideoId);

        setTimeout(() => {
          onPlayerReady();
          play();
        }, 1000);
      }
    },
    [player, onPlayerReady, play]
  );

  const requestFullscreen = useCallback(
    (callback?: (success: boolean) => void) => {
      const playerContainer = document.getElementById(elementIdRef.current);
      if (playerContainer) {
        playerContainer
          .requestFullscreen()
          .then(() => {
            callback?.(true);
          })
          .catch((err: any) => {
            console.error("Fullscreen request failed:", err);
            callback?.(false);
          });
      }
    },
    []
  );

  const exitFullscreen = useCallback(
    (callback?: (success: boolean) => void) => {
      document
        .exitFullscreen()
        .then(() => {
          callback?.(true);
        })
        .catch((err: any) => {
          console.error("Exit fullscreen failed:", err);
          callback?.(false);
        });
    },
    []
  );

  const setPlayerPlaybackRate = useCallback(
    (rate: number) => {
      if (player && typeof player.setPlaybackRate === "function") {
        const clampedRate = Math.max(0.25, Math.min(2, rate));
        player.setPlaybackRate(clampedRate);
        setPlaybackRate(clampedRate);
      }
    },
    [player]
  );

  const setCCEnabled = useCallback(
    (enabled: boolean) => {
      if (player && typeof player.loadModule === "function") {
        if (enabled) {
          player.loadModule("captions");
        } else {
          player.unloadModule("captions");
        }
      }
    },
    [player]
  );

  const setCCLanguage = useCallback(
    (langCode: string) => {
      if (player && typeof player.setOption === "function") {
        player.setOption("captions", "track", { languageCode: langCode });
      }
    },
    [player]
  );

  const getVolume = useCallback((): number => {
    if (player && typeof player.getVolume === "function") {
      return player.getVolume();
    }
    return 0;
  }, [player]);

  const getPlaybackRate = useCallback((): number => {
    if (player && typeof player.getPlaybackRate === "function") {
      return player.getPlaybackRate();
    }
    return 1;
  }, [player]);

  const checkIsMuted = useCallback((): boolean => {
    if (player && typeof player.isMuted === "function") {
      return player.isMuted();
    }
    return false;
  }, [player]);

  const getAvailableCCLanguages = useCallback((): any[] => {
    if (player && typeof player.getOption === "function") {
      return player.getOption("captions", "tracklist") || [];
    }
    return [];
  }, [player]);

  const getCurrentCCLanguage = useCallback((): string | null => {
    if (player && typeof player.getOption === "function") {
      const track = player.getOption("captions", "track");
      return track ? track.languageCode : null;
    }
    return null;
  }, [player]);

  const updateProgressBar = useCallback((percent: number) => {
    const progressBar = document.getElementById("progressBar");
    const progressHandle = document.getElementById("progressHandle");
    if (progressBar && progressHandle) {
      progressBar.style.width = `${percent * 100}%`;
      progressHandle.style.left = `${percent * 100}%`;
    }
  }, []);

  const resetPlayer = useCallback(() => {
    if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current);
      playbackIntervalRef.current = null;
    }
    setPlayer(null);
    setVideoId("");
    setStartTime(0);
    setEndTime(0);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setIsLoaded(false);
    setIsMuted(false);
    setVolume(100);
    setPlaybackRate(1);
    setLoading(false);
    setError(null);
    retryCountRef.current = 0;
    isDraggingRef.current = false;
  }, []);

  return (
    <YoutubePlayerContext.Provider
      value={{
        // State
        player,
        videoId,
        startTime,
        endTime,
        currentTime,
        duration,
        isPlaying,
        isLoaded,
        isMuted,
        volume,
        playbackRate,
        loading,
        error,

        // Methods
        initializePlayer,
        play,
        pause,
        seekTo,
        setVolume: setPlayerVolume,
        mute,
        unMute,
        changeVideo,
        requestFullscreen,
        exitFullscreen,
        setPlaybackRate: setPlayerPlaybackRate,
        setCCEnabled,
        setCCLanguage,
        getFormattedTime,
        getCurrentTime,
        getDuration,
        getVolume,
        getPlaybackRate,
        checkIsMuted,
        getAvailableCCLanguages,
        getCurrentCCLanguage,
        updateProgressBar,
        resetPlayer,
      }}
    >
      {children}
    </YoutubePlayerContext.Provider>
  );
};

export const useYoutubePlayerContext = (): YoutubePlayerContextType => {
  const context = useContext(YoutubePlayerContext);
  if (!context) {
    throw new Error(
      "useYoutubePlayerContext must be used within YoutubePlayerProvider"
    );
  }
  return context;
};
