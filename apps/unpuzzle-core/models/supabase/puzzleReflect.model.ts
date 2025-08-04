import supabase from "./client";
import { PuzzleReflect } from "../../types/puzzleReflect.type";
import PuzzleReflectSchema from "../validator/puzzleReflect.validator";

class PuzzleReflectModel extends PuzzleReflectSchema {
  constructor() {
    super();
  }
  getAllPuzzleReflects = async (video_id: string, page = 1, limit = 10) => {
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from("puzzlereflects")
        .select("*", { count: "exact" })
        .eq("video_id", video_id)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        throw new Error(error.message);
      }

      const countWithDefault = count || 0;
      return {
        data,
        count: countWithDefault,
        total_page: Math.ceil(countWithDefault / limit),
      };
    } catch (error) {
      throw error;
    }
  };

  getPuzzleReflectById = async (
    id: string,
    includeVideo = true,
    includeFiles = true,
    includeUser = true
  ) => {
    try {
      let selectFields: string[] = ["*"];
      if (includeUser) {
        selectFields.push("user:user_id(*)");
      }
      if (includeVideo) {
        selectFields.push("video:video_id(*)");
      }
      if (includeFiles) {
        selectFields.push("file(*)");
      }
      const selectQuery = selectFields.join(",\n");
      const { data, error } = await supabase
        .from("puzzlereflects")
        .select(selectQuery)
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

  getPuzzleReflectsByPath = async (puzzle_path_id: string) => {
    try {
      const { data, error } = await supabase
        .from("puzzlereflects")
        .select("*")
        .eq("puzzle_path_id", puzzle_path_id)
        .order("order_index", { ascending: true });

      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  createPuzzleReflect = async (
    body: Omit<PuzzleReflect, "id" | "created_at" | "updated_at">
  ) => {
    this.validate(body);

    const { data, error } = await supabase
      .from("puzzlereflects")
      .insert([body])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  updatePuzzleReflect = async (id: string, body: Partial<PuzzleReflect>) => {
    try {
      this.validate(body, 1);
      const { data, error } = await supabase
        .from("puzzlereflects")
        .update(body)
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

  deletePuzzleReflect = async (id: string) => {
    try {
      const { error } = await supabase
        .from("puzzlereflects")
        .delete()
        .eq("id", id);
      if (error) {
        throw new Error(error.message);
      }
      return { success: true, message: "Resource Deleted Successfully!" };
    } catch (error) {
      throw error;
    }
  };
}

export default new PuzzleReflectModel();
