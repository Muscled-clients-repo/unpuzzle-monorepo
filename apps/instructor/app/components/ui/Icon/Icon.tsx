import React from "react";

export interface IconProps {
  name?: string;  // For icon library integration
  src?: string;   // For custom SVG or image icons
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  color?: "primary" | "secondary" | "muted" | "error" | "success" | "warning" | "inherit";
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode; // For inline SVG content
}

export const Icon: React.FC<IconProps> = ({
  name,
  src,
  size = "md",
  color = "inherit",
  className = "",
  onClick,
  children,
  ...props
}) => {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4", 
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
    "2xl": "w-10 h-10"
  };

  const colorClasses = {
    primary: "text-gray-900",
    secondary: "text-gray-600",
    muted: "text-gray-400",
    error: "text-red-600",
    success: "text-green-600",
    warning: "text-yellow-600",
    inherit: "text-inherit"
  };

  const baseClasses = `inline-block ${sizeClasses[size]} ${colorClasses[color]} ${onClick ? 'cursor-pointer' : ''}`;
  const classes = `${baseClasses} ${className}`.trim();

  // If children are provided (inline SVG), render them
  if (children) {
    return (
      <span className={classes} onClick={onClick} {...props}>
        {children}
      </span>
    );
  }

  // If src is provided, render as image
  if (src) {
    return (
      <img 
        src={src} 
        alt={name || "icon"} 
        className={classes}
        onClick={onClick}
        {...props}
      />
    );
  }

  // If name is provided, this would integrate with an icon library
  // For now, we'll render a placeholder
  if (name) {
    return (
      <span 
        className={`${classes} bg-gray-200 rounded inline-flex items-center justify-center text-xs`}
        onClick={onClick}
        {...props}
      >
        {name.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  // Default fallback
  return (
    <span className={classes} onClick={onClick} {...props}>
      <svg fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414-1.414L9 5.586 7.707 4.293a1 1 0 00-1.414 1.414L8.586 8l-2.293 2.293a1 1 0 101.414 1.414L9 10.414l2.293 2.293a1 1 0 001.414-1.414L10.414 9l2.293-2.293a1 1 0 000-1.414z" clipRule="evenodd" />
      </svg>
    </span>
  );
};

export default Icon;