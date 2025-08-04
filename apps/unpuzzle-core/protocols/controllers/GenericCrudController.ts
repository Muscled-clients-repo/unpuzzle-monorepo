import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { NotFoundError, ValidationError, ERROR_MESSAGES } from '../../constants/errors';
import EnrollmentModel from '../../models/supabase/enrollment.model';

/**
 * Generic CRUD Controller that works with our migrated BaseModel pattern
 * Provides standard CRUD operations while maintaining exact compatibility
 * with existing model method names (getAllXs, getXById, createX, updateX, deleteX)
 */
export abstract class GenericCrudController<T> extends BaseController {
  protected abstract model: any;
  protected abstract resourceName: string;
  protected abstract resourceNamePlural: string;

  /**
   * Get all resources with pagination
   * Calls model's getAllXs method following our naming convention
   */
  getAll = this.asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = this.getPaginationParams(req);
    
    // Call the model method with the naming pattern getAllXs
    const methodName = `getAll${this.resourceNamePlural}`;
    if (typeof this.model[methodName] !== 'function') {
      throw new Error(`Model method ${methodName} not found`);
    }
    
    const result = await this.model[methodName](page, limit);
    
    if (!result) {
      throw new NotFoundError(`Unable to fetch ${this.resourceNamePlural.toLowerCase()}`);
    }
    
    return this.sendSuccess(res, result);
  });

  /**
   * Get resource by ID
   * Calls model's getXById method
   */
  getById = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    if (!id) {
      throw new ValidationError('ID parameter is required');
    }
    
    // Call the model method with the naming pattern getXById
    const methodName = `get${this.resourceName}ById`;
    if (typeof this.model[methodName] !== 'function') {
      throw new Error(`Model method ${methodName} not found`);
    }
    
    const result = await this.model[methodName](id);
    
    if (!result) {
      throw new NotFoundError(`${this.resourceName} with ID ${id} not found`);
    }
    
    // If this is a course and user is authenticated, check enrollment status
    if (this.resourceName === 'Course' && (req as any).user?.id) {
      try {
        const enrollment = await EnrollmentModel.getEnrollmentByUserAndCourse((req as any).user.id, id);
        result.enrolled = !!enrollment;
      } catch (error) {
        // If enrollment check fails, default to not enrolled
        result.enrolled = false;
      }
    }
    
    return this.sendSuccess(res, result);
  });

  /**
   * Create new resource
   * Calls model's createX method
   */
  create = this.asyncHandler(async (req: Request, res: Response) => {
    // Validate required fields if defined
    const requiredFields = this.getRequiredFields();
    if (requiredFields.length > 0) {
      const validation = this.validateRequiredFields(req.body, requiredFields);
      if (validation) {
        throw new ValidationError(validation);
      }
    }
    
    // Call the model method with the naming pattern createX
    const methodName = `create${this.resourceName}`;
    if (typeof this.model[methodName] !== 'function') {
      throw new Error(`Model method ${methodName} not found`);
    }
    
    const result = await this.model[methodName](req.body);
    
    return this.sendSuccess(
      res, 
      result, 
      `${this.resourceName} created successfully`, 
      201
    );
  });

  /**
   * Update resource
   * Calls model's updateX method
   */
  update = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    if (!id) {
      throw new ValidationError('ID parameter is required');
    }
    
    // Call the model method with the naming pattern updateX
    const methodName = `update${this.resourceName}`;
    if (typeof this.model[methodName] !== 'function') {
      throw new Error(`Model method ${methodName} not found`);
    }
    
    const result = await this.model[methodName](id, req.body);
    
    if (!result) {
      throw new NotFoundError(`${this.resourceName} with ID ${id} not found`);
    }
    
    return this.sendSuccess(
      res, 
      result, 
      `${this.resourceName} updated successfully`
    );
  });

  /**
   * Delete resource
   * Calls model's deleteX method
   */
  delete = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    if (!id) {
      throw new ValidationError('ID parameter is required');
    }
    
    // Call the model method with the naming pattern deleteX
    const methodName = `delete${this.resourceName}`;
    if (typeof this.model[methodName] !== 'function') {
      throw new Error(`Model method ${methodName} not found`);
    }
    
    const result = await this.model[methodName](id);
    
    return this.sendSuccess(
      res, 
      result,
      `${this.resourceName} deleted successfully`
    );
  });

  /**
   * Override in child classes to specify required fields for creation
   */
  protected getRequiredFields(): string[] {
    return [];
  }

  /**
   * Helper to check if user is authenticated for protected routes
   */
  protected requireAuth(req: Request): string {
    const userId = this.getUserId(req);
    if (!userId) {
      throw new ValidationError(ERROR_MESSAGES.UNAUTHORIZED);
    }
    return userId;
  }
}