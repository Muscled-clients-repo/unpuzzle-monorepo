import supabase from "./client";
import { Video } from "../../types/video.type";
import VideoSchema from "../validator/VideoValidator";

class VideoModel extends VideoSchema{
  constructor(){
    super()
  }
  
  // Get all videos with pagination and related counts
  getAllVideos = async (chapter_id: string, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    try {
      // First get the videos
      const { data: videos, error: videosError, count } = await supabase
        .from("videos")
        .select("*", { count: 'exact' })
        .eq("chapter_id", chapter_id)
        .range(offset, offset + limit - 1)
        .order("created_at", { ascending: true });

      if (videosError) {
        throw new Error(videosError.message);
      }

      // Then get counts for each video
      const videosWithCounts = await Promise.all(
        (videos || []).map(async (video) => {
          // Get counts for each related table
          const [puzzlereflectsCount, puzzlepathsCount, puzzlehintsCount, puzzlechecksCount] = await Promise.all([
            supabase.from("puzzlereflects").select("id", { count: 'exact', head: true }).eq("video_id", video.id),
            supabase.from("puzzlepaths").select("id", { count: 'exact', head: true }).eq("video_id", video.id),
            supabase.from("puzzlehints").select("id", { count: 'exact', head: true }).eq("video_id", video.id),
            supabase.from("puzzlechecks").select("id", { count: 'exact', head: true }).eq("video_id", video.id)
          ]);

          return {
            ...video,
            puzzlereflects_count: puzzlereflectsCount.count || 0,
            puzzlepaths_count: puzzlepathsCount.count || 0,
            puzzlehints_count: puzzlehintsCount.count || 0,
            puzzlechecks_count: puzzlechecksCount.count || 0
          };
        })
      );

      const countWithDefault = count || 0
      return {data: videosWithCounts, count:countWithDefault, total_page: Math.ceil(countWithDefault/limit)};
    } catch (error) {
      throw error;
    }
  }
  
  // Get video by ID
  getVideoById = async (id: string, includeTranscripts = false) => {
    try{
      const { data, error } = await supabase
        .from("videos")
        .select(`*${includeTranscripts?",transcripts(*)":""}`)
        .eq("id", id)
        .maybeSingle();
      if (error){
        throw new Error(error.message)
      };
      return data;

    }catch(error){
      throw error
    }
  };
  
  // Get video by URL
  getVideoByURL = async (videoURL: string,includeTranscripts = false) => {
    try{
      const { data, error } = await supabase
        .from("videos")
        .select(`*${includeTranscripts?",transcripts(*)":""}`)
        .eq("video_url", videoURL)
        .maybeSingle();
      if (error){
        throw new Error(error.message)
      };
      return data;

    }catch(error){
      throw error
    }
  };

  // Create a new video
  createVideo = async (body: Video) => {
    try{
      this.validate(body);
      const { data, error } = await supabase
        .from("videos")
        .insert([body])
        .select()
        .single();
  
      if (error) {
        throw new Error(error.message);
      }
      return data;
    }catch(error){
      throw error
    }
  };

  updateVideo = async (id: string, body: Partial<Video>) => {
    try{
      this.validate(body,1);
      const { data, error } = await supabase
        .from("videos")
        .update(body)
        .eq("id", id)
        .select()
        .single();
  
      if (error) {
        throw new Error(error.message);
      }
      return data;
    }catch(error){
      throw error
    }
  };

  // Delete a video
  deleteVideo = async (youtube_video_id: string) => {
    try{
      const { error } = await supabase
        .from("videos")
        .delete()
        .eq("youtube_video_id", youtube_video_id);
        
      if (error){
        throw new Error(error.message)
      };
      return { success: true, message: "Resource Deleted Successfully!" };
    }catch(error){
      throw error
    }
  };
  
  // finds videos based on keyword
  findVideos = async ({keywords, getOne = false,includeTranscripts = false}:{keywords: string[], getOne: boolean, includeTranscripts: boolean}) => {
    try {
      const orFilter = keywords.map((kw:string) => `title.ilike.%${kw}%`).join(",");
      const { data, error } = await supabase
          .from("videos")
          .select(`*${includeTranscripts?",transcripts(*)":""}`)
          .or(`${orFilter}`);

      if (error){
        throw new Error(error.message)
      };
      return data;
    } catch (error) {
      throw error;
    }
  };
  
  // Check if a YouTube video with the given Youtube Video ID exists in the database
  checkVideoExistsById = async (videoId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from("videos")
        .select("id") // only selecting id for performance
        .ilike("url", `%v=${videoId}%`); // looks for the videoId in the URL

      if (error){
        throw new Error(error.message)
      };

      return data.length > 0;
    } catch (error) {
      console.error("Error in checkVideoExistsById:", error);
      throw error;
    }
  };
}

export default new VideoModel();