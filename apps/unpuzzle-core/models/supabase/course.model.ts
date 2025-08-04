import supabase from "./client";
import { Course } from "../../types/course.type";
import CourseSchema from "../validator/course.validator";

class CourseModel extends CourseSchema {
  // Get all courses (paginated) with chapter count and videos count
  getAllCourses = async (page = 1, limit = 10) => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    try {
      const { data, error, count } = await supabase
        .from("courses")
        .select(
          `
          *,
          chapters(
            id,
            videos(count)
          )
        `,
          { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(from, to)

      if (error) {
        throw new Error(error.message);
      }

      // Transform data to include chapter_count and videos_count
      const transformedData = data?.map((course) => {
        const chapters = course.chapters || [];
        const chapters_count = chapters.length;
        const videos_count = chapters.reduce((total: number, chapter: any) => {
          return total + (chapter.videos?.[0]?.count || 0);
        }, 0);

        return {
          ...course,
          chapters_count,
          videos_count,
          chapters: undefined, // Remove the chapters array as we only need the counts
        };
      });

      const countWithDefault = count || 0;
      return {
        data: transformedData,
        count: countWithDefault,
        total_page: Math.ceil(countWithDefault / limit),
      };
    } catch (error) {
      throw error;
    }
  };

  // Get course by ID
  getCourseById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select(
          `
          *,
          chapters (
            *,
            videos (*)
          )
        `
        )
        .eq("id", id)
        .maybeSingle()

      if (error) {
        throw new Error(error.message);
      }
      if (data && data.chapters) {
        data.chapters.sort((a: any, b: any) => a.order_index - b.order_index); // Sorting chapters by order_index
      }
      data["enrolled"]=false
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Create new course
  createCourse = async (body: Course) => {
    try {
      this.validate(body);

      const { data, error } = await supabase
        .from("courses")
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

  // Update course
  updateCourse = async (id: string, body: Partial<Course>) => {
    try {
      this.validate(body, 1);
      const { data, error } = await supabase
        .from("courses")
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

  // Delete course
  deleteCourse = async (id: string) => {
    try {
      const { error } = await supabase.from("courses").delete().eq("id", id);
      if (error) {
        throw new Error(error.message);
      }
      return { success: true, message: "Resource Deleetd Successfully!" };
    } catch (error) {
      throw error;
    }
  };

  // Get courses by user (creator)
  getCoursesByCreator = async (userId: string) => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("created_by", userId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  };
}

export default new CourseModel();
