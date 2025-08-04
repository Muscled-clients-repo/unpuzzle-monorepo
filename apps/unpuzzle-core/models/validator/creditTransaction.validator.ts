import Joi from "joi";
import { BaseValidator } from "./baseValidator";

class CreditTransactionSchema extends BaseValidator {
  constructor() {
    super();
    this.schema = Joi.object({
      id: Joi.string().uuid().optional(),
      user_id: Joi.string().uuid().required(),
      amount: Joi.number().integer().required(),
      type: Joi.string().valid('purchase', 'usage', 'refund', 'bonus').required(),
      stripe_session_id: Joi.string().allow(null).optional(),
      description: Joi.string().optional(),
      metadata: Joi.object().optional(),
      created_at: Joi.date().iso().optional(),
    });
  }
}

export default CreditTransactionSchema;