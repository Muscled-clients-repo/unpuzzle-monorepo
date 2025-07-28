import { useEffect, useRef } from "react";
// @ts-ignore
import { io, Socket } from "socket.io-client";

const useSocket = (
  url = "http://localhost:3001",
  options = { transports: ["websocket"], upgrade: false }
) => {
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (!socketRef.current) {
      
      socketRef.current = io(url, options);

      socketRef.current.on("connect", () => {
        
      });

      socketRef.current.on("connect_error", (error: Error) => {
        console.error("Socket connection error:", error);
      });

      socketRef.current.on("disconnect", (reason: string) => {
        console.warn("Socket disconnected:", reason);
      });
    }
  }, [url, options]);

  const connectSocket = () => {
    if (socketRef.current && !socketRef.current?.connected) {
      
      socketRef.current.connect();
    } else {
      console.warn("Socket is not initialized. Cannot connect manually.");
    }
  };

  const disconnectSocket = () => {
    if (socketRef.current && socketRef.current?.connected) {
      
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
