import Joi from "joi";
import {BaseValidator} from "./baseValidator"

// ProductSchema Validator
class OrdersSchema extends BaseValidator {
  constructor(){
    super();
    this.schema = Joi.object({
      id: Joi.string().optional(),
      user_id: Joi.string().required(),
      total_amount: Joi.number().required(),
      discount_id: Joi.string().optional(),
      items: Joi.array().items(Joi.object({
        product_id: Joi.string().required(),
        quantity: Joi.number().required(),
      })).required(),
      payment_id: Joi.string().optional(),
      payment_status: Joi.string().valid('pending', 'paid', 'failed').required(),
      payment_method: Joi.string().valid('credit_card', 'bank_transfer', 'paypal', 'stripe').required(),
      payment_date: Joi.date().optional(),
      payment_amount: Joi.number().required(),
      payment_currency: Joi.string().valid('USD').required(),
      created_at: Joi.date().optional(),
      updated_at: Joi.date().optional(),
    });
  }
}

export default OrdersSchema
