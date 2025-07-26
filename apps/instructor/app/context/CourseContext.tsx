"use client";
import React, { createContext, useState, useCallback, ReactNode } from "react";
import useApi from "../hooks/useApi";
import { Course } from "@/types/course.types";
import { useAuth } from "@clerk/nextjs";

interface CourseContextType {
  course:Course | undefined,
  courses: Course[];
  loading: boolean;
  error: string | null;
  getAllCourses: (page?: number, limit?: number) => Promise<Course[]>;
  getCourseById: (id: string, chapterId?: string, videoId?: string) => Promise<Course | null>;
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
  getYouTubeEmbedUrl:(url:string ) => Promise<string>;
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
  const api = useApi();
  const { getToken } = useAuth();
  const getAllCourses = useCallback(
    async (page = 1, limit = 10): Promise<Course[]> => {
      setLoading(true);
      setError(null);
      try {
        const token = await getToken();
        console.log("token :", token);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER_URL}/api/courses?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        console.log("response: ", res);
        const data = await res.json();
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
    [api]
  );

  const getCourseById = useCallback(
    async (id: string, chapterIdParam?: string, videoIdParam?: string): Promise<Course | null> => {
      setLoading(true);
      setError(null);
      try {
        // const data = await api.get(`${}/api/courses/${id}`);
        // return data;
        const token = await getToken();
        console.log("token :", token);
        console.log("id is: ",id)
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER_URL}/api/courses/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        // console.log("response: ", res);
        const data = await res.json();
        console.log("data: ", data);
        setCourse(data?.data||null)
        // Set chapter and video globally
        if (data?.data?.chapters?.length > 0) {
          let selectedChapter = null;
          if (chapterIdParam && data.data.chapters.some((ch: any) => ch.id === chapterIdParam)) {
            selectedChapter = data.data.chapters.find((ch: any) => ch.id === chapterIdParam);
            setChapterId(chapterIdParam);
          } else {
            selectedChapter = data.data.chapters[0];
            setChapterId(data.data.chapters[0].id);
          }
          setChapter(selectedChapter);

          if (selectedChapter?.videos?.length > 0) {
            let selectedVideo = null;
            if (videoIdParam && selectedChapter.videos.some((v: any) => v.id === videoIdParam)) {
              selectedVideo = selectedChapter.videos.find((v: any) => v.id === videoIdParam);
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
        return data?.data || null;
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
    [api]
  );

  const createCourse = useCallback(
    async (courseData: Partial<Course>): Promise<Course | null> => {
      setLoading(true);
      setError(null);
      const token = await getToken();
      console.log("token :", token);
      if(!token) return null;
      try {
        // If you need to send as JSON, adjust useApi or use fetch directly
        
        const formData = new FormData();
        Object.entries(courseData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value as any);
          }
        });
       
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_APP_SERVER_URL}/api/courses`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(courseData),
            credentials: "include",
          }
        );
        console.log("response ",response )
        const data = await response.json();
        console.log("data: ", data);
        return (data?.data||null)
      } catch (err: any) {
        console.log("error is: ",err)
        setError(err.message || "Failed to create course");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  const updateCourse = useCallback(
    async (id: string, courseData: Partial<Course>): Promise<Course | null> => {
      setLoading(true);
      setError(null);
      try {
        // If you need to send as JSON, adjust useApi or use fetch directly
        const formData = new FormData();
        Object.entries(courseData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, value as any);
          }
        });
        // You may want to implement api.put in useApi for this
        const response = await fetch(`/api/courses/${id}`, {
          method: "PUT",
          body: formData,
        });
        if (!response.ok) throw new Error("Failed to update course");
        const data = await response.json();
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
      // You may want to implement api.delete in useApi for this
      const response = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete course");
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to delete course");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
  const  getYouTubeEmbedUrl=useCallback(async(url: string): Promise<string> => {
    try {
      const parsedUrl = new URL(url);
  
      // If already in embed format
      if (parsedUrl.hostname.includes("youtube.com") && parsedUrl.pathname.startsWith("/embed/")) {
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
  },[])
  
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
        getYouTubeEmbedUrl
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
export { CourseContext, CourseProvider };
