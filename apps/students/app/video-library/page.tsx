import { Metadata } from "next";
import ClientSideWrapper from "../components/shared/client-side-wrapper";
import LearningJourneyDetail from "../components/learning/video-learning/learning-journey-detail";
import SEOBreadcrumb from "../components/shared/seo-breadcrumb";

export const metadata: Metadata = {
  title: "Video Library - Unpuzzle Learning Platform",
  description: "Browse your complete video library including screen recordings, uploaded videos, and educational resources. Filter and search through all your learning materials.",
  keywords: "video library, learning resources, screen recordings, educational videos, course materials, unpuzzle library",
  openGraph: {
    title: "Video Library - Unpuzzle Learning Platform",
    description: "Access your complete collection of learning videos and resources in one place.",
    type: "website",
    url: "/video-library",
    siteName: "Unpuzzle",
    locale: "en_US",
    images: [
      {
        url: "/assets/video.svg",
        width: 1200,
        height: 630,
        alt: "Unpuzzle Video Library",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Video Library - Unpuzzle Learning Platform",
    description: "Browse your complete collection of learning videos and resources.",
    images: ["/assets/video.svg"],
  },
};

export default function VideoLibrary() {
  const breadcrumbItems = [
    { name: "My Learning", url: "/my-courses" },
    { name: "Video Library", url: "/video-library" }
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <SEOBreadcrumb items={breadcrumbItems} />
      </div>
      <ClientSideWrapper fallback={null}>
        <LearningJourneyDetail videos={[]} />
      </ClientSideWrapper>
    </>
  );
}