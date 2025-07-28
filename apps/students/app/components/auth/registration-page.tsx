"use client";
import { useState } from "react";
import { useCreateUserMutation } from "../../redux/services/user.services";
import { useRouter } from "next/navigation";

const SignUpScreen = () => {
  const router = useRouter();
  const [createUser] = useCreateUserMutation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Prepare payload for API
    const userPayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    };

    try {
      // Trigger the createUser mutation
      await createUser(userPayload).unwrap();
      // User created successfully - redirect to login
      router.push('/login');
    } catch (err) {
      console.error("Failed to create user:", err);
      // TODO: Show error in UI instead of alert
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="flex justify-center items-center bg-gray-100 h-[591px] w-[382px] border-[1px] border-[rgba(29, 29, 29, 0.2)] rounded-[10px]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 p-6 bg-white shadow-lg rounded-lg h-full w-full"
        >
          <div className="flex flex-col items-start gap-2">
            <h2 className="text-2xl font-medium text-left text-[#1D1D1D]">
              Signup
            </h2>
            <p className="text-[14px] font-medium text-left text-[#71717A]">
              Enter your details below to create your account
            </p>
          </div>

          <div>
            <p className="text-[14px] font-medium text-[#1D1D1D]">First name</p>
            <input
              type="text"
              name="firstName"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="p-2 border-[rgba(228, 228, 231, 1)] border-[1px] h-[36px] w-full outline-none rounded-[6px]"
            />
          </div>

          <div>
            <p className="text-[14px] font-medium text-[#1D1D1D]">Last name</p>
            <input
              type="text"
              name="lastName"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="p-2 border-[rgba(228, 228, 231, 1)] border-[1px] h-[36px] w-full outline-none rounded-[6px]"
            />
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
            <p className="text-[14px] font-medium text-[#1D1D1D]">Password</p>
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
            className="bg-[#00AFF0] text-center  text-white  w-full h-[36px] rounded-[6px]"
          >
            Signup
          </button>

          <button
            type="button"
            className="text-center w-full text-[#1D1D1D] text-[14px] font-medium cursor-pointer"
          >
            Create Account with Google
          </button>
          <div className="w-full flex items-center justify-center">
            <p className="flex items-center justify-center gap-1 font-normal text-sm">
              Already have an account?
              <button
                className="cursor-pointer font-normal text-sm underline"
                onClick={() => {
                  router.push("/login");
                }}
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpScreen;
