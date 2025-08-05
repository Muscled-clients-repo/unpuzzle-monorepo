"use client";
import React, { createContext, useState, useCallback, ReactNode } from "react";
import { Course } from "@/app/types/course.types";
import { api } from "../utils/apiClient";

interface CourseContextType {
  course: Course | undefined;
  courses: Course[];
  loading: boolean;
  error: string | null;
  getAllCourses: (page?: number, limit?: number) => Promise<Course[]>;
  getCourseById: (
    id: string,
    chapterId?: string,
    videoId?: string
  ) => Promise<Course | null>;
  createCourse: (courseData: Partial<Course>) => Promise<Course | null>;
  updateCourse: (
    id: string,
    courseData: Partial<Course>
  ) => Promise<Course | null>;
  deleteCourse: (id: string) => Promise<boolean>;
  setCourses: (courses: Course[]) => void;
  setCourse: (courses: Course) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  chapter: any;
  setChapter: (chapter: any) => void;
  chapterId: string | null;
  setChapterId: (id: string | null) => void;
  video: any;
  setVideo: (video: any) => void;
  videoId: string | null;
  setVideoId: (id: string | null) => void;
  getYouTubeEmbedUrl: (url: string) => Promise<string>;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [course, setCourse] = useState<Course>();
  const [chapter, setChapter] = useState<any>(null);
  const [chapterId, setChapterId] = useState<string | null>(null);
  const [video, setVideo] = useState<any>(null);
  const [videoId, setVideoId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const getAllCourses = useCallback(
    async (page = 1, limit = 10): Promise<Course[]> => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get<{data: Course[]}>('/api/courses', {
          params: { page, limit }
        });
        console.log("data: ", data);
        setCourses(data?.data || []);
        return data?.data || [];
      } catch (err: any) {
        setError(err.message || "Failed to fetch courses");
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getCourseById = useCallback(
    async (
      id: string,
      chapterIdParam?: string,
      videoIdParam?: string
    ): Promise<Course | null> => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get<Course>(`/api/courses/${id}`);
        console.log("data: ", data);
        setCourse(data || null);
        // Set chapter and video globally
        const courseData = data;
        if (courseData?.chapters?.length > 0) {
          let selectedChapter = null;
          if (
            chapterIdParam &&
            courseData.chapters.some((ch: any) => ch.id === chapterIdParam)
          ) {
            selectedChapter = courseData.chapters.find(
              (ch: any) => ch.id === chapterIdParam
            );
            setChapterId(chapterIdParam);
          } else {
            selectedChapter = courseData.chapters[0];
            setChapterId(courseData.chapters[0].id);
          }
          setChapter(selectedChapter);

          if (selectedChapter?.videos?.length > 0) {
            let selectedVideo = null;
            if (
              videoIdParam &&
              selectedChapter.videos.some((v: any) => v.id === videoIdParam)
            ) {
              selectedVideo = selectedChapter.videos.find(
                (v: any) => v.id === videoIdParam
              );
              setVideoId(videoIdParam);
            } else {
              selectedVideo = selectedChapter.videos[0];
              setVideoId(selectedChapter.videos[0].id);
            }
            setVideo(selectedVideo);
          } else {
            setVideo(null);
            setVideoId(null);
          }
        } else {
          setChapter(null);
          setChapterId(null);
          setVideo(null);
          setVideoId(null);
        }
        return data || null;
      } catch (err: any) {
        setError(err.message || "Failed to fetch course");
        setChapter(null);
        setChapterId(null);
        setVideo(null);
        setVideoId(null);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createCourse = useCallback(
    async (courseData: Partial<Course>): Promise<Course | null> => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.post<{data: Course}>('/api/courses', courseData);
        console.log("data: ", data);
        return data?.data || null;
      } catch (err: any) {
        console.log("error is: ", err);
        setError(err.message || "Failed to create course");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateCourse = useCallback(
    async (id: string, courseData: Partial<Course>): Promise<Course | null> => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.put<Course>(`/api/courses/${id}`, courseData);
        return data;
      } catch (err: any) {
        setError(err.message || "Failed to update course");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteCourse = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/api/courses/${id}`);
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to delete course");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  const getYouTubeEmbedUrl = useCallback(
    async (url: string): Promise<string> => {
      try {
        const parsedUrl = new URL(url);

        // If already in embed format
        if (
          parsedUrl.hostname.includes("youtube.com") &&
          parsedUrl.pathname.startsWith("/embed/")
        ) {
          return url;
        }

        // Handle watch?v=VIDEO_ID format
        const videoId = parsedUrl.searchParams.get("v");
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }

        // Handle youtu.be short links
        if (parsedUrl.hostname === "youtu.be") {
          return `https://www.youtube.com/embed${parsedUrl.pathname}`;
        }

        return url; // Return original if format is unknown
      } catch (err) {
        console.error("Invalid URL", err);
        return url;
      }
    },
    []
  );

  return (
    <CourseContext.Provider
      value={{
        course,
        courses,
        loading,
        error,
        getAllCourses,
        getCourseById,
        createCourse,
        updateCourse,
        deleteCourse,
        setCourses,
        setCourse,
        setLoading,
        setError,
        chapter,
        setChapter,
        chapterId,
        setChapterId,
        video,
        setVideo,
        videoId,
        setVideoId,
        getYouTubeEmbedUrl,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
export { CourseContext, CourseProvider };
