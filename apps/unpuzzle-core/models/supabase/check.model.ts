import supabase from "./client";
import { Check } from "../../types/check.type";
import CheckSchema from "../validator/check.validator";

class CheckModel extends CheckSchema {
  constructor() {
    super();
  }

  // Get all checks with pagination
  getAllChecks = async (page = 1, limit = 10) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    try {
      const { data, error, count } = await supabase
        .from("checks")
        .select("*", { count: "exact" })
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

  // Get check by ID
  getCheckById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("checks")
        .select("*")
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

  // Get checks by puzzlecheck_id
  getChecksByPuzzleCheckId = async (puzzlecheck_id: string) => {
    try {
      const { data, error } = await supabase
        .from("checks")
        .select("*")
        .eq("puzzlecheck_id", puzzlecheck_id)
        .order("created_at", { ascending: true });

      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Create a new check
  createCheck = async (body: Omit<Check, "id" | "created_at" | "updated_at">) => {
    try {
      this.validate(body);
      const { data, error } = await supabase
        .from("checks")
        .insert([body])
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

  // Create multiple checks
  createMultipleChecks = async (checks: Omit<Check, "id" | "created_at" | "updated_at">[]) => {
    try {
      // Validate each check
      checks.forEach(check => this.validate(check));
      
      const { data, error } = await supabase
        .from("checks")
        .insert(checks)
        .select();

      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Update check
  updateCheck = async (id: string, body: Partial<Check>) => {
    try {
      this.validate(body, 1);
      const { data, error } = await supabase
        .from("checks")
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

  // Delete check
  deleteCheck = async (id: string) => {
    try {
      const { error } = await supabase.from("checks").delete().eq("id", id);
      if (error) {
        throw new Error(error.message);
      }
      return { success: true, message: "Check deleted successfully!" };
    } catch (error) {
      throw error;
    }
  };

  // Delete checks by puzzlecheck_id
  deleteChecksByPuzzleCheckId = async (puzzlecheck_id: string) => {
    try {
      const { error } = await supabase
        .from("checks")
        .delete()
        .eq("puzzlecheck_id", puzzlecheck_id);
      
      if (error) {
        throw new Error(error.message);
      }
      return { success: true, message: "Checks deleted successfully!" };
    } catch (error) {
      throw error;
    }
  };
}

export default new CheckModel();