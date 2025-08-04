import Joi from "joi";
import {BaseValidator} from "./baseValidator"

// CreditTrackSchema Validator
class CreditTrackSchema extends BaseValidator {
  constructor(){
    super();
    this.schema = Joi.object({
      id: Joi.string().uuid().optional(),
      user_id: Joi.string().required(),
      available_credit: Joi.number().integer().min(0).default(0).required(),
      created_at: Joi.date().optional(),
      updated_at: Joi.date().allow(null).optional(),
    });
  }
}

export default CreditTrackSchema
