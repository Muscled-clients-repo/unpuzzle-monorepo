import Joi from "joi";
import {BaseValidator} from "./baseValidator"

// EnrollmentSchema Validator
class EnrollmentSchema extends BaseValidator {
  constructor(){
    super();
    this.schema = Joi.object({
      id: Joi.string().uuid().optional(),
      user_id: Joi.string().uuid().required(),
      course_id: Joi.string().uuid().required(),
      created_at: Joi.date().optional(),
      updated_at: Joi.date().allow(null).optional(),
    });
  }
}

export default EnrollmentSchema
