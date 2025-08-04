import supabase from "./client";
import { Enrollment } from "../../types/enrollment.type";
import EnrollmentSchema from "../validator/enrollment.validator";

class EnrollmentModel extends EnrollmentSchema{
  constructor(){
    super();
  }
  getAllEnrollments=async(page = 1,limit = 10)=> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    try{
      const { data, error, count } = await supabase
        .from("enrollments")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

        if (error) {
          throw new Error(error.message)
        }
        return data ;
    }catch(error){
      throw error
    }
  }

  getEnrollmentById=async(id: string)=> {
    try{
      const { data, error } = await supabase
        .from("enrollments")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        throw new Error(error.message)
      }
      return data;
    }catch(error){
      throw error
    }
  }

  getEnrollmentsByUser=async(user_id: string)=> {
    try{
      const { data, error } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message)
      }
      return data;
    }catch(error){
      throw error
    }
  }

  getEnrollmentsByCourse=async(course_id: string)=> {
    try{
      const { data, error } = await supabase
        .from("enrollments")
        .select("*")
        .eq("course_id", course_id)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message)
      }
      return data;
    }catch(error){
      throw error
    }
  }

  createEnrollment=async(body: Enrollment)=> {
    try{
      this.validate(body,1);

      const { data, error } = await supabase
        .from("enrollments")
        .insert([body])
        .select()
        .single();

      if (error) {
        throw new Error(error.message)
      }
      return data;
    }catch(error){
      throw error
    }
  }

  updateEnrollment=async(id: string,body: Partial<Enrollment>)=> {
    try{
      this.validate(body,1);

      const { data, error } = await supabase
        .from("enrollments")
        .update(body)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message)
      }
      return data;
    }catch(error){
      throw error
    }
  }

  deleteEnrollment=async(id: string)=> {
    try{
      const { error } = await supabase.from("enrollments").delete().eq("id", id);
      if (error) {
        throw new Error(error.message)
      }
      return { success: true, message: "Resource Deleted Successfully!" };
    }catch(error){
      throw error
    }
  }
}

export default new EnrollmentModel();
