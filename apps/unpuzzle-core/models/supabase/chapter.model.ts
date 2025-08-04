import supabase from "./client";
import { Chapter } from "../../types/chapter.type";
import ChapterSchema from "../validator/chapter.validator";

class ChapterModel extends ChapterSchema {
  // Get all chapters with pagination and videos count
  getAllChapters=async(page = 1,limit = 10)=>{
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    try{
      const { data, error, count } = await supabase
        .from("chapters")
        .select(`
          *,
          videos(count)
        `, { count: "exact" })
        .order("order_index", { ascending: true })
        .range(from, to);
  
      if (error) {
        throw new Error(error.message)
      };
      
      // Transform data to include videos_count
      const transformedData = data?.map((chapter: any) => ({
        ...chapter,
        videos_count: chapter.videos?.[0]?.count || 0,
        videos: undefined // Remove the videos array as we only need the count
      }));
      
      const countWithDefault = count || 0;
      return { 
        data: transformedData, 
        count: countWithDefault, 
        total_page: Math.ceil(countWithDefault / limit) 
      };
    }catch(error){
      throw error
    }
  }

  // Get chapter by ID
  getChapterById=async(id: string)=> {

    try{
      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("id", id)
        .maybeSingle();
  
      if (error){
        throw new Error(error.message)
      };
      return data ;
    }catch(error){
      throw error
    }
  }

  // Get chapters by course ID with videos count
  getChaptersByCourse=async(id: string)=>{
    try{
      const { data, error } = await supabase
        .from("chapters")
        .select(`
          *,
          videos(count)
        `)
        .eq("course_id", id)
        .order("order_index", { ascending: true });
  
      if (error) {
        throw new Error(error.message)
      };
      
      // Transform data to include videos_count
      const transformedData = data?.map((chapter: any) => ({
        ...chapter,
        videos_count: chapter.videos?.[0]?.count || 0,
        videos: undefined // Remove the videos array as we only need the count
      }));
      
      return transformedData;
    }catch(error){
      throw error
    }
  }

  // Create a new chapter
  createChapter=async(body: Chapter)=> {
    try{
      this.validate(body);
      const { data, error } = await supabase
        .from("chapters")
        .insert([body])
        .select()
        .single();
  
      if (error){
        throw new Error(error.message)
      }
      return data;
    }catch(error){
      throw error
    }
  }

  // Update chapter
  updateChapter=async(id: string, body: Partial<Chapter>)=>{
    try{
      this.validate(body, 1);
      const { data, error } = await supabase
        .from("chapters")
        .update(body)
        .eq("id", id)
        .select()
        .single();
  
      if (error) {
        throw new Error(error.message)
      };
      return data;
    }catch(error){
      throw error
    }
  }

  // Delete chapter
  deleteChapter=async(id: string)=>{
    try{
      const { error } = await supabase.from("chapters").delete().eq("id", id);
      if (error){
        throw new Error(error.message)
      };
      return { success: true, message: "Resource Deleetd Successfully!" };
    }catch(error){
      throw error
    }
  }
}

export default new ChapterModel();
