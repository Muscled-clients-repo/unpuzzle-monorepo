import Joi from "joi";
import {BaseValidator} from "./baseValidator"

// ActivityLogSchema Validator
class AgentSchema extends BaseValidator {
  constructor(){
    super();
    this.schema = Joi.object({
      id: Joi.string().uuid().optional(),
      created_by: Joi.string().uuid().required(),
      type: Joi.string().required(),
      Title: Joi.string().optional(),
    });
  }
}

export default AgentSchema


