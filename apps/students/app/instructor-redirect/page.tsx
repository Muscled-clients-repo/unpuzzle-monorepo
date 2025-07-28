"use client";
import { useEffect } from "react";

export default function InstructorRedirect() {
  useEffect(() => {
    const instructorUrl = process.env.NEXT_PUBLIC_INSTRUCTOR_APP_URL || "https://unpuzzle-mono-repo-frontend-v9qa-mceveraj4.vercel.app";
    window.location.href = instructorUrl;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting to Instructor Portal...</h1>
        <p className="text-gray-600">If you're not redirected automatically, <a href={process.env.NEXT_PUBLIC_INSTRUCTOR_APP_URL || "https://unpuzzle-mono-repo-frontend-v9qa-mceveraj4.vercel.app"} className="text-blue-600 hover:underline">click here</a>.</p>
      </div>
    </div>
  );
}