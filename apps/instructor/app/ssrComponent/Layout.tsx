"use client";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "../assets/globals.css";
// import Header from "./Header";
import { Provider, useSelector } from "react-redux";
import store, { RootState } from "../redux/store";
import userReducer from "../redux/features/user/userSlice";
import { Sidebar } from "../components";
import { SidebarWithAuth } from "../components";
import { Loading as LoadingSpinner } from "../components";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { VideoTimeProvider } from "../context/VideoTimeContext";
import { NavigationProvider } from "../context/NavigationContext";
import { NavigationLoader } from "../components";
import { ClientOnly } from "../components";
import { AnnotationHeader } from "../components";
import { ToastContainer } from 'react-toastify';
import { UserSync } from "../components";

// clerk
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  RedirectToSignIn,
} from "@clerk/nextjs";

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Unpuzzle - Transform Your Teaching",
  description: "Create interactive educational content that engages students through puzzle-based learning",
};

function LayoutContent({ children }: { children: React.ReactNode }) {
  const user = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname();

  // In your layout or any server component
  console.log(
    "CLERK_SECRET_KEY:",
    process.env.CLERK_SECRET_KEY?.substring(0, 10) + "..."
  );
  console.log(
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:",
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.substring(0, 10) + "..."
  );

  useEffect(() => {
    // Content will not be displayed if loading is always true.
    setLoading(false);
  }, []);

  // Paths without Sidebar
  const noSidebarPaths = [
    "/student-annotations",
    "/teacher-annotations",
    "/confusions-puzzlejourney",
    "/annotations-puzzlejourney",
  ];

  // Only show sidebar on these routes (exact or as prefix)
  const sidebarAllowedPaths = [
    "/instructor",
    "/editor",
    "/courses",
    "/my-assets",
    "/videos",
    "/settings",
    "/assets",
    "/all-courses",
    "/puzzle-content",
    "/my-courses",
    "/test-sidebar",
  ];
  const showSidebar = sidebarAllowedPaths.some((path) =>
    pathname.startsWith(path)
  ) && !noSidebarPaths.includes(pathname);

  // Show AnnotationHeader for specific paths
  const showAnnotationHeader = noSidebarPaths.includes(pathname);

  // Debug logging
  useEffect(() => {
    console.log('Sidebar Debug:', {
      pathname,
      showSidebar,
      hasUser: !!user.user,
      user: user.user,
    });
  }, [pathname, showSidebar, user.user]);

  return (
    <>
      <UserSync />
      <main>
        <div className="flex h-screen">
          {/* Sidebar - Using direct Clerk approach */}
          {showSidebar && <SidebarWithAuth />}
          <div className="flex-grow bg-white text-black flex flex-col h-full">
            {/* Annotation Header */}
            {showAnnotationHeader && (
              <div className="sticky top-0 z-50">
                <ClientOnly fallback={null}>
                  {() => <AnnotationHeader />}
                </ClientOnly>
              </div>
            )}

            {/* Scrollable Children Section */}
            <div className="overflow-scroll min-h-[90vh] light">
              {loading ? <LoadingSpinner /> : children}
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

          <Provider store={store}>
            <NavigationProvider>
              <VideoTimeProvider>
                <NavigationLoader />
                <LayoutContent>{children}</LayoutContent>
              </VideoTimeProvider>
            </NavigationProvider>
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
