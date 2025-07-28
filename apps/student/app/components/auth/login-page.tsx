"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ForgotPassword } from "../shared/ui/password-reset-form";

const LogInScreen = () => {
  const router = useRouter();
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      {showForgotPassword ? (
        <ForgotPassword />
      ) : (
        <div className="flex justify-center items-center bg-gray-100 h-[432px] w-[382px] border-[1px] border-[rgba(29, 29, 29, 0.2)] rounded-[10px]">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 p-6 bg-white shadow-lg rounded-lg h-full w-full"
          >
            <div className="flex flex-col items-start gap-2">
              <h2 className="text-2xl font-medium text-left text-[#1D1D1D]">
                Login
              </h2>
              <p className="text-[14px] font-medium text-left text-[#71717A]">
                Enter your email below to login to your account
              </p>
            </div>

            <div>
              <p className="text-[14px] font-medium text-[#1D1D1D]">Email</p>
              <input
                type="email"
                name="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="p-2 border-[rgba(228, 228, 231, 1)] border-[1px] h-[36px] w-full outline-none rounded-[6px]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-medium text-[#1D1D1D]">
                  Password
                </p>
                <button
                  type="button"
                  className="text-[14px] font-normal text-[#1D1D1D] cursor-pointer"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot your password?
                </button>
              </div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="p-2 border-[rgba(228, 228, 231, 1)] border-[1px] h-[36px] w-full outline-none rounded-[6px]"
              />
            </div>

            <button
              type="submit"
              className="bg-[#00AFF0] text-center text-white w-full h-[36px] rounded-[6px]"
            >
              Login
            </button>

            <button
              type="button"
              className="text-center w-full text-[#1D1D1D] text-[14px] font-medium cursor-pointer"
            >
              Login with Google
            </button>

            <div className="w-full flex items-center justify-center">
              <p className="flex items-center justify-center gap-1 font-normal text-sm">
                Don&apos;t have an account?
                <button
                  type="button"
                  className="cursor-pointer font-normal text-sm underline"
                  onClick={() => {
                    router.push("/signup");
                  }}
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LogInScreen;
