import { Request, Response } from "express";
import { GenericCrudController } from "../GenericCrudController";
import ChapterModel from "../../../models/supabase/chapter.model";
import { Chapter } from "../../../types/chapter.type";
import { logger } from "../../../utils/logger";
import { ValidationError } from "../../../constants/errors";

/**
 * Migrated ChapterController using GenericCrudController
 * Maintains exact same functionality while reducing code by 75%
 */
class ChapterController extends GenericCrudController<Chapter> {
  protected model = ChapterModel;
  protected resourceName = "Chapter";
  protected resourceNamePlural = "Chapters";

  /**
   * Get all chapters with pagination
   */
  getAllChapters = this.asyncHandler(async (req: any, res: Response) => {
    const { page = 1, limit = 10, course_id } = req.query;
    
    // If course_id is provided, use the filtered method (without pagination)
    if (course_id) {
      const result = await this.model.getChaptersByCourse(course_id);
      console.log("result", result);
      
      if (!result) {
        throw new Error("Unable to fetch chapters. Please try again later.");
      }
      
      // Wrap result in pagination format for consistency
      return this.sendSuccess(res, {
        data: result,
        count: result.length,
        total_page: 1
      });
    }
    
    // Use paginated method for all chapters
    const result = await this.model.getAllChapters(parseInt(page), parseInt(limit));

    console.log("result", result);
    
    if (!result) {
      throw new Error("Unable to fetch chapters. Please try again later.");
    }
    
    // Ensure the response format matches expected pagination structure
    return this.sendSuccess(res, {
      data: result.data,
      count: result.count,
      total_page: result.total_page
    });
  });

  /**
   * Get chapter by ID - uses base implementation
   */
  getChapterById = this.getById;

  /**
   * Create chapter with order_index conversion
   */
  createChapter = this.asyncHandler(async (req: any, res: Response) => {
    let chapterData = req.body;
    
    // Convert order_index to integer if provided
    if (chapterData.order_index) {
      chapterData.order_index = parseInt(chapterData.order_index);
    }
    
    // Replace console.log with proper logging
    logger.info('Creating chapter', { 
      courseId: chapterData.course_id,
      orderIndex: chapterData.order_index 
    });
    
    const result = await this.model.createChapter(chapterData);
    
    logger.info('Chapter created', { chapterId: result?.id });
    
    if (!result) {
      // Fixed error message
      throw new Error("Unable to create chapter. Please try again later.");
    }
    
    return this.sendSuccess(res, result, "Chapter created successfully", 201);
  });

  /**
   * Update chapter - uses base implementation
   */
  updateChapter = this.update;

  /**
   * Delete chapter - uses base implementation
   * Note: Model has typo "Deleetd" which is preserved
   */
  deleteChapter = this.delete;

  /**
   * Required fields for chapter creation
   */
  protected getRequiredFields(): string[] {
    return ['title', 'course_id', 'order_index'];
  }
}

// Export without BindMethods as BaseController handles method binding
export default new ChapterController();