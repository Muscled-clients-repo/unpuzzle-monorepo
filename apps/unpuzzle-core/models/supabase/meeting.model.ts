import supabase from "./client";
import { Meeting, MeetingSession, InstructorAvailability, MeetingWithParticipants } from "../../types/meeting.type";
import MeetingValidators from "../validator/meeting.validator";

class MeetingModel extends MeetingValidators.MeetingSchema {
  constructor() {
    super();
  }

  // Get all meetings (paginated)
  getAllMeetings = async (page = 1, limit = 10) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    try {
      const { data, error, count } = await supabase
        .from("meetings")
        .select(`
          *,
          student:users!meetings_student_id_fkey(id, first_name, last_name, email, image_url),
          instructor:users!meetings_instructor_id_fkey(id, first_name, last_name, email, image_url, hourly_rate, bio, expertise)
        `)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        throw new Error(error.message);
      }
      return { data: data || [], total: count || 0 };
    } catch (error) {
      throw error;
    }
  };

  // Get meeting by ID with participants
  getMeetingById = async (id: string): Promise<MeetingWithParticipants | null> => {
    try {
      const { data, error } = await supabase
        .from("meetings")
        .select(`
          *,
          student:users!meetings_student_id_fkey(id, first_name, last_name, email, image_url),
          instructor:users!meetings_instructor_id_fkey(id, first_name, last_name, email, image_url, hourly_rate, bio, expertise),
          sessions:meeting_sessions(*)
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Get meetings by student
  getMeetingsByStudent = async (studentId: string, page = 1, limit = 10) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    try {
      const { data, error, count } = await supabase
        .from("meetings")
        .select(`
          *,
          instructor:users!meetings_instructor_id_fkey(id, first_name, last_name, email, image_url, hourly_rate, bio, expertise)
        `)
        .eq("student_id", studentId)
        .order("start_time", { ascending: false })
        .range(from, to);

      if (error) {
        throw new Error(error.message);
      }
      return { data: data || [], total: count || 0 };
    } catch (error) {
      throw error;
    }
  };

  // Get meetings by instructor
  getMeetingsByInstructor = async (instructorId: string, page = 1, limit = 10) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    try {
      const { data, error, count } = await supabase
        .from("meetings")
        .select(`
          *,
          student:users!meetings_student_id_fkey(id, first_name, last_name, email, image_url)
        `)
        .eq("instructor_id", instructorId)
        .order("start_time", { ascending: false })
        .range(from, to);

      if (error) {
        throw new Error(error.message);
      }
      return { data: data || [], total: count || 0 };
    } catch (error) {
      throw error;
    }
  };

  // Create new meeting
  createMeeting = async (meeting: Meeting): Promise<Meeting> => {
    try {
      this.validate(meeting);
      const { data, error } = await supabase
        .from("meetings")
        .insert([meeting])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Update meeting
  updateMeeting = async (id: string, updates: Partial<Meeting>): Promise<Meeting> => {
    try {
      this.validate(updates, 1);
      const { data, error } = await supabase
        .from("meetings")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Delete meeting
  deleteMeeting = async (id: string) => {
    try {
      const { error } = await supabase.from("meetings").delete().eq("id", id);
      if (error) {
        throw new Error(error.message);
      }
      return { success: true, message: "Meeting deleted successfully!" };
    } catch (error) {
      throw error;
    }
  };

  // Get instructor availability
  getInstructorAvailability = async (instructorId: string) => {
    try {
      const { data, error } = await supabase
        .from("instructor_availability")
        .select("*")
        .eq("instructor_id", instructorId)
        .eq("is_available", true)
        .order("day_of_week", { ascending: true });

      if (error) {
        throw new Error(error.message);
      }
      return data || [];
    } catch (error) {
      throw error;
    }
  };

  // Set instructor availability
  setInstructorAvailability = async (availability: InstructorAvailability) => {
    try {
      const { data, error } = await supabase
        .from("instructor_availability")
        .upsert([availability], { onConflict: "instructor_id,day_of_week" })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Create meeting session
  createMeetingSession = async (session: MeetingSession) => {
    try {
      const { data, error } = await supabase
        .from("meeting_sessions")
        .insert([session])
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Update meeting session
  updateMeetingSession = async (id: string, updates: Partial<MeetingSession>) => {
    try {
      const { data, error } = await supabase
        .from("meeting_sessions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Get meeting sessions
  getMeetingSessions = async (meetingId: string) => {
    try {
      const { data, error } = await supabase
        .from("meeting_sessions")
        .select("*")
        .eq("meeting_id", meetingId)
        .order("session_start", { ascending: true });

      if (error) {
        throw new Error(error.message);
      }
      return data || [];
    } catch (error) {
      throw error;
    }
  };
}

export default new MeetingModel(); 