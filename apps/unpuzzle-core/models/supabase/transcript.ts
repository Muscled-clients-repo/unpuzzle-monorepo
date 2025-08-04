import supabase from "./client";
import { Transcript } from "../../types/transcript.type";
import TranscriptSchema from "../validator/TranscriptsValidator";

class TranscriptModel extends TranscriptSchema{
  constructor(){
    super()
  }
  // Get all transcripts for a given video_id
  getTranscriptsByVideoId=async(video_id: string)=>{
    try{
      const { data, error } = await supabase
        .from("transcripts")
        .select("*")
        .eq("video_id", video_id)
        .order("start_time_sec", { ascending: true });
  
      if (error){
        throw new Error(error.message)
      };
      return data;
    }catch(error){
      throw error
    }
  }

  // Get a single transcript by its id
  getTranscriptById=async(id: string)=>{
    try{
      const { data, error } = await supabase
        .from("transcripts")
        .select("*")
        .eq("id", id)
        .single();
  
      if (error){
        throw new Error(error.message)
      };
      return data;
    }catch(error){
      throw error
    }
  }

  // Create a new transcript record with validation
  createTranscript=async(body: Transcript)=> {
    this.validate(body);

    const { data, error } = await supabase
      .from("transcripts")
      .insert([body])
      .select()
      .single();

    if (error){
      throw new Error(error.message)
    };
    return data;
  }

  // Bulk insert transcripts with validation on each record
  bulkInsertTranscripts=async(body: Array<Transcript>)=> {
    for (const record of body) {
      this.validate(record);
    }

    const { data, error } = await supabase
      .from("transcripts")
      .insert(body);

    if (error){
      throw new Error(error.message)
    };
    return data;
  }

  // Update an existing transcript with validation
  updateTranscript=async(id: string,body: Partial<Transcript>)=> {
    try{
      this.validate(body, 1);
      const { data, error } = await supabase
        .from("transcripts")
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

  // Delete a transcript by id
  deleteTranscript=async(id: string)=> {
    try{
      const { error } = await supabase.from("transcripts").delete().eq("id", id);
      if (error){
        throw new Error(error.message)
      };
      return { success: true, message: "Resource Deleted Successfully!" };
    }catch(error){
      throw error
    }
  }

  // filter transcripts by video_id and greater than start_time_sec and less than end_time_sec
  getVideoWithTranscripts=async(video_id: string,start_time_sec: number,end_time_sec: number)=> {
    try{
      // Fetch filtered transcripts
      const { data, error} = await supabase
        .from("transcripts")
        .select("*")
        .eq("video_id", video_id)
        .gte("start_time_sec", Math.floor(start_time_sec))
        .lte("end_time_sec", Math.ceil(end_time_sec));
    
        if (error){
          throw new Error(error.message)
        };
        return data;
    }catch(error){
      throw error
    }
  }
  
}

export default new TranscriptModel();
