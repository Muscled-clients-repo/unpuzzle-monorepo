import Joi from "joi";
import {BaseValidator} from "./baseValidator"

// ChapterSchema Validator
class ChapterSchema extends BaseValidator {
  constructor(){
    super();
    this.schema = Joi.object({
      id: Joi.string().optional(),
      course_id: Joi.string().uuid().required(),
      title: Joi.string().required(),
      order_index: Joi.number().integer().required(),
      created_at: Joi.date().optional(),
      updated_at: Joi.date().optional(),
    })
  }
}

export default ChapterSchema


