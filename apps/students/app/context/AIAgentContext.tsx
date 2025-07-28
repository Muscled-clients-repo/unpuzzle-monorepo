import React, { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
// Define the shape of your context

interface AIAgentContextType {
  pausedAt: string;
  agentType: string | null;
  handleVideoPaused: (formattedTime: string, videoId: string) => Promise<void>;
  activateAgent: (type: "hint" | "reflect" | "path" | "check") => void;
  // ...add more as needed
}

const AIAgentContext = createContext<AIAgentContextType | undefined>(undefined);

const AIAgentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pausedAt, setPausedAt] = useState<string>("");
  const [agentType, setAgentType] = useState<string | null>(null);
  const { getToken } = useAuth();

  // Example: handle video paused event
  const handleVideoPaused = useCallback(
    async (formattedTime: string, videoId: string) => {
      setPausedAt(formattedTime);

      const token = await getToken(); // Fetch recommendation from API
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_SERVER_URL}/api/recommend-agent/solution`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include", // ✅ This is the correct way to include credentials
          body: JSON.stringify({ videoId }),
        }
      );
      
      const data = await response.json();

      // Decide which agent to activate
      if (data.puzzleHint) {
        setAgentType("hint");
      } else if (data.puzzleReflect) {
        setAgentType("reflect");
      } else if (data.puzzlePath) {
        setAgentType("path");
      } else if (data.puzzleChecks) {
        setAgentType("check");
      }
      // ...handle user logs in localStorage if needed
    },
    []
  );

  // Example: activate agent manually
  const activateAgent = useCallback(
    (type: "hint" | "reflect" | "path" | "check") => {
      setAgentType(type);
      // ...additional logic as needed
    },
    []
  );

  return (
    <AIAgentContext.Provider
      value={{ pausedAt, agentType, handleVideoPaused, activateAgent }}
    >
      {children}
    </AIAgentContext.Provider>
  );
};
export { AIAgentContext, AIAgentProvider };
