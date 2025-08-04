import Joi from "joi";
import {BaseValidator} from "./baseValidator"

// TranscriptSchema Validator
class TranscriptSchema extends BaseValidator {
  constructor(){
    super();
    this.schema = Joi.object({
      id: Joi.string().uuid().optional(), 
      video_id: Joi.string().uuid().required(),
      start_time_sec: Joi.number().required(),
      end_time_sec: Joi.number().required(),
      content: Joi.string().required(),
      created_at: Joi.date().iso().optional(), 
      updated_at: Joi.date().iso().optional(),
    });
  }
}

export default TranscriptSchema
