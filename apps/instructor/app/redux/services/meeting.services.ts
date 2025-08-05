import { createApi } from '@reduxjs/toolkit/query/react';
import { createApiClientBaseQuery } from './baseQuery';
import type {
  Instructor,
  Availability,
  Meeting,
  PaymentIntent,
  Session,
} from '../../types/meeting.types';

// Use centralized API client with automatic token handling
const baseQuery = createApiClientBaseQuery();

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface BookMeetingResponse {
  meeting: Meeting;
  payment_intent: PaymentIntent;
}

export const meetingApi = createApi({
  reducerPath: 'meetingApi',
  baseQuery: baseQuery,
  tagTypes: ['Instructors', 'Availability', 'Meetings'],
  endpoints: (build) => ({
    getInstructors: build.query<Instructor[], void>({
      query: () => ({
        url: '/api/users?role=instructor',
      }),
      providesTags: ['Instructors'],
      transformResponse: (response: ApiResponse<Instructor[]>) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch instructors');
      },
    }),
    
    getInstructorAvailability: build.query<Availability[], { instructorId: string }>({
      query: ({ instructorId }) => ({
        url: `/api/meetings/instructor/${instructorId}/availability`,
      }),
      providesTags: ['Availability'],
      transformResponse: (response: ApiResponse<Availability[]>) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch availability');
      },
    }),
    
    bookMeeting: build.mutation<BookMeetingResponse, any>({
      query: (bookingData) => ({
        url: '/api/meetings',
        method: 'POST',
        body: bookingData,
      }),
      invalidatesTags: ['Meetings'],
      transformResponse: (response: ApiResponse<BookMeetingResponse>) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to book meeting');
      },
    }),
    
    getMyMeetings: build.query<Meeting[], void>({
      query: () => ({
        url: '/api/meetings/my/meetings',
      }),
      providesTags: ['Meetings'],
      transformResponse: (response: ApiResponse<Meeting[]>) => {
        if (response.success) {
          return response.data;
        }
        throw new Error(response.message || 'Failed to fetch meetings');
      },
    }),
    
    startMeetingSession: build.mutation<void, string>({
      query: (meetingId) => ({
        url: `/api/meetings/${meetingId}/session/start`,
        method: 'POST',
      }),
      invalidatesTags: ['Meetings'],
    }),
    
    endMeetingSession: build.mutation<void, { sessionId: string; meetingId: string }>({
      query: ({ sessionId, meetingId }) => ({
        url: `/api/meetings/session/${sessionId}/end`,
        method: 'PATCH',
        body: { meeting_id: meetingId },
      }),
      invalidatesTags: ['Meetings'],
    }),
    
    cancelMeeting: build.mutation<void, string>({
      query: (meetingId) => ({
        url: `/api/meetings/${meetingId}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Meetings'],
    }),
  }),
});

export const {
  useGetInstructorsQuery,
  useGetInstructorAvailabilityQuery,
  useBookMeetingMutation,
  useGetMyMeetingsQuery,
  useStartMeetingSessionMutation,
  useEndMeetingSessionMutation,
  useCancelMeetingMutation,
} = meetingApi;