import React from "react";

export interface TextProps {
  as?: "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  variant?: "body" | "caption" | "subtitle" | "title" | "heading";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold";
  color?: "primary" | "secondary" | "muted" | "error" | "success" | "warning";
  align?: "left" | "center" | "right" | "justify";
  className?: string;
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  as: Component = "p",
  variant = "body",
  size,
  weight = "normal",
  color = "primary",
  align = "left",
  className = "",
  children,
  ...props
}) => {
  const variantClasses = {
    body: "text-base",
    caption: "text-sm text-gray-600",
    subtitle: "text-lg font-medium",
    title: "text-xl font-semibold",
    heading: "text-2xl font-bold"
  };

  const sizeClasses = size ? {
    xs: "text-xs",
    sm: "text-sm", 
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl"
  }[size] : "";

  const weightClasses = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium", 
    semibold: "font-semibold",
    bold: "font-bold"
  };

  const colorClasses = {
    primary: "text-gray-900",
    secondary: "text-gray-600",
    muted: "text-gray-500",
    error: "text-red-600",
    success: "text-green-600",
    warning: "text-yellow-600"
  };

  const alignClasses = {
    left: "text-left",
    center: "text-center", 
    right: "text-right",
    justify: "text-justify"
  };

  const classes = [
    size ? sizeClasses : variantClasses[variant],
    weightClasses[weight],
    colorClasses[color],
    alignClasses[align],
    className
  ].filter(Boolean).join(" ");

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};

export default Text;