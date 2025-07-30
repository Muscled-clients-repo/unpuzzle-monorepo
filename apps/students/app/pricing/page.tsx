import type { Metadata } from "next";
import Layout from "../ssrComponent/Layout";
import PricingPlansContainer from "../components/pricing-plans-container";

export const metadata: Metadata = {
  title: "Pricing Plans - Unpuzzle Learning Platform",
  description: "Choose the perfect learning plan for your needs. Unlock premium courses, AI assistance, and interactive puzzles with our flexible pricing options.",
  keywords: "unpuzzle pricing, learning platform pricing, online course pricing, educational subscription",
  openGraph: {
    title: "Pricing Plans - Unpuzzle Learning Platform",
    description: "Choose the perfect learning plan for your needs. Unlock premium courses, AI assistance, and interactive puzzles.",
    type: "website",
    url: "/pricing",
    images: [
      {
        url: "/assets/logo.png",
        width: 1200,
        height: 630,
        alt: "Unpuzzle Pricing Plans",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing Plans - Unpuzzle Learning Platform",
    description: "Choose the perfect learning plan for your needs. Unlock premium courses and AI assistance.",
    images: ["/assets/logo.png"],
  },
};

export default function Home() {
  return (
    <Layout>
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20  sm:p-20 font-[family-name:var(--font-geist-sans)] !pt-0">
        <PricingPlansContainer />
      </div>
    </Layout>
  );
}
