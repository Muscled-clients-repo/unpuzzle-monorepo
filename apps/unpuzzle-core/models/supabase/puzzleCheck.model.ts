import supabase from "./client";
import { PuzzleCheck } from "../../types/puzzleCheck.type";
import PuzzleCheckSchema from "../validator/puzzleCheck.validator";
import CheckModel from "./check.model";

class PuzzleCheckModel extends PuzzleCheckSchema {
  constructor() {
    super();
  }
  getAllPuzzleChecks = async (page = 1, limit = 10) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    try {
      const { data, error, count } = await supabase
        .from("puzzlechecks")
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

  getPuzzleCheckById = async (
    id: string,
    includeChecks = true,
    includeVideo = true,
    includeUser = true
  ): Promise<PuzzleCheck | null> => {
    try {
      let selectFields: string[] = ["*"];
      if (includeUser) {
        selectFields.push("user:user_id(*)");
      }
      if (includeChecks) {
        selectFields.push("checks(*)");
      }

      if (includeVideo) {
        selectFields.push("video:video_id(*)");
      }

      const selectQuery = selectFields.join(",\n");

      const { data, error } = await supabase
        .from("puzzlechecks")
        .select(selectQuery)
        .eq("id", id)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }
      return data as PuzzleCheck | null;
    } catch (error) {
      throw error;
    }
  };

  getPuzzleChecksByPath = async (puzzle_path_id: string) => {
    try {
      const { data, error } = await supabase
        .from("puzzlechecks")
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

  // Create PuzzleCheck without checks (for backwards compatibility)
  createPuzzleCheck = async (
    body: Omit<
      PuzzleCheck,
      "id" | "created_at" | "updated_at" | "checks" | "user"
    >
  ) => {
    try {
      console.log("body is: ", body);
      this.validate(body);
      const { data, error } = await supabase
        .from("puzzlechecks")
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

  // Create PuzzleCheck with related checks
  createPuzzleCheckWithChecks = async (
    puzzleCheckData: Omit<
      PuzzleCheck,
      "id" | "created_at" | "updated_at" | "user"
    >,
    checksData: any[]
  ) => {
    try {
      // Start a transaction-like approach using multiple operations
      // First create the puzzle check
      const puzzleCheckBody = {
        topic: puzzleCheckData.topic,
        video_id: puzzleCheckData.video_id,
        duration: puzzleCheckData.duration || 0,
        user_id: puzzleCheckData.user_id,
        total_checks: checksData.length,
        correct_checks_count: null, // Will be updated when answers are submitted
      };

      const { data: puzzleCheck, error: puzzleCheckError } = await supabase
        .from("puzzlechecks")
        .insert([puzzleCheckBody])
        .select()
        .single();

      if (puzzleCheckError) {
        throw new Error(puzzleCheckError.message);
      }

      // Then create the related checks
      if (checksData && checksData.length > 0) {
        const checksToInsert = checksData.map((check) => ({
          question: check.question,
          choices: check.choices,
          answer: check.answer,
          puzzlecheck_id: puzzleCheck.id,
        }));

        const createdChecks = await CheckModel.createMultipleChecks(
          checksToInsert
        );

        // Return puzzle check with checks
        return {
          ...puzzleCheck,
          checks: createdChecks,
        };
      }

      return puzzleCheck;
    } catch (error) {
      throw error;
    }
  };

  updatePuzzleCheck = async (id: string, body: Partial<PuzzleCheck>) => {
    try {
      this.validate(body, 1);
      const { data, error } = await supabase
        .from("puzzlechecks")
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

  // Submit answers and calculate correct count
  submitAnswers = async (
    puzzleCheckId: string,
    userAnswers: { [checkId: string]: string }
  ) => {
    try {
      // Get puzzle check with its checks
      const puzzleCheck = await this.getPuzzleCheckById(puzzleCheckId, true);
      if (!puzzleCheck) {
        throw new Error("Puzzle check not found");
      }

      if (
        !puzzleCheck.checks ||
        !Array.isArray(puzzleCheck.checks) ||
        puzzleCheck.checks.length === 0
      ) {
        throw new Error("Puzzle check has no checks");
      }

      // Compare user answers with correct answers
      let correctCount = 0;
      puzzleCheck.checks.forEach((check: any) => {
        const userAnswer = userAnswers[check.id];
        if (
          userAnswer &&
          userAnswer.trim().toLowerCase() === check.answer.trim().toLowerCase()
        ) {
          correctCount++;
        }
      });

      // Update the puzzle check with correct count
      const updatedPuzzleCheck = await this.updatePuzzleCheck(puzzleCheckId, {
        correct_checks_count: correctCount,
      });

      return {
        ...updatedPuzzleCheck,
        correct_checks_count: correctCount,
        total_checks: puzzleCheck.checks.length,
        score_percentage: Math.round(
          (correctCount / puzzleCheck.checks.length) * 100
        ),
      };
    } catch (error) {
      throw error;
    }
  };

  // Update puzzle check with new checks (replace existing)
  updatePuzzleCheckWithChecks = async (
    puzzleCheckId: string,
    puzzleCheckData: Partial<PuzzleCheck>,
    checksData: any[]
  ) => {
    try {
      // Delete existing checks
      await CheckModel.deleteChecksByPuzzleCheckId(puzzleCheckId);

      // Update puzzle check data including total_checks
      const updatedPuzzleCheckData = {
        ...puzzleCheckData,
        total_checks: checksData.length,
        correct_checks_count: null, // Reset when checks are updated
      };

      const updatedPuzzleCheck = await this.updatePuzzleCheck(
        puzzleCheckId,
        updatedPuzzleCheckData
      );

      // Create new checks
      if (checksData && checksData.length > 0) {
        const checksToInsert = checksData.map((check) => ({
          question: check.question,
          choices: check.choices,
          answer: check.answer,
          puzzlecheck_id: puzzleCheckId,
        }));

        const createdChecks = await CheckModel.createMultipleChecks(
          checksToInsert
        );

        return {
          ...updatedPuzzleCheck,
          checks: createdChecks,
        };
      }

      return updatedPuzzleCheck;
    } catch (error) {
      throw error;
    }
  };

  getPuzzleChecksByDuration = async (
    video_id: string,
    startTime: number,
    endTime: number
  ) => {
    try {
      const { data, error } = await supabase
        .from("puzzlechecks")
        .select("*")
        .eq("video_id", video_id)
        .gte("duration", startTime)
        .lte("duration", endTime + 5)
        .limit(5);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      throw error;
    }
  };

  deletePuzzleCheck = async (id: string) => {
    try {
      const { error } = await supabase
        .from("puzzlechecks")
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

export default new PuzzleCheckModel();
