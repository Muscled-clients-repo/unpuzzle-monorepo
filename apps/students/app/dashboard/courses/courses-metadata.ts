import type { Metadata } from "next";

export const coursesMetadata: Metadata = {
  title: "Browse Courses - Unpuzzle Learning Platform",
  description: "Explore our comprehensive catalog of interactive courses. Learn programming, data science, web development, and more with puzzle-based learning and AI assistance.",
  keywords: "online courses, programming courses, data science courses, web development courses, interactive learning, puzzle-based education",
  openGraph: {
    title: "Browse Courses - Unpuzzle Learning Platform",
    description: "Explore our comprehensive catalog of interactive courses. Learn with puzzle-based content and AI assistance.",
    type: "website",
    url: "/courses",
    siteName: "Unpuzzle",
    locale: "en_US",
    images: [
      {
        url: "/assets/courseThumbnail.svg",
        width: 1200,
        height: 630,
        alt: "Unpuzzle Courses Catalog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Browse Courses - Unpuzzle Learning Platform",
    description: "Explore our comprehensive catalog of interactive courses with AI-powered learning assistance.",
    images: ["/assets/courseThumbnail.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};