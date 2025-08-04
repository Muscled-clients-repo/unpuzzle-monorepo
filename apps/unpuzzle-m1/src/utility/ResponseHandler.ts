import { Response, NextFunction } from "express";

class ResponseHandler {
  private res: Response | null = null;
  private next: NextFunction | null = null;

  constructor(res: Response, next: NextFunction) {
    this.res = res;
    this.next = next;
  }

  error(error: Error, errCode?: number) {
    if (this.next) {
      if (errCode) {
        (error as any).statusCode = errCode;
      }
      return this.next(error);
    }
    throw error;
  }

  success(
    data: any,
    statusCode: number = 200,
    errMessage: string = "Requested data not found",
    errCode: number = 404
  ) {
    if (this.res && data) {
      return this.res.status(statusCode).send({ success: true, data });
    } else if (data) {
      return data;
    } else {
      const error = new Error(errMessage);
      (error as any).statusCode = errCode;
      return this.error(error);
    }
  }
}

export default ResponseHandler;
