import { Request, Response } from "express";
import { BaseController } from "../BaseController";
import EnrollmentModel from "../../../models/supabase/enrollment.model";
import supabase from "../../../models/supabase/client";
import { logger } from "../../../utils/logger";

/**
 * MyLearningController - Handles enrolled courses for students
 * Provides endpoints to fetch user's enrolled courses with course details
 */
class MyLearningController extends BaseController {

  /**
   * Get all enrolled courses for the authenticated user
   * Returns courses with enrollment details and progress
   */
  getMyEnrolledCourses = this.asyncHandler(async (req: any, res: Response) => {
    const userId = req.user?.id;
    const { page = 1, limit = 15, search, category, status, sort = "recent" } = req.query;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    try {
      const from = (parseInt(page) - 1) * parseInt(limit);
      const to = from + parseInt(limit) - 1;

      // Build the query to get enrolled courses with course details
      let query = supabase
        .from("enrollments")
        .select(`
          *,
          courses!inner (
            *,
            chapters(
              id,
              videos(count)
            )
          )
        `, { count: "exact" })
        .eq("user_id", userId)
        .range(from, to);

      // Apply search filter if provided
      if (search) {
        query = query.ilike("courses.title", `%${search}%`);
      }

      // Apply category filter if provided
      if (category && category !== "all") {
        query = query.eq("courses.category", category);
      }

      // Apply sorting
      switch (sort) {
        case "alphabetical":
          query = query.order("title", { ascending: true, foreignTable: "courses" });
          break;
        case "progress":
          // For now, order by enrollment date - progress tracking would need additional table
          query = query.order("created_at", { ascending: false });
          break;
        case "recent":
        default:
          query = query.order("created_at", { ascending: false });
          break;
      }

      const { data, error, count } = await query;

      if (error) {
        logger.error('Error fetching enrolled courses:', error);
        throw new Error(error.message);
      }

      // Transform the data to match expected format
      const transformedData = data?.map((enrollment: any) => {
        const course = enrollment.courses;
        const chapters = course.chapters || [];
        const chapters_count = chapters.length;
        const videos_count = chapters.reduce((total: number, chapter: any) => {
          return total + (chapter.videos?.[0]?.count || 0);
        }, 0);

        return {
          ...course,
          enrolledAt: enrollment.created_at,
          enrollmentId: enrollment.id,
          chapters_count,
          videos_count,
          progress: 0, // TODO: Implement progress tracking
          lastAccessed: enrollment.updated_at || enrollment.created_at,
          chapters: undefined, // Remove the chapters array as we only need the counts
        };
      });

      const countWithDefault = count || 0;
      
      // Filter by status if provided (requires progress implementation)
      let filteredData = transformedData;
      if (status && status !== "all") {
        if (status === "completed") {
          filteredData = transformedData?.filter((course: any) => course.progress >= 100) || [];
        } else if (status === "in-progress") {
          filteredData = transformedData?.filter((course: any) => course.progress > 0 && course.progress < 100) || [];
        }
      }

      return this.sendSuccess(res, {
        data: filteredData,
        count: countWithDefault,
        total_page: Math.ceil(countWithDefault / parseInt(limit))
      }, "Enrolled courses fetched successfully");

    } catch (error) {
      logger.error('Error in getMyEnrolledCourses:', error);
      return this.handleError(res, error, "Unable to fetch enrolled courses. Please try again later.");
    }
  });
}

export default new MyLearningController();