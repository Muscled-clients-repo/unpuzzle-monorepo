import supabase from "./client";
import { ActivityLog } from "../../types/activityLogs.type";
import ActivityLogSchema from "../validator/activityLogs.validator";
import { BindMethods } from "../../protocols/utility/BindMethods";

class ActivityLogsModel extends ActivityLogSchema{
  // Fetch all activity logs
  getAllActivityLogs = async (page: number = 1,limit: number = 10) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    try{
      const { data, error, count } = await supabase
        .from("activity_logs")
        .select("*", { count: "exact" }) // Get data with total count
        .order("created_at", { ascending: false })
        .range(from, to);
  
      if (error) {
        throw new Error(error.message)
      }
      return data;
    }catch(error){
      throw error
    }
  };

  // Get activity log by ID
  getActivityLogById = async (id: string)=> {
    try{
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error){
        throw new Error(error.message)
      }
      return data;
    }catch(error){
      throw error
    }
  };

  // Create a new activity log
  createActivityLog = async (activityLog: ActivityLog)=> {
    try{
      this.validate(activityLog);
      
      const { data, error } = await supabase
        .from("activity_logs")
        .insert([activityLog])
        .select()
        .single();
      if (error) {
        throw new Error(error.message)
      }
      return data
    }catch(error){
      throw error
    }
  };

  // Update an activity log
  updateActivityLog = async (id: string,body: Partial<ActivityLog>) => {
    this.validate(body, 1);

    const { data, error } = await supabase
      .from("activity_logs")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error){
      throw new Error(error.message)
    }
    return data
  };

  // Delete an activity log
  deleteActivityLog = async (id: string) => {
    try{
      const { error } = await supabase
        .from("activity_logs")
        .delete()
        .eq("id", id);
      if (error){
        throw new Error(error.message)
      }
      return { success: true, message: "Activity Log Deleted Successfully!" };
    }catch(error){
      throw error
    }
  };

  getLatestActivityLogs = async (userId: string, videoId: string) => {

    try{
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .eq("user_id", userId)
        .eq("video_id", videoId)
        .order("created_at", { ascending: false }) // newest first
        .limit(20);
  
      if (error) {
        throw new Error(error.message)
      }
      return data;
    }catch(error){
      throw error
    }
  };
}

const binding = new BindMethods(new ActivityLogsModel());
export default binding.bindMethods();
