import Joi from "joi";
import { BaseValidator } from "./baseValidator";

class RelatedVideoSchema extends BaseValidator {
  constructor() {
    super();
    this.schema = Joi.object({
      id: Joi.string().uuid().required(),
      video_id: Joi.string().min(1).required(),
      related_video_id: Joi.string().min(1).required(),
      created_at: Joi.date().optional(),
      updated_at: Joi.date().optional(),
    });
  }
}

export default RelatedVideoSchema;