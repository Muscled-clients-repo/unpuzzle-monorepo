import Joi from "joi";
import {BaseValidator} from "./baseValidator"

// PuzzleSchema Validator
class PuzzleSchema extends BaseValidator {
  constructor(){
    super();
    this.schema = Joi.object({
      id: Joi.string().uuid().optional(),
      title: Joi.string().required(),
      description: Joi.string().optional(),
      created_at: Joi.date().optional(),
      updated_at: Joi.date().optional(),
    });
  }
}

export default PuzzleSchema
