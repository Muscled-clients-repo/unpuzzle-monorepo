"use client";

import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode | (() => React.ReactNode);
  fallback?: React.ReactNode;
};

export default function ClientOnly({ children, fallback = null }: Props) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <>{fallback}</>;

  return <>{typeof children === "function" ? children() : children}</>;
}
