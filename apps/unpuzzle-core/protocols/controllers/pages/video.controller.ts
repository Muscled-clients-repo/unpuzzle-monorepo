import { Request, Response } from 'express';
import CourseModel from "../../../models/supabase/course.model"
// import VideoDescription from '../../../contexts/agents/VideoDescription';

class VideoController {
  async getCourseVideoPage(req: any, res: Response) {
    // const videoDescription = new VideoDescription()
    try {
      const id = req.params.id || ""
      const course = await CourseModel.getCourseById(id);
      console.log(course)
      if(!course){
        throw new Error("Course not found");
      }
      console.log(req.user);

      // debug: process.env.DEBUG === 'true'
      // Include fallback socketId for backward compatibility (mainly for caching issues)
      const fallbackSocketId = req.user?.id || `fallback-${Date.now()}`;
      res.render('pages/course-video', {course: course, user: req.user, socketId: fallbackSocketId});
    } catch (error) {
      console.error('Error fetching video:', error);
      res.status(500).render('pages/error', {
        message: 'Error loading video',
        error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
      });
    }
  }
}

export default new VideoController();