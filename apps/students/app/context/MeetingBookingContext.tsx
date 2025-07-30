import React, { createContext, useState, useCallback, ReactNode } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import type {
  Instructor,
  Availability,
  Meeting,
  PaymentIntent,
  Session,
} from "../types/meeting.types";

const stripePromise = loadStripe(
  "pk_test_51RebMZ2fB4WJ1ELeiZQXVTkzG3TZFKJpzmvD2QHc5rAwM16TSUcBMe1NDoENz1d1aeKmthsIWfGOKLUsAd8wvW4R00JRu8RYP4"
);

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

const MeetingBookingContext = createContext<
  MeetingBookingContextType | undefined
>(undefined);

const MeetingBookingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedInstructor, setSelectedInstructor] =
    useState<Instructor | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [booking, setBooking] = useState<Meeting | null>(null);
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntent | null>(
    null
  );
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [meetingStatus, setMeetingStatus] = useState<string>("scheduled");
  const [priceEstimate, setPriceEstimate] = useState<number>(0);
  // hooks
  const loadInstructors = useCallback(async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_SERVER_URL}/api/users?role=instructor`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const data = await res.json();
    
    if (data.success) setInstructors(data.data as Instructor[]);
  }, []);

  const loadInstructorAvailability = useCallback(
    async (instructorId: string) => {
      const res = await fetch(
        `/api/meetings/instructor/${instructorId}/availability`
      );
      const data = await res.json();
      
      if (data.success) setAvailability(data.data as Availability[]);
    },
    []
  );

  const bookMeeting = useCallback(async (bookingData: any) => {
    const res = await fetch("/api/meetings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });
    const data = await res.json();
    
    if (data.success) {
      setBooking(data.data.meeting as Meeting);
      setPaymentIntent(data.data.payment_intent as PaymentIntent);
      return { success: true };
    }
    return { success: false, message: data.message };
  }, []);

  const startMeeting = useCallback(async (meetingId: string) => {
    const res = await fetch(`/api/meetings/${meetingId}/session/start`, {
      method: "POST",
    });
    const data = await res.json();
    if (data.success) {
      setMeetingStatus("in_progress");
    }
  }, []);

  const endMeeting = useCallback(
    async (sessionId: string, meetingId: string) => {
      const res = await fetch(`/api/meetings/session/${sessionId}/end`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meeting_id: meetingId }),
      });
      const data = await res.json();
      if (data.success) {
        setMeetingStatus("completed");
      }
    },
    []
  );

  const loadMyMeetings = useCallback(async () => {
    const res = await fetch("/api/meetings/my/meetings");
    const data = await res.json();
    if (data.success) setMeetings(data.data as Meeting[]);
  }, []);

  const cancelMeeting = useCallback(
    async (meetingId: string) => {
      const res = await fetch(`/api/meetings/${meetingId}/cancel`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success) loadMyMeetings();
    },
    [loadMyMeetings]
  );

  const updatePriceEstimate = useCallback(
    (hourlyRate: number, duration: number) => {
      const price = (hourlyRate / 60) * duration;
      setPriceEstimate(price);
    },
    []
  );

  return (
    <MeetingBookingContext.Provider
      value={{
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
      }}
    >
      <Elements stripe={stripePromise}>{children}</Elements>
    </MeetingBookingContext.Provider>
  );
};

export { MeetingBookingContext, MeetingBookingProvider };
