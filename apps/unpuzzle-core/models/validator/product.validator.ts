import Joi from "joi";
import {BaseValidator} from "./baseValidator"

// ProductSchema Validator
class ProductSchema extends BaseValidator {
  constructor(){
    super();
    this.schema = Joi.object({
      id: Joi.string().optional(),
      title: Joi.string().required(),
      price: Joi.number().required(),
      product_type: Joi.string().valid('onetime_purchase', 'monthly_subscription', 'yearly_subscription').required(),
      credit: Joi.number().integer().required(),
      created_at: Joi.date().optional(),
      updated_at: Joi.date().optional(),
    });
  }
}

export default ProductSchema
