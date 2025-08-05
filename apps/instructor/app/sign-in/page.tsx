"use client";
import { logout } from "../redux/features/user/userSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import RootLayout from "../ssrComponent/Layout";
import { SignIn } from "@clerk/nextjs";
export default function page() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <div className="container relative  h-full flex-col items-center justify-center md:grid lg:max-w-none lg:px-0">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {/* <div className="grid gap-6">aaa</div> */}
          <SignInRoute />
        </div>
      </div>
    </div>
  );
}
function SignInRoute() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <div className="container relative  h-full flex-col items-center justify-center md:grid lg:max-w-none lg:px-0">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="grid gap-6">
            <SignIn />
          </div>
        </div>
      </div>
    </div>
  );
}
