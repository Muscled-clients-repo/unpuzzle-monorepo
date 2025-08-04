import Joi from "joi";
import {BaseValidator} from "./baseValidator"

export const allowedMimeTypes = [
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/aac",
  "audio/mp4",
  "audio/x-m4a",
  "audio/flac",
  "audio/webm",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
  "image/x-icon",
] as const;
export type AllowedMimeType =
  | "audio/mpeg"
  | "audio/wav"
  | "audio/ogg"
  | "audio/aac"
  | "audio/mp4"
  | "audio/x-m4a"
  | "audio/flac"
  | "audio/webm"
  | "image/jpeg"
  | "image/png"
  | "image/gif"
  | "image/webp"
  | "image/svg+xml"
  | "image/bmp"
  | "image/tiff"
  | "image/x-icon";


// FileSchema Validator
class FileSchema extends BaseValidator {
  constructor(){
    super();
    this.schema = Joi.object({
      id: Joi.string().uuid().optional(),
      mime_type: Joi.string().valid(...allowedMimeTypes),
      puzzle_reflect_id: Joi.string().uuid().allow(null),
      name: Joi.string().allow(null, ""),
      stoarge_path: Joi.string().allow(null, ""), // typo matches column
      file_id: Joi.string().allow(null, ""),
      loom_link: Joi.string().uri().allow(null, ""),
      original_file_name: Joi.string().allow(null, ""),
      url: Joi.string().uri().allow(null, ""),
      file_size: Joi.string().allow(null, ""),
      check_sum: Joi.string().allow(null, ""),
      created_at: Joi.date().iso().allow(null),
      updated_at: Joi.date().iso().allow(null),
    })
  }
}

export default FileSchema

