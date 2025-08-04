// middlewares/errorHandler.ts

import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("errro Handler Run !");
  console.log("error: ", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errorDetails = err.errorDetails || null;

  res.status(statusCode).json({
    success: false,
    message,
    error: errorDetails,
  });
};
