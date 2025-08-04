import { NextFunction, Request, Response } from "express";
import CourseModel from "../../../models/supabase/course.model"; // Adjust path as needed
import { randomUUID } from "crypto";
import { BindMethods } from "../../utility/BindMethods";
// import { Course } from "../../../types/Course.type";
import ResponseHandler from "../../utility/ResponseHandler";

class CourseController {
  constructor(){

  }
  // Fetch all activity logs with pagination
  getAllCourse= async(req: any, res: Response, next:NextFunction)=>{
    const responseHandler = new ResponseHandler(res, next);
    const videoId = req.query.videoId;
    try {
      const result = await CourseModel.getAllCourses(req.user.id, videoId);
      if (!result) {
        const error= new Error("Unable to fetch activity logs. Please try again later.")
        return responseHandler.error(error)
      }
      return responseHandler.success(result)
    } catch (error: any) {
      return responseHandler.error(error)
    }
  }

  // Get activity log by ID
  getCourseById= async(req: Request, res: Response, next:NextFunction)=>{
    const responseHandler = new ResponseHandler(res, next);
    try {
      const result = await CourseModel.getCourseById(req.params.id);
      if (!result) {
        const error= new Error("Unable to fetch activity logs. Please try again later.")
        return responseHandler.error(error)
      }
      return responseHandler.success(result)
    } catch (error: any) {
      return responseHandler.error(error)
    }
  }

  // Create a new activity log
  createCourse= async(req: any, res: Response, next:NextFunction)=>{
    const responseHandler = new ResponseHandler(res, next);
    try {
      let CourseData = req.body;
      if(req.user){
        CourseData['created_by']=req.user.id
      }
      console.log(CourseData)
      const result = await CourseModel.createCourse(CourseData);
      console.log(result)
      if (!result) {
        const error= new Error("Unable to create activity logs. Please try again later.")
        return responseHandler.error(error)
      }
      return responseHandler.success(result)
    } catch (error: any) {
      return responseHandler.error(error)
    }
  }

  // Update activity log by ID
  updateCourse= async(req: Request, res: Response, next:NextFunction)=>{
    const responseHandler = new ResponseHandler(res, next);
    try {
      const updates = req.body;
      const result = await CourseModel.updateCourse(
        req.params.id,
        updates
      );
      if (!result) {
        const error= new Error("Unable to update activity logs. Please try again later.")
        return responseHandler.error(error)
      }
      return responseHandler.success(result)
    } catch (error: any) {
      return responseHandler.error(error)
    }
  }

  // Delete activity log by ID
  deleteCourse= async(req: Request, res: Response, next:NextFunction)=>{
    const responseHandler = new ResponseHandler(res, next);
    try {
      const result = await CourseModel.deleteCourse(req.params.id);
      if (!result) {
        const error= new Error("Unable to delete activity logs. Please try again later.")
        return responseHandler.error(error)
      }
      return responseHandler.success(result)
    } catch (error: any) {
      return responseHandler.error(error)
    }
  }
}

const binding = new BindMethods(new CourseController());
export default binding.bindMethods();
