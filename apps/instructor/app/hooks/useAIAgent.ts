import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { 
  selectPausedAt, 
  selectAgentType,
  activateAgent as activateAgentAction
} from '../redux/features/aiAgent/aiAgentSlice';
import { useHandleVideoPaused } from '../redux/hooks';

// Custom hook for using AI Agent functionality
export const useAIAgent = () => {
  const dispatch = useDispatch();
  const pausedAt = useSelector(selectPausedAt);
  const agentType = useSelector(selectAgentType);
  const handleVideoPaused = useHandleVideoPaused();
  
  const activateAgent = useCallback((type: "hint" | "reflect" | "path" | "check") => {
    dispatch(activateAgentAction(type));
  }, [dispatch]);
  
  return {
    pausedAt,
    agentType,
    handleVideoPaused,
    activateAgent
  };
};