import { Metadata } from "next";
import StudentPuzzleJourneyPage from "../components/learning/puzzle-journey/student-puzzle-journey-page";
import SEOBreadcrumb from "../components/shared/seo-breadcrumb";

export const metadata: Metadata = {
  title: "Puzzle Content - Interactive Learning Journey | Unpuzzle",
  description: "Explore your interactive puzzle journey, track progress, and engage with AI-powered learning content. Access annotations, confusions, and personalized learning paths.",
  keywords: "puzzle content, interactive learning, puzzle journey, learning activities, educational puzzles, unpuzzle journey",
  openGraph: {
    title: "Puzzle Content - Interactive Learning Journey",
    description: "Track your puzzle journey and engage with interactive learning content on Unpuzzle.",
    type: "website",
    url: "/puzzle-content",
    siteName: "Unpuzzle",
    locale: "en_US",
    images: [
      {
        url: "/assets/puzzles.svg",
        width: 1200,
        height: 630,
        alt: "Unpuzzle Interactive Learning Journey",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Puzzle Content - Interactive Learning Journey",
    description: "Track your puzzle journey and engage with interactive learning content.",
    images: ["/assets/puzzles.svg"],
  },
};

export default function PuzzleContent() {
  const breadcrumbItems = [
    { name: "Puzzle Journey", url: "/puzzle-content" }
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <SEOBreadcrumb items={breadcrumbItems} />
      </div>
      <StudentPuzzleJourneyPage />
    </>
  );
}
