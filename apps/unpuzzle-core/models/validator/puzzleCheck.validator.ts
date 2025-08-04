import Joi from "joi";
import {BaseValidator} from "./baseValidator"

// PuzzleCheckSchema Validator
class PuzzleCheckSchema extends BaseValidator {
  constructor(){
    super();
    this.schema = Joi.object({
      id: Joi.string().uuid().optional(),
      topic: Joi.string().required(),
      created_at: Joi.date().optional(),
      updated_at: Joi.date().optional(),
      video_id: Joi.string().uuid().required(),
      duration: Joi.number().default(0),
      user_id: Joi.string().required(),
      total_checks: Joi.number().allow(null).optional(),
      correct_checks_count: Joi.number().allow(null).optional(),
      
      // For relationship data validation
      checks: Joi.array().items(Joi.object({
        question: Joi.string().required(),
        choices: Joi.alternatives().try(Joi.array(), Joi.object()).required(),
        answer: Joi.string().required(),
      })).optional(),
      user: Joi.object().optional(),
    });
  }
}

export default PuzzleCheckSchema
