import Joi from "joi";
import {BaseValidator} from "./baseValidator"

// ChapterSchema Validator
class CourseSchema extends BaseValidator {
  constructor(){
    super();
    this.schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
      created_by: Joi.string().required(),
      price: Joi.number().positive().required(),
      visibility: Joi.string().valid("public", "private").default("private"),
      created_at: Joi.date().optional(),
      updated_at: Joi.date().optional(),
    });
  }
}

export default CourseSchema

