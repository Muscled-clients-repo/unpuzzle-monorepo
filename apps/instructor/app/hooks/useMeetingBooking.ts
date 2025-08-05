import { useState, useCallback, useMemo } from "react";
import type {
  Instructor,
  Availability,
  Meeting,
  PaymentIntent,
  Session,
} from "../types/meeting.types";
import {
  useGetInstructorsQuery,
  useGetInstructorAvailabilityQuery,
  useBookMeetingMutation,
  useGetMyMeetingsQuery,
  useStartMeetingSessionMutation,
  useEndMeetingSessionMutation,
  useCancelMeetingMutation
} from '../redux/hooks';

interface MeetingBookingContextType {
  instructors: Instructor[];
  selectedInstructor: Instructor | null;
  setSelectedInstructor: (inst: Instructor | null) => void;
  loadInstructors: () => Promise<void>;
  availability: Availability[];
  loadInstructorAvailability: (instructorId: string) => Promise<void>;
  booking: Meeting | null;
  bookMeeting: (
    bookingData: any
  ) => Promise<{ success: boolean; message?: string }>;
  paymentIntent: PaymentIntent | null;
  meetings: Meeting[];
  loadMyMeetings: () => Promise<void>;
  startMeeting: (meetingId: string) => Promise<void>;
  endMeeting: (sessionId: string, meetingId: string) => Promise<void>;
  cancelMeeting: (meetingId: string) => Promise<void>;
  meetingStatus: string;
  priceEstimate: number;
  updatePriceEstimate: (hourlyRate: number, duration: number) => void;
}

export const useMeetingBooking = (): MeetingBookingContextType => {
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>('');
  const [booking, setBooking] = useState<Meeting | null>(null);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(null);
  const [meetingStatus, setMeetingStatus] = useState<string>("scheduled");
  const [priceEstimate, setPriceEstimate] = useState<number>(0);

  // API queries
  const { data: instructors = [], refetch: refetchInstructors } = useGetInstructorsQuery();
  const { data: availability = [], refetch: refetchAvailability } = useGetInstructorAvailabilityQuery(
    selectedInstructorId,
    { skip: !selectedInstructorId }
  );
  const { data: meetings = [], refetch: refetchMeetings } = useGetMyMeetingsQuery();

  // Mutations
  const [bookMeetingMutation] = useBookMeetingMutation();
  const [startMeetingMutation] = useStartMeetingSessionMutation();
  const [endMeetingMutation] = useEndMeetingSessionMutation();
  const [cancelMeetingMutation] = useCancelMeetingMutation();

  const loadInstructors = useCallback(async () => {
    await refetchInstructors();
  }, [refetchInstructors]);

  const loadInstructorAvailability = useCallback(async (instructorId: string) => {
    setSelectedInstructorId(instructorId);
    await refetchAvailability();
  }, [refetchAvailability]);

  const bookMeeting = useCallback(async (bookingData: any) => {
    try {
      const result = await bookMeetingMutation(bookingData).unwrap();
      setBooking(result.meeting);
      setPaymentIntent(result.payment_intent);
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to book meeting' };
    }
  }, [bookMeetingMutation]);

  const startMeeting = useCallback(async (meetingId: string) => {
    try {
      await startMeetingMutation(meetingId).unwrap();
      setMeetingStatus("in_progress");
    } catch (error) {
      console.error('Failed to start meeting:', error);
    }
  }, [startMeetingMutation]);

  const endMeeting = useCallback(async (sessionId: string, meetingId: string) => {
    try {
      await endMeetingMutation({ sessionId, meetingId }).unwrap();
      setMeetingStatus("completed");
    } catch (error) {
      console.error('Failed to end meeting:', error);
    }
  }, [endMeetingMutation]);

  const loadMyMeetings = useCallback(async () => {
    await refetchMeetings();
  }, [refetchMeetings]);

  const cancelMeeting = useCallback(async (meetingId: string) => {
    try {
      await cancelMeetingMutation(meetingId).unwrap();
      await loadMyMeetings();
    } catch (error) {
      console.error('Failed to cancel meeting:', error);
    }
  }, [cancelMeetingMutation, loadMyMeetings]);

  const updatePriceEstimate = useCallback((hourlyRate: number, duration: number) => {
    const price = (hourlyRate / 60) * duration;
    setPriceEstimate(price);
  }, []);

  return useMemo(() => ({
    instructors,
    selectedInstructor,
    setSelectedInstructor,
    loadInstructors,
    availability,
    loadInstructorAvailability,
    booking,
    bookMeeting,
    paymentIntent,
    meetings,
    loadMyMeetings,
    startMeeting,
    endMeeting,
    cancelMeeting,
    meetingStatus,
    priceEstimate,
    updatePriceEstimate,
  }), [
    instructors,
    selectedInstructor,
    availability,
    booking,
    paymentIntent,
    meetings,
    meetingStatus,
    priceEstimate,
    loadInstructors,
    loadInstructorAvailability,
    bookMeeting,
    loadMyMeetings,
    startMeeting,
    endMeeting,
    cancelMeeting,
    updatePriceEstimate
  ]);
};