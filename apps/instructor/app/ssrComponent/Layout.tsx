"use client";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import "../assets/globals.css";
import { Provider } from "react-redux";
import store from "../redux/store";
import { Loading as LoadingSpinner } from "../components";
import { VideoTimeProvider } from "../context/VideoTimeContext";
import { NavigationProvider } from "../context/NavigationContext";
import { NavigationLoader } from "../components";
import { ToastContainer } from 'react-toastify';
import { useEffect, useState } from "react";


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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      {/* UserSync removed - no Clerk authentication needed */}
      <main>
        <div className="flex h-screen">
          {/* Sidebar - Now without Clerk authentication */}
          <div className="flex-grow bg-white text-black flex flex-col h-full">
            {loading ? <LoadingSpinner /> : children}
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
  );
}
