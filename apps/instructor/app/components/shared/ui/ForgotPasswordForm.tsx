import React, { useState } from "react";

export const ForgotPassword: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    verificationCode: "",
  });
  const [showVerificationCode, setShowVerificationCode] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    // Transition to showing the verification code field
    setShowVerificationCode(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Verification Code Submitted:", formData);
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 h-[332px] w-[382px] border-[1px] border-[rgba(29, 29, 29, 0.2)] rounded-[10px]">
      <form
        onSubmit={showVerificationCode ? handleSubmit : handleNext}
        className="flex flex-col gap-6 p-6 bg-white shadow-lg rounded-lg h-full w-full"
      >
        <div className="flex flex-col items-start gap-2">
          <h2 className="text-2xl font-medium text-left text-[#1D1D1D]">
            Forgot Password
          </h2>
          <p className="text-[14px] font-medium text-left text-[#71717A]">
            Enter your email below to reset your password.
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

        {/* Verification Code Field */}
        {showVerificationCode && (
          <div
            className="transition-opacity duration-300 ease-in-out opacity-100"
          >
            <p className="text-[14px] font-medium text-[#1D1D1D]">
              Verification Code
            </p>
            <input
              type="text"
              name="verificationCode"
              placeholder="Enter code"
              value={formData.verificationCode}
              onChange={handleChange}
              required
              className="p-2 border-[rgba(228, 228, 231, 1)] border-[1px] h-[36px] w-full outline-none rounded-[6px]"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-[#00AFF0] text-center text-white w-full h-[36px] rounded-[6px]"
        >
          {showVerificationCode ? "Submit" : "Next"}
        </button>
      </form>
    </div>
  );
};
