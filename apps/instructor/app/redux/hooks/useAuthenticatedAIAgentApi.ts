import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { 
  useGetAgentRecommendationMutation as useGetAgentRecommendationMutationBase 
} from '../services/aiAgent.services';
import { setPausedAt, setAgentType } from '../features/aiAgent/aiAgentSlice';

// Wrapper hook for AI Agent API - bypassing authentication
export const useGetAgentRecommendationMutation = () => {
  const dispatch = useDispatch();
  const [getRecommendation, result] = useGetAgentRecommendationMutationBase();
  
  const getRecommendationWithAuth = useCallback(async (videoId: string) => {
    // Direct API call without authentication
    const response = await getRecommendation({ 
      videoId
    });
    
    // Handle the response and update state
    if ('data' in response && response.data) {
      const data = response.data;
      // Update the agent type based on recommendation
      if (data.puzzleHint) {
        dispatch(setAgentType('hint'));
      } else if (data.puzzleReflect) {
        dispatch(setAgentType('reflect'));
      } else if (data.puzzlePath) {
        dispatch(setAgentType('path'));
      } else if (data.puzzleChecks) {
        dispatch(setAgentType('check'));
      }
    }
    
    return response;
  }, [getRecommendation, dispatch]);
  
  return [getRecommendationWithAuth, result] as const;
};

// Hook for handling video pause with AI agent recommendation
export const useHandleVideoPaused = () => {
  const dispatch = useDispatch();
  const [getRecommendation] = useGetAgentRecommendationMutation();
  
  const handleVideoPaused = useCallback(async (formattedTime: string, videoId: string) => {
    dispatch(setPausedAt(formattedTime));
    
    try {
      await getRecommendation(videoId);
    } catch (error) {
      console.error('Failed to get agent recommendation:', error);
    }
  }, [dispatch, getRecommendation]);
  
  return handleVideoPaused;
};