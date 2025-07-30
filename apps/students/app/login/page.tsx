import { Metadata } from "next";
import LogInScreen from "../components/auth/login-page";

export const metadata: Metadata = {
  title: "Login - Unpuzzle Learning Platform",
  description: "Sign in to your Unpuzzle account to access your courses, track progress, and continue your interactive learning journey.",
  keywords: "login, sign in, unpuzzle login, student login, learning platform login",
  openGraph: {
    title: "Login - Unpuzzle Learning Platform",
    description: "Sign in to access your interactive courses and learning dashboard.",
    type: "website",
    url: "/login",
    siteName: "Unpuzzle",
    locale: "en_US",
  },
  robots: {
    index: false, // Login pages should not be indexed
    follow: false,
  },
};

export default function Login() {
  return (
    <div className="h-full w-full">
      <LogInScreen />
    </div>
  );
}
