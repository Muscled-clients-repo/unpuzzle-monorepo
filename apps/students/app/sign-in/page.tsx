"use client";
import { logout } from "../redux/features/user/userSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-gray-600">Sign in to continue your learning journey</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              card: "shadow-none",
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
              footerActionLink: "text-blue-600 hover:text-blue-700"
            }
          }}
          signUpUrl="/sign-up"
          afterSignInUrl="/courses"
        />
      </div>
    </div>
  );
}
