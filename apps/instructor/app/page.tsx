"use client";

import dynamic from 'next/dynamic';

// Dynamically import the client component with no SSR
const HomeClient = dynamic(() => import('./page-client'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#0A0E27] flex items-center justify-center">
      <div className="text-white text-2xl">Loading...</div>
    </div>
  )
});

export default function Home() {
  return <HomeClient />;
}