import Joi from "joi";
import {BaseValidator} from "./baseValidator"

// PuzzleRequestSchema Validator
class PuzzleRequestSchema extends BaseValidator {
  constructor(){
    super();
    this.schema = Joi.object({
      id: Joi.string().uuid().optional(),
      user_id: Joi.string().uuid().required(),
      video_id: Joi.string().uuid().required(),
      current_time_sec: Joi.number().integer().required(),
      transcript_content: Joi.string().required(),
      ai_generated_him: Joi.string().required(),
      created_at: Joi.date().optional(),
      updated_at: Joi.date().allow(null).optional(),
    });
  }
}

export default PuzzleRequestSchema




