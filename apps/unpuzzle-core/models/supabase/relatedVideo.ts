import supabase from "./client";
import { Video } from "../../types/video.type";

class RelatedVideoModel {
  // Get related videos for a specific video ID
  getRelatedVideos=async(videoId: string)=>{
    try{
      const { data, error } = await supabase
        .from("related_videos")
        .select(
          `
          related_video_id,
          videos:related_video_id (
            id, title, description, thumbnails, created_at
          )
        `
        )
        .eq("video_id", videoId);
  
      if (error){
        throw new Error(error.message)
      };
  
      // Ensure you're extracting a flat array of related videos
      const relatedVideos: Video[] = (data || [])
        .map((entry: any) => entry.videos)
        .filter(Boolean);
      return relatedVideos;
    }catch(error){
      throw error
    }
  }

  // Create a related video relation
  addRelatedVideo=async(videoId: string,relatedVideoId: string)=> {
    try{
      const { data, error } = await supabase
        .from("related_videos")
        .insert([{ video_id: videoId, related_video_id: relatedVideoId }]);
  
      if (error){
        throw new Error(error.message)
      };
      return data
    }catch(error){
      throw error
    }
  }

  // Remove a related video relation
  removeRelatedVideo=async(videoId: string,relatedVideoId: string)=>{

    try{
      const { error } = await supabase
        .from("related_videos")
        .delete()
        .match({ video_id: videoId, related_video_id: relatedVideoId });
  
      if (error){
        throw new Error(error.message)
      };

      return { success: true, message: "Resource Deleted Successfully!" };
    }catch(error){
      throw error
    }
  }

  // Optional: Get all related entries for debugging (raw)
  getRawRelatedEntries=async()=> {
    try{
      const { data, error } = await supabase.from("related_videos").select("*");
      if (error){
        throw new Error(error.message)
      };
      return data;
    }catch(error){
      throw error
    }
  }
}

export default new RelatedVideoModel();
