import { Request, Response } from 'express';
import CourseModel from "../../../models/supabase/course.model"

class HomepageController {
  async getHomePage(req: any, res: Response) {
    try {
      const courses = await CourseModel.getAllCourses();
      console.log(courses);
      res.render('pages/home', { courses: courses, user: req.user});
    } catch (error) {
      console.error('Error fetching videos:', error);
      res.status(500).render('pages/error', {
        message: 'Error loading videos',
        error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
      });
    }
  }
}

export default new HomepageController();