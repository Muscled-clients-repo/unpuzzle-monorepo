import supabase from "./client";
import FileSchema from "../validator/file.validator";
import { BindMethods } from "../../protocols/utility/BindMethods";
import { AllowedMimeType } from "../validator/file.validator";

interface FileRecord {
  created_at: string; // ISO timestamp (with TZ)
  mime_type: AllowedMimeType;
  puzzle_reflect_id: string | null; // uuid FK → puzzlereflects.id
  name: string | null;
  stoarge_path: string | null; // note the miss-spelling in DB
  file_id: string | null;
  loom_link: string | null;
  original_file_name: string | null;
  url: string | null;
  file_size: string | null;
  check_sum: string | null;
  updated_at: string | null; // ISO timestamp (no TZ)
}

class FileModel extends FileSchema{
  constructor(){
    super();
  }
  // Fetch all files
  getAllFiles=async(page = 1,limit = 10)=> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    try{
      const { data, error, count } = await supabase
        .from("file")
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

  // Get file by ID
  getFileById=async(id: string)=> {
    try{
      const { data, error } = await supabase
        .from("file")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        throw new Error(error.message)
      }
      return data ;
    }catch(error){
      throw error
    }
  }

  // Create new file
  createFile=async(body: FileRecord)=> {

    try{
      this.validate(body);
      const { data, error } = await supabase
        .from("file")
        .insert([body])
        .select()
        .single();
      if (error) {
        throw new Error(error.message)
      };
      return  data;
    }catch(error){
      throw error
    }
  }

  // Update file
  updateFile=async(id: string,body: Partial<FileRecord>)=> {
    try{
      this.validate(body, 1);
      const { data, error } = await supabase
        .from("file")
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

  // Delete file
  deleteFile=async(id: string)=> {
    try{
      const { error } = await supabase.from("file").delete().eq("id", id);
      if (error) {
        throw new Error(error.message)
      }
      return { success: true, message: "Resource Deleted Successfully!" };
    }catch(error){
      throw error
    }
  }
}

const binding = new BindMethods(new FileModel());
export default binding.bindMethods();
