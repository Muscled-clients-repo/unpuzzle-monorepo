import Joi from "joi";
import { BaseValidator } from "./baseValidator";

// InstructorAvailability Validator
class InstructorAvailabilitySchema extends BaseValidator {
  constructor() {
    super();
    this.schema = Joi.object({
      id: Joi.string().uuid().optional(),
      instructor_id: Joi.string().uuid().required(),
      day_of_week: Joi.number().integer().min(0).max(6).required(),
      start_time: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      end_time: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
      is_available: Joi.boolean().default(true),
      created_at: Joi.date().optional(),
      updated_at: Joi.date().optional(),
    });
  }
}

// Meeting Validator
class MeetingSchema extends BaseValidator {
  constructor() {
    super();
    this.schema = Joi.object({
      id: Joi.string().uuid().optional(),
      student_id: Joi.string().uuid().required(),
      instructor_id: Joi.string().uuid().required(),
      start_time: Joi.date().iso().required(),
      end_time: Joi.date().iso().optional(),
      actual_duration_minutes: Joi.number().integer().min(0).default(0),
      status: Joi.string().valid('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show').default('scheduled'),
      meeting_link: Joi.string().uri().optional(),
      notes: Joi.string().max(1000).optional(),
      price_per_minute: Joi.number().positive().required(),
      total_amount: Joi.number().min(0).default(0),
      payment_status: Joi.string().valid('pending', 'paid', 'failed', 'refunded').default('pending'),
      stripe_payment_intent_id: Joi.string().optional(),
      created_at: Joi.date().optional(),
      updated_at: Joi.date().optional(),
    });
  }
}

// MeetingSession Validator
class MeetingSessionSchema extends BaseValidator {
  constructor() {
    super();
    this.schema = Joi.object({
      id: Joi.string().uuid().optional(),
      meeting_id: Joi.string().uuid().required(),
      session_start: Joi.date().iso().required(),
      session_end: Joi.date().iso().optional(),
      duration_minutes: Joi.number().integer().min(0).default(0),
      created_at: Joi.date().optional(),
    });
  }
}

// CreateMeetingRequest Validator
class CreateMeetingRequestSchema extends BaseValidator {
  constructor() {
    super();
    this.schema = Joi.object({
      instructor_id: Joi.string().uuid().required(),
      start_time: Joi.date().iso().required(),
      duration_minutes: Joi.number().integer().min(15).max(480).required(), // 15 min to 8 hours
      notes: Joi.string().max(1000).optional(),
    });
  }
}

// UpdateMeetingStatusRequest Validator
class UpdateMeetingStatusRequestSchema extends BaseValidator {
  constructor() {
    super();
    this.schema = Joi.object({
      status: Joi.string().valid('in_progress', 'completed', 'cancelled', 'no_show').required(),
      actual_duration_minutes: Joi.number().integer().min(0).optional(),
      meeting_link: Joi.string().uri().optional(),
    });
  }
}

export default {
  InstructorAvailabilitySchema,
  MeetingSchema,
  MeetingSessionSchema,
  CreateMeetingRequestSchema,
  UpdateMeetingStatusRequestSchema,
}; 