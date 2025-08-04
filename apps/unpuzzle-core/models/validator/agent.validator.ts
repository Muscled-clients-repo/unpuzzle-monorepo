import Joi from "joi";
import { BaseValidator } from "./baseValidator";

class AgentSchema extends BaseValidator {
  constructor() {
    super();
    this.schema = Joi.object({
      id: Joi.string().uuid().required(),
      name: Joi.string().min(1).required(),
      user_id: Joi.string().min(1).required(),
      is_active: Joi.boolean().default(true),
      created_at: Joi.date().optional(),
      updated_at: Joi.date().optional(),
    });
  }
}

export default AgentSchema;