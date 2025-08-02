"use client";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function CrossAppNavigation() {
  const instructorUrl = process.env.NEXT_PUBLIC_INSTRUCTOR_APP_URL || "https://unpuzzle-mono-repo-frontend-v9qa-mceveraj4.vercel.app";
  
  return (
    <Link
      href={instructorUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <ExternalLink className="h-4 w-4" aria-hidden="true" />
      <span>Instructor Portal</span>
    </Link>
  );
}