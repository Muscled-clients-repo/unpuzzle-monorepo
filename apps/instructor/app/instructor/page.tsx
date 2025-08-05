"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminScreen from "../components/screens/AdminScreen";
import { useOptionalUser } from "../hooks/useOptionalUser";

export default function AdminPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useOptionalUser();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace(process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in");
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded) return null;
  if (!isSignedIn) return null;

  return (
    <div>
      <AdminScreen />
    </div>
  );
}
