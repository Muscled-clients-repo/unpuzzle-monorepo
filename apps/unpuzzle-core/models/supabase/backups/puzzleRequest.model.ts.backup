import supabase from "./client";
import { PuzzleRequest } from "../../types/puzzleRequest.type";
import PuzzleRequestSchema from "../validator/puzzleRequest.validator";

class PuzzleRequestModel extends PuzzleRequestSchema{
  constructor(){
    super()
  }
  getAllPuzzleRequests= async(page = 1,limit = 10)=> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    try{
      const { data, error, count } = await supabase
        .from("puzzlerequests")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);
  
      if (error) {
        throw new Error(error.message)
      };
      return data;
    }catch(error){
      throw error
    }
  }

  getPuzzleRequestById=async(id: string)=> {
    try{
      const { data, error } = await supabase
        .from("puzzlerequests")
        .select("*")
        .eq("id", id)
        .maybeSingle();
  
      if (error) {
        throw new Error(error.message)
      };
      return data;
    }catch(error){
      throw error
    }
  }

  getPuzzleRequestsByUser=async(user_id: string)=> {
    try{
      const { data, error } = await supabase
        .from("puzzlerequests")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", { ascending: false });
  
      if (error) {
        throw new Error(error.message)
      };
      return data;
    }catch(error){
      throw error
    }
  }

  getPuzzleRequestsByVideo=async(video_id: string)=> {

    try{
      const { data, error } = await supabase
        .from("puzzlerequests")
        .select("*")
        .eq("video_id", video_id)
        .order("created_at", { ascending: false });
  
      if (error){
        throw new Error(error.message)
      };
      return data;
    }catch(error){
      throw error
    }
  }

  createPuzzleRequest=async(body: PuzzleRequest)=> {
    try{
      this.validate(body);
      const { data, error } = await supabase
        .from("puzzlerequests")
        .insert([body])
        .select()
        .single();
  
      if (error){
        throw new Error(error.message)
      };
      return data;
    }catch(error){
      throw error
    }
  }

  updatePuzzleRequest=async(id: string,body: Partial<PuzzleRequest>)=> {
    try{
      this.validate(body, 1);
      const { data, error } = await supabase
        .from("puzzlerequests")
        .update(body)
        .eq("id", id)
        .select()
        .single();
  
      if (error){
        throw new Error(error.message)
      };
      return data;
    }catch(error){
      throw error
    }
  }

  deletePuzzleRequest=async(id: string)=> {
    try{
      const { error } = await supabase
        .from("puzzlerequests")
        .delete()
        .eq("id", id);
      if (error){
        throw new Error(error.message)
      }
      return { success: true, message: "Resource Deleted Successfully!" };
    }catch(error){
      throw error
    }
  }
}

export default new PuzzleRequestModel();
