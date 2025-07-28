'use client';

import dynamic from 'next/dynamic';

const AssetsScreen = dynamic(
  () => import("../components/pages/AssetsScreen"),
  { ssr: false }
);

export default function Assets() {
  return <AssetsScreen />;
}
