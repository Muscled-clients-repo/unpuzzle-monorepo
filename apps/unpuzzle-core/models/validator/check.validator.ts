import Joi from "joi";
import { BaseValidator } from "./baseValidator";

// CheckSchema Validator
class CheckSchema extends BaseValidator {
  constructor() {
    super();
    this.schema = Joi.object({
      id: Joi.string().uuid().optional(),
      created_at: Joi.date().optional(),
      updated_at: Joi.date().allow(null).optional(),
      question: Joi.string().required(),
      choices: Joi.alternatives().try(
        Joi.array(),
        Joi.object()
      ).required(),
      answer: Joi.string().required(),
      puzzlecheck_id: Joi.string().uuid().required(),
    });
  }
}

export default CheckSchema;