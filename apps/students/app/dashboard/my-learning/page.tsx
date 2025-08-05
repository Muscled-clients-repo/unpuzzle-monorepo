import { Metadata } from "next";
import MyCoursesClient from "./my-courses-client";
import { SEOBreadcrumb } from "@unpuzzle/ui";

export const metadata: Metadata = {
  title: "My Courses - Unpuzzle Learning Platform",
  description: "Access your enrolled courses, track your learning progress, and continue your educational journey with Unpuzzle's interactive learning platform.",
  keywords: "my courses, enrolled courses, learning dashboard, course progress, unpuzzle dashboard",
  openGraph: {
    title: "My Courses - Unpuzzle Learning Platform",
    description: "Access your enrolled courses and track your learning progress on Unpuzzle.",
    type: "website",
    url: "/my-courses",
    siteName: "Unpuzzle",
    locale: "en_US",
    images: [
      {
        url: "/assets/courseThumbnail.svg",
        width: 1200,
        height: 630,
        alt: "My Courses Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Courses - Unpuzzle Learning Platform",
    description: "Access your enrolled courses and track your learning progress.",
    images: ["/assets/courseThumbnail.svg"],
  },
  robots: {
    index: false, // This is a user-specific page
    follow: true,
  },
};

export default function MyCoursesPage() {
  const breadcrumbItems = [
    { name: "My Courses", url: "/my-courses" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <SEOBreadcrumb items={breadcrumbItems} />
      </div>
      <MyCoursesClient />
    </div>
  );
}
