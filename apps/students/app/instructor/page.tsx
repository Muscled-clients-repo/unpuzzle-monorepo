import { redirect } from 'next/navigation';

export default function InstructorPage() {
  const instructorUrl = process.env.NEXT_PUBLIC_INSTRUCTOR_APP_URL || "https://unpuzzle-mono-repo-frontend-v9qa-mceveraj4.vercel.app";
  redirect(instructorUrl);
}