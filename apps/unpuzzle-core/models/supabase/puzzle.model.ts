import supabase from "./client";
import { Puzzle } from "../../types/puzzle.type";
import PuzzleSchema from "../validator/puzzle.validator"

class PuzzleModel extends PuzzleSchema{
  constructor(){
    super()
  }
  getAllPuzzles=async(page = 1,limit = 10)=> {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    try {
      console.log("Fetching puzzles from Supabase...");
      const { data, error, count } = await supabase
        .from("puzzles")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        throw new Error(error.message)
      }

      return data;
    } catch (error) {
      throw error
    }
  }

  getPuzzleById=async(id: string)=> {
    try{
      const { data, error } = await supabase
        .from("puzzles")
        .select("*")
        .eq("id", id)
        .single();
  
      if (error) {
        throw new Error(error.message)
      }
      return data;
    }catch(error){
      throw error
    }
  }

  createPuzzle=async(body: Puzzle)=> {
    try{
      this.validate(body);
      const { data, error } = await supabase
        .from("puzzles")
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

  updatePuzzle=async(id: string, body: Partial<Puzzle>)=> {
    try{
      this.validate(body, 1);
      const { data, error } = await supabase
        .from("puzzles")
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

  deletePuzzle=async(id: string)=> {
    try{
      const { error } = await supabase.from("puzzles").delete().eq("id", id);
      if (error) {
        throw new Error(error.message)
      }
      return { success: true, message: "Resource Deleted Successfully!" };
    }catch(error){
      throw error
    }
  }
}

export default new PuzzleModel();
