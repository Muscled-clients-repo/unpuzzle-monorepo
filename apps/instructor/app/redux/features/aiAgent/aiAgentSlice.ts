import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AIAgentState {
  pausedAt: string;
  agentType: string | null;
}

const initialState: AIAgentState = {
  pausedAt: '',
  agentType: null,
};

const aiAgentSlice = createSlice({
  name: 'aiAgent',
  initialState,
  reducers: {
    setPausedAt: (state, action: PayloadAction<string>) => {
      state.pausedAt = action.payload;
    },
    setAgentType: (state, action: PayloadAction<string | null>) => {
      state.agentType = action.payload;
    },
    activateAgent: (state, action: PayloadAction<"hint" | "reflect" | "path" | "check">) => {
      state.agentType = action.payload;
    },
    resetAgent: (state) => {
      state.pausedAt = '';
      state.agentType = null;
    },
  },
});

export const { setPausedAt, setAgentType, activateAgent, resetAgent } = aiAgentSlice.actions;

// Selectors
export const selectPausedAt = (state: any) => state.aiAgent.pausedAt;
export const selectAgentType = (state: any) => state.aiAgent.agentType;

export default aiAgentSlice.reducer;