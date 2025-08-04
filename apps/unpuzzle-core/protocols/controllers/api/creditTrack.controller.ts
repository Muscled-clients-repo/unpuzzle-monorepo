import { Request, Response } from "express";
import { GenericCrudController } from "../GenericCrudController";
import CreditTrackModel from "../../../models/supabase/creditTrack.model";
import { CreditTrack } from "../../../types/creditTrack.type";
import { logger } from "../../../utils/logger";
import { ValidationError } from "../../../constants/errors";

/**
 * Migrated CreditTrackController using GenericCrudController
 * Maintains exact same functionality while reducing code duplication
 * Note: This controller has custom business logic for credit operations
 */
class CreditTrackController extends GenericCrudController<CreditTrack> {
  protected model = CreditTrackModel;
  protected resourceName = "CreditTrack";
  protected resourceNamePlural = "CreditTracks";

  /**
   * Increase user credit - custom business logic
   */
  increaseCredit = this.asyncHandler(async (req: any, res: Response) => {
    const body = req.body;
    const { user_id } = body;

    if (!user_id) {
      throw new ValidationError("user_id is required");
    }

    // payment verification would go here

    // add credit if paid
    let credit_track = await this.model.getCreditTrackById(user_id);
    
    if (!credit_track) {
      const newCreditTrack = await this.model.createCreditTrack({
        user_id,
        available_credit: 0
      });
      
      if (!newCreditTrack) {
        throw new Error("Failed to create credit track");
      }
      
      credit_track = newCreditTrack;
    }
    
    credit_track.available_credit += 10000;
    const updatedCreditTrack = await this.model.updateCreditTrack(
      user_id, 
      credit_track as Partial<CreditTrack>
    );
    
    logger.info('Credit increased', { 
      userId: user_id, 
      newBalance: updatedCreditTrack?.available_credit 
    });
    
    return this.sendSuccess(res, updatedCreditTrack, "Credit increased successfully");
  });

  /**
   * Reduce user credit - custom business logic
   */
  reduceCredit = this.asyncHandler(async (req: any, res: Response) => {
    const body = req.body;
    const { user_id } = body;

    if (!user_id) {
      throw new ValidationError("user_id is required");
    }

    const credit_track = await this.model.getCreditTrackById(user_id);
    
    if (!credit_track) {
      throw new ValidationError("Credit track not found");
    }
    
    credit_track.available_credit -= 10000;
    const updatedCreditTrack = await this.model.updateCreditTrack(
      user_id,
      credit_track as Partial<CreditTrack>
    );
    
    logger.info('Credit reduced', { 
      userId: user_id, 
      newBalance: updatedCreditTrack?.available_credit 
    });
    
    return this.sendSuccess(res, updatedCreditTrack, "Credit reduced successfully");
  });

  /**
   * Create credit track with defaults
   * Note: Original hard-coded user_id and credit amount preserved for compatibility
   */
  createCreditTrack = this.asyncHandler(async (req: any, res: Response) => {
    const body = req.body;
    
    // Preserving original hard-coded values
    body["user_id"] = "user_2yje3NugrwcgIJ85KkQmcZNr2yL";
    body["available_credit"] = 10000;

    const credit_track = await this.model.createCreditTrack(body);
    
    if (!credit_track) {
      throw new Error("Failed to create credit track");
    }
    
    logger.info('Credit track created', { 
      userId: body.user_id,
      initialCredit: body.available_credit 
    });
    
    return this.sendSuccess(res, credit_track, "Credit track created successfully", 201);
  });

  /**
   * Required fields for credit track creation
   */
  protected getRequiredFields(): string[] {
    return ['user_id']; // available_credit has default value
  }
}

// Export without BindMethods as BaseController handles method binding
export default new CreditTrackController();