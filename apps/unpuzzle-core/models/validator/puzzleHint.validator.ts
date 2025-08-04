import Joi from "joi";
import { BaseValidator } from "./baseValidator";

// PuzzleHintSchema Validator
class PuzzleHintSchema extends BaseValidator {
  constructor() {
    super();
    this.schema = Joi.object({
      id: Joi.string().uuid().optional(),
      question: Joi.string().required(),
      topic: Joi.string().default(""),
      prompt: Joi.string().default(""),
      completion: Joi.array().default([]),
      duration: Joi.number().default(0),
      video_id: Joi.string().uuid().allow(null).optional(),
      user_id: Joi.string().required(),
      status: Joi.string()
        .valid("still confused", "got it")
        .allow(null)
        .optional(),
      created_at: Joi.date().optional(),
      updated_at: Joi.date().allow(null).optional(),
    });
  }
}

export default PuzzleHintSchema;
