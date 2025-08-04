import Joi from "joi";
import {BaseValidator} from "./baseValidator"

// PuzzlePathSchema Validator
class PuzzlePathSchema extends BaseValidator {
  constructor(){
    super();
    this.schema = Joi.object({
      id: Joi.string().uuid().required(),
      trigger_time: Joi.number().integer().required(),
      yt_video_id: Joi.string().allow(null).optional(),
      content_url: Joi.string().allow(null).optional(),
      content_type: Joi.string().valid('yt_video').default('yt_video'),
      start_time: Joi.number().default(0),
      end_time: Joi.number().default(0),
      duration: Joi.number().default(0),
      title: Joi.string().default('Default title'),
      video_id: Joi.string().uuid().required(),
      content_video_id: Joi.string().uuid().allow(null).optional(),
      user_id: Joi.string().required(),
      created_at: Joi.date().optional(),
      updated_at: Joi.date().optional(),
    });
  }
}

export default PuzzlePathSchema


