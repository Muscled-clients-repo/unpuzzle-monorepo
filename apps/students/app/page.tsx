import type { Metadata } from "next";
import { SEOStructuredData } from "@unpuzzle/ui";
import { generateOrganizationSchema } from "@unpuzzle/ui";
import HomeClient from "./home-client";

export const metadata: Metadata = {
  title: "Unpuzzle - Transform Your Learning Experience",
  description: "Interactive educational platform that makes learning engaging through puzzle-based content, AI-powered assistance, and collaborative learning features.",
  keywords: "online learning, interactive education, puzzle-based learning, AI tutoring, educational platform, online courses",
  authors: [{ name: "Unpuzzle Team" }],
  creator: "Unpuzzle",
  publisher: "Unpuzzle",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Unpuzzle - Transform Your Learning Experience",
    description: "Interactive educational platform that makes learning engaging through puzzle-based content, AI-powered assistance, and collaborative learning features.",
    url: "/",
    siteName: "Unpuzzle",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/assets/logo.png",
        width: 1200,
        height: 630,
        alt: "Unpuzzle Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unpuzzle - Transform Your Learning Experience",
    description: "Interactive educational platform with puzzle-based content and AI-powered assistance.",
    creator: "@unpuzzle",
    images: ["/assets/logo.png"],
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
  verification: {
    google: "google-site-verification-code",
  },
};

export default function Home() {
  const organizationSchema = generateOrganizationSchema();
  
  return (
    <>
      <SEOStructuredData data={organizationSchema} />
      <HomeClient />
    </>
  );
}
