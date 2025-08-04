import { 
  useGetInstructorsQuery as useGetInstructorsQueryBase,
  useGetInstructorAvailabilityQuery as useGetInstructorAvailabilityQueryBase,
  useBookMeetingMutation as useBookMeetingMutationBase,
  useGetMyMeetingsQuery as useGetMyMeetingsQueryBase,
  useStartMeetingSessionMutation as useStartMeetingSessionMutationBase,
  useEndMeetingSessionMutation as useEndMeetingSessionMutationBase,
  useCancelMeetingMutation as useCancelMeetingMutationBase
} from '../services/meeting.services';

// Wrapper hook for getInstructors - bypassing authentication
export const useGetInstructorsQuery = (options?: any) => {
  // Direct API call without authentication
  const result = useGetInstructorsQueryBase(undefined, {
    ...options,
    skip: options?.skip,
  });
  
  return result;
};

// Wrapper hook for getInstructorAvailability
export const useGetInstructorAvailabilityQuery = (instructorId: string, options?: any) => {
  return useGetInstructorAvailabilityQueryBase({ instructorId }, options);
};

// Wrapper hook for bookMeeting
export const useBookMeetingMutation = () => {
  const [bookMeeting, result] = useBookMeetingMutationBase();
  return [bookMeeting, result] as const;
};

// Wrapper hook for getMyMeetings
export const useGetMyMeetingsQuery = (options?: any) => {
  return useGetMyMeetingsQueryBase(undefined, options);
};

// Wrapper hook for startMeetingSession
export const useStartMeetingSessionMutation = () => {
  const [startSession, result] = useStartMeetingSessionMutationBase();
  return [startSession, result] as const;
};

// Wrapper hook for endMeetingSession
export const useEndMeetingSessionMutation = () => {
  const [endSession, result] = useEndMeetingSessionMutationBase();
  return [endSession, result] as const;
};

// Wrapper hook for cancelMeeting
export const useCancelMeetingMutation = () => {
  const [cancelMeeting, result] = useCancelMeetingMutationBase();
  return [cancelMeeting, result] as const;
};