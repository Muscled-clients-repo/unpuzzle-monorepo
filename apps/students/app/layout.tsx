import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { ClientProviders } from "./providers/ClientProviders";
import { ComponentErrorBoundary, Header, Footer } from "@unpuzzle/ui";
import "./styles/loading-overlay.css";

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Unpuzzle - Interactive Learning Platform",
  description: "Transform your learning experience with interactive puzzles and AI-powered assistance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.className} ${geistMono.className}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="stylesheet" href="/tailwind.css" />
      </head>
      <body className="antialiased light" suppressHydrationWarning>
        <ClientProviders>
          <Header variant="student" />
          <main>
            <div className="min-h-screen bg-gray-50">
              <ComponentErrorBoundary>
                {children}
              </ComponentErrorBoundary>
            </div>
          </main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}