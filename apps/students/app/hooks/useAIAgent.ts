import React, {  useContext } from "react";
import { AIAgentContext } from "../context/AIAgentContext";
// Custom hook for using the context
export const useAIAgent = () => {
    const context = useContext(AIAgentContext);
    if (!context) throw new Error("useAIAgent must be used within AIAgentProvider");
    return context;
  };