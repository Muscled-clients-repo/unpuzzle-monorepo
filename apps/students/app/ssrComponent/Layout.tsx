"use client";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "../assets/globals.css";
// import Header from "./Header";
import { Provider } from "react-redux";
import store from "../redux/store";
// import AuthenticatedSidebar from "../components/authenticated-sidebar"; // Removed - no sidebar needed
import PageLoadingSpinner from "../components/shared/loading-indicator";
import StudentHeader from "../components/shared/student-header";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { VideoTimeProvider } from "../context/VideoTimeContext";
import ClientSideWrapper from "../components/shared/client-side-wrapper";
import AnnotationViewHeader from "../components/shared/annotation-header";
import { ToastContainer } from 'react-toastify';
import AuthStateSync from "../components/auth-state-sync";
import ComponentErrorBoundary from "../components/shared/component-error-boundary";
import { WebVitalsReporter } from "../components/web-vitals";

// clerk
import { ClerkProvider } from "@clerk/nextjs";

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

function LayoutContent({ children }: { children: React.ReactNode }) {
  // const user = useSelector((state: RootState) => state.user); // Not currently used
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname();

  // Environment variables are properly configured

  useEffect(() => {
    // Content will not be displayed if loading is always true.
    setLoading(false);
  }, []);

  // Disable sidebar completely for all paths
  const showSidebar = false;

  // Show AnnotationHeader for specific paths
  const showAnnotationHeader = [
    "/student-annotations",
    "/confusions-puzzlejourney", 
    "/annotations-puzzlejourney"
  ].includes(pathname);

  return (
    <>
      <AuthStateSync />
      <main>
        <div className="flex h-screen">
          {/* Sidebar - Using direct Clerk approach */}
          {showSidebar && <AuthenticatedSidebar />}
          <div className="flex-grow bg-white text-black flex flex-col h-full">
            {/* Annotation Header */}
            {showAnnotationHeader && (
              <div className="sticky top-0 z-50">
                <ClientSideWrapper fallback={null}>
                  {() => <AnnotationViewHeader />}
                </ClientSideWrapper>
              </div>
            )}

            {/* Scrollable Children Section */}
            <div className="overflow-scroll min-h-[90vh] light">
              {loading ? <PageLoadingSpinner /> : (
                <ComponentErrorBoundary>
                  {children}
                </ComponentErrorBoundary>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.className} ${geistMono.className} overflow-hidden`}
      >
        <body className="antialiased light" suppressHydrationWarning>
        <ToastContainer />
        <WebVitalsReporter />

          <Provider store={store}>
            <VideoTimeProvider>
              <LayoutContent>{children}</LayoutContent>
            </VideoTimeProvider>
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
