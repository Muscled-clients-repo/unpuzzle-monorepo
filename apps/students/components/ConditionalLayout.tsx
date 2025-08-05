"use client";

import { usePathname } from 'next/navigation';
import { Header, Footer } from "@unpuzzle/ui";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  if (isDashboard) {
    // Dashboard routes: no header/footer, just children (dashboard layout will handle everything)
    return <>{children}</>;
  }

  // Regular routes: show header and footer
  return (
    <>
      <Header variant="student" />
      <main>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}