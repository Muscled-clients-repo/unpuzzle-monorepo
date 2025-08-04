import Joi from "joi";
import {BaseValidator} from "./baseValidator"

// PuzzleReflectSchema Validator
class PuzzleReflectSchema extends BaseValidator {
  constructor(){
    super();
    this.schema = Joi.object({
      id: Joi.string().uuid().optional(),
      type: Joi.string().allow(null).optional(),
      loom_link: Joi.string().allow(null).optional(),
      user_id: Joi.string().allow(null).optional(),
      video_id: Joi.string().uuid().allow(null).optional(),
      title: Joi.string().allow(null).optional(),
      timestamp: Joi.number().min(0).allow(null).optional(),
      created_at: Joi.date().optional(),
      updated_at: Joi.date().allow(null).optional(),
    });
  }
}

export default PuzzleReflectSchema
