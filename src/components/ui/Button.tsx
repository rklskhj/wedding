"use client";

import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const baseStyles =
    "rounded-md font-medium transition-colors focus:outline-none";

  const variantStyles = {
    primary:
      "bg-primary-400 text-white hover:bg-primary-500 active:bg-primary-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400",
    outline:
      "bg-transparent border border-primary-400 text-primary-400 hover:bg-primary-50",
  };

  const sizeStyles = {
    sm: "py-1 px-3 text-sm",
    md: "py-2 px-4 text-base",
    lg: "py-3 px-6 text-lg",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${
        sizeStyles[size]
      } ${widthStyle} ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {children}
    </button>
  );
}
