import React from "react";

interface SharedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "solid" | "outline";
  children: React.ReactNode;
}

const SharedButton = ({
  variant = "outline",
  children,
  className = "",
  ...props
}: SharedButtonProps) => {
  const baseClasses =
    "text-sm w-full p-2 py-1 px-4 rounded border transition-colors duration-200";

  const variantClasses =
    variant === "solid"
      ? "bg-[#1D1D1D] text-white hover:bg-white hover:text-[#1D1D1D] border-[#1D1D1D] hover:border-[#1D1D1D]"
      : "bg-transparent text-[#1D1D1D] hover:bg-[#1D1D1D] hover:text-white border-[#1D1D1D] hover:border-transparent";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default SharedButton;
