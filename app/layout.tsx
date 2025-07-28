import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Unpuzzle',
  description: 'Interactive Learning Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}