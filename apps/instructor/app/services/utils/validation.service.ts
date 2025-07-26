/**
 * Validation Service
 * Provides comprehensive validation utilities
 */

export interface ValidationRule {
  name: string;
  message: string;
  validator: (value: any, context?: any) => boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  validatedValue?: any;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
  email?: boolean;
  url?: boolean;
  number?: boolean;
  integer?: boolean;
  min?: number;
  max?: number;
}

export class ValidationService {
  private rules: Map<string, ValidationRule> = new Map();

  constructor() {
    this.initializeDefaultRules();
  }

  /**
   * Initialize default validation rules
   */
  private initializeDefaultRules(): void {
    // Required field rule
    this.addRule({
      name: 'required',
      message: 'This field is required',
      validator: (value) => {
        if (typeof value === 'string') return value.trim().length > 0;
        if (Array.isArray(value)) return value.length > 0;
        return value !== null && value !== undefined;
      },
    });

    // Email validation rule
    this.addRule({
      name: 'email',
      message: 'Please enter a valid email address',
      validator: (value) => {
        if (!value) return true; // Empty is valid (use required rule separately)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
      },
    });

    // URL validation rule
    this.addRule({
      name: 'url',
      message: 'Please enter a valid URL',
      validator: (value) => {
        if (!value) return true;
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      },
    });

    // Number validation rule
    this.addRule({
      name: 'number',
      message: 'Please enter a valid number',
      validator: (value) => {
        if (!value && value !== 0) return true;
        return !isNaN(Number(value)) && isFinite(Number(value));
      },
    });

    // Integer validation rule
    this.addRule({
      name: 'integer',
      message: 'Please enter a valid integer',
      validator: (value) => {
        if (!value && value !== 0) return true;
        const num = Number(value);
        return Number.isInteger(num);
      },
    });

    // Strong password rule
    this.addRule({
      name: 'strongPassword',
      message: 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character',
      validator: (value) => {
        if (!value) return true;
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return strongPasswordRegex.test(value);
      },
    });

    // Phone number rule
    this.addRule({
      name: 'phone',
      message: 'Please enter a valid phone number',
      validator: (value) => {
        if (!value) return true;
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''));
      },
    });
  }

  /**
   * Add a custom validation rule
   */
  addRule(rule: ValidationRule): void {
    this.rules.set(rule.name, rule);
  }

  /**
   * Remove a validation rule
   */
  removeRule(name: string): boolean {
    return this.rules.delete(name);
  }

  /**
   * Get a validation rule
   */
  getRule(name: string): ValidationRule | undefined {
    return this.rules.get(name);
  }

  /**
   * Validate a single field
   */
  validateField(value: any, validation: FieldValidation): ValidationResult {
    const errors: string[] = [];
    let validatedValue = value;

    // Required validation
    if (validation.required) {
      const requiredRule = this.rules.get('required');
      if (requiredRule && !requiredRule.validator(value)) {
        errors.push(requiredRule.message);
      }
    }

    // Skip other validations if value is empty and not required
    if (!validation.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return { isValid: true, errors: [], validatedValue };
    }

    // Type-specific validations
    if (validation.email) {
      const emailRule = this.rules.get('email');
      if (emailRule && !emailRule.validator(value)) {
        errors.push(emailRule.message);
      }
    }

    if (validation.url) {
      const urlRule = this.rules.get('url');
      if (urlRule && !urlRule.validator(value)) {
        errors.push(urlRule.message);
      }
    }

    if (validation.number) {
      const numberRule = this.rules.get('number');
      if (numberRule && !numberRule.validator(value)) {
        errors.push(numberRule.message);
      } else {
        validatedValue = Number(value);
      }
    }

    if (validation.integer) {
      const integerRule = this.rules.get('integer');
      if (integerRule && !integerRule.validator(value)) {
        errors.push(integerRule.message);
      } else {
        validatedValue = parseInt(value, 10);
      }
    }

    // Length validations
    if (validation.minLength !== undefined) {
      const length = typeof value === 'string' ? value.length : String(value).length;
      if (length < validation.minLength) {
        errors.push(`Minimum length is ${validation.minLength} characters`);
      }
    }

    if (validation.maxLength !== undefined) {
      const length = typeof value === 'string' ? value.length : String(value).length;
      if (length > validation.maxLength) {
        errors.push(`Maximum length is ${validation.maxLength} characters`);
      }
    }

    // Numeric range validations
    if (validation.min !== undefined) {
      const numValue = Number(value);
      if (numValue < validation.min) {
        errors.push(`Minimum value is ${validation.min}`);
      }
    }

    if (validation.max !== undefined) {
      const numValue = Number(value);
      if (numValue > validation.max) {
        errors.push(`Maximum value is ${validation.max}`);
      }
    }

    // Pattern validation
    if (validation.pattern) {
      if (!validation.pattern.test(String(value))) {
        errors.push('Invalid format');
      }
    }

    // Custom validation
    if (validation.custom) {
      const result = validation.custom(value);
      if (result === false) {
        errors.push('Invalid value');
      } else if (typeof result === 'string') {
        errors.push(result);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      validatedValue: errors.length === 0 ? validatedValue : value,
    };
  }

  /**
   * Validate an object against a schema
   */
  validateObject(
    data: Record<string, any>,
    schema: Record<string, FieldValidation>
  ): { isValid: boolean; errors: Record<string, string[]>; validatedData: Record<string, any> } {
    const errors: Record<string, string[]> = {};
    const validatedData: Record<string, any> = {};
    let isValid = true;

    for (const [field, validation] of Object.entries(schema)) {
      const result = this.validateField(data[field], validation);
      
      if (!result.isValid) {
        errors[field] = result.errors;
        isValid = false;
      }
      
      validatedData[field] = result.validatedValue;
    }

    return { isValid, errors, validatedData };
  }

  /**
   * Validate form data
   */
  validateForm(formData: FormData, schema: Record<string, FieldValidation>): {
    isValid: boolean;
    errors: Record<string, string[]>;
    validatedData: Record<string, any>;
  } {
    const data: Record<string, any> = {};
    
    // Convert FormData to object
    for (const [key, value] of formData.entries()) {
      if (data[key]) {
        // Handle multiple values for same key
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    }

    return this.validateObject(data, schema);
  }

  /**
   * Validate array of objects
   */
  validateArray(
    items: Record<string, any>[],
    schema: Record<string, FieldValidation>
  ): {
    isValid: boolean;
    errors: Array<Record<string, string[]>>;
    validatedData: Record<string, any>[];
  } {
    const errors: Array<Record<string, string[]>> = [];
    const validatedData: Record<string, any>[] = [];
    let isValid = true;

    items.forEach((item, index) => {
      const result = this.validateObject(item, schema);
      
      errors[index] = result.errors;
      validatedData[index] = result.validatedData;
      
      if (!result.isValid) {
        isValid = false;
      }
    });

    return { isValid, errors, validatedData };
  }

  /**
   * Sanitize string input
   */
  sanitizeString(value: string, options: {
    trim?: boolean;
    lowercase?: boolean;
    uppercase?: boolean;
    removeSpecialChars?: boolean;
    maxLength?: number;
  } = {}): string {
    let result = value;

    if (options.trim) {
      result = result.trim();
    }

    if (options.lowercase) {
      result = result.toLowerCase();
    }

    if (options.uppercase) {
      result = result.toUpperCase();
    }

    if (options.removeSpecialChars) {
      result = result.replace(/[^a-zA-Z0-9\s]/g, '');
    }

    if (options.maxLength) {
      result = result.substring(0, options.maxLength);
    }

    return result;
  }

  /**
   * Sanitize email
   */
  sanitizeEmail(email: string): string {
    return this.sanitizeString(email, { trim: true, lowercase: true });
  }

  /**
   * Check password strength
   */
  getPasswordStrength(password: string): {
    score: number; // 0-4
    feedback: string[];
    isStrong: boolean;
  } {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) {
      score++;
    } else {
      feedback.push('Use at least 8 characters');
    }

    if (/[a-z]/.test(password)) {
      score++;
    } else {
      feedback.push('Add lowercase letters');
    }

    if (/[A-Z]/.test(password)) {
      score++;
    } else {
      feedback.push('Add uppercase letters');
    }

    if (/\d/.test(password)) {
      score++;
    } else {
      feedback.push('Add numbers');
    }

    if (/[@$!%*?&]/.test(password)) {
      score++;
    } else {
      feedback.push('Add special characters (@$!%*?&)');
    }

    return {
      score,
      feedback,
      isStrong: score >= 4,
    };
  }

  /**
   * Validate file
   */
  validateFile(file: File, options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
    maxDimensions?: { width: number; height: number };
  }): Promise<ValidationResult> {
    return new Promise((resolve) => {
      const errors: string[] = [];

      // Size validation
      if (options.maxSize && file.size > options.maxSize) {
        errors.push(`File size must be less than ${this.formatFileSize(options.maxSize)}`);
      }

      // Type validation
      if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
        errors.push(`File type must be one of: ${options.allowedTypes.join(', ')}`);
      }

      // Image dimension validation
      if (options.maxDimensions && file.type.startsWith('image/')) {
        const img = new Image();
        img.onload = () => {
          if (img.width > options.maxDimensions!.width || img.height > options.maxDimensions!.height) {
            errors.push(`Image dimensions must be less than ${options.maxDimensions!.width}x${options.maxDimensions!.height}`);
          }
          resolve({ isValid: errors.length === 0, errors });
        };
        img.onerror = () => {
          errors.push('Invalid image file');
          resolve({ isValid: false, errors });
        };
        img.src = URL.createObjectURL(file);
      } else {
        resolve({ isValid: errors.length === 0, errors });
      }
    });
  }

  /**
   * Format file size for display
   */
  private formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }
}

// Service class is exported, instances created in services/index.ts