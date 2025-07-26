import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "solid";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "outline",
  size = "md",
  loading = false,
  icon,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeClasses = {
    sm: "text-sm px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2", 
    lg: "text-base px-6 py-3 gap-2"
  };

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 border border-transparent",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 border border-transparent", 
    outline: "bg-transparent text-gray-900 hover:bg-gray-50 focus:ring-gray-500 border border-gray-300",
    ghost: "bg-transparent text-gray-900 hover:bg-gray-100 focus:ring-gray-500 border border-transparent",
    solid: "bg-[#1D1D1D] text-white hover:bg-white hover:text-[#1D1D1D] border border-[#1D1D1D] hover:border-[#1D1D1D]"
  };

  const isDisabled = disabled || loading;

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
      )}
      {!loading && icon && icon}
      {children}
    </button>
  );
};

export default Button;