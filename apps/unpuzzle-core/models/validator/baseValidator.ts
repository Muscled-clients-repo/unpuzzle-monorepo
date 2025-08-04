import Joi from "joi";

export class BaseValidator {
    option: number;
    schema: Joi.ObjectSchema<any> | null;

    constructor() {
      this.option = 0
      this.schema = null;
    }
  
    validate(data:any, option=0) {
      this.option = option
      if(!this.schema) throw new Error("Schema not defined")
      // Make all fields optional if `option` is 1
      if (this.option === 1) {
        this.schema = this.schema.fork(Object.keys(this.schema.describe().keys), (field) =>
          field.optional()
        );
      }
      const { error } = this.schema.validate(data);
      if (error) {
        throw new Error(error.details[0].message);
      }
    }
  }
  
  