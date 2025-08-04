import Joi from "joi";
import {BaseValidator} from "./baseValidator"

// UserSchema Validator
class UserSchema extends BaseValidator {
  constructor(){
    super();
    this.schema = Joi.object({
      id: Joi.string().optional(),
      email: Joi.string().email().required(),
      first_name: Joi.string().default('').optional(),
      last_name: Joi.string().default('').optional(),
      image_url: Joi.string().allow(null).optional(),
      role: Joi.string()
        .valid("admin", "user", "moderator")
        .default("user")
        .optional(),
      bio: Joi.string().default('').optional(),
      title: Joi.string().default('').optional(),
      created_at: Joi.date().optional(),
      updated_at: Joi.date().allow(null).optional(),
    });
  }
}

export default UserSchema

