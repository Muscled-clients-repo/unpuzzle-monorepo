import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import type { Socket } from "socket.io-client";

const useSocket = (
  url = "http://localhost:3001",
  options = { transports: ["websocket"], upgrade: false }
) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      console.log(`Connecting to socket at ${url}...`);
      socketRef.current = io(url, options);

      socketRef.current.on("connect", () => {
        console.log("Socket connected:", socketRef.current.id);
      });

      socketRef.current.on("connect_error", (error: any) => {
        console.error("Socket connection error:", error);
      });

      socketRef.current.on("disconnect", (reason: any) => {
        console.warn("Socket disconnected:", reason);
      });
    }
  }, [url, options]);

  const connectSocket = () => {
    if (socketRef.current && !socketRef.current?.connected) {
      console.log("Attempting to manually connect socket...");
      socketRef.current.connect();
    } else {
      console.warn("Socket is not initialized. Cannot connect manually.");
    }
  };

  const disconnectSocket = () => {
    if (socketRef.current && socketRef.current?.connected) {
      console.log("Attempting to manually connect socket...");
      socketRef.current.disconnect();
    } else {
      console.warn("Socket is not initialized. Cannot connect manually.");
    }
  };

  const emitEvent = async (event: string, ...args: any[]) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, ...args);
    } else {
      console.warn("Cannot emit event; socket is not connected.");
    }
  };

  const onEvent = (event: string, callback: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    } else {
      console.error(
        "Socket is not initialized. Cannot listen to event:",
        event
      );
    }
  };

  const offEvent = (event: string) => {
    if (socketRef.current) {
      socketRef.current.off(event);
    } else {
      console.error(
        "Socket is not initialized. Cannot remove listener for event:",
        event
      );
    }
  };

  const isConnected = () => {
    return socketRef.current?.connected ?? false; // Return connection status
  };

  return {
    emitEvent,
    onEvent,
    offEvent,
    connectSocket,
    disconnectSocket,
    isConnected,
  };
};

export default useSocket;