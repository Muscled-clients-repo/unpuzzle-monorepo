import Joi from "joi";
import {BaseValidator} from "./baseValidator"

// VideoSchema Validator
class VideoSchema extends BaseValidator {
  constructor(){
    super();
    this.schema = Joi.object({
      id: Joi.string().uuid().required(),
      chapter_id: Joi.string().uuid().required(),
      title: Joi.string().required(),
      video_url: Joi.string().uri().required(),
      default_source: Joi.string().required(),
      created_at: Joi.date().iso().optional(),
      updated_at: Joi.date().iso().optional(),
    });
  }
}

export default VideoSchema


