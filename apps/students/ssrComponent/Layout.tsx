"use client";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { Provider } from "react-redux";
import store from "../redux/store";
import React from "react";
import { VideoTimeProvider } from "../context/VideoTimeContext";
import { NavigationLoadingProvider } from "../context/NavigationLoadingContext";
import { ToastContainer } from 'react-toastify';
import { ComponentErrorBoundary } from "@unpuzzle/ui";
import {AuthProvider} from "@unpuzzle/auth"
import {Header, Footer} from "@unpuzzle/ui";


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

  // Environment variables are properly configured

  return (
    <>
      
      {/* Student Header */}
      <Header variant="student" />
      
      <main>

        {/* Main Content */}
        <div className="min-h-screen bg-gray-50">
          <ComponentErrorBoundary>
            {children}
          </ComponentErrorBoundary>
        </div>
      </main>

      <Footer />
    </>
  );
}

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
        <ToastContainer />

          <Provider store={store}>
            <AuthProvider>
              <NavigationLoadingProvider>
                <VideoTimeProvider>
                  <LayoutContent>{children}</LayoutContent>
                </VideoTimeProvider>
              </NavigationLoadingProvider>
            </AuthProvider>
          </Provider>
      </body>
    </html>
  );
}
