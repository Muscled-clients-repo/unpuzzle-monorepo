import { useContext } from "react";
import type {
  Instructor,
  Availability,
  Meeting,
  PaymentIntent,
  Session,
} from "../types/meeting.types";
import { MeetingBookingContext } from "../context/MeetingBookingContext";

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
  const ctx = useContext(MeetingBookingContext);
  if (!ctx)
    throw new Error(
      "useMeetingBooking must be used within MeetingBookingProvider"
    );
  return ctx;
};
