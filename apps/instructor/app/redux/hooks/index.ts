// Export authenticated course API hooks
export { 
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useDeleteCourseMutation,
  useUpdateCourseMutation,
  useGetChaptersByCourseIdQuery,
  useGetVideosByChapterIdQuery
} from './useAuthenticatedCourseApi';

// Export AI Agent hooks
export {
  useGetAgentRecommendationMutation,
  useHandleVideoPaused
} from './useAuthenticatedAIAgentApi';

// Export Meeting hooks
export {
  useGetInstructorsQuery,
  useGetInstructorAvailabilityQuery,
  useBookMeetingMutation,
  useGetMyMeetingsQuery,
  useStartMeetingSessionMutation,
  useEndMeetingSessionMutation,
  useCancelMeetingMutation
} from './useAuthenticatedMeetingApi';

// Export Stripe hooks
export {
  useStripePayment
} from './useStripePayment';

// Export Activity Logs hooks
export {
  useGetActivityLogsQuery
} from '../services/activityLogs.services';

// Export Puzzle Agents hooks
export {
  useGetPuzzleHintsByVideoIdQuery,
  useGetPuzzleChecksByVideoIdQuery,
  useGetPuzzleReflectsByVideoIdQuery,
  useGetPuzzlePathsByVideoIdQuery,
  useCreatePuzzleHintMutation,
  useCreatePuzzleCheckMutation,
  useCreatePuzzleReflectMutation,
  useCreatePuzzlePathMutation
} from './useAuthenticatedPuzzleAgentsApi';

// Export Redux action creators
export { 
  setPausedAt, 
  setAgentType, 
  activateAgent, 
  resetAgent 
} from '../features/aiAgent/aiAgentSlice';

export {
  setLoading as setStripeLoading,
  setError as setStripeError,
  setPaymentSuccess,
  setPaymentIntent,
  resetPayment
} from '../features/stripe/stripeSlice';

export {
  setSelectedVideoId,
  clearAllPuzzleAgents,
  setPuzzleHintsLoading,
  setPuzzleHintsData,
  setPuzzleHintsError,
  setPuzzleChecksLoading,
  setPuzzleChecksData,
  setPuzzleChecksError,
  setPuzzleReflectsLoading,
  setPuzzleReflectsData,
  setPuzzleReflectsError,
  setPuzzlePathsLoading,
  setPuzzlePathsData,
  setPuzzlePathsError,
} from '../features/puzzleAgents/puzzleAgentsSlice';

// Export User slice actions and selectors
export {
  loginStart,
  loginSuccess,
  loginFailure,
  logout
} from '../features/user/userSlice';

// User selectors
export const selectUser = (state: any) => state.user.user;
export const selectIsAuthenticated = (state: any) => state.user.isAuthenticated;
export const selectUserRole = (state: any) => state.user.user?.role || 'guest';

// Export Course slice actions and selectors
export {
  setCurrentCourse,
  setSelectedChapter,
  setSelectedVideo,
  setSelectedChapterAndVideo,
  clearCourseState,
  setCourseLoading,
  setCourseError,
  selectCurrentCourse,
  selectSelectedChapter,
  selectSelectedVideo,
  selectSelectedChapterId,
  selectSelectedVideoId,
  selectCourseLoading,
  selectCourseError,
  selectYouTubeEmbedUrl,
} from '../features/course/courseSlice';

// Export VideoTime slice actions and selectors
export {
  setCurrentTime,
  setDuration,
  setDisplayTime,
  setIsPlaying,
  setIsLoading,
  play,
  pause,
  togglePlayPause,
  setVolume,
  setIsMuted,
  toggleMute,
  setPlaybackRate,
  registerVideoElement,
  unregisterVideoElement,
  setActiveVideo,
  seekTo,
  setError,
  clearError,
  resetVideoTime,
  resetAllVideoState,
  setUpdateThrottle,
  batchUpdateVideoState,
  selectVideoTimeState,
  selectCurrentTime,
  selectDuration,
  selectDisplayTime,
  selectIsPlaying,
  selectIsLoading,
  selectIsPaused,
  selectVolume,
  selectIsMuted,
  selectPlaybackRate,
  selectActiveVideoId,
  selectVideoElements,
  selectVideoError,
  selectActiveVideoElement,
  selectFormattedCurrentTime,
  selectFormattedDuration,
  selectVideoProgress,
} from '../features/videoTime/videoTimeSlice';