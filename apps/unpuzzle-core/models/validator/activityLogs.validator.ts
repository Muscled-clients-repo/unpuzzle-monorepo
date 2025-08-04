import Joi from "joi";
import {BaseValidator} from "./baseValidator"

// ActivityLogSchema Validator
class ActivityLogSchema extends BaseValidator {
  constructor(){
    super();
    this.schema = Joi.object({
      id: Joi.string().uuid().optional(),
      title: Joi.string().required(),
      user_id: Joi.string().required(),
      video_id: Joi.string().uuid().required(),
      fromTime: Joi.number().allow(null).optional(), // Time in seconds
      toTime: Joi.number().allow(null).optional(), // Time in seconds
      duration: Joi.number().allow(null).optional(), // Duration in seconds
      actionType: Joi.string()
        .valid(
          "pause",
          "seek",
          "play",
          "puzzle_path",
          "puzzle_hint",
          "puzzle_check",
          "puzzle_reflect"
        )
        .optional(), // Valid actions
      created_at: Joi.date().iso().optional(), // Validates an ISO 8601 date string
    });
  }
}

export default ActivityLogSchema

